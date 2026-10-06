import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/pages/AuthPages";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Crear cuenta | Planecitos" }, { name: "description", content: "Crea tu cuenta de Planecitos en menos de un minuto." }, { property: "og:title", content: "Crear cuenta | Planecitos" }, { property: "og:description", content: "Crea tu cuenta de Planecitos en menos de un minuto." }] }),
  component: SignupPage,
});
