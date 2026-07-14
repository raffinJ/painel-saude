import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import plotly.express as px
import streamlit as st

from utils.data import get_indicator_df, get_indicator_options, indicator_group

st.set_page_config(page_title="Comparar Municípios", page_icon="📊", layout="wide")
st.title("📊 Comparar Municípios")

opcoes_indicador = get_indicator_options()

with st.sidebar:
    st.header("Filtros")
    indicador_label = st.selectbox("Indicador", list(opcoes_indicador.keys()))
    chave = opcoes_indicador[indicador_label]

df = get_indicator_df(chave)
st.caption(f"Grupo: {indicator_group(chave)}")

municipios = sorted(df["municipio"].unique())
selecionados = st.multiselect(
    "Selecione de 2 a 6 municípios para comparar",
    municipios,
    max_selections=6,
)

if len(selecionados) < 2:
    st.info("Selecione ao menos 2 municípios para começar a comparação.")
    st.stop()

df_sel = df[df["municipio"].isin(selecionados)].sort_values(["municipio", "year"])

st.subheader("Evolução ao longo do tempo")
fig = px.line(
    df_sel,
    x="year",
    y="valor",
    color="municipio",
    markers=True,
    labels={"year": "Ano", "valor": indicador_label, "municipio": "Município"},
)
fig.update_layout(hovermode="x unified", legend=dict(orientation="h", y=-0.2))
st.plotly_chart(fig, use_container_width=True)

st.subheader("Tabela comparativa")
pivot = df_sel.pivot_table(index="year", columns="municipio", values="valor").reindex(columns=selecionados)
st.dataframe(pivot.round(2), use_container_width=True)

referencia = selecionados[0]
if referencia in pivot.columns:
    st.caption(f"Variação percentual em relação a **{referencia}**")
    diff = pivot.sub(pivot[referencia], axis=0).div(pivot[referencia], axis=0) * 100
    diff = diff.drop(columns=[referencia])
    st.dataframe(diff.round(1).astype(str) + "%", use_container_width=True)

csv = pivot.to_csv().encode("utf-8-sig")
st.download_button("⬇️ Baixar comparação (CSV)", csv, file_name=f"comparacao_{chave}.csv", mime="text/csv")
