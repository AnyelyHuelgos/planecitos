import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/pages/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Bienvenida | Planecitos" }, { name: "description", content: "Cuéntanos de tu hijo para recomendarte mejores planecitos." }, { property: "og:title", content: "Bienvenida | Planecitos" }, { property: "og:description", content: "Cuéntanos de tu hijo para recomendarte mejores planecitos." }] }),
  component: OnboardingPage,
});
