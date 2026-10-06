import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getActivityBySlug } from "@/services/activities";
import { ActivityPage } from "@/pages/ActivityPage";

export const Route = createFileRoute("/planecito/$slug")({
  // Se carga en el navegador para usar la sesión del usuario (premium)
  ssr: false,
  loader: async ({ params }) => {
    const activity = await getActivityBySlug(params.slug);
    if (!activity) throw notFound();
    return { activity };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.activity.title ?? "Planecito"} | Planecitos`;
    const d = loaderData?.activity.shortDescription ?? "Una actividad lista para hacer con tu hijo.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: () => <ActivityPage activity={Route.useLoaderData().activity} />,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="font-display text-2xl">Ese planecito no existe.</p>
      <Link to="/biblioteca" className="mt-4 inline-block underline">Ver todos</Link>
    </div>
  ),
});
