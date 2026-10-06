import { Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { Button, buttonClass } from "@/components/Button";
import { Badge, Card, Logo } from "@/components/primitives";
import { activities } from "@/data/activities";
import { useChild, useFavorites, useUser } from "@/hooks/use-session";
import { useRequireUser } from "@/hooks/use-require-user";
import { signOut } from "@/services/auth";
import { HOTMART_CHECKOUT_URL, FOUNDERS_PRICE } from "@/config/checkout";
import { track } from "@/services/analytics";

export function FavoritesPage() {
  useRequireUser();
  const favs = useFavorites();
  const list = favs.map((s) => activities.find((a) => a.slug === s)).filter((a) => !!a);
  return (
    <AppLayout>
      <h1 className="text-[34px] md:text-[44px]">Mis planecitos</h1>
      <div className="mt-6">
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
        ) : (
          <EmptyState title="Aquí aparecerán los planecitos que quieras repetir." action={<Link to="/selector" className={buttonClass({})}>Encontrar uno</Link>} />
        )}
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function AccountPage() {
  useRequireUser();
  const navigate = useNavigate();
  const user = useUser();
  const child = useChild();
  return (
    <AppLayout>
      <h1 className="text-[34px] md:text-[44px]">Cuenta</h1>
      <Card className="mt-6 max-w-xl px-5">
        <Row label="Nombre" value={user?.name ?? "—"} />
        <Row label="Email" value={user?.email ?? "—"} />
        <Row label="Perfil del niño" value={child?.name ?? "—"} />
        <Row label="Edad" value={child ? `${child.age} años` : "—"} />
        <Row label="Estado de acceso" value={user?.premium ? <Badge tone="ink">Fundador</Badge> : <Badge tone="paper">Gratis</Badge>} />
      </Card>
      <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
        <Link to="/onboarding" className={buttonClass({ variant: "secondary" })}>Editar perfil</Link>
        <Button variant="ghost" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>Cerrar sesión</Button>
      </div>
      {!user?.premium && <Link to="/premium" className={buttonClass({ className: "mt-6 w-full max-w-xl" })}>Desbloquear todos los planecitos</Link>}
    </AppLayout>
  );
}

export function PremiumPage() {
  return (
    <AppLayout>
      <Card className="mx-auto max-w-md rounded-[28px] p-8 text-center shadow-lift">
        <Logo variant="isotipo" className="mx-auto h-16" />
        <h1 className="mt-5 text-[32px]">Desbloquea todos los planecitos</h1>
        <Badge tone="ink" className="mt-4">Acceso fundadores</Badge>
        <p className="mt-5 font-display text-5xl font-semibold">{FOUNDERS_PRICE}</p>
        <p className="mt-1 text-muted-foreground">Pago único</p>
        <ul className="mt-6 space-y-2 text-left">
          {["Todas las actividades de esta etapa", "Según edad y tiempo disponible", "Sin mensualidad"].map((t) => (
            <li key={t} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-sky-deep" /> {t}</li>
          ))}
        </ul>
        <a href={HOTMART_CHECKOUT_URL} onClick={() => track("checkout_clicked", { from: "premium" })} className={buttonClass({ size: "lg", block: true, className: "mt-7" })}>Quiero acceso</a>
      </Card>
    </AppLayout>
  );
}
