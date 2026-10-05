import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./primitives";
import { buttonClass } from "./Button";
import { track } from "@/services/analytics";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#planecitos", label: "Planecitos" },
  { href: "#precio", label: "Precio" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20">
        <Link to="/" aria-label="Planecitos, inicio"><Logo className="h-8 md:h-10" /></Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => <a key={l.href} href={l.href} className="font-medium hover:text-sky-deep">{l.label}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" onClick={() => track("login_started")} className={buttonClass({ variant: "ghost", size: "sm" })}>Iniciar sesión</Link>
          <Link to="/selector" onClick={() => track("hero_cta_click", { from: "header" })} className={buttonClass({ size: "sm" })}>Encontrar mi planecito</Link>
        </div>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-paper px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center font-display text-xl">{l.label}</a>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <Link to="/selector" className={buttonClass({ block: true })}>Encontrar mi planecito</Link>
            <Link to="/login" className={buttonClass({ variant: "secondary", block: true })}>Iniciar sesión</Link>
          </div>
        </div>
      )}
    </header>
  );
}
