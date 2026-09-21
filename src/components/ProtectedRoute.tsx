import { getSession } from "@/lib/backend";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const authenticated = Boolean(getSession());

  useEffect(() => {
    if (!authenticated) {
      void navigate({ to: "/login", replace: true });
    }
  }, [authenticated, navigate]);

  if (!authenticated) return null;

  return <>{children}</>;
}
