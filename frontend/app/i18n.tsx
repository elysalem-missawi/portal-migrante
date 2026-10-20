import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LOCALES,
  RTL,
  dicts,
  type Locale,
} from "./locales";

type TranslationParams = Record<
  string,
  string | number
>;

type I18nContextType = {
  locale: Locale;

  t: (
    key: string,
    params?: TranslationParams
  ) => string;

  setLocale: (
    locale: Locale
  ) => void;

  locales: Locale[];
};

const I18nContext =
  createContext<I18nContextType | null>(
    null
  );

const LS_KEY =
  "portal.locale";

export const I18nProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [
    locale,
    setLocaleState,
  ] = useState<Locale>("es");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        LS_KEY
      ) as Locale | null;

    if (
      saved &&
      LOCALES.includes(saved)
    ) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (
    nextLocale: Locale
  ) => {
    if (
      !LOCALES.includes(
        nextLocale
      )
    ) {
      return;
    }

    setLocaleState(
      nextLocale
    );

    localStorage.setItem(
      LS_KEY,
      nextLocale
    );
  };

  useEffect(() => {
    const isRtl =
      RTL[locale] || false;

    document.documentElement.dir =
      isRtl
        ? "rtl"
        : "ltr";

    document.documentElement.lang =
      locale;
  }, [locale]);

  const t = useMemo(() => {
    const activeDict =
      dicts[locale] ||
      dicts.es;

    return (
      key: string,
      params?: TranslationParams
    ): string => {
      let value =
        activeDict[key] ||
        dicts.es[key] ||
        key;

      if (params) {
        Object.entries(
          params
        ).forEach(
          ([
            name,
            replacement,
          ]) => {
            value =
              value.replaceAll(
                `{${name}}`,
                String(
                  replacement
                )
              );
          }
        );
      }

      return value;
    };
  }, [locale]);

  const value =
    useMemo(
      () => ({
        locale,
        t,
        setLocale,
        locales:
          LOCALES,
      }),
      [
        locale,
        t,
      ]
    );

  return (
    <I18nContext.Provider
      value={value}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n =
  (): I18nContextType => {
    const context =
      useContext(
        I18nContext
      );

    if (!context) {
      throw new Error(
        "useI18n must be used within an I18nProvider"
      );
    }

    return context;
  };