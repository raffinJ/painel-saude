// Escala de cor compartilhada pelo mapa por UF e pelo heatmap da aba
// Indicadores. Usa color-mix() em cima dos tokens de tema (--color-brand /
// --color-accent-warm), o mesmo padrão já usado em src/styles.css para
// ::selection, em vez de uma paleta nova desconectada do resto do site.

export type Direcao = "maior_melhor" | "menor_melhor" | "neutro";

export function normalize(valor: number, min: number, max: number): number {
  if (!Number.isFinite(valor) || max === min) return 0.5;
  return Math.min(1, Math.max(0, (valor - min) / (max - min)));
}

/** 0 = pior valor do recorte atual, 100 = melhor. Indicadores "neutro" não
 * têm melhor/pior — tratamos como escala sequencial (maior = 100). */
export function colorScalePercent(
  valor: number,
  min: number,
  max: number,
  direcao: Direcao,
): number {
  let t = normalize(valor, min, max);
  if (direcao === "menor_melhor") t = 1 - t;
  return Math.round(t * 100);
}

export function colorForValue(
  valor: number,
  min: number,
  max: number,
  direcao: Direcao,
): string {
  if (direcao === "neutro") {
    const pct = Math.round(normalize(valor, min, max) * 100);
    return `color-mix(in oklch, var(--color-brand-dark) ${pct}%, var(--color-brand-soft) ${100 - pct}%)`;
  }
  const pct = colorScalePercent(valor, min, max, direcao);
  return `color-mix(in oklch, var(--color-brand) ${pct}%, var(--color-accent-warm) ${100 - pct}%)`;
}

export function extentOf(valores: number[]): [number, number] {
  const validos = valores.filter((v) => Number.isFinite(v));
  if (!validos.length) return [0, 1];
  return [Math.min(...validos), Math.max(...validos)];
}
