import { createFileRoute } from "@tanstack/react-router";
import { StoriesPage } from "@/pages/StoriesPage";

export const Route = createFileRoute("/cuentos/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Cuentitos mágicos | Planecitos" }, { name: "description", content: "Cuentos cortos para leer y escuchar con tu hijo, con un juego al final." }] }),
  component: StoriesPage,
});
