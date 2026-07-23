"""Exporta os 26 indicadores do modelo dimensional (data/processed/) como
JSON estatico para a aba "Indicadores" do frontend em web/:
serie anual por Brasil, Regiao, UF e Municipio, prontas para o line chart,
o mapa por UF, o heatmap UF x Ano e a tabela/CSV.

Indicadores com quebra por categoria (proporcao_parto_vaginal_profissional,
coef_obito_neonatal_causa) exportam uma serie POR CATEGORIA em cada nivel
geografico, em vez de combinar as categorias num unico valor - somar
numerador/denominador por cima das categorias nao faz sentido para
indicadores de composicao (ex.: as proporcoes por profissional somam
~100% em qualquer municipio/ano, misturar tudo "confirma" um numero que
nao significa nada).

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
    listar_categorias,
    load_dim_indicadores_parquet,
    load_dim_municipios,
    load_fato_indicadores,
)

OUT_DIR = (
    Path(__file__).resolve().parent.parent
    / "web"
    / "public"
    / "data"
    / "indicadores"
)


def serie_geral(chave: str, anos: list[int], nivel: str, categoria: str | None = None, **filtro) -> list[dict]:
    serie = []
    for ano in anos:
        valor = calcular_taxa_agregada(chave, ano, nivel=nivel, categoria=categoria, **filtro)
        if valor is not None:
            serie.append({"ano": int(ano), "valor": round(float(valor), 4)})
    return serie


def serie_geral_por_categoria(
    chave: str, anos: list[int], nivel: str, categorias: list[str], **filtro
) -> dict[str, list[dict]]:
    return {cat: serie_geral(chave, anos, nivel, categoria=cat, **filtro) for cat in categorias}


def serie_municipios(chave: str, dim_mun: pd.DataFrame) -> list[dict]:
    """Indicadores simples (sem categoria): uma serie por municipio."""
    fato = load_fato_indicadores()
    df = fato[fato["indicador_chave"] == chave].dropna(subset=["valor"])
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
    return municipios


def serie_municipios_por_categoria(
    chave: str, dim_mun: pd.DataFrame, categorias: list[str]
) -> list[dict]:
    """Indicadores com categoria: uma serie por categoria, dentro de cada
    municipio (series[categoria] = [{ano, valor}, ...])."""
    fato = load_fato_indicadores()
    df = fato[fato["indicador_chave"] == chave].dropna(subset=["valor"])
    df = df.merge(
        dim_mun[["codibge", "nome_municipio_bruto", "uf_sigla", "regiao"]],
        on="codibge",
        how="left",
    )

    municipios = []
    for codibge, grupo in df.groupby("codibge"):
        primeira = grupo.iloc[0]
        series = {}
        for cat in categorias:
            sub = grupo[grupo["categoria"] == cat].sort_values("ano")
            series[cat] = [
                {"ano": int(r.ano), "valor": round(float(r.valor), 4)} for r in sub.itertuples()
            ]
        municipios.append({
            "codibge": codibge,
            "nome": primeira["nome_municipio_bruto"],
            "uf": primeira["uf_sigla"],
            "regiao": primeira["regiao"],
            "series": series,
        })
    return municipios


def exportar_indicador(chave: str, row, anos: list[int], ufs: list[str], dim_mun: pd.DataFrame) -> dict:
    categorias = listar_categorias(chave)
    multi_categoria = bool(categorias)

    if multi_categoria:
        brasil = serie_geral_por_categoria(chave, anos, "brasil", categorias)
        regioes = {
            r: serie_geral_por_categoria(chave, anos, "regiao", categorias, regiao=r)
            for r in REGIOES_ORDEM
        }
        ufs_series = {
            uf: serie_geral_por_categoria(chave, anos, "uf", categorias, uf_sigla=uf) for uf in ufs
        }
        municipios = serie_municipios_por_categoria(chave, dim_mun, categorias)
    else:
        brasil = serie_geral(chave, anos, "brasil")
        regioes = {r: serie_geral(chave, anos, "regiao", regiao=r) for r in REGIOES_ORDEM}
        ufs_series = {uf: serie_geral(chave, anos, "uf", uf_sigla=uf) for uf in ufs}
        municipios = serie_municipios(chave, dim_mun)

    return {
        "chave": chave,
        "nome": row["indicador_nome"],
        "grupo": row["grupo"],
        "direcao": row["direcao"],
        "formato": row["formato"],
        "unidade": row["unidade"],
        "multi_categoria": multi_categoria,
        "categorias": categorias,
        "anos": anos,
        "brasil": brasil,
        "regioes": regioes,
        "ufs": ufs_series,
        "municipios": municipios,
    }


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
        payload = exportar_indicador(chave, row, anos, ufs, dim_mun)

        (OUT_DIR / f"{chave}.json").write_text(
            json.dumps(payload, ensure_ascii=False), encoding="utf-8"
        )
        indice.append({
            "chave": chave,
            "nome": row["indicador_nome"],
            "grupo": row["grupo"],
            "direcao": row["direcao"],
            "formato": row["formato"],
            "unidade": row["unidade"],
            "multi_categoria": payload["multi_categoria"],
        })

    (OUT_DIR / "_index.json").write_text(
        json.dumps(indice, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nExportados {len(indice)} indicadores para {OUT_DIR}")


if __name__ == "__main__":
    main()
