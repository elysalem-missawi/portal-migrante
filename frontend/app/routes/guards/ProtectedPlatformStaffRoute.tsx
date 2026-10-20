import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  AuthGateStatus,
  useAuth,
} from "../../auth";

import type {
  User,
} from "../../services/users.service";

export function isPlatformStaffUser(
  user: User | null
) {
  if (!user) {
    return false;
  }

  return (
    user.platformRole === "moderator" ||
    user.platformRole === "admin"
  );
}

export function isPlatformAdminUser(
  user: User | null
) {
  if (!user) {
    return false;
  }

  return (
    user.platformRole === "admin"
  );
}

export default function ProtectedPlatformStaffRoute({
  children,
}: {
  children: ReactNode;
}) {
  const location =
    useLocation();

  const {
    currentUser,
    status,
    refreshSession,
  } = useAuth();

  if (
    status === "checking" ||
    status === "unavailable"
  ) {
    return (
      <AuthGateStatus
        status={status}
        retry={() =>
          void refreshSession()
        }
      />
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  if (
    !isPlatformStaffUser(
      currentUser
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <>{children}</>;
}