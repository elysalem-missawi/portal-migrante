import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  usersService,
  type PlatformRole,
  type User,
} from "../../services/users.service";

function effectivePlatformRole(user: User): PlatformRole {
  if (user.platformRole) return user.platformRole;
  if (user.role === "super_admin") return "super_admin";
  if (user.role === "admin") return "admin";
  return "user";
}

export function isPlatformStaffUser(user: User | null) {
  if (!user) return false;
  return ["moderator", "admin", "super_admin"].includes(
    effectivePlatformRole(user)
  );
}

export function isPlatformAdminUser(user: User | null) {
  if (!user) return false;
  return ["admin", "super_admin"].includes(
    effectivePlatformRole(user)
  );
}

export default function ProtectedPlatformStaffRoute({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    usersService.getCurrentUser()
  );

  useEffect(
    () =>
      usersService.onCurrentUserChange(() =>
        setCurrentUser(usersService.getCurrentUser())
      ),
    []
  );

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isPlatformStaffUser(currentUser)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
