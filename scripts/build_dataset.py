"""
Etapa 1 — Padronização e Performance de Dados (QualiPreNeo).

Lê todos os .xlsx de data/raw/, padroniza suas colunas e consolida tudo em
um único modelo dimensional (fato + dimensões), pronto para consultas
rápidas por Município, Ano e Indicador. Grava o resultado em dois formatos
equivalentes:

    data/processed/*.parquet   — leitura rápida via pandas/DuckDB (Streamlit)
    data/processed/qualipreneo.db  — SQLite indexado (bom p/ Next.js/API)

MODELO DE DADOS
----------------
fato_indicadores (grão: município x ano x indicador [x categoria]):
    codibge, cod_mapa, ano, grupo, indicador_chave, indicador_nome,
    valor, numerador, denominador, categoria, fonte_arquivo

dim_municipios (um registro por município):
    codibge, cod_mapa, nome_municipio_bruto, uf_sigla, uf_nome, regiao

dim_indicadores (catálogo — um registro por indicador):
    indicador_chave, indicador_nome, grupo, direcao, formato, unidade,
    arquivo_origem

dim_populacao (grão: município x ano — pesos demográficos para agregação
ponderada e para estratificar rankings por porte; não é um indicador do
catálogo):
    codibge, ano, nascidos_vivos, populacao_municipio, populacao_uf,
    populacao_br, faixa_populacional

COMO ADICIONAR UM NOVO INDICADOR
---------------------------------
Acrescente uma entrada em MANIFESTO (veja o formato dos exemplos abaixo) e
rode `python scripts/build_dataset.py` novamente.

REGRAS DE PADRONIZAÇÃO APLICADAS
----------------------------------
- 'codibge' (6 dígitos) e 'cod_mapa' (7 dígitos, com dígito verificador) são
  sempre tratados e gravados como TEXTO, com zero à esquerda preservado.
- Quando um arquivo não traz 'cod_mapa' próprio, ele é preenchido a partir
  de um mapa mestre codibge -> cod_mapa construído com os arquivos que o
  possuem (evita reimplementar o algoritmo de dígito verificador do IBGE).
- Linhas sem 'codibge' ou sem valor no indicador são descartadas (dado
  suprimido/õ ausente) e contabilizadas no relatório final para auditoria.
- Arquivos com grão mais fino que município x ano (ex.: leitos neonatais,
  que vem por mês) são agregados para o grão padrão antes da união.
- Códigos de Regiões Administrativas do DF que não são municípios IBGE
  (veja CODIGOS_EXCLUIR) são descartados como os "0000" de UF.
"""

import sqlite3
import sys
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
OUT_DIR = BASE_DIR / "data" / "processed"

# Tabela de pesos demograficos (nascidos vivos + populacao), grao municipio x
# ano. Nao entra no MANIFESTO porque nao e um indicador em si: alimenta a
# agregacao ponderada (UF/Regiao/Brasil) e a estratificacao de rankings por
# porte, usada por utils/data.py.
POPULACAO_ARQUIVO = "nascidos_vivos_populacao.xlsx"

# Codigos que aparecem nos arquivos de origem mas NAO sao municipios segundo
# o IBGE - sao Regioes Administrativas (RA) do Distrito Federal, usadas por
# alguns sistemas do Ministerio da Saude (SINASC) para o DF, que so tem um
# municipio oficial (530010 - Brasilia). Confirmado manualmente:
#   539914 -> RA de Planaltina
#   539927 -> RA de Brasilia - Asa Norte
# Impacto verificado: 2 linhas em todo o fato_indicadores (1 indicador, 1
# ano, denominador=1 cada) - descartamos em vez de somar a 530010 para nao
# contaminar um indicador que ja tem problema proprio de categoria.
CODIGOS_EXCLUIR = {"539914", "539927"}

# Faixas de porte populacional para estratificar rankings (nao compara
# municipios de tamanhos muito diferentes). Baseado em populacao_municipio
# de dim_populacao, calculado por ano (o porte de um municipio pode mudar
# ao longo dos 16 anos da serie).
FAIXAS_POPULACIONAIS_BINS = [0, 5_000, 10_000, 20_000, 50_000, 100_000, 500_000, float("inf")]
FAIXAS_POPULACIONAIS_LABELS = [
    "Até 5 mil hab.",
    "Mais de 5 mil até 10 mil hab.",
    "Mais de 10 mil até 20 mil hab.",
    "Mais de 20 mil até 50 mil hab.",
    "Mais de 50 mil até 100 mil hab.",
    "Mais de 100 mil até 500 mil hab.",
    "Mais de 500 mil hab.",
]


def classificar_porte(populacao: pd.Series) -> pd.Series:
    return pd.cut(populacao, bins=FAIXAS_POPULACIONAIS_BINS, labels=FAIXAS_POPULACIONAIS_LABELS, right=True)

