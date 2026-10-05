import { AppLayout } from "@/layouts/AppLayout";
import { SelectorWizard } from "@/components/SelectorWizard";
import { useChild } from "@/hooks/use-session";

export function SelectorPage() {
  const child = useChild();
  return (
    <AppLayout>
      <div className="mx-auto max-w-xl">
        <p className="mb-4 font-display text-lg text-sky-deep">¿Cuál es el planecito de hoy?</p>
        <SelectorWizard initialAge={child?.age} />
      </div>
    </AppLayout>
  );
}
