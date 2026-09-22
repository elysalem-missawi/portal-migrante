import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useI18n } from "./i18n";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function AppShell() {
  const { t } = useI18n();

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div
              className="container py-5 text-center"
              role="status"
              aria-live="polite"
            >
              {t("loading")}
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function Root() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppShell />
    </GoogleOAuthProvider>
  );
}