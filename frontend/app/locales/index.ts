import type { Dict, Locale } from "./types";
import { es } from "./es";
import { en } from "./en";
import { eu } from "./eu";
import { ar } from "./ar";

export const dicts: Record<Locale, Dict> = {
  es,
  en,
  eu,
  ar,
};

export type { Dict, Locale };
export { LOCALES, RTL } from "./types";