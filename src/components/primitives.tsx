import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl bg-card border border-border shadow-soft", className)} {...props} />;
}

const badgeTone = {
  sky: "bg-sky-soft text-ink",
  paper: "bg-paper text-ink border border-border",
  spark: "bg-spark text-ink",
  ink: "bg-ink text-light",
};

export function Badge({ children, tone = "sky", className }: { children: ReactNode; tone?: keyof typeof badgeTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium", badgeTone[tone], className)}>
      {children}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, text, center }: { eyebrow?: string; title: ReactNode; text?: ReactNode; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-deep">{eyebrow}</p>}
      <h2 className="text-[30px] md:text-[38px]">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}

export function LightOrb({ size, className }: { size: number; className?: string }) {
  return <span aria-hidden className={cn("light-orb", className)} style={{ width: size, height: size }} />;
}

export function Logo({ variant = "horizontal", className }: { variant?: "horizontal" | "negativo" | "isotipo" | "wordmark"; className?: string }) {
  const src = {
    horizontal: "/brand/planecitos-logo-horizontal.svg",
    negativo: "/brand/planecitos-logo-horizontal-negativo.svg",
    isotipo: "/brand/planecitos-isotipo.svg",
    wordmark: "/brand/planecitos-wordmark.svg",
  }[variant];
  return <img src={src} alt="Planecitos" className={cn("h-9 w-auto", className)} />;
}
