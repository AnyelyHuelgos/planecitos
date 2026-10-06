import { Clock, Heart, Lightbulb, Timer } from "lucide-react";
import type { ReactNode } from "react";
import type { Activity } from "@/types/activity";
import { CATEGORY_LABEL, LOCATION_LABEL } from "@/config/labels";
import { Badge } from "./primitives";
import { ActivityArt } from "./ActivityArt";
import { Button } from "./Button";
import { useFavorites } from "@/hooks/use-session";
import { toggleFavorite } from "@/services/profile";
import { cn } from "@/lib/utils";

export function ActivityDetail({ activity: a, eyebrow, actions }: { activity: Activity; eyebrow?: string; actions?: ReactNode }) {
  const fav = useFavorites().includes(a.slug);
  return (
    <article className="mx-auto max-w-2xl fade-step">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink">{eyebrow}</p>}
      <h1 className="mt-2 text-[36px] md:text-[48px]">{a.title}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge><Clock className="h-3.5 w-3.5" /> {a.duration} min</Badge>
        <Badge tone="paper">{a.minAge}+ años</Badge>
        <Badge tone="paper">{LOCATION_LABEL[a.location]}</Badge>
        <Badge tone="paper">{CATEGORY_LABEL[a.category]}</Badge>
      </div>
      <ActivityArt category={a.category} className="mt-6 aspect-[16/9] w-full rounded-2xl" />
      <p className="mt-6 text-lg">{a.description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-[22px]">Materiales</h2>
          {a.materials.length ? (
            <ul className="mt-3 space-y-1.5">{a.materials.map((m) => <li key={m} className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />{m}</li>)}</ul>
          ) : <p className="mt-3">Nada especial.</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-[22px]"><Timer className="h-5 w-5 text-sky-deep" /> Preparación</h2>
          <p className="mt-3">{a.preparation}</p>
          <p className="mt-2 text-[15px] text-muted-foreground">{a.adultHelp ? "Con ayuda de un adulto." : "Puede hacerlo casi solo."}</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-[22px]">Pasos</h2>
        <ol className="mt-4 space-y-4">
          {a.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky font-display font-semibold">{i + 1}</span>
              <p className="pt-1">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <aside className="mt-6 flex gap-3 rounded-2xl bg-sky-soft p-5">
        <Lightbulb className="h-6 w-6 shrink-0 text-sky-deep" />
        <p><span className="font-semibold">Consejo: </span>{a.tip}</p>
      </aside>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Button variant={fav ? "sky" : "secondary"} onClick={() => toggleFavorite(a.slug)} aria-pressed={fav}>
          <Heart className={cn("h-5 w-5", fav && "fill-spark text-spark")} /> {fav ? "Guardado" : "Guardar planecito"}
        </Button>
        {actions}
      </div>
    </article>
  );
}
