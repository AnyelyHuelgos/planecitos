import { useEffect } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import type { Activity } from "@/types/activity";
import { AppLayout } from "@/layouts/AppLayout";
import { ActivityDetail } from "@/components/ActivityDetail";
import { Button } from "@/components/Button";
import { track } from "@/services/analytics";

export function ResultPage({ matches, index, search }: { matches: Activity[]; index: number; search: Record<string, unknown> }) {
  const navigate = useNavigate();
  const router = useRouter();
  const free = matches.filter((a) => !a.premium);
  const list = free.length ? free : matches;
  const activity = list[index % list.length]!;

  useEffect(() => { track("activity_viewed", { slug: activity.slug, from: "result" }); }, [activity.slug]);

  return (
    <AppLayout>
      <ActivityDetail
        key={activity.slug}
        activity={activity}
        eyebrow="Tu planecito está listo"
        actions={
          <>
            <Button onClick={() => navigate({ to: "/resultado", search: { ...search, i: index + 1 } })}>Otro planecito</Button>
            <Button variant="ghost" onClick={() => router.history.back()}>Volver</Button>
          </>
        }
      />
      <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground">
        ¿Quieres cambiar algo? <Link to="/selector" className="font-semibold text-ink underline underline-offset-4">Empezar de nuevo</Link>
      </p>
    </AppLayout>
  );
}
