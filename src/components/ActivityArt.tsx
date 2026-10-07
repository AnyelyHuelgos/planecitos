import { Brush, Footprints, Lightbulb, Moon, HeartHandshake, Puzzle } from "lucide-react";
import type { Age, Category } from "@/types/activity";
import { ageInfo } from "@/lib/ages";
import { Character } from "./Characters";
import { cn } from "@/lib/utils";

const icons = { crear: Brush, moverse: Footprints, aprender: Lightbulb, tranquilo: Moon, juntos: HeartHandshake, solo: Puzzle };

/** Ilustración de la actividad: el personaje de su edad y el ícono del tipo de planecito. */
export function ActivityArt({ category, age = 3, className }: { category: Category; age?: number; className?: string }) {
  const Icon = icons[category];
  const info = ageInfo(age);
  return (
    <div className={cn("relative overflow-hidden rounded-xl", info.soft, className)} aria-hidden>
      <Character age={(Math.min(5, Math.max(2, age)) as Age)} className="absolute bottom-[-6%] left-1/2 w-[34%] -translate-x-1/2" />
      <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white">
        <Icon className="h-5 w-5 text-ink" strokeWidth={2.2} />
      </span>
    </div>
  );
}
