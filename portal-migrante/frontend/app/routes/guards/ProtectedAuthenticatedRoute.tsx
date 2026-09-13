import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { User } from "../../services/users.service";
import { usersService } from "../../services/users.service";

export default function ProtectedAuthenticatedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    usersService.getCurrentUser()
  );

  useEffect(() => {
    return usersService.onCurrentUserChange(() =>
      setCurrentUser(usersService.getCurrentUser())
    );
  }, []);

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
