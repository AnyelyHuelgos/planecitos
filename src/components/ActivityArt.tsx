import { Brush, Footprints, Lightbulb, Moon, HeartHandshake, Puzzle } from "lucide-react";
import type { Category } from "@/types/activity";
import { cn } from "@/lib/utils";

const icons = { crear: Brush, moverse: Footprints, aprender: Lightbulb, tranquilo: Moon, juntos: HeartHandshake, solo: Puzzle };

/** Elegant illustration placeholder: sky tile, horizon arc, category glyph. */
export function ActivityArt({ category, className }: { category: Category; className?: string }) {
  const Icon = icons[category];
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-sky", className)} aria-hidden>
      <span className="absolute left-1/2 top-[38%] h-16 w-16 -translate-x-1/2 rounded-full bg-spark" />
      <span className="absolute -bottom-[60%] left-[-20%] h-full w-[140%] rounded-[50%] bg-paper" />
      <Icon className="absolute bottom-3 right-3 h-6 w-6 text-ink/70" strokeWidth={2} />
    </div>
  );
}
