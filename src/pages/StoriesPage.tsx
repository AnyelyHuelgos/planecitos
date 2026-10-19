import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Moon, Sparkles } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Character } from "@/components/Characters";
import { listStories, type StoryCard } from "@/services/stories";
import { useUser } from "@/hooks/use-session";
import { ageInfo } from "@/lib/ages";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "dormir", label: "Para dormir" },
  { key: "otros", label: "Para cualquier momento" },
] as const;

export function StoriesPage() {
  const user = useUser();
  const [stories, setStories] = useState<StoryCard[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("todos");
  useEffect(() => { void listStories().then(setStories); }, []);

  const list = (stories ?? []).filter((s) => filter === "todos" || (filter === "dormir" ? s.moment === "dormir" : s.moment !== "dormir"));

  return (
    <AppLayout>
      <h1 className="text-[34px] md:text-[46px]">Cuentitos mágicos</h1>
      <p className="mt-2 max-w-[48ch] text-lg text-ink/75">Cuentos cortos con Sol, Cubo, Pico y Luna. Tu hijo es parte de la historia, y al final hay un juego para seguir fuera de la pantalla.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}
            className={cn("min-h-11 rounded-full border-2 px-4 font-semibold", filter === f.key ? "border-ink bg-ink text-white" : "border-border bg-white")}>
            {f.label}
          </button>
        ))}
      </div>
      {!stories && <p className="mt-8 text-ink/70">Cargando cuentos…</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const info = ageInfo(s.characterAge);
          const locked = s.premium && !user?.premium;
          return (
            <Link key={s.id} to="/cuentos/$slug" params={{ slug: s.slug }} className="group flex flex-col overflow-hidden rounded-[24px] border border-border bg-white transition hover:shadow-lift">
              <div className={cn("relative flex h-40 items-end justify-center", info.soft)}>
                <Character age={s.characterAge} className="w-24" title="" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[13px] font-bold">
                  {s.moment === "dormir" ? <Moon className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {s.minutes} min
                </span>
                {locked ? (
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink text-white"><Lock className="h-4 w-4" /></span>
                ) : !s.premium ? (
                  <span className="absolute right-3 top-3 rounded-full bg-age-4 px-3 py-1 text-[13px] font-bold">Gratis</span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-[21px] leading-tight">{s.title}</h2>
                <p className="mt-2 flex-1 text-[15px] text-ink/75">{s.summary.replaceAll("{nombre}", "tu hijo")}</p>
                <p className="mt-3 text-[14px] font-semibold text-ink/70">{s.minAge} a {s.maxAge} años</p>
              </div>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
