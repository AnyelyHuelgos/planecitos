import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { Activity } from "@/types/activity";
import { AppLayout } from "@/layouts/AppLayout";
import { ActivityDetail } from "@/components/ActivityDetail";
import { Button, buttonClass } from "@/components/Button";
import { PremiumModal } from "@/components/PremiumModal";
import { useUser } from "@/hooks/use-session";
import { track } from "@/services/analytics";

export function ActivityPage({ activity }: { activity: Activity }) {
  const user = useUser();
  const [modal, setModal] = useState(false);
  useEffect(() => { track("activity_viewed", { slug: activity.slug }); }, [activity.slug]);

  if (activity.premium && !user?.premium) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-light"><Lock /></span>
          <h1 className="mt-5 text-[30px]">{activity.title}</h1>
          <p className="mt-3 text-muted-foreground">Este planecito es parte del acceso fundadores.</p>
          <Button block size="lg" className="mt-6" onClick={() => setModal(true)}>Desbloquear</Button>
          <Link to="/biblioteca" className={buttonClass({ variant: "ghost", block: true, className: "mt-2" })}>Ver otros planecitos</Link>
        </div>
        <PremiumModal open={modal} onOpenChange={setModal} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ActivityDetail activity={activity} actions={<Link to="/selector" className={buttonClass({})}>Otro planecito</Link>} />
    </AppLayout>
  );
}
