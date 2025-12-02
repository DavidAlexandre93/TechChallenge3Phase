import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
