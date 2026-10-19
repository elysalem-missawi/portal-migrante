export type Locale = "eu" | "es" | "en" | "ar";

export type Dict = Record<string, string>;

export const LOCALES: Locale[] = ["eu", "es", "en", "ar"];

export const RTL: Record<Locale, boolean> = {
  ar: true,
  es: false,
  en: false,
  eu: false,
};