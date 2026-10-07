import { AppLayout } from "@/layouts/AppLayout";
import { SelectorWizard } from "@/components/SelectorWizard";
import { useChild } from "@/hooks/use-session";
import { useSearch } from "@tanstack/react-router";

export function SelectorPage() {
  const child = useChild();
  const search = useSearch({ from: "/selector" });
  return (
    <AppLayout>
      <div className="mx-auto max-w-xl">
        <p className="mb-4 font-display text-xl">¿Cuál es el planecito de hoy?</p>
        <SelectorWizard initialAge={search.age ?? child?.age} />
      </div>
    </AppLayout>
  );
}
