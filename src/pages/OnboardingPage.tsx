import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/layouts/AuthLayout";
import { Button } from "@/components/Button";
import { SelectorOption } from "@/components/SelectorOption";
import { AGES } from "@/config/labels";
import type { Age } from "@/types/activity";
import { saveChildProfile } from "@/services/profile";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [age, setAge] = useState<Age>();
  const [error, setError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("child")).trim();
    if (!age || !name) return setError(true);
    const res = await saveChildProfile({ name, age });
    if (res.error) return setError(true);
    navigate({ to: "/inicio" });
  }

  return (
    <AuthLayout title="¡Hola! Hagamos Planecitos más útil para ustedes.">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h2 className="mb-3 text-[22px]">¿Cómo le decimos?</h2>
          <Field id="child" label="Nombre o apodo del niño" autoComplete="off" required />
        </div>
        <fieldset>
          <legend className="mb-3 font-display text-[22px] font-semibold">¿Cuántos años tiene?</legend>
          <div role="radiogroup" className="grid grid-cols-2 gap-3">
            {AGES.map((a) => <SelectorOption key={a} selected={age === a} onClick={() => setAge(a)}>{a}</SelectorOption>)}
          </div>
        </fieldset>
        {error && <p role="alert" className="text-destructive">Cuéntanos su nombre y su edad.</p>}
        <Button type="submit" block size="lg">Empezar</Button>
      </form>
    </AuthLayout>
  );
}
