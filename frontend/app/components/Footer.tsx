import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 bg-vitoria-green text-vitoria-white border-t-4 border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-10 border-b border-white/20">
          
          {/* العمود الأول: الشعار المؤسسي والتعريف */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/images/MarcaAytoMonocolor-V.jpg"
                alt="Ayuntamiento de Vitoria-Gasteiz"
                className="h-16 w-auto object-contain bg-white/10 p-1.5 rounded"
              />
              <div>
                <h3 className="font-bold text-lg tracking-wide">{t("app_title")}</h3>
                <p className="text-xs opacity-90">{t("footer_madeby")}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed opacity-80 pt-2 border-t border-white/10">
              Iniciativa impulsada con la colaboración y apoyo institucional del Ayuntamiento de Vitoria-Gasteiz para la integración y apoyo al colectivo migrante.
            </p>
          </div>

          {/* العمود الثاني: حول المشروع */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-3 text-emerald-100">
              {t("footer_about")}
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link to="/sobre" className="hover:underline hover:text-white transition-colors">
                  {t("footer_about")}
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:underline hover:text-white transition-colors">
                  {t("footer_contact")}
                </Link>
              </li>
              <li>
                <Link to="/servicios/asociaciones" className="hover:underline hover:text-white transition-colors">
                  {t("f_charities")}
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: روابط سريعة */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-3 text-emerald-100">
              {t("quick_links")}
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link to="/servicios" className="hover:underline hover:text-white transition-colors">
                  {t("cta_services")}
                </Link>
              </li>
              <li>
                <Link to="/foro" className="hover:underline hover:text-white transition-colors">
                  {t("nav_forum")}
                </Link>
              </li>
              <li>
                <Link to="/cultura-vasca" className="hover:underline hover:text-white transition-colors">
                  {t("nav_basque_culture")}
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: النشرة البريدية */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-3 text-emerald-100">
              {t("footer_newsletter")}
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(t("footer_subscribe_success"));
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder={t("footer_email_placeholder")}
                className="w-full rounded-md px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors shadow-sm"
              >
                {t("footer_subscribe")}
              </button>
            </form>
          </div>

        </div>

        {/* الشريط السفلي للحقوق والروابط القانونية */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs opacity-75 gap-4">
          <div>
            © {new Date().getFullYear()} {t("app_title")} - {t("footer_rights")}
          </div>
          <div className="flex gap-4">
            <Link to="/contacto" className="hover:underline">Aviso Legal</Link>
            <span>•</span>
            <Link to="/contacto" className="hover:underline">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}