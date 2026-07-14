import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from utils.data import (
    format_value,
    get_indicator_df,
    get_indicator_options,
    indicator_group,
    is_lower_better,
    rank_dataframe,
)

st.set_page_config(page_title="Buscar Município", page_icon="🔍", layout="wide")
st.title("🔍 Buscar Município")

opcoes_indicador = get_indicator_options()

with st.sidebar:
    st.header("Filtros")
    indicador_label = st.selectbox("Indicador", list(opcoes_indicador.keys()))
    chave = opcoes_indicador[indicador_label]

df = get_indicator_df(chave)
st.caption(f"Grupo: {indicator_group(chave)}")

municipios = sorted(df["municipio"].unique())
municipio = st.selectbox("Digite ou selecione o município", municipios, index=None, placeholder="Ex.: Natal")

if not municipio:
    st.info("Selecione um município acima para ver seu desempenho detalhado.")
    st.stop()

hist = df[df["municipio"] == municipio].sort_values("year")
if hist.empty:
    st.warning("Este município não possui dados para o indicador selecionado (dado suprimido ou indisponível).")
    st.stop()

uf_sigla = hist["uf_sigla"].iloc[-1]
regiao = hist["regiao"].iloc[-1]
ano_recente = hist["year"].max()

st.subheader(f"{municipio} — {uf_sigla} ({regiao})")

linha_atual = hist[hist["year"] == ano_recente].iloc[0]
valor_atual = linha_atual["valor"]

df_ano = df[df["year"] == ano_recente]
ascending = is_lower_better(chave)
rank_brasil = rank_dataframe(df_ano, ascending=ascending)
pos_brasil = rank_brasil.loc[rank_brasil["municipio"] == municipio, "posicao"].iloc[0]
total_brasil = len(rank_brasil)

df_uf = df_ano[df_ano["uf_sigla"] == uf_sigla]
rank_uf = rank_dataframe(df_uf, ascending=ascending)
pos_uf = rank_uf.loc[rank_uf["municipio"] == municipio, "posicao"].iloc[0]
total_uf = len(rank_uf)

col1, col2, col3 = st.columns(3)
col1.metric(f"{indicador_label} ({ano_recente})", format_value(chave, valor_atual))
col2.metric("Posição no Brasil", f"{pos_brasil}º de {total_brasil}")
col3.metric(f"Posição em {uf_sigla}", f"{pos_uf}º de {total_uf}")

melhor_pior = "menores" if ascending else "maiores"
st.caption(f"Ranking calculado considerando que {melhor_pior} valores indicam melhor resultado.")

st.divider()
st.subheader("Evolução histórica")

media_brasil = df.groupby("year")["valor"].mean().reset_index()
media_uf = df[df["uf_sigla"] == uf_sigla].groupby("year")["valor"].mean().reset_index()

fig = go.Figure()
fig.add_trace(go.Scatter(x=hist["year"], y=hist["valor"], mode="lines+markers", name=municipio, line=dict(width=3)))
fig.add_trace(go.Scatter(x=media_uf["year"], y=media_uf["valor"], mode="lines", name=f"Média {uf_sigla}", line=dict(dash="dash")))
fig.add_trace(go.Scatter(x=media_brasil["year"], y=media_brasil["valor"], mode="lines", name="Média Brasil", line=dict(dash="dot")))
fig.update_layout(xaxis_title="Ano", yaxis_title=indicador_label, hovermode="x unified", legend=dict(orientation="h", y=-0.2))
st.plotly_chart(fig, use_container_width=True)

st.divider()
st.subheader(f"Comparação com melhores e piores municípios de {uf_sigla} em {ano_recente}")

destaque = (
    pd.concat([rank_uf.head(5), rank_uf.tail(5)]) if pos_uf > 5 else rank_uf.head(10)
)
destaque["valor_fmt"] = destaque["valor"].apply(lambda v: format_value(chave, v))
destaque["é_o_município"] = destaque["municipio"] == municipio

fig2 = px.bar(
    destaque,
    x="valor",
    y="municipio",
    orientation="h",
    color="é_o_município",
    color_discrete_map={True: "#0E7C7B", False: "#B0C4C4"},
    labels={"valor": indicador_label, "municipio": ""},
)
fig2.update_layout(showlegend=False, height=400)
st.plotly_chart(fig2, use_container_width=True)
