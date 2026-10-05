import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SelectorOption({ selected, onClick, children, multi }: { selected: boolean; onClick: () => void; children: ReactNode; multi?: boolean }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 text-left font-display text-lg font-medium transition-all",
        selected ? "border-ink bg-sky-soft" : "border-border bg-card hover:border-ink/30",
      )}
    >
      <span>{children}</span>
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2", selected ? "border-ink bg-ink text-light" : "border-ink/25")}>
        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>
    </button>
  );
}
