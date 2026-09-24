import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCALES, RTL, dicts, type Locale } from "./locales";

type I18nContextType = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
  locales: Locale[];
};

const I18nContext = createContext<I18nContextType | null>(null);

const LS_KEY = "portal.locale";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Locale | null;
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    if (!LOCALES.includes(l)) return;
    setLocaleState(l);
    localStorage.setItem(LS_KEY, l);
  };

  useEffect(() => {
    const isRtl = RTL[locale] || false;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => {
    const activeDict = dicts[locale] || dicts.es;
    return (key: string): string => {
      return activeDict[key] || dicts.es[key] || key;
    };
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      locales: LOCALES,
    }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
};