import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto bg-vitoria-green text-vitoria-white border-t-4 border-emerald-700 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

        {/* القسم الأول: أجزاء الملاحة والأقسام الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/20">

          {/* العمود الأول: التعريف بالمنصة */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-white">{t("app_title")}</h3>
            <p className="text-xs text-emerald-100 font-medium">
              Proyecto desarrollado por ASOC ZUBIA SOCIAL EUSKADI
            </p>
            <p className="text-xs leading-relaxed opacity-85">
              Plataforma digital para la integración, orientación y cohesión social del colectivo migrante en Vitoria-Gasteiz.
            </p>
          </div>

          {/* العمود الثاني: حول المشروع */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-3 text-emerald-200">
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
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-3 text-emerald-200">
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
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-3 text-emerald-200">
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
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2 px-3 rounded-md text-xs transition-colors shadow-sm uppercase tracking-wider"
              >
                {t("footer_subscribe")}
              </button>
            </form>
          </div>

        </div>

        {/* القسم الثاني: إبراز الجهة الداعمة والشعارات في الأسفل (Financiación y Colaboración) */}
        <div className="py-6 border-b border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 px-6 rounded-lg my-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <span className="text-[10px] font-semibold tracking-widest text-emerald-200 uppercase block">
              Con el apoyo y financiación de:
            </span>
            <p className="text-xs leading-relaxed opacity-90">
              Proyecto subvencionado por el <strong>Ayuntamiento de Vitoria-Gasteiz</strong> en la convocatoria de ayudas a proyectos de participación ciudadana y promoción de la cohesión social.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white p-2.5 rounded-md shadow-md">
            <img
              src="/images/MarcaAytoMonocolor-V.jpg"
              alt="Ayuntamiento de Vitoria-Gasteiz / Vitoria-Gasteizko Udala"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        {/* القسم الثالث: حقوق النشر وإخلاء المسؤولية القانوني */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-80 gap-4 text-center md:text-left pt-2">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {t("app_title")} - Todos los derechos reservados.</p>
            <p className="text-[11px] text-emerald-100 opacity-75">
              Las opiniones y contenidos expresados en esta plataforma son de exclusiva responsabilidad de ASOC ZUBIA SOCIAL EUSKADI y no reflejan necesariamente la opinión del Ayuntamiento de Vitoria-Gasteiz.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 text-[11px]">
            <Link to="/contacto" className="hover:underline">Aviso Legal</Link>
            <span>•</span>
            <Link to="/contacto" className="hover:underline">Política de Privacidad</Link>
            <span>•</span>
            <Link to="/contacto" className="hover:underline">Accesibilidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}