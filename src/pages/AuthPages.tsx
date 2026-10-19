import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/layouts/AuthLayout";
import { Button } from "@/components/Button";
import { sendLoginCode, verifyLoginCode } from "@/services/auth";
import { getChildProfile } from "@/services/profile";
import { track } from "@/services/analytics";

/**
 * Entrar con un código de 6 números enviado al correo, sin contraseña.
 * El mismo flujo sirve para registrarse (mode="registro") e iniciar sesión (mode="login").
 */
function EmailCodeAuth({ mode }: { mode: "registro" | "login" }) {
  const navigate = useNavigate();
  const isSignup = mode === "registro";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function sendCode() {
    setLoading(true);
    setError(null);
    track(isSignup ? "signup_started" : "login_started");
    const res = await sendLoginCode({ email, name, createUser: isSignup });
    setLoading(false);
    if (res.error) return setError(res.error);
    setStep("code");
    setWait(60);
  }

  async function onEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendCode();
  }

  async function onCodeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await verifyLoginCode({ email, code });
    setLoading(false);
    if (res.error) return setError(res.error);
    track(isSignup ? "signup_completed" : "login_completed");
    navigate({ to: getChildProfile() ? "/inicio" : "/onboarding" });
  }

  if (step === "code") {
    return (
      <AuthLayout title="Revisa tu correo" subtitle={`Te enviamos un código de 6 números a ${email}.`}>
        <form onSubmit={onCodeSubmit} className="space-y-4">
          <Field
            id="code"
            label="Código"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,8}"
            maxLength={8}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            className="h-14 w-full rounded-xl border-2 border-input bg-light px-4 text-center text-[26px] font-bold tracking-[0.4em] outline-none focus:border-sky-deep"
          />
          <p className="rounded-xl bg-age-2-soft p-3 text-[15px]">Si no lo ves en un minuto, revisa <b>Spam</b> o <b>Promociones</b>.</p>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <Button type="submit" block size="lg" disabled={loading || code.replace(/\D/g, "").length < 6}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[15px]">
          <button type="button" onClick={() => { setStep("email"); setCode(""); setError(null); }} className="font-semibold underline underline-offset-4">
            Cambiar correo
          </button>
          <button type="button" onClick={sendCode} disabled={wait > 0 || loading} className="font-semibold underline underline-offset-4 disabled:no-underline disabled:opacity-60">
            {wait > 0 ? `Reenviar código en ${wait} s` : "Reenviar código"}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={isSignup ? "Crea tu cuenta" : "Hola de nuevo"}
      subtitle={isSignup ? "Usa el mismo correo con el que compraste. No necesitas contraseña." : "Te enviaremos un código a tu correo para entrar."}
    >
      <form onSubmit={onEmailSubmit} className="space-y-4">
        {isSignup && (
          <Field id="name" label="Tu nombre" autoComplete="given-name" required value={name} onChange={(e) => setName(e.currentTarget.value)} />
        )}
        <Field id="email" label="Correo" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        {isSignup && (
          <label className="flex items-start gap-3 text-[15px] leading-snug">
            <input type="checkbox" name="acepto" required className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
            <span>
              Acepto la <Link to="/privacidad" target="_blank" className="font-semibold underline underline-offset-4">política de privacidad</Link> y
              los <Link to="/terminos" target="_blank" className="font-semibold underline underline-offset-4">términos</Link>, y autorizo el tratamiento de mis datos.
            </span>
          </label>
        )}
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <Button type="submit" block size="lg" disabled={loading}>{loading ? "Enviando…" : "Enviarme el código"}</Button>
      </form>
      <p className="mt-5 text-center text-[15px]">
        {isSignup ? (
          <>¿Ya tienes cuenta? <Link to="/login" className="font-semibold underline underline-offset-4">Inicia sesión</Link></>
        ) : (
          <>¿Primera vez? <Link to="/registro" className="font-semibold underline underline-offset-4">Crea tu cuenta</Link></>
        )}
      </p>
    </AuthLayout>
  );
}

export function LoginPage() {
  return <EmailCodeAuth mode="login" />;
}

export function SignupPage() {
  return <EmailCodeAuth mode="registro" />;
}

/** Ya no hay contraseñas: estas rutas antiguas muestran el inicio de sesión con código. */
export const RecoverPage = LoginPage;
export const NewPasswordPage = LoginPage;
