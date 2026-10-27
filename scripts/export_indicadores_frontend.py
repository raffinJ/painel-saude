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
from agregar_brutos import BRUTOS, OUT_DIR as BRUTOS_DIR

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


def exportar_indicador_bruto(chave: str) -> dict:
    """Indicador cuja fonte e' data/brutos/<chave>.csv (numerador e
    denominador por municipio x ano [x categoria]). Todos os niveis
    (municipio, UF, regiao, Brasil) saem de soma(numerador)/soma(denominador)
    * fator, e cada ponto leva `num` e `den` para o site mostrar "X de Y".

    Indicador "soma" (cfg soma=True): o valor e' a propria soma do numerador
    (estimativa de leitos), sem razao e sem num/den nos pontos; UF, regiao e
    Brasil saem de <chave>_uf.csv (populacao oficial por UF)."""
    cfg = BRUTOS[chave]
    fator = cfg["fator"]
    soma = cfg.get("soma", False)
    mun = pd.read_csv(BRUTOS_DIR / "_municipios.csv", dtype={"codibge": str})
    arq = BRUTOS_DIR / f"{chave}.csv"
    df = pd.read_csv(arq if arq.exists() else arq.with_suffix(".csv.gz"), dtype={"codibge": str})
    df = df.merge(mun, on="codibge", how="left")
    if df["uf"].isna().any():
        sys.exit(f"{chave}: municipios sem cadastro em _municipios.csv: "
                 f"{sorted(df[df['uf'].isna()]['codibge'].unique())[:10]}")
    multi = "categoria" in df.columns
    categorias = (cfg.get("ordem") or sorted(df["categoria"].unique())) if multi else []

    # nivel agregado: por UF oficial (soma) ou pelos proprios municipios
    agg = df
    if soma and (BRUTOS_DIR / f"{chave}_uf.csv").exists():
        ufs_csv = pd.read_csv(BRUTOS_DIR / f"{chave}_uf.csv", dtype={"codigo_uf": str})
        ref = mun.assign(codigo_uf=mun["codibge"].str[:2])[["codigo_uf", "uf", "regiao"]].drop_duplicates()
        agg = ufs_csv.merge(ref, on="codigo_uf", how="left")

    def serie(sub: pd.DataFrame, omitir_zeros: bool = False) -> list[dict]:
        g = sub.groupby("ano")[["numerador", "denominador"]].sum()
        pts = []
        for ano, r in g.iterrows():
            if r.denominador <= 0 or (omitir_zeros and r.numerador == 0):
                continue
            if soma:
                pts.append({"ano": int(ano), "valor": round(float(r.numerador), 4)})
            else:
                pts.append({"ano": int(ano), "valor": round(float(r.numerador / r.denominador * fator), 4),
                            "num": int(r.numerador), "den": int(r.denominador)})
        return pts

    def nivel(sub: pd.DataFrame):
        if not multi:
            return serie(sub)
        return {c: serie(sub[sub["categoria"] == c]) for c in categorias}

    municipios = []
    for cod, g in ([] if cfg.get("sem_municipios") else df.groupby("codibge")):
        base = {"codibge": cod, "nome": g["nome"].iat[0], "uf": g["uf"].iat[0], "regiao": g["regiao"].iat[0]}
        if multi:
            series = {c: serie(g[g["categoria"] == c], omitir_zeros=True) for c in categorias}
            if any(series.values()):
                municipios.append({**base, "series": series})
        else:
            municipios.append({**base, "serie": serie(g)})
    return {
        "anos": sorted(int(a) for a in df["ano"].unique()),
        "multi_categoria": multi,
        "categorias": categorias,
        "brasil": nivel(agg),
        "regioes": {r: nivel(agg[agg["regiao"] == r]) for r in REGIOES_ORDEM},
        "ufs": {uf: nivel(agg[agg["uf"] == uf]) for uf in sorted(agg["uf"].dropna().unique())},
        "municipios": municipios,
        **({"empilhado": False} if cfg.get("empilhado") is False else {}),
    }


def exportar_indicador(chave: str, row, anos: list[int], ufs: list[str], dim_mun: pd.DataFrame) -> dict:
    if chave in BRUTOS:
        extra = exportar_indicador_bruto(chave)
        anos = extra.pop("anos")
        return {
            "chave": chave, "nome": row["indicador_nome"], "grupo": row["grupo"],
            "direcao": row["direcao"], "formato": row["formato"], "unidade": row["unidade"],
            "anos": anos, **extra,
        }

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


def main_brutos(chaves: list[str]):
    """Exporta so indicadores com fonte em data/brutos/ (nao precisa dos
    parquets). Atualiza o JSON do indicador e mantem o _index.json."""
    meta = {r["chave"]: r for r in json.loads((OUT_DIR / "_index.json").read_text(encoding="utf-8"))}
    for chave in chaves:
        cfg = BRUTOS[chave]
        if "nome" in cfg:  # indicador novo, metadados vivem em BRUTOS
            row = {k: cfg[k] for k in ("grupo", "direcao", "formato", "unidade")}
            row["indicador_nome"] = cfg["nome"]
        else:
            antigo = json.loads((OUT_DIR / f"{chave}.json").read_text(encoding="utf-8"))
            row = {k: antigo[k] for k in ("grupo", "direcao", "formato", "unidade")}
            row["indicador_nome"] = antigo["nome"]
        payload = exportar_indicador(chave, row, [], [], None)
        (OUT_DIR / f"{chave}.json").write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        if chave not in meta or "nome" in cfg:
            meta[chave] = {"chave": chave, "nome": row["indicador_nome"], "grupo": row["grupo"],
                           "direcao": row["direcao"], "formato": row["formato"],
                           "unidade": row["unidade"], "multi_categoria": payload["multi_categoria"]}
            (OUT_DIR / "_index.json").write_text(json.dumps(list(meta.values()), ensure_ascii=False), encoding="utf-8")
        print(f"-> '{chave}' exportado a partir de data/brutos/")


def main():
    if len(sys.argv) > 1:
        return main_brutos(sys.argv[1:])
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
