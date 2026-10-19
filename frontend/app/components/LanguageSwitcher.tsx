import { useI18n } from "../i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();

  const languageNames = {
    eu: "Euskera",
    es: "Español",
    en: "English",
    ar: "العربية",
  };

  return (
    <div className="relative">
      <select
        className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-vitoria-black focus:outline-none focus:ring-2 focus:ring-vitoria-green focus:border-transparent hover:border-vitoria-green transition-colors cursor-pointer"
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        aria-label={t("language_label")}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {languageNames[l as keyof typeof languageNames]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-vitoria-gray">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
