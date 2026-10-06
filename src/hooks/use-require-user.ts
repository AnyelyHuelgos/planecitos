import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSessionReady, useUser } from "@/hooks/use-session";

/** Manda al login si no hay sesión (espera a que Supabase confirme). */
export function useRequireUser() {
  const navigate = useNavigate();
  const ready = useSessionReady();
  const user = useUser();
  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);
}
