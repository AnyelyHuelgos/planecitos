import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Clock, Home, Sparkles, Timer, Baby, Zap, ChevronDown } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge, Card, LightOrb, Logo, SectionHeader } from "@/components/primitives";
import { buttonClass } from "@/components/Button";
import { ActivityCard } from "@/components/ActivityCard";
import { SelectorWizard } from "@/components/SelectorWizard";
import { activities } from "@/data/activities";
import { HOTMART_CHECKOUT_URL, FOUNDERS_PRICE } from "@/config/checkout";
import { track } from "@/services/analytics";

const exampleSlugs = ["pintura-escondida", "busqueda-de-colores", "camino-de-cojines", "caja-misteriosa", "historias-con-dibujos", "clasificacion-de-objetos"];

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <Problem />
      <HowItWorks />
      <Demo />
      <Examples />
      <Benefits />
      <NoImprovise />
      <Offer />
      <Faq />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <LightOrb size={130} className="-left-10 top-10" />
      <LightOrb size={70} className="right-[8%] top-6 hidden md:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:pt-20">
        <div>
          <h1 className="text-[42px] leading-[1.02] md:text-[56px]">
            ¿Tienes 15 minutos?<br />
            <span className="text-sky-deep">Tenemos un planecito.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg md:text-xl">
            Dinos la edad y el tiempo. Te damos una idea lista, con lo que ya tienes en casa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/selector" onClick={() => track("hero_cta_click")} className={buttonClass({ size: "lg" })}>Encontrar mi planecito</Link>
            <a href="#como-funciona" className={buttonClass({ variant: "secondary", size: "lg" })}>Ver cómo funciona</a>
          </div>
        </div>
        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-3 -z-0 rotate-3 rounded-[32px] bg-sky" aria-hidden />
      <Card className="relative rounded-[28px] p-6 shadow-lift">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-deep">Tu planecito está listo</p>
        <h3 className="mt-3 text-[30px]">Pintura escondida</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge><Clock className="h-3.5 w-3.5" /> 15 min</Badge>
          <Badge tone="paper">3+ años</Badge>
          <Badge tone="paper">En casa</Badge>
          <Badge tone="paper">Crear</Badge>
        </div>
        <div className="mt-5 rounded-2xl bg-paper p-4">
          <p className="text-sm font-semibold">Materiales</p>
          <p className="mt-1 text-[15px]">papel, crayón blanco, acuarelas y un pincel.</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link to="/planecito/$slug" params={{ slug: "pintura-escondida" }} className={buttonClass({ size: "sm" })}>Ver planecito</Link>
          <Link to="/selector" className={buttonClass({ variant: "secondary", size: "sm" })}>Otro planecito</Link>
        </div>
      </Card>
    </div>
  );
}

function Problem() {
  const items = ["Tienes poco tiempo", "Tu hijo está aburrido", "Quieres hacer algo juntos", "No quieres preparar media casa", "Necesitas una idea ahora"];
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
        <SectionHeader title="No tienes que inventar un juego nuevo todos los días." text="Planecitos te ayuda cuando:" />
        <ul className="grid gap-3">
          {items.map((t) => (
            <li key={t} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-paper px-5 text-lg">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sky"><Check className="h-4 w-4" strokeWidth={3} /></span>{t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Cuéntanos para quién", d: "Edad del niño." },
    { t: "Dinos cuánto tiempo tienes", d: "5, 15 o 30 minutos." },
    { t: "Recibe tu planecito", d: "Materiales + preparación + pasos." },
  ];
  return (
    <section id="como-funciona" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader eyebrow="Cómo funciona" title="Tres pasos. Listo." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl bg-sky p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-light font-display text-2xl font-semibold">{i + 1}</span>
              <h3 className="mt-5 text-[24px]">{s.t}</h3>
              <p className="mt-2">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section className="relative py-16 md:py-24">
      <LightOrb size={90} className="right-4 top-0" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1fr_1.1fr]">
        <SectionHeader eyebrow="Pruébalo" title="Cuatro toques y tienes plan." text="Así de simple es encontrar el planecito de hoy." />
        <Card className="rounded-3xl p-5 md:p-8"><SelectorWizard demo /></Card>
      </div>
    </section>
  );
}

function Examples() {
  const list = exampleSlugs.map((s) => activities.find((a) => a.slug === s)!);
  return (
    <section id="planecitos" className="scroll-mt-20 bg-light py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader eyebrow="Planecitos" title="Ideas reales, para hoy." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => <ActivityCard key={a.id} activity={a} showFavorite={false} />)}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, t: "Ideas en segundos" },
    { icon: Home, t: "Con cosas de casa" },
    { icon: Baby, t: "Según su edad" },
    { icon: Timer, t: "Según el tiempo que tienes" },
    { icon: Clock, t: "Sin preparar actividades durante horas" },
    { icon: Sparkles, t: "Una idea cuando la necesitas" },
  ];
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t }) => (
            <Card key={t} className="flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-soft"><Icon className="h-6 w-6" /></span>
              <p className="font-display text-xl font-medium">{t}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoImprovise() {
  return (
    <section className="px-5">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-sky px-6 py-14 text-center md:py-20">
        <LightOrb size={120} className="-left-6 -top-6" />
        <LightOrb size={80} className="bottom-4 right-10" />
        <h2 className="relative text-[32px] md:text-[44px]">Hoy no tienes que inventar nada.</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-lg">Abre Planecitos, elige cuánto tiempo tienes y encuentra algo para hacer juntos.</p>
        <Link to="/selector" className={buttonClass({ size: "lg", className: "relative mt-8" })}>Encontrar mi planecito</Link>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="precio" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-md px-5">
        <Card className="rounded-[28px] p-8 text-center shadow-lift">
          <Logo variant="wordmark" className="mx-auto h-8" />
          <Badge tone="ink" className="mt-4">Acceso fundadores</Badge>
          <p className="mt-6 font-display text-5xl font-semibold">{FOUNDERS_PRICE}</p>
          <p className="mt-1 font-medium text-muted-foreground">Pago único</p>
          <p className="mt-5">Acceso al lanzamiento de Planecitos y a las actividades disponibles durante esta primera etapa.</p>
          <a href={HOTMART_CHECKOUT_URL} onClick={() => track("checkout_clicked", { from: "landing" })} className={buttonClass({ size: "lg", block: true, className: "mt-7" })}>
            Quiero Planecitos
          </a>
        </Card>
      </div>
    </section>
  );
}

const faqs = [
  { q: "¿Para qué edades es?", a: "Para niños de 2 a 5 años. Cada planecito indica la edad sugerida." },
  { q: "¿Necesito comprar materiales?", a: "No. La mayoría usa cosas que ya tienes en casa, y hay planecitos sin materiales." },
  { q: "¿Cuánto duran las actividades?", a: "Eliges tú: 5, 15 o 30 minutos." },
  { q: "¿Tengo que imprimir cosas?", a: "No. Todo está en la pantalla, listo para usar." },
  { q: "¿Cómo recibo acceso?", a: "Después del pago te llega un correo con tu acceso." },
  { q: "¿Es una suscripción?", a: "No. Para el lanzamiento es un pago único." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-5">
        <SectionHeader title="Preguntas frecuentes" center />
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-border bg-paper">
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left font-display text-lg font-medium">
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-5 pb-5 text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink py-10 text-light">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 md:flex-row">
        <Logo variant="negativo" className="h-8" />
        <p className="text-sm text-light/70">¿Cuál es el planecito de hoy?</p>
      </div>
    </footer>
  );
}
