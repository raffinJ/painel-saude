import { useSyncExternalStore } from "react";

// Guarda os códigos IBGE selecionados para comparação em localStorage, para
// sobreviver à navegação entre páginas (Ranking, cabeçalho, /comparar).
const KEY = "cuidadopreneo_comparador";
export const COMPARADOR_MAX = 4;

// useSyncExternalStore exige que getSnapshot devolva a MESMA referência
// enquanto o valor subjacente não mudar — por isso o resultado do parse é
// cacheado, senão cada chamada cria um array novo e o React entra em loop.
let cachedRaw: string | null = null;
let cached: string[] = [];

function read(): string[] {
  if (typeof window === "undefined") return cached;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    cached = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    cached = [];
  }
  return cached;
}

function write(ibges: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ibges));
  window.dispatchEvent(new Event("comparador-change"));
}

export function getComparador(): string[] {
  return read();
}

/** Retorna false se já estiver no limite de COMPARADOR_MAX. */
export function addToComparador(ibge: string): boolean {
  const atual = read();
  if (atual.includes(ibge)) return true;
  if (atual.length >= COMPARADOR_MAX) return false;
  write([...atual, ibge]);
  return true;
}

export function removeFromComparador(ibge: string) {
  write(read().filter((i) => i !== ibge));
}

export function clearComparador() {
  write([]);
}

function subscribe(callback: () => void) {
  window.addEventListener("comparador-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("comparador-change", callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY: string[] = [];

/** Lista reativa dos IBGEs no comparador — atualiza em qualquer componente
 * assim que add/remove/clear é chamado, sem precisar de um Context no root. */
export function useComparador(): string[] {
  return useSyncExternalStore(subscribe, getComparador, () => EMPTY);
}
