import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Clock, Home, HeartHandshake, MonitorOff } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/primitives";
import { buttonClass } from "@/components/Button";
import { SelectorWizard } from "@/components/SelectorWizard";
import { Character } from "@/components/Characters";
import { AGES, AGE_INFO } from "@/lib/ages";
import { HOTMART_CHECKOUT_URL, FOUNDERS_PRICE } from "@/config/checkout";
import { track } from "@/services/analytics";
import { cn } from "@/lib/utils";
import type { Age } from "@/types/activity";

export function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Demo />
        <ByAge />
        <Benefits />
        <Offer />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Hero ---------- */

function AgeButtons({ from }: { from: string }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
      {AGES.map((age) => (
        <Link
          key={age}
          to="/selector"
          search={{ age }}
          onClick={() => track("hero_cta_click", { from, age })}
          className={cn(
            "inline-flex min-h-14 items-center justify-center rounded-2xl px-2 text-base font-extrabold text-ink ring-ink transition hover:ring-2 sm:min-w-[92px] sm:px-4 sm:text-lg",
            AGE_INFO[age].bg,
          )}
        >
          {age} años
        </Link>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-16">
        <div>
          <h1 className="text-[46px] leading-[0.98] md:text-[68px]">¿Tienes 15 minutos? Tenemos un planecito.</h1>
          <p className="mt-6 max-w-[34ch] text-xl leading-relaxed text-ink/80">
            Dinos la edad y el tiempo. Te damos una actividad lista para hacer hoy, con lo que ya tienes en casa.
          </p>
          <p className="mt-8 font-bold">¿Cuántos años tiene?</p>
          <div className="mt-3"><AgeButtons from="hero" /></div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-ink/75">
            <li className="flex items-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> Más de 100 planecitos</li>
            <li className="flex items-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> Sin descargar nada</li>
            <li className="flex items-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> Lista en 2 minutos</li>
            <li className="flex items-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> Pago único</li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <img
            src="/images/hero.webp"
            alt="Una mamá y su hija de 3 años pintan con acuarelas en la mesa de la cocina; la niña muestra su dibujo feliz"
            width={1000}
            height={1250}
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-[36px] object-cover"
          />
          <Character age={4} className="absolute -right-4 -top-10 w-24 md:-right-10 md:w-32" />
          <div className="absolute -left-3 bottom-8 flex items-center gap-3 rounded-3xl border border-border bg-white p-3.5 pr-5 shadow-lift md:-left-12">
            <Character age={3} className="w-12" title="" />
            <div>
              <p className="font-display text-lg font-extrabold leading-tight">Pintura escondida</p>
              <div className="mt-1 flex gap-1.5">
                <span className="rounded-full bg-age-3 px-2.5 py-0.5 text-[13px] font-bold">3 años</span>
                <span className="rounded-full bg-light px-2.5 py-0.5 text-[13px] font-bold">15 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Problema ---------- */

function Problem() {
  const items = [
    { t: "Ya no sé qué inventar.", d: "Las ideas de siempre ya no lo entretienen." },
    { t: "No tengo tiempo de preparar nada.", d: "Entre el trabajo y la casa, lo último que necesitas es otro proyecto." },
    { t: "Hay demasiadas ideas en internet.", d: "Buscas cinco minutos y terminas con cuarenta pestañas abiertas." },
  ];
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <img
          src="/images/problema.webp"
          alt="Un niño aburrido de cabeza en el sofá mientras su mamá lo mira con cariño"
          width={1000}
          height={800}
          loading="lazy"
          className="w-full rounded-[32px] object-cover"
        />
        <div>
          <h2 className="text-[34px] md:text-[46px]">Son las 4 de la tarde y otra vez: ¿qué hacemos?</h2>
          <ul className="mt-8 space-y-6">
            {items.map((i) => (
              <li key={i.t}>
                <p className="font-display text-[22px] font-extrabold">{i.t}</p>
                <p className="mt-1 text-lg text-ink/75">{i.d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold">Planecitos te da una sola idea, concreta y lista. Tú decides si la hacen.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cómo funciona ---------- */

function HowItWorks() {
  const steps: { age: Age; t: string; d: string }[] = [
    { age: 2, t: "Dinos la edad", d: "De 2 a 5 años. Cada edad tiene sus planecitos." },
    { age: 3, t: "Elige tiempo y ganas", d: "5, 15 o 30 minutos. Crear, moverse, aprender o un rato tranquilo." },
    { age: 4, t: "Recibe tu planecito", d: "Materiales, preparación y pasos claros. Si no te convence, pide otro." },
  ];
  return (
    <section id="como-funciona" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-[18ch] text-[34px] md:text-[46px]">Así de fácil es encontrar el planecito de hoy.</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.t} className="relative">
              <div className={cn("flex h-44 items-end justify-center rounded-[28px]", AGE_INFO[s.age].soft)}>
                <Character age={s.age} className="w-28" />
              </div>
              <p className="mt-5 font-display text-[44px] font-extrabold leading-none">{i + 1}</p>
              <h3 className="mt-2 text-[24px]">{s.t}</h3>
              <p className="mt-2 text-lg text-ink/75">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Demo ---------- */

function Demo() {
  return (
    <section className="bg-ink py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 md:grid-cols-[1fr_1.15fr]">
        <div>
          <h2 className="text-[34px] md:text-[46px]">Pruébalo aquí, sin registrarte.</h2>
          <p className="mt-4 max-w-[36ch] text-lg text-white/80">Cuatro toques y tienes un planecito para hoy. Así se ve por dentro.</p>
          <div className="mt-10 hidden gap-3 md:flex">
            {AGES.map((a) => <Character key={a} age={a} className="w-20" title="" />)}
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 text-ink md:p-8"><SelectorWizard demo /></div>
      </div>
    </section>
  );
}

/* ---------- Por edad ---------- */

const AGE_EXAMPLES: Record<Age, { slug: string; img: string; alt: string; title: string; text: string }> = {
  2: { slug: "tesoros-de-la-cocina", img: "/images/edad-2.webp", alt: "Una niña de 2 años saca vasos y cucharas de colores de una caja", title: "Tesoros de la cocina", text: "Vasos, cucharas y tapas para sacar, mirar y volver a guardar. Para ellos, todo es nuevo." },
  3: { slug: "pintura-escondida", img: "/images/edad-3.webp", alt: "Un niño de 3 años pinta con acuarela y descubre un dibujo escondido", title: "Pintura escondida", text: "Pinta encima y descubre el dibujo secreto que dejaste con crayón blanco." },
  4: { slug: "el-camino-de-cintas", img: "/images/edad-4.webp", alt: "Una niña de 4 años salta entre líneas de cinta de colores en el piso", title: "El camino de cintas", text: "Cuatro tiras de cinta en el piso y un circuito para saltar sin parar." },
  5: { slug: "el-gran-fuerte", img: "/images/edad-5.webp", alt: "Un niño de 5 años y su papá leen con linterna dentro de un fuerte de cobijas", title: "El gran fuerte", text: "Cobijas, cojines y una linterna. Adentro, la historia la inventan juntos." },
};

function ByAge() {
  return (
    <section id="planecitos" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-[16ch] text-[34px] md:text-[46px]">Un planecito para cada edad.</h2>
        <p className="mt-4 max-w-[46ch] text-lg text-ink/75">Lo que divierte a los 2 años no es lo mismo que a los 5. Por eso cada edad tiene su color, su personaje y 25 planecitos pensados para ella.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGES.map((age) => {
            const ex = AGE_EXAMPLES[age];
            const info = AGE_INFO[age];
            return (
              <article key={age} className={cn("flex flex-col overflow-hidden rounded-[28px]", info.soft)}>
                <img src={ex.img} alt={ex.alt} width={720} height={540} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="relative flex flex-1 flex-col p-5">
                  <Character age={age} className="absolute -top-12 right-4 w-16" />
                  <span className={cn("self-start rounded-full px-3 py-1 text-sm font-extrabold", info.bg)}>{age} años</span>
                  <h3 className="mt-3 text-[22px]">{ex.title}</h3>
                  <p className="mt-2 flex-1 text-[16px] text-ink/75">{ex.text}</p>
                  <Link to="/planecito/$slug" params={{ slug: ex.slug }} onClick={() => track("activity_viewed", { slug: ex.slug, from: "by_age" })} className="mt-4 self-start font-bold underline underline-offset-4">
                    Ver este planecito
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Beneficios ---------- */

function Benefits() {
  const items = [
    { icon: MonitorOff, t: "Menos pantalla, sin culpa", d: "No se trata de prohibir. Es tener otra opción a la mano." },
    { icon: Home, t: "Con lo que tienes en casa", d: "Papel, cinta, cojines, vasos. Nada de comprar materiales." },
    { icon: HeartHandshake, t: "Un rato de verdad juntos", d: "Planecitos pensados para hacer con ellos, no solo para entretenerlos." },
    { icon: Clock, t: "Cero preparación", d: "Casi todos se arman en menos de 2 minutos." },
  ];
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="text-[34px] md:text-[46px]">Lo que cambia cuando tienes un plan.</h2>
          <ul className="mt-8 space-y-6">
            {items.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white"><Icon className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-[21px] font-extrabold">{t}</p>
                  <p className="mt-1 text-lg text-ink/75">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <img
          src="/images/beneficios.webp"
          alt="Un papá acostado en el piso ríe con su hijo de 2 años entre bloques de colores"
          width={1000}
          height={800}
          loading="lazy"
          className="order-1 w-full rounded-[32px] object-cover md:order-2"
        />
      </div>
    </section>
  );
}

/* ---------- Oferta ---------- */

function Offer() {
  const includes = [
    "Más de 100 planecitos para 2, 3, 4 y 5 años",
    "El selector ilimitado: pide otro cuando quieras",
    "Tus planecitos favoritos guardados",
    "Planecitos nuevos que vayamos sumando",
  ];
  return (
    <section id="precio" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
        <img
          src="/images/oferta.webp"
          alt="Una familia sentada en el piso de la sala haciendo una manualidad con papel y cinta"
          width={1000}
          height={800}
          loading="lazy"
          className="w-full rounded-[32px] object-cover"
        />
        <div className="relative rounded-[32px] border-2 border-ink bg-white p-7 md:p-10">
          <Character age={5} className="absolute -right-3 -top-14 w-24" />
          <h2 className="text-[32px] md:text-[40px]">Desbloquea todos los planecitos.</h2>
          <p className="mt-6 font-display text-[56px] font-extrabold leading-none">{FOUNDERS_PRICE}</p>
          <p className="mt-2 font-semibold text-ink/75">Pago único. No es una suscripción.</p>
          <ul className="mt-7 space-y-3">
            {includes.map((t) => (
              <li key={t} className="flex gap-3 text-lg">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-age-4"><Check className="h-4 w-4" strokeWidth={3} /></span>
                {t}
              </li>
            ))}
          </ul>
          <a
            href={HOTMART_CHECKOUT_URL}
            onClick={() => track("checkout_clicked", { from: "landing" })}
            className={buttonClass({ size: "lg", block: true, className: "mt-8" })}
          >
            Desbloquear Planecitos
          </a>
          <p className="mt-4 text-center text-[15px] text-ink/75">Tienes 7 días de garantía. Si no te sirve, te devolvemos el dinero.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Preguntas ---------- */

const faqs = [
  { q: "¿Para qué edades es?", a: "Para niños de 2 a 5 años. Cada planecito dice para qué edad es, y el selector te muestra los que le sirven a tu hijo." },
  { q: "¿Necesito comprar materiales?", a: "No. Los planecitos usan cosas que ya tienes en casa, como papel, cinta, cojines o vasos. Algunos no necesitan nada." },
  { q: "¿Cuánto duran?", a: "Tú eliges: 5, 15 o 30 minutos." },
  { q: "¿Tengo que descargar una app o imprimir?", a: "No. Planecitos funciona en el navegador de tu celular o computador, y todo está en la pantalla." },
  { q: "¿Cómo recibo el acceso?", a: "Después de pagar, creas tu cuenta en Planecitos con el mismo correo de tu compra y todos los planecitos se desbloquean solos." },
  { q: "¿Y si no me gusta?", a: "Tienes 7 días para pedir el reembolso desde Hotmart, sin preguntas." },
  { q: "¿Es una suscripción?", a: "No. Es un pago único." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-5">
        <h2 className="text-center text-[34px] md:text-[44px]">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-border rounded-[28px] bg-white">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 px-6 text-left text-lg font-bold"
              >
                {f.q}
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="px-6 pb-6 text-lg text-ink/75">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cierre ---------- */

function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <div className="flex items-end justify-center gap-2 md:gap-4">
          {AGES.map((a) => <Character key={a} age={a} className="w-16 md:w-24" title="" />)}
        </div>
        <h2 className="mt-8 text-[36px] md:text-[52px]">Hoy no tienes que inventar nada.</h2>
        <p className="mx-auto mt-4 max-w-[40ch] text-lg text-ink/75">Elige la edad y en un minuto tienes el planecito de hoy.</p>
        <div className="mt-8 flex justify-center"><AgeButtons from="final" /></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
        <Logo variant="negativo" className="h-10 self-start" />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
          <a href="#como-funciona" className="hover:underline">Cómo funciona</a>
          <a href="#precio" className="hover:underline">Precio</a>
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          <Link to="/privacidad" className="hover:underline">Privacidad</Link>
          <Link to="/terminos" className="hover:underline">Términos</Link>
        </nav>
        <p className="text-sm text-white/70">Las actividades requieren acompañamiento de un adulto.</p>
      </div>
    </footer>
  );
}

