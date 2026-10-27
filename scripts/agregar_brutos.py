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


def _obitos_neonatais_causa() -> pd.DataFrame:
    """Numerador: óbitos neonatais (SIM) por Agrupamento_Nivel_1; denominador:
    nascidos vivos (SINASC) do município de residência. Formato longo, com
    todas as combinações município x ano x categoria (zeros preenchidos), pois
    o denominador de uma categoria precisa de todos os municípios."""
    pasta = HD_DIR / "obito_neo_causa"
    n = pd.read_csv(pasta / "obitos_neonatais_evitaveis_numerador_res.csv",
                    usecols=["YEAR", "codibge", "Agrupamento_Nivel_1", "obitos_neonatais_evitaveis"],
                    dtype={"codibge": str})
    n = n.rename(columns={"YEAR": "ano", "Agrupamento_Nivel_1": "categoria",
                          "obitos_neonatais_evitaveis": "numerador"})
    num = n.groupby(["codibge", "ano", "categoria"], as_index=False)["numerador"].sum()
    d = pd.read_csv(pasta / "obitos_neonatais_evitaveis_denominador_res.csv",
                    usecols=["year", "codmunres", "nascidos_vivos"], dtype={"codmunres": str})
    den = (d.rename(columns={"year": "ano", "codmunres": "codibge", "nascidos_vivos": "denominador"})
             .groupby(["codibge", "ano"], as_index=False)["denominador"].sum())
    cats = pd.DataFrame({"categoria": sorted(num["categoria"].unique())})
    base = den.merge(cats, how="cross")
    out = base.merge(num, on=["codibge", "ano", "categoria"], how="left")
    out["numerador"] = out["numerador"].fillna(0)
    return out


def _nascidos_vivos() -> pd.DataFrame:
    """Nascidos vivos por município de residência e ano (SINASC)."""
    n = pd.read_csv(HD_DIR / "nascidos_vivos" / "nascidos_vivos.csv", dtype={"codibge": str})
    return (n.rename(columns={"year": "ano", "nascidos_vivos": "denominador"})
             .groupby(["codibge", "ano"], as_index=False)["denominador"].sum())


def _sobre_nv(num: pd.DataFrame) -> pd.DataFrame:
    """Junta um numerador (codibge, ano, numerador) ao denominador de NV.
    Município-ano sem registro no numerador entra com 0."""
    out = _nascidos_vivos().merge(num, on=["codibge", "ano"], how="left")
    out["numerador"] = out["numerador"].fillna(0)
    return out


def _triagem_neonatal() -> pd.DataFrame:
    """Numerador: exames de triagem neonatal (SIA/SIH; teste do pezinho,
    orelhinha e coraçãozinho) — quantidade de EXAMES, não de crianças.
    Denominador: nascidos vivos."""
    t = pd.read_csv(HD_DIR / "TAN" / "procs_TAN_consolidado.csv",
                    usecols=["year", "codibge", "quantidade"], dtype={"codibge": str})
    num = (t.rename(columns={"year": "ano", "quantidade": "numerador"})
             .groupby(["codibge", "ano"], as_index=False)["numerador"].sum())
    return _sobre_nv(num)


def _consultas_puerperio() -> pd.DataFrame:
    """Numerador: consultas puerperais (03.01.01.012-9) por município de
    OCORRÊNCIA — 93% dos registros (BPA-C) não têm município de residência.
    Denominador: nascidos vivos por município de residência."""
    pasta = HD_DIR / "puerp_consultas_puerperio"
    p = pd.read_csv(pasta / "procs_consulta_puerperio_consolidado_novo.csv",
                    usecols=["year", "codibge_oco", "quantidade"], dtype={"codibge_oco": str})
    num = (p.rename(columns={"year": "ano", "codibge_oco": "codibge", "quantidade": "numerador"})
             .dropna(subset=["codibge"]).groupby(["codibge", "ano"], as_index=False)["numerador"].sum())
    d = pd.read_csv(pasta / "denominador_gestantes.csv",
                    usecols=["year", "codmunres", "nascidos_vivos"], dtype={"codmunres": str})
    den = (d.rename(columns={"year": "ano", "codmunres": "codibge", "nascidos_vivos": "denominador"})
             .groupby(["codibge", "ano"], as_index=False)["denominador"].sum())
    out = den.merge(num, on=["codibge", "ano"], how="left")
    out["numerador"] = out["numerador"].fillna(0)
    return out


def _vacinas(coluna: str):
    def carregar() -> pd.DataFrame:
        v = pd.read_csv(HD_DIR / "neonatos-vacinados" / "vacinados_hepatiteb_bcg.csv",
                        usecols=["ANO", "codibge", coluna], dtype={"codibge": str})
        # ano sem nenhum registro (ex.: 2019, dado ausente na fonte) não é zero
        num = (v.rename(columns={"ANO": "ano", coluna: "numerador"})
                 .groupby(["codibge", "ano"], as_index=False)["numerador"].sum(min_count=1)
                 .dropna(subset=["numerador"]))
        anos_ok = num.groupby("ano")["numerador"].sum().loc[lambda s: s > 0].index
        num = num[num["ano"].isin(anos_ok)]
        out = _sobre_nv(num)
        return out[out["ano"].isin(anos_ok)]
    return carregar


