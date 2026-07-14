"""Exporta o ranking do indicador_composto (ano 2023) como JSON para a busca
por município do frontend em teste_not_streamlit (todos os municípios, não
só o top/bottom 15 mockado em ranking-data.ts)."""

import json
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from utils.data import montar_ranking

ANO = 2023
OUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "teste_not_streamlit"
    / "public"
    / "data"
    / "ranking-composto-2023.json"
)


def main():
    df = montar_ranking("indicador_composto", ANO)

    records = []
    for row in df.itertuples():
        records.append({
            "codibge": row.codibge,
            "name": row.nome_municipio_bruto,
            "uf": row.uf_sigla,
            "region": row.regiao,
            "rank": int(row.posicao),
            "composite": round(float(row.valor), 1),
            "population": int(row.populacao_municipio) if pd.notna(row.populacao_municipio) else None,
        })

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(records, ensure_ascii=False), encoding="utf-8")
    print(f"Exportado {len(records)} municipios ({ANO}) para {OUT_PATH}")


if __name__ == "__main__":
    main()
