import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthGateStatus, useAuth } from "../../auth";

export default function ProtectedAuthenticatedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const { currentUser, status, refreshSession } = useAuth();

  if (status === "checking" || status === "unavailable") {
    return (
      <AuthGateStatus
        status={status}
        retry={() => void refreshSession()}
      />
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}
