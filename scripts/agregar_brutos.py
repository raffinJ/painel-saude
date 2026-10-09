"""
Agrega os CSVs brutos (base primária, estratificados por idade, peso, raça...)
para o grão município x ano, preservando NUMERADOR e DENOMINADOR.

Saída: data/brutos/<chave>.csv  (codibge, ano, numerador, denominador)
Esses arquivos são pequenos e versionados; o resto do pipeline não depende
do HD externo.

Uso:
    python scripts/agregar_brutos.py                  # todos os indicadores registrados
    python scripts/agregar_brutos.py proporcao_cesareas

COMO ADICIONAR UM INDICADOR: acrescente uma entrada em BRUTOS com o CSV de
origem, as colunas lidas e as funções que calculam numerador/denominador por
linha. Códigos de município terminados em "0000" (sem informação de
município) são sempre descartados, como no pipeline anterior.
"""

import sys
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
HD_DIR = Path("/Volumes/HD JULIA/dados_qualineopre")
OUT_DIR = BASE_DIR / "data" / "brutos"

# fator: escala do indicador (valor = numerador / denominador * fator)
# Nenhum indicador inclui dados de 2025 ou posteriores.
ANO_MAX = 2023

def _sisab() -> pd.DataFrame:
    """Numerador: gestantes com 1º atendimento de pré-natal no SISAB (soma
    mensal de 'Total Gestantes'). Denominador: nascidos vivos + nascidos
    mortos (SINASC + SIM). Município sem registro no SISAB entra com
    numerador 0."""
    pasta = HD_DIR / "cobertura_sisab"
    s = pd.read_csv(pasta / "relatorio_sisab.csv", dtype={"codibge": str})
    s = s.rename(columns={"YEAR": "ano", "Total Gestantes": "numerador"})
    num = s.groupby(["codibge", "ano"], as_index=False)["numerador"].sum()
    n = pd.read_csv(pasta / "nascidos_vivos_mais_nascidos_mortos.csv", dtype={"codibge": str}, low_memory=False)
    n["denominador"] = n["nascidosvivos"] + n["nascidosmortos"]
    den = n.rename(columns={"YEAR": "ano"}).groupby(["codibge", "ano"], as_index=False)["denominador"].sum()
    out = den.merge(num, on=["codibge", "ano"], how="outer")
    out["numerador"] = out["numerador"].fillna(0)
    return out.dropna(subset=["denominador"])


BRUTOS = {
    # Validado contra o documento "Cobertura do SISAB": numerador 2017-2023 =
    # 11.506.153 e denominador por ano idêntico à Tabela 1. A série começa em
    # 2017 (início do SISAB).
    "cobertura_sisab": dict(
        carregar=_sisab,
        nome="Taxa de Cobertura do SISAB (pré-natal)",
        grupo="Grupo 1 - Pré-natal",
        direcao="maior_melhor",
        formato="{:.1f}%",
        unidade="%",
        fator=100,
    ),
    # numerador = partos cesáreos; denominador = todos os partos (cesáreo +
    # vaginal + ignorado + não informado; os sem via informada ficam no
    # denominador, decisão declarada na metodologia). Validado contra o indicador
    # anterior: os 89.093 pares município-ano coincidem.
    "proporcao_cesareas": dict(
        arquivo="prop_cesariana/proporcao_cesareas_resmae.csv",
        ano="year",
        colunas=["cesáreo", "ignorado", "não informado", "vaginal"],
        numerador=lambda d: d["cesáreo"],
        denominador=lambda d: d[["cesáreo", "ignorado", "não informado", "vaginal"]].sum(axis=1),
        fator=100,
    ),
}


def agregar(chave: str) -> Path:
    cfg = BRUTOS[chave]
    if "carregar" in cfg:
        print(f"-> {chave}: lendo fontes em {HD_DIR}")
        out = cfg["carregar"]()
        out = out[~out["codibge"].str.endswith("0000")]
        out = out[out["ano"] <= ANO_MAX]
    else:
        path = HD_DIR / cfg["arquivo"]
        print(f"-> {chave}: lendo {path}")
        df = pd.read_csv(path, usecols=[cfg["ano"], "codibge", *cfg["colunas"]], dtype={"codibge": str})
        df = df[~df["codibge"].str.endswith("0000")]
        df = df[df[cfg["ano"]] <= ANO_MAX]
        out = pd.DataFrame({
            "codibge": df["codibge"],
            "ano": df[cfg["ano"]],
            "numerador": cfg["numerador"](df),
            "denominador": cfg["denominador"](df),
        })
    out = out.groupby(["codibge", "ano"], as_index=False).sum()
    out["numerador"] = out["numerador"].round().astype(int)
    out["denominador"] = out["denominador"].round().astype(int)
    out = out[out["denominador"] > 0]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    destino = OUT_DIR / f"{chave}.csv"
    out.to_csv(destino, index=False)
    print(f"   {len(out):,} linhas -> {destino}".replace(",", "."))
    return destino


if __name__ == "__main__":
    chaves = sys.argv[1:] or list(BRUTOS)
    for c in chaves:
        agregar(c)
