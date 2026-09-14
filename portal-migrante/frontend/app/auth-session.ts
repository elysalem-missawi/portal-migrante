import type { User } from "./services/users.service";

export type AuthStatus =
  | "checking"
  | "authenticated"
  | "anonymous"
  | "unavailable";

export type StoredSessionResult = {
  currentUser: User | null;
  status: Exclude<AuthStatus, "checking">;
  error: string;
  clearLocalSession: boolean;
};

export function isRejectedSession(error: unknown) {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number" &&
    [401, 403, 404].includes(error.status)
  );
}

export async function inspectStoredSession(
  hasToken: boolean,
  loadCurrentUser: () => Promise<User>
): Promise<StoredSessionResult> {
  if (!hasToken) {
    return {
      currentUser: null,
      status: "anonymous",
      error: "",
      clearLocalSession: true,
    };
  }

  try {
    const currentUser = await loadCurrentUser();
    return {
      currentUser,
      status: "authenticated",
      error: "",
      clearLocalSession: false,
    };
  } catch (caught: unknown) {
    if (isRejectedSession(caught)) {
      return {
        currentUser: null,
        status: "anonymous",
        error: "",
        clearLocalSession: true,
      };
    }

    return {
      currentUser: null,
      status: "unavailable",
      error:
        caught instanceof Error ? caught.message : "Session check failed",
      clearLocalSession: false,
    };
  }
}
