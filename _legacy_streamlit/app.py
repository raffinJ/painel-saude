import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import plotly.express as px
import streamlit as st

from utils.data import (
    REGIOES_ORDEM,
    get_indicator_df,
    get_indicator_options,
    indicator_group,
    load_long_data,
)

st.set_page_config(
    page_title="Painel de Indicadores de Saúde Materna e Infantil",
    page_icon="🩺",
    layout="wide",
)

long_df = load_long_data()
opcoes_indicador = get_indicator_options()

st.title("🩺 Painel de Indicadores de Saúde Materna e Infantil")
st.caption("QualiPréNeo · Dados DataSUS · 2008–2023")

st.markdown(
    """
Este painel reúne indicadores de saúde materna e neonatal para todos os
municípios brasileiros, permitindo comparar, ranquear e acompanhar a
evolução ao longo do tempo em diferentes níveis geográficos.

Use o menu à esquerda para navegar:

- **🏆 Ranking** — melhores e piores municípios em cada indicador, ano e recorte geográfico
- **🔍 Buscar Município** — posição, histórico e comparações de um município específico
- **📊 Comparar** — evolução de vários municípios lado a lado
- **🗺️ Mapa** — visão espacial por estado/região
"""
)

st.divider()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Municípios", f"{long_df['codibge'].nunique():,}".replace(",", "."))
col2.metric("Período", f"{long_df['year'].min()}–{long_df['year'].max()}")
col3.metric("Indicadores disponíveis", len(opcoes_indicador))
col4.metric("Registros", f"{len(long_df):,}".replace(",", "."))

st.divider()
st.subheader("Evolução de um indicador — média nacional e por região")

indicador_label = st.selectbox("Indicador", list(opcoes_indicador.keys()))
chave = opcoes_indicador[indicador_label]
df = get_indicator_df(chave)
st.caption(f"Grupo: {indicator_group(chave)}")

media_brasil = df.groupby("year")["valor"].mean().reset_index()
media_brasil["recorte"] = "Brasil (média)"

media_regiao = df.groupby(["year", "regiao"])["valor"].mean().reset_index()
media_regiao = media_regiao.rename(columns={"regiao": "recorte"})

mostrar_regioes = st.checkbox("Detalhar por região", value=True)
plot_df = (
    media_brasil[["year", "recorte", "valor"]]
    if not mostrar_regioes
    else media_regiao[["year", "recorte", "valor"]]
)

fig = px.line(
    plot_df,
    x="year",
    y="valor",
    color="recorte",
    category_orders={"recorte": ["Brasil (média)"] + REGIOES_ORDEM},
    markers=True,
    labels={"year": "Ano", "valor": indicador_label, "recorte": ""},
)
fig.update_layout(hovermode="x unified", legend=dict(orientation="h", y=-0.2))
st.plotly_chart(fig, use_container_width=True)

st.info(
    "💡 Este protótipo já roda com 3 indicadores reais. Para adicionar os "
    "outros 40, veja as instruções no início de "
    "`scripts/importar_indicadores.py` — nenhuma página do site precisa "
    "ser alterada.",
    icon="💡",
)
