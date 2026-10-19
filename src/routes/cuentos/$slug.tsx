import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getStory } from "@/services/stories";
import { StoryPage } from "@/pages/StoryPage";

export const Route = createFileRoute("/cuentos/$slug")({
  ssr: false,
  loader: async ({ params }) => {
    const story = await getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.story.title ?? "Cuento"} | Planecitos` }] }),
  component: () => {
    const { story } = Route.useLoaderData();
    return <StoryPage key={story.slug} story={story} />;
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="text-lg">No encontramos ese cuento.</p>
      <Link to="/cuentos" className="mt-4 inline-block font-bold underline">Ver todos los cuentos</Link>
    </div>
  ),
});
