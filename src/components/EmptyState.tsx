import type { ReactNode } from "react";
import { Logo } from "./primitives";

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-ink/15 bg-card/60 px-6 py-12 text-center">
      <Logo variant="isotipo" className="h-16" />
      <p className="mt-5 max-w-xs font-display text-xl">{title}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
