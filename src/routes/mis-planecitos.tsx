import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/AccountPages";

export const Route = createFileRoute("/mis-planecitos")({
  head: () => ({ meta: [{ title: "Mis planecitos | Planecitos" }, { name: "description", content: "Los planecitos que guardaste para repetir." }, { property: "og:title", content: "Mis planecitos | Planecitos" }, { property: "og:description", content: "Los planecitos que guardaste para repetir." }] }),
  component: FavoritesPage,
});
