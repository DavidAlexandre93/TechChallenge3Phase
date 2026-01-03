import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import type { User } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

type PrivateRouteProps = {
  children: JSX.Element;
  allowedRoles?: User["role"][];
};

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
