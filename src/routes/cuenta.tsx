import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/pages/AccountPages";

export const Route = createFileRoute("/cuenta")({
  head: () => ({ meta: [{ title: "Cuenta | Planecitos" }, { name: "description", content: "Tu cuenta de Planecitos." }, { property: "og:title", content: "Cuenta | Planecitos" }, { property: "og:description", content: "Tu cuenta de Planecitos." }] }),
  component: AccountPage,
});
