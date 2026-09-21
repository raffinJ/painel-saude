// Dataset real (5.569 municípios) gerado por scripts/export_ranking_frontend.py
// a partir do fato_indicadores real — usado para downloads e busca, em
// contraste com o mock top/bottom 15 em ranking-data.ts usado só para a
// vitrine visual da roleta.
export type RankingMunicipioReal = {
  codibge: string;
  name: string;
  uf: string;
  region: string;
  rank: number;
  composite: number;
  population: number | null;
};

// Entrada sintética para representar o Brasil (agregado nacional) nos
// mesmos seletores/listas que usam RankingMunicipioReal — ex.: o
// comparador de municípios, que permite comparar qualquer indicador
// contra o valor nacional. Não existe no dataset real (que é só
// município); tratado como caso especial onde é consumido.
export const BRASIL_CODIBGE = "BR";

export const BRASIL_ENTRY: RankingMunicipioReal = {
  codibge: BRASIL_CODIBGE,
  name: "Brasil",
  uf: "Nacional",
  region: "Agregado nacional",
  rank: 0,
  composite: 0,
  population: null,
};

let cache: Promise<RankingMunicipioReal[]> | null = null;

export function fetchRankingReal(): Promise<RankingMunicipioReal[]> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/ranking-composto-2023.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}
