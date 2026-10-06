import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { findActivities } from "@/services/activities";
import { ResultPage } from "@/pages/ResultPage";
import type { Material } from "@/types/activity";

const schema = z.object({
  age: z.coerce.number().int().min(2).max(5).optional().catch(undefined),
  duration: z.union([z.literal(5), z.literal(15), z.literal(30)]).optional().catch(undefined),
  category: z.enum(["crear", "moverse", "aprender", "tranquilo", "juntos", "solo"]).optional().catch(undefined),
  materials: z.string().optional().catch(undefined),
  i: z.coerce.number().int().min(0).optional().catch(0),
});

export const Route = createFileRoute("/resultado")({
  validateSearch: schema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    findActivities({
      age: deps.age as 2 | 3 | 4 | 5 | undefined,
      duration: deps.duration,
      category: deps.category,
      materials: deps.materials ? (deps.materials.split(",") as Material[]) : undefined,
    }),
  head: () => ({ meta: [{ title: "Tu planecito está listo | Planecitos" }, { name: "description", content: "Una actividad lista según la edad y el tiempo que tienes." }, { property: "og:title", content: "Tu planecito está listo | Planecitos" }, { property: "og:description", content: "Una actividad lista según la edad y el tiempo que tienes." }] }),
  component: () => {
    const search = Route.useSearch();
    return <ResultPage matches={Route.useLoaderData()} index={search.i ?? 0} search={search} />;
  },
});
