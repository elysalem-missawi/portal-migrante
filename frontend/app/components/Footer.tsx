import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-12 bg-vitoria-green text-vitoria-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="font-semibold mb-2">{t("app_title")}</div>
          <p className="text-sm opacity-80">{t("footer_madeby")}</p>
        </div>

        <div>
          <div className="font-semibold mb-2">{t("footer_about")}</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/sobre" className="hover:underline">{t("footer_about")}</Link></li>
            <li><Link to="/contacto" className="hover:underline">{t("footer_contact")}</Link></li>
            <li><Link to="/servicios/asociaciones" className="hover:underline">{t("f_charities")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">{t("quick_links")}</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/servicios" className="hover:underline">{t("cta_services")}</Link></li>
            <li><Link to="/foro" className="hover:underline">{t("nav_forum")}</Link></li>
            <li><Link to="/cultura-vasca" className="hover:underline">{t("nav_basque_culture")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">{t("footer_newsletter")}</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(t("footer_subscribe_success"));
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder={t("footer_email_placeholder")}
              className="flex-1 rounded-md px-3 py-2 text-sm text-vitoria-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vitoria-green"
              required
            />
            <button className="btn-primary">
              {t("footer_subscribe")}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-sm opacity-80 pb-6">
        © {new Date().getFullYear()} - {t("footer_rights")}
      </div>
    </footer>
  );
}
