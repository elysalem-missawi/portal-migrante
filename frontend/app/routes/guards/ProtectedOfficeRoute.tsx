import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  AuthGateStatus,
  useAuth,
} from "../../auth";

import type {
  OfficePermission,
  OfficeRole,
} from "../../services/office.service";

import {
  officeRolePermissions,
} from "../../services/office.service";

import type {
  User,
} from "../../services/users.service";

export function getOfficeRole(
  user: User | null
): OfficeRole {
  if (!user) {
    return "visitor";
  }

  if (
    user.platformRole ===
    "admin"
  ) {
    return "admin";
  }

  if (
    user.platformRole ===
    "moderator"
  ) {
    return "user";
  }

  return "user";
}

export function getOfficePermissions(
  user: User | null
): OfficePermission[] {
  return (
    officeRolePermissions[
      getOfficeRole(user)
    ] ?? []
  );
}

export function hasOfficePermission(
  user: User | null,
  permission: OfficePermission
) {
  return getOfficePermissions(
    user
  ).includes(permission);
}

export default function ProtectedOfficeRoute({
  children,
  permission = "view_dashboard",
}: {
  children: ReactNode;
  permission?: OfficePermission;
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
    !hasOfficePermission(
      currentUser,
      permission
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