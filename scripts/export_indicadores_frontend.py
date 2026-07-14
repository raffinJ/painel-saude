"""Exporta os 26 indicadores do modelo dimensional (data/processed/) como
JSON estatico para a aba "Indicadores" do frontend em teste_not_streamlit:
serie anual por Brasil, Regiao, UF e Municipio, prontas para o line chart,
o mapa por UF, o heatmap UF x Ano e a tabela/CSV.

Nao substitui scripts/export_ranking_frontend.py (que continua alimentando
especificamente a pagina de Ranking) - roda em paralelo a ele.
"""

import json
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from utils.data import (
    REGIOES_ORDEM,
    calcular_taxa_agregada,
    load_dim_indicadores_parquet,
    load_dim_municipios,
    load_fato_indicadores,
)

OUT_DIR = (
    Path(__file__).resolve().parent.parent
    / "teste_not_streamlit"
    / "public"
    / "data"
    / "indicadores"
)


def serie_geral(chave: str, anos: list[int], nivel: str, **filtro) -> list[dict]:
    serie = []
    for ano in anos:
        valor = calcular_taxa_agregada(chave, ano, nivel=nivel, **filtro)
        if valor is not None:
            serie.append({"ano": int(ano), "valor": round(float(valor), 4)})
    return serie


def serie_municipios(chave: str, dim_mun: pd.DataFrame) -> tuple[list[dict], bool]:
    """Retorna (municipios, multi_categoria). Alguns indicadores (ex.:
    proporcao_parto_vaginal_profissional, coef_obito_neonatal_causa) tem
    mais de uma linha por municipio/ano (uma por categoria - profissional,
    causa do obito, etc.). Ate a equipe decidir como exibir a quebra por
    categoria no frontend (ver docs/09-roadmap-e-perguntas-abertas.md),
    combinamos essas linhas em um unico valor por ano via
    soma(numerador)/soma(denominador) - mesma regra de agregacao usada em
    utils.data.calcular_taxa_agregada (ADR-001) - em vez de gerar pontos
    duplicados no mesmo ano."""
    fato = load_fato_indicadores()
    df = fato[fato["indicador_chave"] == chave].dropna(subset=["valor"])
    multi_categoria = df.groupby(["codibge", "ano"]).size().max() > 1

    if multi_categoria:
        agregado = df.groupby(["codibge", "ano"], as_index=False).agg(
            numerador=("numerador", "sum"), denominador=("denominador", "sum")
        )
        agregado["valor"] = agregado["numerador"] / agregado["denominador"]
        df = agregado

    df = df.merge(
        dim_mun[["codibge", "nome_municipio_bruto", "uf_sigla", "regiao"]],
        on="codibge",
        how="left",
    )

    municipios = []
    for codibge, grupo in df.groupby("codibge"):
        primeira = grupo.iloc[0]
        serie = [
            {"ano": int(r.ano), "valor": round(float(r.valor), 4)}
            for r in grupo.sort_values("ano").itertuples()
        ]
        municipios.append({
            "codibge": codibge,
            "nome": primeira["nome_municipio_bruto"],
            "uf": primeira["uf_sigla"],
            "regiao": primeira["regiao"],
            "serie": serie,
        })
    return municipios, multi_categoria


def main():
    dim_ind = load_dim_indicadores_parquet()
    fato = load_fato_indicadores()
    dim_mun = load_dim_municipios()

    anos = sorted(int(a) for a in fato["ano"].unique())
    ufs = sorted(dim_mun["uf_sigla"].dropna().unique())

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    indice = []
    for chave, row in dim_ind.iterrows():
        print(f"-> exportando '{chave}'...")

        brasil = serie_geral(chave, anos, "brasil")
        regioes = {r: serie_geral(chave, anos, "regiao", regiao=r) for r in REGIOES_ORDEM}
        ufs_series = {uf: serie_geral(chave, anos, "uf", uf_sigla=uf) for uf in ufs}
        municipios, multi_categoria = serie_municipios(chave, dim_mun)

        payload = {
            "chave": chave,
            "nome": row["indicador_nome"],
            "grupo": row["grupo"],
            "direcao": row["direcao"],
            "formato": row["formato"],
            "multi_categoria": bool(multi_categoria),
            "anos": anos,
            "brasil": brasil,
            "regioes": regioes,
            "ufs": ufs_series,
            "municipios": municipios,
        }

        (OUT_DIR / f"{chave}.json").write_text(
            json.dumps(payload, ensure_ascii=False), encoding="utf-8"
        )
        indice.append({
            "chave": chave,
            "nome": row["indicador_nome"],
            "grupo": row["grupo"],
            "direcao": row["direcao"],
            "formato": row["formato"],
        })

    (OUT_DIR / "_index.json").write_text(
        json.dumps(indice, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nExportados {len(indice)} indicadores para {OUT_DIR}")


if __name__ == "__main__":
    main()
