"""
Funções centrais de carregamento e manipulação de dados do painel.

O painel inteiro é orientado pelo catálogo (data/catalogo_indicadores.csv)
e pela base longa gerada por scripts/importar_indicadores.py
(data/indicadores_long.csv). Para adicionar um indicador novo, veja as
instruções no topo de scripts/importar_indicadores.py — nenhuma página
do site precisa ser alterada.
"""

import pandas as pd
import streamlit as st

LONG_DATA_PATH = "data/indicadores_long.csv"
CATALOGO_PATH = "data/catalogo_indicadores.csv"

REGIOES_ORDEM = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]


@st.cache_data
def load_catalogo() -> pd.DataFrame:
    return pd.read_csv(CATALOGO_PATH).set_index("chave")


@st.cache_data
def load_long_data() -> pd.DataFrame:
    return pd.read_csv(
        LONG_DATA_PATH,
        dtype={"codibge": str, "cod_mapa": str},
    )


def get_indicator_options() -> dict:
    """{rótulo amigável: chave} apenas para indicadores com dados carregados."""
    catalogo = load_catalogo()
    chaves_disponiveis = set(load_long_data()["indicador"].unique())
    return {
        row["nome_amigavel"]: chave
        for chave, row in catalogo.iterrows()
        if chave in chaves_disponiveis
    }


def get_indicator_df(chave: str) -> pd.DataFrame:
    """Retorna o recorte do indicador com colunas:
    year, codibge, cod_mapa, municipio, uf_sigla, uf_nome, regiao, valor
    """
    df = load_long_data()
    return df[df["indicador"] == chave].drop(columns=["indicador"]).reset_index(drop=True)


def format_value(chave: str, valor: float) -> str:
    catalogo = load_catalogo()
    fmt = catalogo.loc[chave, "formato"] if chave in catalogo.index else "{:.2f}"
    try:
        return fmt.format(valor)
    except (ValueError, TypeError):
        return str(valor)


def is_lower_better(chave: str) -> bool:
    catalogo = load_catalogo()
    if chave not in catalogo.index:
        return True
    return catalogo.loc[chave, "direcao"] == "menor_melhor"


def indicator_group(chave: str) -> str:
    catalogo = load_catalogo()
    return catalogo.loc[chave, "grupo"] if chave in catalogo.index else ""


def rank_dataframe(df: pd.DataFrame, ascending: bool) -> pd.DataFrame:
    """Adiciona a coluna 'posicao' (1 = melhor) ao dataframe filtrado.
    Espera uma coluna chamada 'valor'."""
    out = df.sort_values("valor", ascending=ascending).reset_index(drop=True)
    out.insert(0, "posicao", out.index + 1)
    return out


def filter_geo(df: pd.DataFrame, regioes=None, ufs=None) -> pd.DataFrame:
    if regioes:
        df = df[df["regiao"].isin(regioes)]
    if ufs:
        df = df[df["uf_sigla"].isin(ufs)]
    return df


# ===================================================================== #
# Motor de consultas sobre o modelo dimensional (data/processed/*.parquet)
#
# Gerado por scripts/build_dataset.py. Estas funcoes NAO substituem as
# acima (que ainda alimentam as paginas atuais via indicadores_long.csv) -
# sao a base para a proxima geracao de paginas, que vai consumir direto
# fato_indicadores/dim_municipios/dim_indicadores/dim_populacao.
# ===================================================================== #

PROCESSED_DIR = "data/processed"


@st.cache_data
def load_fato_indicadores() -> pd.DataFrame:
    return pd.read_parquet(f"{PROCESSED_DIR}/fato_indicadores.parquet").astype({"codibge": str})


@st.cache_data
def load_dim_municipios() -> pd.DataFrame:
    return pd.read_parquet(f"{PROCESSED_DIR}/dim_municipios.parquet").astype({"codibge": str})


@st.cache_data
def load_dim_indicadores_parquet() -> pd.DataFrame:
    return pd.read_parquet(f"{PROCESSED_DIR}/dim_indicadores.parquet").set_index("indicador_chave")


@st.cache_data
def load_dim_populacao() -> pd.DataFrame:
    return pd.read_parquet(f"{PROCESSED_DIR}/dim_populacao.parquet").astype({"codibge": str})


def _fator_escala(df_municipios: pd.DataFrame) -> float:
    """Deriva o fator de escala do indicador (ex.: x100 para %, x1000 para
    coeficiente por mil) a partir das proprias linhas municipais, em vez de
    exigir essa informacao no catalogo. Para cada linha com numerador e
    denominador validos, valor = (numerador/denominador) * fator; tomamos a
    mediana entre os municipios para robustez a arredondamento."""
    validas = df_municipios[(df_municipios["numerador"] > 0) & (df_municipios["denominador"] > 0)]
    if validas.empty:
        return 1.0
    fatores = validas["valor"] * validas["denominador"] / validas["numerador"]
    return float(fatores.median())


