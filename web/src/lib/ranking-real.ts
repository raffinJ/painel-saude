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
