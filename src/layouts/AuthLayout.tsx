import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LightOrb, Logo } from "@/components/primitives";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-8">
      <LightOrb size={130} className="-right-8 top-24" />
      <LightOrb size={60} className="left-6 bottom-24" />
      <div className="relative mx-auto max-w-md">
        <Link to="/" aria-label="Volver al inicio"><Logo className="h-9" /></Link>
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <h1 className="text-[32px]">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-medium">{label}</label>
      <input id={id} name={id} className="h-13 min-h-12 w-full rounded-xl border-2 border-input bg-light px-4 text-[17px] outline-none focus:border-sky-deep" {...props} />
    </div>
  );
}
