import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/pages/LandingPage";

const title = "Planecitos | ¿Cuál es el planecito de hoy?";
const description = "Ideas fáciles para jugar, crear y compartir con niños de 2 a 5 años, según su edad y el tiempo que tienes.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: LandingPage,
});
