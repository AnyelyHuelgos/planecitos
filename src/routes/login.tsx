import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/AuthPages";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión | Planecitos" }, { name: "description", content: "Entra a Planecitos y encuentra el planecito de hoy." }, { property: "og:title", content: "Iniciar sesión | Planecitos" }, { property: "og:description", content: "Entra a Planecitos y encuentra el planecito de hoy." }] }),
  component: LoginPage,
});
