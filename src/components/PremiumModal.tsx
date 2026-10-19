import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { HOTMART_CHECKOUT_URL, FOUNDERS_PRICE } from "@/config/checkout";
import { track } from "@/services/analytics";
import { buttonClass } from "./Button";

export function PremiumModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-light p-6 pb-8 shadow-lift data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom md:inset-auto md:left-1/2 md:top-1/2 md:w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl">
          <Dialog.Close aria-label="Cerrar" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5">
            <X className="h-5 w-5" />
          </Dialog.Close>
          <img src="/brand/planecitos-isotipo.svg" alt="" className="h-14 w-14" />
          <Dialog.Title className="mt-4 font-display text-[26px] font-extrabold">Desbloquea todo Planecitos</Dialog.Title>
          <Dialog.Description className="mt-2 text-muted-foreground">Precio de lanzamiento. Pago único, sin mensualidad.</Dialog.Description>
          <p className="mt-5 font-display text-4xl font-semibold">{FOUNDERS_PRICE}</p>
          <ul className="mt-5 space-y-2">
            {["140 planecitos para 2 a 5 años", "10 cuentitos mágicos para leer y escuchar", "10 imprimibles para colorear y recortar", "Planecito SOS y tus favoritos guardados"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="h-5 w-5 shrink-0" /> {t}</li>
            ))}
          </ul>
          <a href={HOTMART_CHECKOUT_URL} onClick={() => track("checkout_clicked", { from: "modal" })} className={buttonClass({ block: true, size: "lg", className: "mt-6" })}>
            Quiero acceso
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