def _alojamento_conjunto() -> pd.DataFrame:
    """Proporção de estabelecimentos com nascimentos que têm alojamento
    conjunto (CNES, QTLEIT40). Numerador = estabelecimentos com AC somados
    por mês; denominador = estabelecimentos com nascimentos somados por mês
    (razão das somas mensais = média ponderada das proporções mensais)."""
    pasta = HD_DIR / "alojamento_conjunto"
    a = pd.read_excel(pasta / "leitos_alojamento_v2.xlsx",
                      usecols=["year", "month", "cnes", "codibge", "total_alojamentos"])
    a = a[a["total_alojamentos"] > 0].drop_duplicates(["year", "month", "cnes"])
    a["codibge"] = a["codibge"].astype(str)
    num = (a.groupby(["codibge", "year"]).size().rename("numerador").reset_index()
             .rename(columns={"year": "ano"}))
    c = pd.read_csv(pasta / "cnes_com_nascimentos.csv", dtype={"codmunnasc": str})
    c = c.drop_duplicates(["year", "month", "cnes"])
    den = (c.groupby(["codmunnasc", "year"]).size().rename("denominador").reset_index()
             .rename(columns={"codmunnasc": "codibge", "year": "ano"}))
    out = den.merge(num, on=["codibge", "ano"], how="left")
    out["numerador"] = out["numerador"].fillna(0)
    return out


def _robson() -> pd.DataFrame:
    """Taxa de cesárea dentro de cada grupo de Robson (SINASC). Numerador =
    cesáreas do grupo; denominador = nascidos vivos do grupo."""
    r = pd.read_csv(HD_DIR / "grupo_robson" / "taxa_grupo_robson_resmae.csv",
                    usecols=["year", "codibge", "parto_desc", "tprobson", "nascidos_vivos"],
                    dtype={"codibge": str, "tprobson": str})
    cod = pd.to_numeric(r["tprobson"], errors="coerce")
    r["categoria"] = cod.where(cod.between(1, 10)).map(lambda x: f"Grupo {int(x)}" if x == x else None)
    r["categoria"] = r["categoria"].fillna("Não classificado")
    r["cesarea"] = r["nascidos_vivos"].where(r["parto_desc"].str.lower().str.startswith("ces"), 0)
    r = r.rename(columns={"year": "ano"})
    return (r.groupby(["codibge", "ano", "categoria"], as_index=False)
              .agg(numerador=("cesarea", "sum"), denominador=("nascidos_vivos", "sum")))


# Parâmetros da Portaria SAS/MS 650/2011 e da Rede Cegonha (leitos UTI adulto)
_USUARIOS_SUS = 0.75
_LEITOS_OBST_POR_MIL = 0.28
_UTI_SOBRE_OBST = 0.06


def _uti_estimado(pop: pd.Series) -> pd.DataFrame:
    sus = pop * _USUARIOS_SUS
    return pd.DataFrame({"denominador": sus,
                         "numerador": sus * _LEITOS_OBST_POR_MIL / 1000 * _UTI_SOBRE_OBST})


def _uti_populacao(tipos: tuple[str, ...]) -> pd.DataFrame:
    p = pd.read_csv(HD_DIR / "enf_obstetricos" / "populacao_ibge.csv", dtype={"codRegion": str})
    p = p[p["regionType"].isin(tipos)].rename(columns={"year": "ano", "codRegion": "codibge"})
    return pd.concat([p[["codibge", "ano"]], _uti_estimado(p["population"])], axis=1)


def _uti_adulto() -> pd.DataFrame:
    """Leitos de UTI adulto necessários à atenção materna (estimativa): população
    x 75% (usuários SUS) x 0,28/1.000 (leitos obstétricos) x 6% (UTI)."""
    return _uti_populacao(("MN",))


def _uti_adulto_uf() -> pd.DataFrame:
    """Mesma estimativa a partir da população oficial por UF (projeção IBGE),
    base dos totais de UF/região/Brasil no documento. A soma das estimativas
    municipais difere (ex.: 2008 +1,4%; 2023 repete a população do Censo 2022)."""
    return _uti_populacao(("UF",))


