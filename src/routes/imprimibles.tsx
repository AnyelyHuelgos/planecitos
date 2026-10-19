import { createFileRoute } from "@tanstack/react-router";
import { PrintablesPage } from "@/pages/PrintablesPage";

export const Route = createFileRoute("/imprimibles")({
  ssr: false,
  head: () => ({ meta: [{ title: "Imprimibles | Planecitos" }, { name: "description", content: "Páginas para colorear, laberintos y recortables para niños de 2 a 5 años." }] }),
  component: PrintablesPage,
});