def calcular_taxa_agregada(
    indicador_chave: str,
    ano: int,
    nivel: str = "brasil",
    uf_sigla: str | None = None,
    regiao: str | None = None,
) -> float | None:
    """Calcula o valor do indicador para Brasil, uma Regiao ou uma UF, no
    ano dado, agregando corretamente os municipios (nunca por media simples
    das taxas municipais):

    - Indicadores com numerador/denominador (a maioria): recalcula a taxa
      como (soma(numerador) / soma(denominador)) * fator_escala.
    - Indicadores sem numerador/denominador (ex.: indicador_composto, que
      ja vem ponderado/calculado por municipio): media ponderada por
      nascidos_vivos, ou seja soma(valor * nascidos_vivos) / soma(nascidos_vivos).

    nivel: "brasil" | "regiao" | "uf". Para "regiao"/"uf" informe o
    respectivo filtro (regiao=... ou uf_sigla=...).
    """
    fato = load_fato_indicadores()
    dim_mun = load_dim_municipios()

    df = fato[(fato["indicador_chave"] == indicador_chave) & (fato["ano"] == ano)].copy()
    if df.empty:
        return None

    df = df.merge(dim_mun[["codibge", "uf_sigla", "regiao"]], on="codibge", how="left")

    if nivel == "uf":
        if not uf_sigla:
            raise ValueError("nivel='uf' requer uf_sigla.")
        df = df[df["uf_sigla"] == uf_sigla]
    elif nivel == "regiao":
        if not regiao:
            raise ValueError("nivel='regiao' requer regiao.")
        df = df[df["regiao"] == regiao]
    elif nivel != "brasil":
        raise ValueError("nivel deve ser 'brasil', 'regiao' ou 'uf'.")

    if df.empty:
        return None

    tem_numerador_denominador = df["numerador"].notna().any() and df["denominador"].notna().any()

    if tem_numerador_denominador:
        soma_num = df["numerador"].sum()
        soma_den = df["denominador"].sum()
        if not soma_den:
            return None
        fator = _fator_escala(df)
        return (soma_num / soma_den) * fator

    # sem numerador/denominador -> media ponderada por nascidos_vivos
    dim_pop = load_dim_populacao()
    pesos = dim_pop[dim_pop["ano"] == ano][["codibge", "nascidos_vivos"]]
    df = df.merge(pesos, on="codibge", how="left").dropna(subset=["valor", "nascidos_vivos"])
    soma_peso = df["nascidos_vivos"].sum()
    if df.empty or not soma_peso:
        return None
    return (df["valor"] * df["nascidos_vivos"]).sum() / soma_peso


def montar_ranking(
    indicador_chave: str,
    ano: int,
    faixa_populacional: str | None = None,
    excluir_zeros: bool = False,
) -> pd.DataFrame:
    """Monta o ranking de municipios para um indicador/ano.

    Regras:
    - Le a direcao (maior_melhor / menor_melhor) em dim_indicadores para
      decidir a ordenacao.
    - Municipios sem valor no ano sao removidos explicitamente (nao vao
      para as pontas do ranking).
    - Empates sao desfeitos por populacao do municipio (maior primeiro) e,
      persistindo, por nome do municipio (alfabetico).
    - faixa_populacional (opcional) filtra para comparar apenas municipios
      de porte semelhante (veja scripts/build_dataset.py:
      FAIXAS_POPULACIONAIS_LABELS) - evita comparar Sao Paulo com Assu.
    - excluir_zeros (opcional, default False): remove do RANKING os
      municipios com valor == 0. Usado para indicadores onde 0 e um valor
      legitimo mas nao comparavel - ex.: taxa_leitos_neonatais, onde
      municipios sem hospital especializado ficam zerados por nao terem
      leito, nao porque tenham a "melhor taxa". O 0 continua aparecendo
      normalmente no painel do indicador (fora do ranking); so' e' excluido
      aqui. NAO usar como default global: em varios indicadores (ex.:
      mortalidade) 0 e' de fato o melhor valor possivel e deve ranquear.

    Retorna um DataFrame com a coluna 'posicao' (1 = melhor) adicionada.
    """
    dim_ind = load_dim_indicadores_parquet()
    if indicador_chave not in dim_ind.index:
        raise ValueError(f"indicador desconhecido: {indicador_chave}")
    ascending = dim_ind.loc[indicador_chave, "direcao"] == "menor_melhor"

    fato = load_fato_indicadores()
    dim_mun = load_dim_municipios()
    dim_pop = load_dim_populacao()

    df = fato[(fato["indicador_chave"] == indicador_chave) & (fato["ano"] == ano)].copy()
    df = df.dropna(subset=["valor"])  # remove municipios sem dado no ano, em vez de jogar pra ponta

    if excluir_zeros:
        df = df[df["valor"] != 0]

    df = df.merge(dim_mun, on="codibge", how="left")
    pop_ano = dim_pop[dim_pop["ano"] == ano][
        ["codibge", "populacao_municipio", "nascidos_vivos", "faixa_populacional"]
    ]
    df = df.merge(pop_ano, on="codibge", how="left")

    if faixa_populacional:
        df = df[df["faixa_populacional"] == faixa_populacional]

    df = df.sort_values(
        ["valor", "populacao_municipio", "nome_municipio_bruto"],
        ascending=[ascending, False, True],
    ).reset_index(drop=True)
    df.insert(0, "posicao", df.index + 1)
    return df
