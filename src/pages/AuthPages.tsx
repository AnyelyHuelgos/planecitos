import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/layouts/AuthLayout";
import { Button } from "@/components/Button";
import { requestPasswordReset, signIn, signUp, updatePassword } from "@/services/auth";
import { getChildProfile } from "@/services/profile";
import { track } from "@/services/analytics";

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    track("login_started");
    const { error } = await signIn({ email: String(fd.get("email")), password: String(fd.get("password")) });
    setLoading(false);
    if (error) return setError(error);
    navigate({ to: getChildProfile() ? "/inicio" : "/onboarding" });
  }

  return (
    <AuthLayout title="Hola de nuevo" subtitle="Entra y busquemos el planecito de hoy.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="email" label="Email" type="email" autoComplete="email" required />
        <Field id="password" label="Contraseña" type="password" autoComplete="current-password" required minLength={6} />
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <Button type="submit" block size="lg" disabled={loading}>{loading ? "Entrando…" : "Iniciar sesión"}</Button>
      </form>
      <div className="mt-6 space-y-2 text-center">
        <Link to="/recuperar" className="block font-medium underline underline-offset-4">Olvidé mi contraseña</Link>
        <p className="text-muted-foreground">¿No tienes cuenta? <Link to="/registro" className="font-semibold text-ink underline underline-offset-4">Regístrate</Link></p>
      </div>
    </AuthLayout>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    track("signup_started");
    const res = await signUp({ name: String(fd.get("name")), email: String(fd.get("email")), password: String(fd.get("password")) });
    setLoading(false);
    if (res.error) return setError(res.error);
    if (res.needsConfirmation) return setCheckEmail(true);
    navigate({ to: "/onboarding" });
  }

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Toma menos de un minuto.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="name" label="Tu nombre" autoComplete="given-name" required />
        <Field id="email" label="Email" type="email" autoComplete="email" required />
        <Field id="password" label="Contraseña" type="password" autoComplete="new-password" required minLength={6} />
        <label className="flex items-start gap-3 text-[15px] leading-snug">
          <input type="checkbox" name="acepto" required className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
          <span>
            Acepto la <Link to="/privacidad" target="_blank" className="font-semibold underline underline-offset-4">política de privacidad</Link> y
            los <Link to="/terminos" target="_blank" className="font-semibold underline underline-offset-4">términos</Link>, y autorizo el tratamiento de mis datos.
          </span>
        </label>
        {error && <p role="alert" className="text-destructive">{error}</p>}
        {checkEmail && <p role="status" className="rounded-xl bg-sky-soft p-4">Te enviamos un correo para confirmar tu cuenta. Ábrelo y vuelve aquí.</p>}
        <Button type="submit" block size="lg" disabled={loading}>{loading ? "Creando…" : "Crear cuenta"}</Button>
      </form>
      <p className="mt-6 text-center text-muted-foreground">¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-ink underline underline-offset-4">Inicia sesión</Link></p>
    </AuthLayout>
  );
}

export function RecoverPage() {
  const [sent, setSent] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await requestPasswordReset(String(new FormData(e.currentTarget).get("email")));
    setSent(true);
  }
  return (
    <AuthLayout title="Recuperar contraseña" subtitle="Te enviamos un enlace para crear una nueva.">
      {sent ? (
        <p role="status" className="rounded-xl bg-sky-soft p-4">Listo. Revisa tu correo.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field id="email" label="Email" type="email" autoComplete="email" required />
          <Button type="submit" block size="lg">Enviar enlace</Button>
        </form>
      )}
      <Link to="/login" className="mt-6 block text-center font-medium underline underline-offset-4">Volver a iniciar sesión</Link>
    </AuthLayout>
  );
}

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await updatePassword(String(new FormData(e.currentTarget).get("password")));
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate({ to: "/inicio" });
  }
  return (
    <AuthLayout title="Crea tu nueva contraseña" subtitle="Escríbela y entras de una vez.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="password" label="Nueva contraseña" type="password" autoComplete="new-password" required minLength={6} />
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <Button type="submit" block size="lg" disabled={loading}>{loading ? "Guardando…" : "Guardar contraseña"}</Button>
      </form>
    </AuthLayout>
  );
}
