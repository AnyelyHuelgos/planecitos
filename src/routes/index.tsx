import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/pages/LandingPage";

const title = "Planecitos | Actividades para niños de 2 a 5 años en casa";
const description = "Dinos la edad y el tiempo. Te damos una actividad lista para hacer hoy con tu hijo, con lo que ya tienes en casa.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://planecitos.netlify.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://planecitos.netlify.app/" },
      { rel: "preload", href: "/images/hero.webp", as: "image", type: "image/webp" },
    ],
  }),
  component: LandingPage,
});
