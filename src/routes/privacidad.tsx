import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/pages/LegalPages";

export const Route = createFileRoute("/privacidad")({
  head: () => ({ meta: [{ title: "Política de privacidad | Planecitos" }, { name: "description", content: "Cómo cuida Planecitos tus datos y los de tu familia." }] }),
  component: PrivacyPage,
});
