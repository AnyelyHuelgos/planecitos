import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Age, Category, Duration, Material } from "@/types/activity";
import { AGES, CATEGORY_LABEL, DURATIONS, MATERIAL_LABEL } from "@/config/labels";
import { SelectorOption } from "./SelectorOption";
import { Button } from "./Button";
import { track } from "@/services/analytics";

interface Props {
  /** Landing demo uses the shorter list of options. */
  demo?: boolean;
  initialAge?: Age;
}

const fullCategories: Category[] = ["crear", "moverse", "aprender", "tranquilo", "juntos", "solo"];
const demoCategories: Category[] = ["crear", "moverse", "aprender", "tranquilo"];
const fullMaterials: Material[] = ["papel", "colores", "carton", "plastilina", "cinta", "nada"];
const demoMaterials: Material[] = ["papel", "colores", "carton", "plastilina", "nada"];

export function SelectorWizard({ demo, initialAge }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<Age | undefined>(initialAge);
  const [duration, setDuration] = useState<Duration>();
  const [category, setCategory] = useState<Category>();
  const [materials, setMaterials] = useState<Material[]>([]);

  const questions = demo
    ? ["¿Cuántos años tiene?", "¿Cuánto tiempo tienes?", "¿Qué les provoca hacer?", "¿Qué tienes?"]
    : ["¿Para quién es el planecito?", "¿Cuánto tiempo tienes?", "¿Qué necesitan ahora?", "¿Qué tienen en casa?"];

  const next = () => setStep((s) => s + 1);
  const pick = <T,>(set: (v: T) => void, v: T) => {
    if (step === 0) track("selector_started", { demo });
    set(v);
    setTimeout(next, 180);
  };

  const toggleMaterial = (m: Material) => {
    setMaterials((cur) => {
      if (m === "nada") return cur.includes("nada") ? [] : ["nada"];
      const without = cur.filter((x) => x !== "nada");
      return without.includes(m) ? without.filter((x) => x !== m) : [...without, m];
    });
  };

  const finish = () => {
    track("selector_completed", { age, duration, category, materials, demo });
    navigate({
      to: "/resultado",
      search: { age, duration, category, materials: materials.length ? materials.join(",") : undefined, i: 0 },
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} aria-label="Paso anterior" className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : <span className="h-11 w-11" />}
        <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label={`Paso ${step + 1} de 4`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-ink" : "bg-ink/15"}`} />
          ))}
        </div>
        <span className="w-11 text-right text-sm text-muted-foreground">{step + 1}/4</span>
      </div>

      <div key={step} className="fade-step">
        <h3 className="mb-5 text-[24px] md:text-[26px]">{questions[step]}</h3>
        <div role={step === 3 ? "group" : "radiogroup"} aria-label={questions[step]} className="grid gap-3 sm:grid-cols-2">
          {step === 0 && AGES.map((a) => (
            <SelectorOption key={a} selected={age === a} onClick={() => pick(setAge, a)}>{a} años</SelectorOption>
          ))}
          {step === 1 && DURATIONS.map((d) => (
            <SelectorOption key={d} selected={duration === d} onClick={() => pick(setDuration, d)}>{d} min</SelectorOption>
          ))}
          {step === 2 && (demo ? demoCategories : fullCategories).map((c) => (
            <SelectorOption key={c} selected={category === c} onClick={() => pick(setCategory, c)}>{CATEGORY_LABEL[c]}</SelectorOption>
          ))}
          {step === 3 && (demo ? demoMaterials : fullMaterials).map((m) => (
            <SelectorOption key={m} multi selected={materials.includes(m)} onClick={() => toggleMaterial(m)}>{MATERIAL_LABEL[m]}</SelectorOption>
          ))}
        </div>
        {step === 3 && (
          <Button size="lg" block className="mt-6" onClick={finish}>Encontrar mi planecito</Button>
        )}
      </div>
    </div>
  );
}
