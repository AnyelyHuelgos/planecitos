import { Link } from "@tanstack/react-router";
import { Clock, Heart, Lock } from "lucide-react";
import type { Activity } from "@/types/activity";
import { CATEGORY_LABEL } from "@/config/labels";
import { Badge } from "./primitives";
import { ActivityArt } from "./ActivityArt";
import { useFavorites } from "@/hooks/use-session";
import { toggleFavorite } from "@/services/profile";
import { cn } from "@/lib/utils";

interface Props {
  activity: Activity;
  locked?: boolean;
  onLockedClick?: () => void;
  showFavorite?: boolean;
}

export function ActivityCard({ activity: a, locked, onLockedClick, showFavorite = true }: Props) {
  const favs = useFavorites();
  const fav = favs.includes(a.slug);

  const body = (
    <>
      <ActivityArt category={a.category} age={a.minAge} className="aspect-[16/9] w-full" />
      <div className="p-5">
        <h3 className="text-[22px]">{a.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge><Clock className="h-3.5 w-3.5" /> {a.duration} min</Badge>
          <Badge tone={`age${Math.min(5, Math.max(2, a.minAge))}` as "age2"}>{a.minAge}+ años</Badge>
          <Badge tone="paper">{CATEGORY_LABEL[a.category]}</Badge>
        </div>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {a.materials.length ? a.materials.slice(0, 3).join(", ") : "Sin materiales"}
        </p>
      </div>
    </>
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-soft transition hover:shadow-lift">
      {locked ? (
        <button type="button" onClick={onLockedClick} className="block w-full text-left">
          <div className="opacity-60">{body}</div>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-sm font-medium text-light">
            <Lock className="h-3.5 w-3.5" /> Acceso fundadores
          </span>
        </button>
      ) : (
        <Link to="/planecito/$slug" params={{ slug: a.slug }} className="block">{body}</Link>
      )}
      {showFavorite && !locked && (
        <button
          type="button"
          onClick={() => toggleFavorite(a.slug)}
          aria-pressed={fav}
          aria-label={fav ? "Quitar de mis planecitos" : "Guardar planecito"}
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-light shadow-soft"
        >
          <Heart className={cn("h-5 w-5", fav ? "fill-spark text-spark" : "text-ink")} />
        </button>
      )}
    </div>
  );
}
