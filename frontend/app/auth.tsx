import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useI18n } from "./i18n";
import {
  inspectStoredSession,
  type AuthStatus,
} from "./auth-session";
import {
  usersService,
  type User,
} from "./services/users.service";

export type { AuthStatus } from "./auth-session";

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  currentUser: User | null;
  status: AuthStatus;
  error: string;
  signIn: (credentials: LoginCredentials) => Promise<User>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState("");
  const validationSequence = useRef(0);

  const refreshSession = useCallback(async () => {
    const sequence = ++validationSequence.current;
    setStatus("checking");
    setError("");

    const result = await inspectStoredSession(
      usersService.hasAuthToken(),
      () => usersService.refreshCurrentUser()
    );
    if (sequence !== validationSequence.current) return null;

    if (result.clearLocalSession) {
      usersService.clearLocalSession();
    }
    setCurrentUser(result.currentUser);
    setStatus(result.status);
    setError(result.error);
    return result.currentUser;
  }, []);

  useEffect(() => {
    void refreshSession();

    const synchronizeTabs = () => {
      void refreshSession();
    };
    window.addEventListener("storage", synchronizeTabs);
    return () => window.removeEventListener("storage", synchronizeTabs);
  }, [refreshSession]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const sequence = ++validationSequence.current;
    setStatus("checking");
    setError("");

    try {
      const user = await usersService.login(credentials);
      if (sequence === validationSequence.current) {
        setCurrentUser(user);
        setStatus("authenticated");
      }
      return user;
    } catch (caught) {
      if (sequence === validationSequence.current) {
        setCurrentUser(null);
        setStatus("anonymous");
      }
      throw caught;
    }
  }, []);

  const signOut = useCallback(async () => {
    ++validationSequence.current;
    try {
      await usersService.logout();
    } catch {
      // The local session is cleared by usersService even if the API is down.
    } finally {
      setCurrentUser(null);
      setStatus("anonymous");
      setError("");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      status,
      error,
      signIn,
      signOut,
      refreshSession,
    }),
    [currentUser, error, refreshSession, signIn, signOut, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthGateStatus({
  status,
  retry,
}: {
  status: Extract<AuthStatus, "checking" | "unavailable">;
  retry: () => void;
}) {
  const { t } = useI18n();

  return (
    <section className="container py-5" aria-live="polite">
      <div
        className={
          status === "checking"
            ? "alert alert-light border"
            : "alert alert-warning"
        }
        role="status"
      >
        <p className="mb-0">
          {status === "checking"
            ? t("session_checking")
            : t("session_unavailable")}
        </p>
        {status === "unavailable" && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm mt-3"
            onClick={retry}
          >
            {t("retry")}
          </button>
        )}
      </div>
    </section>
  );
}
