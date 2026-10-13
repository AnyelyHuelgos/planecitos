import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/pages/LegalPages";

export const Route = createFileRoute("/terminos")({
  head: () => ({ meta: [{ title: "Términos y condiciones | Planecitos" }, { name: "description", content: "Condiciones de uso y compra de Planecitos." }] }),
  component: TermsPage,
});
