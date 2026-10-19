import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useI18n } from "./i18n";

function AppShell() {
  const { t } = useI18n();
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

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
  return <AppShell />;
}
