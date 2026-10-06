import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, PackageOpen, Moon, Footprints, Brush, Lightbulb } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { PremiumModal } from "@/components/PremiumModal";
import { buttonClass } from "@/components/Button";
import { LightOrb } from "@/components/primitives";
import { useCatalog, useChild, useFavorites, useUser } from "@/hooks/use-session";
import { useRequireUser } from "@/hooks/use-require-user";
import { matchesFilters } from "@/services/activities";

const quick = [
  { label: "5 minutos", icon: Clock, search: { duration: 5 as const } },
  { label: "Sin materiales", icon: PackageOpen, search: { materials: "nada" } },
  { label: "Algo tranquilo", icon: Moon, search: { category: "tranquilo" as const } },
  { label: "Moverse", icon: Footprints, search: { category: "moverse" as const } },
  { label: "Crear", icon: Brush, search: { category: "crear" as const } },
  { label: "Aprender", icon: Lightbulb, search: { category: "aprender" as const } },
];

export function DashboardPage() {
  useRequireUser();
  const user = useUser();
  const child = useChild();
  const favs = useFavorites();
  const [modal, setModal] = useState(false);
  const activities = useCatalog();

  const forChild = activities.filter((a) => !a.premium && matchesFilters(a, { age: child?.age }));
  const recommended = forChild[new Date().getDate() % Math.max(forChild.length, 1)] ?? activities[0];
  const fast = activities.filter((a) => a.duration === 5).slice(0, 3);
  const saved = favs.map((s) => activities.find((a) => a.slug === s)).filter(Boolean).slice(0, 3);

  return (
    <AppLayout>
      <section className="relative">
        <LightOrb size={90} className="-right-4 -top-4" />
        <p className="relative text-lg text-muted-foreground">Hola, {user?.name ?? "familia"}.</p>
        <h1 className="relative mt-1 text-[34px] md:text-[48px]">¿Cuál es el planecito de hoy?</h1>
        <Link to="/selector" className={buttonClass({ size: "lg", className: "relative mt-5 w-full sm:w-auto" })}>Encontrar mi planecito</Link>
      </section>

      <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2">
        {quick.map(({ label, icon: Icon, search }) => (
          <Link key={label} to="/resultado" search={{ age: child?.age, i: 0, ...search }} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 border-border bg-card px-4 font-medium hover:border-ink/30">
            <Icon className="h-5 w-5 text-sky-deep" /> {label}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-[26px]">Planecito recomendado{child ? ` para ${child.name}` : ""}</h2>
        <div className="max-w-md">{recommended && <ActivityCard activity={recommended} />}</div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-[26px]">Planecitos rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fast.map((a) => <ActivityCard key={a.id} activity={a} locked={a.premium && !user?.premium} onLockedClick={() => setModal(true)} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-[26px]">Guardados recientemente</h2>
        {saved.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{saved.map((a) => <ActivityCard key={a!.id} activity={a!} />)}</div>
        ) : (
          <EmptyState title="Aquí aparecerán los planecitos que quieras repetir." />
        )}
      </section>
      <PremiumModal open={modal} onOpenChange={setModal} />
    </AppLayout>
  );
}
