import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { I18nProvider, useI18n } from "./i18n";

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
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
