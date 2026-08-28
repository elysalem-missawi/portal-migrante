import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "./i18n";

export default function Root() {
  return (
    <I18nProvider>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
