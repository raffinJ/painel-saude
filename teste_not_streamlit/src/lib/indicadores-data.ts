import type { Direcao } from "@/lib/color-scale";

export type IndicadorMeta = {
  chave: string;
  nome: string;
  grupo: string;
  direcao: Direcao;
  formato: string;
  multi_categoria?: boolean;
};

export type SeriePonto = { ano: number; valor: number };

export type MunicipioSerieSimples = {
  codibge: string;
  nome: string;
  uf: string;
  regiao: string;
  serie: SeriePonto[];
};

export type MunicipioSerieCategorias = {
  codibge: string;
  nome: string;
  uf: string;
  regiao: string;
  series: Record<string, SeriePonto[]>;
};

export type IndicadorDataSimples = IndicadorMeta & {
  multi_categoria: false;
  categorias: string[];
  anos: number[];
  brasil: SeriePonto[];
  regioes: Record<string, SeriePonto[]>;
  ufs: Record<string, SeriePonto[]>;
  municipios: MunicipioSerieSimples[];
};

export type IndicadorDataCategorias = IndicadorMeta & {
  multi_categoria: true;
  categorias: string[];
  anos: number[];
  brasil: Record<string, SeriePonto[]>;
  regioes: Record<string, Record<string, SeriePonto[]>>;
  ufs: Record<string, Record<string, SeriePonto[]>>;
  municipios: MunicipioSerieCategorias[];
};

/** proporcao_parto_vaginal_profissional, coef_obito_neonatal_causa: mais de
 * uma linha por município/ano (uma por categoria). As demais séries
 * (brasil/regioes/ufs/municipios) ficam aninhadas por categoria em vez de
 * um único valor combinado — combinar as categorias não faz sentido para
 * indicadores de composição (ex.: as proporções por profissional somam
 * ~100% em qualquer recorte). */
export type IndicadorData = IndicadorDataSimples | IndicadorDataCategorias;

/** Escopo geografico selecionado no drill-down Brasil > Regiao > UF > Municipio. */
export type GeoScope =
  | { nivel: "brasil" }
  | { nivel: "regiao"; regiao: string }
  | { nivel: "uf"; uf: string }
  | { nivel: "municipio"; codibge: string; nome: string; uf: string };

/** Série de UMA categoria (ou a série única, se o indicador não tem
 * categoria) no escopo geográfico selecionado — para o line chart, mapa e
 * heatmap "de um valor só". Quando o indicador tem categoria e nenhuma foi
 * passada, usa a primeira da lista. */
export function serieForScope(data: IndicadorData, scope: GeoScope, categoria?: string): SeriePonto[] {
  if (data.multi_categoria) {
    const cat = categoria ?? data.categorias[0];
    switch (scope.nivel) {
      case "brasil":
        return data.brasil[cat] ?? [];
      case "regiao":
        return data.regioes[scope.regiao]?.[cat] ?? [];
      case "uf":
        return data.ufs[scope.uf]?.[cat] ?? [];
      case "municipio":
        return data.municipios.find((m) => m.codibge === scope.codibge)?.series[cat] ?? [];
    }
  }
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

/** Série de TODAS as categorias no escopo geográfico selecionado — para o
 * gráfico de barras empilhadas e a tabela pivotada. Vazio se o indicador
 * não tem categoria. */
export function seriesPorCategoriaForScope(
  data: IndicadorDataCategorias,
  scope: GeoScope,
): Record<string, SeriePonto[]> {
  switch (scope.nivel) {
    case "brasil":
      return data.brasil;
    case "regiao":
      return data.regioes[scope.regiao] ?? {};
    case "uf":
      return data.ufs[scope.uf] ?? {};
    case "municipio":
      return data.municipios.find((m) => m.codibge === scope.codibge)?.series ?? {};
  }
}

/** Reduz ufs (Record<uf, série-por-categoria>) a Record<uf, série-única>
 * para uma categoria específica — o formato que o mapa e o heatmap
 * entendem, independente de o indicador ter categoria ou não. */
export function ufsSeriesParaCategoria(
  data: IndicadorData,
  categoria?: string,
): Record<string, SeriePonto[]> {
  if (!data.multi_categoria) return data.ufs;
  const cat = categoria ?? data.categorias[0];
  const out: Record<string, SeriePonto[]> = {};
  for (const uf of Object.keys(data.ufs)) out[uf] = data.ufs[uf][cat] ?? [];
  return out;
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
