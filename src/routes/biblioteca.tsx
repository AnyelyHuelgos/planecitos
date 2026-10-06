import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/pages/LibraryPage";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({ meta: [{ title: "Todos los planecitos | Planecitos" }, { name: "description", content: "Explora actividades para niños de 2 a 5 años por edad, tiempo y categoría." }, { property: "og:title", content: "Todos los planecitos | Planecitos" }, { property: "og:description", content: "Explora actividades para niños de 2 a 5 años por edad, tiempo y categoría." }] }),
  component: LibraryPage,
});
