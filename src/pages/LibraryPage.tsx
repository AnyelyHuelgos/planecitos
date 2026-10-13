import { useMemo, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { PremiumModal } from "@/components/PremiumModal";
import { matchesFilters } from "@/services/activities";
import { AGES, CATEGORY_LABEL, DURATIONS, LOCATION_LABEL, MATERIAL_LABEL, durationLabel } from "@/config/labels";
import type { Age, Category, Duration, Location, Material } from "@/types/activity";
import { useCatalog, useUser } from "@/hooks/use-session";

const selectClass = "min-h-12 w-full rounded-xl border-2 border-input bg-light px-3 font-medium";

export function LibraryPage() {
  const user = useUser();
  const activities = useCatalog();
  const [modal, setModal] = useState(false);
  const [age, setAge] = useState<Age>();
  const [duration, setDuration] = useState<Duration>();
  const [category, setCategory] = useState<Category>();
  const [material, setMaterial] = useState<Material>();
  const [location, setLocation] = useState<Location>();

  const list = useMemo(
    () => activities.filter((a) =>
      matchesFilters(a, { age, duration, category }) &&
      (!material || a.materialTags.includes(material)) &&
      // "En cualquier lugar" también sirve para casa y para afuera
      (!location || a.location === location || a.location === "cualquier")),
    [activities, age, duration, category, material, location],
  );

  // Si no hay coincidencia exacta, sugerimos los más parecidos quitando filtros de a uno
  const similar = useMemo(() => {
    if (list.length) return [];
    const loc = (a: (typeof activities)[number]) => !location || a.location === location || a.location === "cualquier";
    const tries = [
      (a: (typeof activities)[number]) => matchesFilters(a, { age, duration, category }) && loc(a),
      (a: (typeof activities)[number]) => matchesFilters(a, { age, duration, category }),
      (a: (typeof activities)[number]) => matchesFilters(a, { age, duration }) && loc(a),
      (a: (typeof activities)[number]) => matchesFilters(a, { age }),
    ];
    for (const t of tries) {
      const res = activities.filter(t);
      if (res.length) return res.slice(0, 6);
    }
    return [];
  }, [list.length, activities, age, duration, category, location]);

  return (
    <AppLayout>
      <h1 className="text-[34px] md:text-[44px]">Todos los planecitos</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <label className="space-y-1"><span className="text-sm font-medium">Edad</span>
          <select className={selectClass} value={age ?? ""} onChange={(e) => setAge(e.target.value ? (Number(e.target.value) as Age) : undefined)}>
            <option value="">Todas</option>{AGES.map((a) => <option key={a} value={a}>{a} años</option>)}
          </select></label>
        <label className="space-y-1"><span className="text-sm font-medium">Duración</span>
          <select className={selectClass} value={duration ?? ""} onChange={(e) => setDuration(e.target.value ? (Number(e.target.value) as Duration) : undefined)}>
            <option value="">Cualquiera</option>{DURATIONS.map((d) => <option key={d} value={d}>Hasta {durationLabel(d)}</option>)}
          </select></label>
        <label className="space-y-1"><span className="text-sm font-medium">Categoría</span>
          <select className={selectClass} value={category ?? ""} onChange={(e) => setCategory((e.target.value || undefined) as Category)}>
            <option value="">Todas</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <label className="space-y-1"><span className="text-sm font-medium">Materiales</span>
          <select className={selectClass} value={material ?? ""} onChange={(e) => setMaterial((e.target.value || undefined) as Material)}>
            <option value="">Todos</option>{Object.entries(MATERIAL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <label className="col-span-2 space-y-1 md:col-span-1"><span className="text-sm font-medium">Lugar</span>
          <select className={selectClass} value={location ?? ""} onChange={(e) => setLocation((e.target.value || undefined) as Location)}>
            <option value="">Todos</option>{Object.entries(LOCATION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
      </div>
      <p className="mt-6 text-muted-foreground" aria-live="polite">{list.length} planecitos</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => <ActivityCard key={a.id} activity={a} locked={a.premium && !user?.premium} onLockedClick={() => setModal(true)} />)}
      </div>
      {!list.length && !similar.length && <EmptyState title="Ningún planecito con esos filtros. Prueba quitar alguno." />}
      {!list.length && similar.length > 0 && (
        <div>
          <p className="text-lg font-semibold">No hay uno exacto con todos esos filtros, pero estos se parecen:</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((a) => <ActivityCard key={a.id} activity={a} locked={a.premium && !user?.premium} onLockedClick={() => setModal(true)} />)}
          </div>
        </div>
      )}
      <PremiumModal open={modal} onOpenChange={setModal} />
    </AppLayout>
  );
}
