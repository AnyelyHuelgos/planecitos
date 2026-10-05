import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BottomNavigation, appNavItems } from "@/components/BottomNavigation";
import { Logo } from "@/components/primitives";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/inicio" aria-label="Inicio"><Logo className="h-8" /></Link>
          <nav className="hidden gap-1 md:flex">
            {appNavItems.map((i) => (
              <Link key={i.to} to={i.to} className="rounded-full px-4 py-2 font-medium hover:bg-ink/5" activeProps={{ className: "bg-sky-soft" }}>
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-6">{children}</main>
      <BottomNavigation />
    </div>
  );
}
