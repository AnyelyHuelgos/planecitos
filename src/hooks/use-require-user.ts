import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getCurrentUser } from "@/services/auth";

/** Client-side guard for mock auth. Swap for a Supabase session check later. */
export function useRequireUser() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getCurrentUser()) navigate({ to: "/login", replace: true });
  }, [navigate]);
}
