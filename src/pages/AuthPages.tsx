import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/layouts/AuthLayout";
import { Button } from "@/components/Button";
import { requestPasswordReset, signIn, signUp } from "@/services/auth";
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    track("signup_started");
    await signUp({ name: String(fd.get("name")), email: String(fd.get("email")), password: String(fd.get("password")) });
    setLoading(false);
    navigate({ to: "/onboarding" });
  }

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Toma menos de un minuto.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="name" label="Tu nombre" autoComplete="given-name" required />
        <Field id="email" label="Email" type="email" autoComplete="email" required />
        <Field id="password" label="Contraseña" type="password" autoComplete="new-password" required minLength={6} />
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
