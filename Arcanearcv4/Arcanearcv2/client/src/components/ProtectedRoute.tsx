import { useEffect } from "react";
import { useLocation } from "wouter";
import { getAuthState, isAdmin } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, token } = getAuthState();

  useEffect(() => {
    if (!token || !user) {
      setLocation("/login");
      return;
    }

    if (requireAdmin && !isAdmin(user)) {
      setLocation("/dashboard");
      return;
    }
  }, [token, user, requireAdmin, setLocation]);

  if (!token || !user) {
    return null;
  }

  if (requireAdmin && !isAdmin(user)) {
    return null;
  }

  return <>{children}</>;
}
