// Strips accents so "Aguas Frias" finds "Águas Frias" — most people typing
// a Brazilian municipality name on the fly skip diacritics.
export function normalizeSearch(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}