UF_INFO = {
    "11": ("RO", "Rondônia", "Norte"), "12": ("AC", "Acre", "Norte"),
    "13": ("AM", "Amazonas", "Norte"), "14": ("RR", "Roraima", "Norte"),
    "15": ("PA", "Pará", "Norte"), "16": ("AP", "Amapá", "Norte"),
    "17": ("TO", "Tocantins", "Norte"),
    "21": ("MA", "Maranhão", "Nordeste"), "22": ("PI", "Piauí", "Nordeste"),
    "23": ("CE", "Ceará", "Nordeste"), "24": ("RN", "Rio Grande do Norte", "Nordeste"),
    "25": ("PB", "Paraíba", "Nordeste"), "26": ("PE", "Pernambuco", "Nordeste"),
    "27": ("AL", "Alagoas", "Nordeste"), "28": ("SE", "Sergipe", "Nordeste"),
    "29": ("BA", "Bahia", "Nordeste"),
    "31": ("MG", "Minas Gerais", "Sudeste"), "32": ("ES", "Espírito Santo", "Sudeste"),
    "33": ("RJ", "Rio de Janeiro", "Sudeste"), "35": ("SP", "São Paulo", "Sudeste"),
    "41": ("PR", "Paraná", "Sul"), "42": ("SC", "Santa Catarina", "Sul"),
    "43": ("RS", "Rio Grande do Sul", "Sul"),
    "50": ("MS", "Mato Grosso do Sul", "Centro-Oeste"), "51": ("MT", "Mato Grosso", "Centro-Oeste"),
    "52": ("GO", "Goiás", "Centro-Oeste"), "53": ("DF", "Distrito Federal", "Centro-Oeste"),
}

GRUPO1 = "Grupo 1 - Pré-natal"
GRUPO2 = "Grupo 2 - Parto"
GRUPO3 = "Grupo 3 - Neonatal"
GRUPO4 = "Grupo 4 - Puerpério"
GRUPO5 = "Grupo 5 - Perinatal"
GRUPO_GERAL = "Indicador Composto"

