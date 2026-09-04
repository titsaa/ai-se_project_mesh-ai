import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

type PublicRouteProps = {
  children: ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/knowledge" replace />;
  }

  return <>{children}</>;
}
