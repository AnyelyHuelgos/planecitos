import { createFileRoute } from "@tanstack/react-router";
import { NewPasswordPage } from "@/pages/AuthPages";

export const Route = createFileRoute("/nueva-contrasena")({
  ssr: false,
  head: () => ({ meta: [{ title: "Nueva contraseña | Planecitos" }, { name: "robots", content: "noindex" }] }),
  component: NewPasswordPage,
});