BRUTOS = {
    # --- Indicadores novos (sem validação contra documento; ver docs/04 §4.10) ---
    "cobertura_triagem_neonatal": dict(
        carregar=_triagem_neonatal,
        nome="Taxa de Cobertura Neonatal Ambulatorial",
        grupo="Grupo 3 - Neonatal", direcao="maior_melhor", formato="{:.1f}%",
        unidade="exames por 100 nascidos vivos", fator=100,
    ),
    "consultas_puerperio": dict(
        carregar=_consultas_puerperio,
        nome="Proporção de Puérperas com Consulta no Puerpério",
        grupo="Grupo 4 - Puerpério", direcao="maior_melhor", formato="{:.1f}%",
        unidade="consultas por 100 nascidos vivos", fator=100,
    ),
    "vacinacao_bcg": dict(
        carregar=_vacinas("bcg_doses"),
        nome="Proporção de Neonatos Vacinados — BCG",
        grupo="Grupo 3 - Neonatal", direcao="maior_melhor", formato="{:.1f}%",
        unidade="doses por 100 nascidos vivos", fator=100,
    ),
    "vacinacao_hepatite_b": dict(
        carregar=_vacinas("hepatite_b_doses"),
        nome="Proporção de Neonatos Vacinados — Hepatite B",
        grupo="Grupo 3 - Neonatal", direcao="maior_melhor", formato="{:.1f}%",
        unidade="doses por 100 nascidos vivos", fator=100,
    ),
    "proporcao_alojamento_conjunto": dict(
        carregar=_alojamento_conjunto,
        nome="Proporção de Instituições com Alojamento Conjunto",
        grupo="Grupo 2 - Parto", direcao="maior_melhor", formato="{:.1f}%",
        unidade="% dos estabelecimentos com nascimentos", fator=100,
    ),
    # 11 categorias que NÃO somam um todo (taxa de cesárea dentro de cada
    # grupo): gráfico sem empilhar. Sem série municipal (peso do JSON).
    "cesareas_grupo_robson": dict(
        carregar=_robson, gzip=True, empilhado=False, sem_municipios=True,
        ordem=[f"Grupo {i}" for i in range(1, 11)] + ["Não classificado"],
        nome="Proporção de Cesáreas por Grupo de Robson",
        grupo="Grupo 2 - Parto", direcao="neutro", formato="{:.1f}%",
        unidade="% de cesáreas dentro do grupo", fator=100,
    ),
    # Validado contra o documento: 399.692 óbitos (2008-2023), 307.227
    # evitáveis, 45.480.337 nascidos vivos.
    "coef_obito_neonatal_causa": dict(carregar=_obitos_neonatais_causa, fator=1000),
    # Indicador de tipo "soma": o valor é a própria estimativa de leitos
    # (numerador), e não uma razão. Validado: Brasil 2008 = 2.374, 2023 = 2.725.
    "taxa_leitos_uti_adulto": dict(
        carregar=_uti_adulto, carregar_uf=_uti_adulto_uf, soma=True,
        nome="Número de leitos de UTI adulto necessários para a atenção materna",
        grupo="Grupo 4 - Puerpério", direcao="neutro", formato="{:.2f}",
        unidade="leitos estimados", fator=1,
    ),
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
    # só municípios IBGE: descarta códigos que não existem em _municipios.csv
    # (ex.: Regiões Administrativas do DF, 5399xx)
    validos = set(pd.read_csv(OUT_DIR / "_municipios.csv", dtype={"codibge": str})["codibge"])
    fora = out[~out["codibge"].isin(validos)]
    if len(fora):
        print(f"   descartados {fora['codibge'].nunique()} códigos fora do IBGE "
              f"({sorted(fora['codibge'].unique())[:5]}): numerador={fora['numerador'].sum():,.0f}, "
              f"denominador={fora['denominador'].sum():,.0f}".replace(",", "."))
    out = out[out["codibge"].isin(validos)]
    chaves = [c for c in ("codibge", "ano", "categoria") if c in out.columns]
    out = out.groupby(chaves, as_index=False)[["numerador", "denominador"]].sum()
    if cfg.get("soma"):  # estimativas fracionárias
        out["numerador"] = out["numerador"].round(6)
        out["denominador"] = out["denominador"].round(2)
    else:
        out["numerador"] = out["numerador"].round().astype(int)
        out["denominador"] = out["denominador"].round().astype(int)
    out = out[out["denominador"] > 0]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    destino = OUT_DIR / (f"{chave}.csv.gz" if cfg.get("gzip") else f"{chave}.csv")
    out.to_csv(destino, index=False)
    if "carregar_uf" in cfg:
        uf = cfg["carregar_uf"]()
        uf = uf[uf["ano"] <= ANO_MAX].rename(columns={"codibge": "codigo_uf"})
        uf["codigo_uf"] = uf["codigo_uf"].str[:2]
        uf = uf.round({"numerador": 6, "denominador": 2})
        uf.to_csv(OUT_DIR / f"{chave}_uf.csv", index=False)
    print(f"   {len(out):,} linhas -> {destino}".replace(",", "."))
    return destino


if __name__ == "__main__":
    chaves = sys.argv[1:] or list(BRUTOS)
    for c in chaves:
        agregar(c)
