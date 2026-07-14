import type { Direcao } from "@/lib/color-scale";

export type IndicadorMeta = {
  chave: string;
  nome: string;
  grupo: string;
  direcao: Direcao;
  formato: string;
};

export type SeriePonto = { ano: number; valor: number };

export type MunicipioSerie = {
  codibge: string;
  nome: string;
  uf: string;
  regiao: string;
  serie: SeriePonto[];
};

export type IndicadorData = IndicadorMeta & {
  multi_categoria: boolean;
  anos: number[];
  brasil: SeriePonto[];
  regioes: Record<string, SeriePonto[]>;
  ufs: Record<string, SeriePonto[]>;
  municipios: MunicipioSerie[];
};

/** Escopo geografico selecionado no drill-down Brasil > Regiao > UF > Municipio. */
export type GeoScope =
  | { nivel: "brasil" }
  | { nivel: "regiao"; regiao: string }
  | { nivel: "uf"; uf: string }
  | { nivel: "municipio"; codibge: string; nome: string; uf: string };

export function serieForScope(data: IndicadorData, scope: GeoScope): SeriePonto[] {
  switch (scope.nivel) {
    case "brasil":
      return data.brasil;
    case "regiao":
      return data.regioes[scope.regiao] ?? [];
    case "uf":
      return data.ufs[scope.uf] ?? [];
    case "municipio":
      return data.municipios.find((m) => m.codibge === scope.codibge)?.serie ?? [];
  }
}

export function scopeLabel(scope: GeoScope): string {
  switch (scope.nivel) {
    case "brasil":
      return "Brasil";
    case "regiao":
      return scope.regiao;
    case "uf":
      return scope.uf;
    case "municipio":
      return scope.nome;
  }
}

/** Aplica uma mascara de formato no estilo Python ("{:.1f}%", "{:.2f}") a um numero. */
export function formatValor(valor: number | null | undefined, formato: string): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "—";
  const match = formato.match(/\{:\.(\d+)f\}/);
  const decimals = match ? parseInt(match[1], 10) : 2;
  const formatted = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return match ? formato.replace(match[0], formatted) : formatted;
}
