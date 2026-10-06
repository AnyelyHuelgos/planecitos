import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage } from "@/pages/AuthPages";

export const Route = createFileRoute("/recuperar")({
  head: () => ({ meta: [{ title: "Recuperar contraseña | Planecitos" }, { name: "description", content: "Recupera el acceso a tu cuenta de Planecitos." }, { property: "og:title", content: "Recuperar contraseña | Planecitos" }, { property: "og:description", content: "Recupera el acceso a tu cuenta de Planecitos." }] }),
  component: RecoverPage,
});