# Cada entrada descreve como extrair UM indicador de UM arquivo bruto.
# coluna_ano: nome da coluna de ano no arquivo de origem (varia: year/YEAR)
# coluna_categoria: dimensão extra opcional (ex.: causa do óbito)
# grao_mensal: True quando o arquivo vem em município x ano x mês e precisa
#              ser reduzido para município x ano (usando 'first', pois o
#              valor anual já vem replicado em cada linha mensal).
# 'unidade': rotulo de unidade/escala mostrado nos graficos do frontend
# (eixo Y, legenda de mapa/heatmap). Verificado empiricamente contra o
# dado real processado (mediana de valor*denominador/numerador), nao so
# copiado da planilha de planejamento da equipe - ver
# docs/03-catalogo-e-metodologia-indicadores.md §3.6 para as divergencias
# encontradas entre a planilha e o dado real.
MANIFESTO = [
    dict(arquivo="grupo1_prenatal/munic_ano_estabelecimentos.xlsx", grupo=GRUPO1,
         chave="cobertura_estabelecimentos_saude",
         nome="Coeficiente de Estabelecimentos de Saúde (Atenção Primária)",
         coluna_valor="densidade", coluna_numerador="qtd_cnes", coluna_denominador="population",
         direcao="maior_melhor", formato="{:.2f}", unidade="por 10.000 habitantes"),
    dict(arquivo="grupo1_prenatal/munic_ano_hiv_positivo.xlsx", grupo=GRUPO1,
         chave="taxa_hiv_gestantes", nome="Taxa de HIV Positivo em Gestantes",
         coluna_valor="taxa", coluna_numerador="total_hiv", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo1_prenatal/munic_ano_obitos_fetais.xlsx", grupo=GRUPO1,
         chave="coef_obitos_fetais", nome="Coeficiente de Óbitos Fetais",
         coluna_valor="coef", coluna_numerador="munic_o", coluna_denominador="munic_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascimentos totais"),
    dict(arquivo="grupo1_prenatal/munic_ano_pre_natal_adequado.xlsx", grupo=GRUPO1,
         chave="proporcao_pre_natal_adequado", nome="Proporção de Gestantes com Pré-natal Adequado",
         coluna_valor="prop", coluna_numerador="sim", coluna_denominador="total",
         direcao="maior_melhor", formato="{:.1f}%", unidade="%"),
    dict(arquivo="grupo1_prenatal/sifilis_munic_ano.xlsx", grupo=GRUPO1,
         chave="taxa_deteccao_sifilis_gestantes", nome="Taxa de Detecção de Sífilis em Gestantes",
         coluna_valor="taxa", coluna_numerador="casos", coluna_denominador="n_total",
         direcao="menor_melhor", formato="{:.2f}", unidade="%"),

    dict(arquivo="grupo2_parto/enfermeiro_obstetrico_munic_ano.xlsx", grupo=GRUPO2,
         chave="proporcao_enfermeiros_obstetricos", nome="Proporção de Enfermeiros Obstétricos",
         coluna_valor="enf_obst", coluna_numerador="n", coluna_denominador="pop_ano",
         direcao="maior_melhor", formato="{:.2f}", unidade="por 10.000 habitantes"),
    dict(arquivo="grupo2_parto/munic_ano_cesareas.xlsx", grupo=GRUPO2,
         chave="proporcao_cesareas", nome="Proporção de Cesáreas",
         coluna_valor="prop", coluna_numerador="tot_c", coluna_denominador="total_partos",
         direcao="neutro", formato="{:.1f}%", unidade="%"),
    # Indicador multi-categoria: 1 linha por tipo de profissional que
    # assistiu o parto vaginal (Medico / Enfermeira-Obstetriz / Parteira /
    # Outros / Ign-NI), distinguidas pela coluna 'categoria'. 'direcao'
    # (maior_melhor) so faz sentido lida junto com a categoria - nao se
    # aplica igual a "Ign/NI" (maior % de nao informado nao e melhor).
    # Paginas/ranking que consumirem este indicador precisam filtrar por
    # categoria antes de comparar municipios.
    dict(arquivo="grupo2_parto/prof_assist_parto_vag_munic_ano.xlsx", grupo=GRUPO2,
         chave="proporcao_parto_vaginal_profissional",
         nome="Proporção de Partos Vaginais por Profissional que Assistiu",
         coluna_valor="proporcao", coluna_numerador="prof_regiao",
         coluna_denominador="total_regiao", coluna_categoria="profissional_assistiu",
         direcao="maior_melhor", formato="{:.1f}%", unidade="%"),

    dict(arquivo="grupo3_neonatal/apgar_munic_ano.xlsx", grupo=GRUPO3,
         chave="apgar_adequado", nome="Proporção de Apgar Adequado (1º/5º min)",
         coluna_valor="proporcao_pct", coluna_numerador="adequados", coluna_denominador="total_nascidos",
         direcao="maior_melhor", formato="{:.1f}%", unidade="%"),
    dict(arquivo="grupo3_neonatal/asfixia_perinatal_munic_ano.xlsx", grupo=GRUPO3,
         chave="proporcao_asfixia_perinatal", nome="Proporção de Asfixia Perinatal",
         coluna_valor="asfixia", coluna_numerador="n_local", coluna_denominador="n_total",
         direcao="menor_melhor", formato="{:.2f}", unidade="%"),
    dict(arquivo="grupo3_neonatal/coef_mortalidade_neo_munic_ano.xlsx", grupo=GRUPO3,
         chave="coef_mortalidade_neonatal", nome="Coeficiente de Mortalidade Neonatal",
         coluna_valor="coeficiente", coluna_numerador="n_obitos", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo3_neonatal/coef_obito_neo_causa_munic_ano.xlsx", grupo=GRUPO3,
         chave="coef_obito_neonatal_causa", nome="Coeficiente de Óbito Neonatal por Causa",
         coluna_valor="coef", coluna_numerador="n_ano", coluna_denominador="n_nv",
         coluna_categoria="Agrupamento_Nivel_1", direcao="menor_melhor", formato="{:.2f}",
         unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo3_neonatal/hiv_vertical_munic_ano.xlsx", grupo=GRUPO3,
         chave="proporcao_hiv_vertical", nome="Proporção de Transmissão Vertical de HIV",
         coluna_valor="hiv", coluna_numerador="n", coluna_denominador="nv_ano",
         direcao="menor_melhor", formato="{:.2f}", unidade="%"),
    dict(arquivo="grupo3_neonatal/infeccoes_sistemicas_neo_munic_ano.xlsx", grupo=GRUPO3,
         chave="taxa_infeccoes_sistemicas_neonatais", nome="Proporção de Infecções Sistêmicas Neonatais",
         coluna_valor="taxa_infeccoes", coluna_numerador="n", coluna_denominador="nv_ano",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo3_neonatal/munic_ano_baixo_peso.xlsx", grupo=GRUPO3,
         chave="taxa_baixo_peso_nascer", nome="Taxa de Baixo Peso ao Nascer",
         coluna_valor="prop", coluna_numerador="total_sim", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.1f}%", unidade="%"),
    # nulo_e_zero=True: municipios sem hospital com leito neonatal ficam com
    # taxa_media_mensal/soma_leitos NaN na fonte (nao existe 0 explicito).
    # Isso e' um zero legitimo (nao tem leito mesmo), nao dado suprimido -
    # tratamos como 0 em vez de descartar a linha (confirmado pela Julia).
    dict(arquivo="grupo3_neonatal/munic_ano_leitos_neonatais.xlsx", grupo=GRUPO3,
         chave="taxa_leitos_neonatais", nome="Taxa Total de Leitos Neonatais",
         coluna_valor="taxa_media_mensal", coluna_numerador="soma_leitos", coluna_denominador="nascidos_vivos",
         direcao="maior_melhor", formato="{:.2f}", grao_mensal=True, nulo_e_zero=True,
         unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo3_neonatal/munic_ano_sifilis_congenita.xlsx", grupo=GRUPO3,
         chave="taxa_incidencia_sifilis_congenita", nome="Taxa de Incidência de Sífilis Congênita",
         coluna_valor="taxa_incidencia", coluna_numerador="total_s", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascidos vivos"),
    dict(arquivo="grupo3_neonatal/natalidade_munic_ano.xlsx", grupo=GRUPO3,
         chave="taxa_bruta_natalidade", nome="Taxa Bruta de Natalidade",
         coluna_valor="taxa", coluna_numerador="nv_ano", coluna_denominador="pop_ano",
         direcao="neutro", formato="{:.2f}", unidade="por 1.000 habitantes"),
    dict(arquivo="grupo3_neonatal/obito_neo_24h_munic_ano.xlsx", grupo=GRUPO3,
         chave="proporcao_obitos_neonatais_24h", nome="Proporção de Óbitos Neonatais nas Primeiras 24h",
         coluna_valor="coeficiente", coluna_numerador="n_obitos", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascidos vivos"),

    # unidade "a confirmar": valor == numerador em 100% das linhas (o
    # denominador, populacao, existe na base mas nao e usado no calculo) -
    # ver docs/03-catalogo-e-metodologia-indicadores.md §3.6.
    dict(arquivo="grupo4_puerperio/leitos_UTI_adulto_munic_ano.xlsx", grupo=GRUPO4,
         chave="taxa_leitos_uti_adulto", nome="Taxa de Leitos em UTI Adulto",
         coluna_valor="leitos_uti", coluna_numerador="leitos_uti", coluna_denominador="popoulation",
         direcao="maior_melhor", formato="{:.2f}", unidade="nº absoluto de leitos"),
    dict(arquivo="grupo4_puerperio/leitos_obst_munic_ano.xlsx", grupo=GRUPO4,
         chave="taxa_leitos_obstetricos", nome="Taxa de Leitos Obstétricos",
         coluna_valor="leitos", coluna_numerador="n_leitos", coluna_denominador="pop",
         direcao="maior_melhor", formato="{:.2f}", unidade="por 1.000 habitantes"),
    dict(arquivo="grupo4_puerperio/munic_ano_desfecho_materno_grave.xlsx", grupo=GRUPO4,
         chave="razao_desfecho_materno_grave", nome="Razão de Desfecho Materno Grave",
         coluna_valor="rmm", coluna_numerador="munic_desf", coluna_denominador="munic_nascidos",
         coluna_ano="YEAR", direcao="menor_melhor", formato="{:.2f}",
         unidade="por 100.000 nascidos vivos"),
    dict(arquivo="grupo4_puerperio/munic_ano_mortalidade_materna.xlsx", grupo=GRUPO4,
         chave="razao_mortalidade_materna", nome="Razão de Mortalidade Materna",
         coluna_valor="rmm", coluna_numerador="munic_o", coluna_denominador="munic_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 100.000 nascidos vivos"),
    dict(arquivo="grupo4_puerperio/obito_mat_evitavel_munic_ano.xlsx", grupo=GRUPO4,
         chave="proporcao_obitos_maternos_evitaveis", nome="Proporção de Óbitos Maternos Evitáveis",
         coluna_valor="prop_evit", coluna_numerador="n_evit", coluna_denominador="n_total",
         direcao="menor_melhor", formato="{:.1f}%", unidade="% (dos óbitos maternos)"),

    dict(arquivo="grupo5_perinatal/coef_mortalidade_perinatal_munic_ano.xlsx", grupo=GRUPO5,
         chave="coef_mortalidade_perinatal", nome="Coeficiente de Mortalidade Perinatal",
         coluna_valor="coeficiente", coluna_numerador="n_obitos", coluna_denominador="total_nascidos",
         direcao="menor_melhor", formato="{:.2f}", unidade="por 1.000 nascimentos totais"),

    dict(arquivo="indicador_composto_munic_ano.xlsx", grupo=GRUPO_GERAL,
         chave="indicador_composto", nome="Indicador Composto",
         coluna_valor="indicador_composto", coluna_numerador=None, coluna_denominador=None,
         direcao="menor_melhor", formato="{:.2f}", unidade="escore 0-100"),
]


def _digits_only(series: pd.Series) -> pd.Series:
    return series.astype(str).str.extract(r"(\d+)", expand=False)


def _rename_encoding_broken_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Alguns .xlsx de origem trazem colunas com acentuação corrompida na
    própria célula do cabeçalho (bytes já perdidos, não recuperáveis).
    Renomeamos para um nome estável em vez de tentar redecodificar."""
    renomeios = {}
    for c in df.columns:
        cu = c.upper()
        if "NOME" in cu and "MUNIC" in cu:
            renomeios[c] = "nome_municipio_bruto"
        elif "POPULA" in cu and "ESTIMADA" in cu:
            renomeios[c] = "populacao_estimada_bruto"
    return df.rename(columns=renomeios)


def carregar_indicador(entry: dict) -> tuple[pd.DataFrame, int, int]:
    path = RAW_DIR / entry["arquivo"]
    if not path.exists():
        print(f"  aviso: arquivo nao encontrado, pulando: {path}")
        return pd.DataFrame(), 0, 0

    df = pd.read_excel(path)
    df = _rename_encoding_broken_columns(df)
    n_bruto = len(df)

    coluna_ano = entry.get("coluna_ano", "year")
    coluna_valor = entry["coluna_valor"]
    coluna_categoria = entry.get("coluna_categoria")

    obrigatorias = {coluna_ano, "codibge", coluna_valor}
    faltantes = obrigatorias - set(df.columns)
    if faltantes:
        print(f"  aviso: {path.name} nao tem as colunas {faltantes}, pulando.")
        return pd.DataFrame(), n_bruto, 0

    if entry.get("nulo_e_zero"):
        # NaN neste indicador significa "0 de verdade" (ex.: municipio sem
        # hospital com leito neonatal), nao dado suprimido - preenche em vez
        # de descartar a linha. So exige codibge presente.
        df = df.dropna(subset=["codibge"]).copy()
        df[coluna_valor] = df[coluna_valor].fillna(0)
        if entry.get("coluna_numerador") and entry["coluna_numerador"] in df.columns:
            df[entry["coluna_numerador"]] = df[entry["coluna_numerador"]].fillna(0)
    else:
        df = df.dropna(subset=["codibge", coluna_valor]).copy()
    df["codibge"] = _digits_only(df["codibge"]).str.zfill(6)
    df = df[df["codibge"].str.len() == 6]
    # codigos terminados em "0000" sao agregados de UF ("ignorado/total estado")
    # do DATASUS, nao municipios reais - descartamos para nao quebrar o mapa.
    df = df[~df["codibge"].str.endswith("0000")]
    # Regioes Administrativas do DF usadas por alguns sistemas do MS - nao
    # sao municipios IBGE (veja CODIGOS_EXCLUIR). Tratadas como dado
    # inexistente para fins de municipio/mapa/porte.
    df = df[~df["codibge"].isin(CODIGOS_EXCLUIR)]

    if "cod_mapa" in df.columns:
        df["cod_mapa"] = _digits_only(df["cod_mapa"]).str.zfill(7)
    else:
        df["cod_mapa"] = pd.NA

    df["ano"] = pd.to_numeric(df[coluna_ano], errors="coerce").astype("Int64")
    df = df.dropna(subset=["ano"])

    if entry.get("grao_mensal"):
        # coluna_valor (ex.: taxa_media_mensal) ja vem replicada identica em
        # cada linha mensal -> 'first' basta. numerador e denominador, ao
        # contrario, sao contagens DO MES (variam linha a linha) e precisam
        # ser somados para virar o total anual - usar 'first' neles (bug
        # anterior) zera silenciosamente o denominador ao sair do groupby.
        agg = {coluna_valor: "first"}
        if entry.get("coluna_numerador"):
            agg[entry["coluna_numerador"]] = "sum"
        if entry.get("coluna_denominador"):
            agg[entry["coluna_denominador"]] = "sum"
        df = (
            df.groupby(["codibge", "cod_mapa", "ano"], as_index=False, dropna=False)
            .agg(agg)
        )

    out = pd.DataFrame({
        "codibge": df["codibge"].values,
        "cod_mapa": df["cod_mapa"].values,
        "ano": df["ano"].astype(int).values,
        "grupo": entry["grupo"],
        "indicador_chave": entry["chave"],
        "indicador_nome": entry["nome"],
        "valor": pd.to_numeric(df[coluna_valor], errors="coerce").values,
    })
    out["numerador"] = (
        pd.to_numeric(df[entry["coluna_numerador"]], errors="coerce").values
        if entry.get("coluna_numerador") and entry["coluna_numerador"] in df.columns
        else pd.NA
    )
    out["denominador"] = (
        pd.to_numeric(df[entry["coluna_denominador"]], errors="coerce").values
        if entry.get("coluna_denominador") and entry["coluna_denominador"] in df.columns
        else pd.NA
    )
    out["categoria"] = (
        df[coluna_categoria].values if coluna_categoria and coluna_categoria in df.columns else pd.NA
    )
    out["fonte_arquivo"] = entry["arquivo"]

    out = out.dropna(subset=["valor"])
    return out, n_bruto, len(out)


def carregar_populacao() -> tuple[pd.DataFrame, int, int]:
    """Le nascidos_vivos_populacao.xlsx e retorna o grao municipio x ano.

    populacao_uf e populacao_br vem do arquivo ja como totais oficiais
    (replicados em cada linha de municipio daquela UF/ano) - preservamos
    esses valores em vez de somar populacao_municipio, porque o arquivo usa
    fontes diferentes por municipio (Censo 2022, Censo 2010, Estimativa
    IBGE) e a soma poderia nao bater com o total publicado.
    """
    path = RAW_DIR / POPULACAO_ARQUIVO
    if not path.exists():
        print(f"  aviso: arquivo nao encontrado, pulando: {path}")
        return pd.DataFrame(), 0, 0

    df = pd.read_excel(path)
    n_bruto = len(df)

    obrigatorias = {"year", "codibge", "nascidos_vivos", "population_munic", "population_uf", "population_br"}
    faltantes = obrigatorias - set(df.columns)
    if faltantes:
        print(f"  aviso: {path.name} nao tem as colunas {faltantes}, pulando.")
        return pd.DataFrame(), n_bruto, 0

    df["codibge"] = _digits_only(df["codibge"]).str.zfill(6)
    df = df[df["codibge"].str.len() == 6]
    # codigos terminados em "0000" sao nascidos vivos "ignorados" (nao
    # atribuidos a nenhum municipio) - mesma regra dos demais indicadores.
    df = df[~df["codibge"].str.endswith("0000")]
    # Regioes Administrativas do DF (veja CODIGOS_EXCLUIR) - nao aparecem
    # hoje neste arquivo, mas excluimos por seguranca/consistencia.
    df = df[~df["codibge"].isin(CODIGOS_EXCLUIR)]

    df["ano"] = pd.to_numeric(df["year"], errors="coerce").astype("Int64")
    df = df.dropna(subset=["codibge", "ano"])

    out = pd.DataFrame({
        "codibge": df["codibge"].values,
        "ano": df["ano"].astype(int).values,
        "nascidos_vivos": pd.to_numeric(df["nascidos_vivos"], errors="coerce").values,
        "populacao_municipio": pd.to_numeric(df["population_munic"], errors="coerce").values,
        "populacao_uf": pd.to_numeric(df["population_uf"], errors="coerce").values,
        "populacao_br": pd.to_numeric(df["population_br"], errors="coerce").values,
    })
    out["faixa_populacional"] = classificar_porte(out["populacao_municipio"])
    out = out.drop_duplicates(subset=["codibge", "ano"]).sort_values(["codibge", "ano"]).reset_index(drop=True)
    return out, n_bruto, len(out)


def construir_dim_municipios(fato: pd.DataFrame, brutos: dict[str, pd.DataFrame]) -> pd.DataFrame:
    # mapa mestre codibge -> cod_mapa, construido com todos os arquivos que trazem cod_mapa
    pares = fato.dropna(subset=["cod_mapa"])[["codibge", "cod_mapa"]].drop_duplicates()
    mapa_cod = pares.groupby("codibge")["cod_mapa"].agg(lambda s: s.mode().iat[0])

    nomes = []
    for df in brutos.values():
        if "nome_municipio_bruto" in df.columns:
            nomes.append(df[["codibge", "nome_municipio_bruto"]])
    nome_map = pd.Series(dtype=str)
    if nomes:
        nomes_df = pd.concat(nomes, ignore_index=True).dropna()
        # codibge nos brutos vem como int64 (leitura direta do xlsx), mas
        # dim["codibge"] abaixo e' string - sem este cast o .map() nao casa
        # nenhuma linha e nome_municipio_bruto sai inteiramente nulo.
        nomes_df["codibge"] = nomes_df["codibge"].astype(str)
        nome_map = nomes_df.groupby("codibge")["nome_municipio_bruto"].agg(lambda s: s.mode().iat[0])

    codigos = sorted(fato["codibge"].unique())
    dim = pd.DataFrame({"codibge": codigos})
    dim["cod_mapa"] = dim["codibge"].map(mapa_cod)
    dim["nome_municipio_bruto"] = dim["codibge"].map(nome_map)
    dim["uf_codigo"] = dim["codibge"].str[:2]
    dim = dim[dim["uf_codigo"].isin(UF_INFO.keys())].copy()
    dim["uf_sigla"] = dim["uf_codigo"].map(lambda c: UF_INFO[c][0])
    dim["uf_nome"] = dim["uf_codigo"].map(lambda c: UF_INFO[c][1])
    dim["regiao"] = dim["uf_codigo"].map(lambda c: UF_INFO[c][2])
    return dim.drop(columns=["uf_codigo"]).reset_index(drop=True)


def construir_dim_indicadores() -> pd.DataFrame:
    return pd.DataFrame([
        {
            "indicador_chave": e["chave"],
            "indicador_nome": e["nome"],
            "grupo": e["grupo"],
            "direcao": e["direcao"],
            "formato": e["formato"],
            "unidade": e["unidade"],
            "arquivo_origem": e["arquivo"],
        }
        for e in MANIFESTO
    ])


def salvar_sqlite(
    fato: pd.DataFrame,
    dim_mun: pd.DataFrame,
    dim_ind: pd.DataFrame,
    caminho: Path,
    dim_pop: pd.DataFrame | None = None,
):
    if caminho.exists():
        caminho.unlink()
    con = sqlite3.connect(caminho)
    try:
        fato.to_sql("fato_indicadores", con, index=False)
        dim_mun.to_sql("dim_municipios", con, index=False)
        dim_ind.to_sql("dim_indicadores", con, index=False)
        con.execute("CREATE INDEX idx_fato_munic_ano ON fato_indicadores(codibge, ano)")
        con.execute("CREATE INDEX idx_fato_indicador ON fato_indicadores(indicador_chave)")
        con.execute("CREATE INDEX idx_fato_ano ON fato_indicadores(ano)")
        con.execute("CREATE UNIQUE INDEX idx_dim_mun ON dim_municipios(codibge)")
        if dim_pop is not None and not dim_pop.empty:
            dim_pop.to_sql("dim_populacao", con, index=False)
            con.execute("CREATE UNIQUE INDEX idx_dim_pop ON dim_populacao(codibge, ano)")
        con.commit()
    finally:
        con.close()


def main():
    print(f"Manifesto com {len(MANIFESTO)} indicador(es) mapeados a partir de {RAW_DIR}\n")

    partes = []
    brutos = {}
    relatorio = []
    for entry in MANIFESTO:
        print(f"-> processando '{entry['chave']}' ({entry['arquivo']})")
        parte, n_bruto, n_final = carregar_indicador(entry)
        relatorio.append({
            "indicador_chave": entry["chave"],
            "arquivo": entry["arquivo"],
            "linhas_brutas": n_bruto,
            "linhas_consolidadas": n_final,
            "descartadas": n_bruto - n_final,
        })
        if not parte.empty:
            partes.append(parte)
            path = RAW_DIR / entry["arquivo"]
            brutos[entry["arquivo"]] = _rename_encoding_broken_columns(pd.read_excel(path))
            print(f"   ok: {n_final:,} linhas ({n_bruto - n_final:,} descartadas)".replace(",", "."))

    if not partes:
        sys.exit("Nenhum indicador foi carregado. Verifique data/raw/ e o MANIFESTO.")

    fato = pd.concat(partes, ignore_index=True)
    fato["codibge"] = fato["codibge"].astype(str)
    fato["cod_mapa"] = fato["cod_mapa"].astype("string")
    fato = fato.sort_values(["indicador_chave", "ano", "codibge"]).reset_index(drop=True)

    dim_mun = construir_dim_municipios(fato, brutos)
    dim_mun["codibge"] = dim_mun["codibge"].astype(str)
    dim_mun["cod_mapa"] = dim_mun["cod_mapa"].astype("string")

    # preenche cod_mapa ausente na fato usando o mapa mestre de dim_municipios
    fato = fato.merge(
        dim_mun[["codibge", "cod_mapa"]].rename(columns={"cod_mapa": "cod_mapa_master"}),
        on="codibge", how="left",
    )
    fato["cod_mapa"] = fato["cod_mapa"].fillna(fato["cod_mapa_master"])
    fato = fato.drop(columns=["cod_mapa_master"])

    dim_ind = construir_dim_indicadores()

    print(f"-> processando tabela de pesos demograficos ('{POPULACAO_ARQUIVO}')")
    dim_pop, pop_n_bruto, pop_n_final = carregar_populacao()
    if not dim_pop.empty:
        print(f"   ok: {pop_n_final:,} linhas ({pop_n_bruto - pop_n_final:,} descartadas)".replace(",", "."))
    relatorio.append({
        "indicador_chave": "(dim_populacao)",
        "arquivo": POPULACAO_ARQUIVO,
        "linhas_brutas": pop_n_bruto,
        "linhas_consolidadas": pop_n_final,
        "descartadas": pop_n_bruto - pop_n_final,
    })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fato.to_parquet(OUT_DIR / "fato_indicadores.parquet", index=False)
    dim_mun.to_parquet(OUT_DIR / "dim_municipios.parquet", index=False)
    dim_ind.to_parquet(OUT_DIR / "dim_indicadores.parquet", index=False)
    if not dim_pop.empty:
        dim_pop.to_parquet(OUT_DIR / "dim_populacao.parquet", index=False)
    salvar_sqlite(fato, dim_mun, dim_ind, OUT_DIR / "qualipreneo.db", dim_pop=dim_pop)

    # ---------------------------------------------------------------- #
    # Relatorio de validacao
    # ---------------------------------------------------------------- #
    rel = pd.DataFrame(relatorio)
    print("\n" + "=" * 78)
    print("RELATORIO DE CONSOLIDACAO POR ARQUIVO")
    print("=" * 78)
    print(rel.to_string(index=False))

    total_bruto = rel["linhas_brutas"].sum()
    total_final = rel["linhas_consolidadas"].sum()

    tam_raw_mb = sum(f.stat().st_size for f in RAW_DIR.rglob("*.xlsx")) / 1_048_576
    tam_parquet_mb = (OUT_DIR / "fato_indicadores.parquet").stat().st_size / 1_048_576
    tam_sqlite_mb = (OUT_DIR / "qualipreneo.db").stat().st_size / 1_048_576

    print("\n" + "=" * 78)
    print("RESUMO GERAL")
    print("=" * 78)
    print(f"Linhas lidas nos .xlsx (somando todos os arquivos): {total_bruto:,}".replace(",", "."))
    print(f"Linhas na fato_indicadores final:                   {total_final:,}".replace(",", "."))
    print(f"Linhas descartadas (sem codibge ou sem valor):      {total_bruto - total_final:,}".replace(",", "."))
    print(f"Indicadores distintos:                              {fato['indicador_chave'].nunique()}")
    print(f"Municipios distintos (codibge):                     {fato['codibge'].nunique()}")
    print(f"Periodo coberto:                                    {fato['ano'].min()}-{fato['ano'].max()}")
    print(f"cod_mapa ainda ausente apos merge com mapa mestre:  {fato['cod_mapa'].isna().sum()}")

    print("\nChecagem de tipos e integridade dos codigos geograficos:")
    print(f"  codibge dtype: {fato['codibge'].dtype} | tamanhos unicos: {sorted(fato['codibge'].str.len().unique())}")
    print(f"  cod_mapa dtype: {fato['cod_mapa'].dtype} | tamanhos unicos (ignorando NA): "
          f"{sorted(fato['cod_mapa'].dropna().str.len().unique())}")
    zeros_a_esquerda = fato["codibge"].str.startswith("0").sum()
    print(f"  codigos comecando com '0' preservados: {zeros_a_esquerda} "
          "(nenhum municipio brasileiro tem UF 00-09, valor esperado = 0)")

    print("\nTamanho em disco (comparativo):")
    print(f"  data/raw/*.xlsx (todos os arquivos): {tam_raw_mb:,.1f} MB".replace(",", "."))
    print(f"  fato_indicadores.parquet:            {tam_parquet_mb:,.1f} MB".replace(",", "."))
    print(f"  qualipreneo.db (sqlite, 3 tabelas):   {tam_sqlite_mb:,.1f} MB".replace(",", "."))

    print("\nAmostra da fato_indicadores:")
    print(fato.sample(min(5, len(fato)), random_state=42).to_string(index=False))

    if not dim_pop.empty:
        print("\n" + "=" * 78)
        print("VALIDACAO DA dim_populacao")
        print("=" * 78)
        print(f"Linhas:                                {len(dim_pop):,}".replace(",", "."))
        print(f"Municipios distintos:                  {dim_pop['codibge'].nunique():,}".replace(",", "."))
        print(f"Periodo coberto:                       {dim_pop['ano'].min()}-{dim_pop['ano'].max()}")
        print(f"Nulos por coluna:\n{dim_pop.isna().sum().to_string()}")

        municipios_fato = set(fato["codibge"].unique())
        municipios_pop = set(dim_pop["codibge"].unique())
        so_no_fato = municipios_fato - municipios_pop
        so_na_pop = municipios_pop - municipios_fato
        print(f"Municipios em fato_indicadores sem peso em dim_populacao: {len(so_no_fato)}")
        if so_no_fato:
            print(f"  amostra: {sorted(so_no_fato)[:10]}")
        print(f"Municipios em dim_populacao ausentes de fato_indicadores: {len(so_na_pop)}")
        if so_na_pop:
            print(f"  amostra: {sorted(so_na_pop)[:10]}")

        print("\nDistribuicao de municipios por faixa populacional (ano mais recente):")
        ano_recente = dim_pop["ano"].max()
        dist = (
            dim_pop[dim_pop["ano"] == ano_recente]["faixa_populacional"]
            .value_counts()
            .reindex(FAIXAS_POPULACIONAIS_LABELS)
        )
        print(dist.to_string())

        # consistencia: populacao_uf/populacao_br devem ter 1 unico valor por (uf,ano)/(ano)
        checagem = dim_pop.merge(dim_mun[["codibge", "uf_sigla"]], on="codibge", how="left")
        divergentes_uf = checagem.groupby(["uf_sigla", "ano"])["populacao_uf"].nunique()
        divergentes_br = checagem.groupby("ano")["populacao_br"].nunique()
        print(f"Combinacoes uf/ano com populacao_uf inconsistente: {(divergentes_uf > 1).sum()}")
        print(f"Anos com populacao_br inconsistente: {(divergentes_br > 1).sum()}")
    else:
        print("\naviso: dim_populacao NAO foi gerada (arquivo ausente, vazio ou sem colunas esperadas).")

    print(f"\nSalvo em: {OUT_DIR}")
    print("  - fato_indicadores.parquet")
    print("  - dim_municipios.parquet")
    print("  - dim_indicadores.parquet")
    if not dim_pop.empty:
        print("  - dim_populacao.parquet")
    print("  - qualipreneo.db")


if __name__ == "__main__":
    main()
