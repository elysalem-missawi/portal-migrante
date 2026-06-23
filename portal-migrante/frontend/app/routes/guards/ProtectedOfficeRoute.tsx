import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { OfficePermission, OfficeRole } from "../../services/office.service";
import { officeRolePermissions } from "../../services/office.service";
import type { User } from "../../services/users.service";
import { usersService } from "../../services/users.service";

const currentRoleToOfficeRole: Record<string, OfficeRole> = {
  community_user: "user",
  organization_manager: "partner_manager",
  admin: "admin",
  super_admin: "super_admin",
};

export function getOfficeRole(user: User | null): OfficeRole {
  if (!user) return "visitor";
  return currentRoleToOfficeRole[user.role] ?? "user";
}

export function getOfficePermissions(user: User | null): OfficePermission[] {
  return officeRolePermissions[getOfficeRole(user)] ?? [];
}

export function hasOfficePermission(user: User | null, permission: OfficePermission) {
  return getOfficePermissions(user).includes(permission);
}

export default function ProtectedOfficeRoute({
  children,
  permission = "view_dashboard",
}: {
  children: ReactNode;
  permission?: OfficePermission;
}) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(() => usersService.getCurrentUser());

  useEffect(() => {
    return usersService.onCurrentUserChange(() => setCurrentUser(usersService.getCurrentUser()));
  }, []);

  const allowed = useMemo(
    () => currentUser && hasOfficePermission(currentUser, permission),
    [currentUser, permission]
  );

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
