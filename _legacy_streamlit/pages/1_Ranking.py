import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import plotly.express as px
import streamlit as st

from utils.data import (
    REGIOES_ORDEM,
    filter_geo,
    format_value,
    get_indicator_df,
    get_indicator_options,
    indicator_group,
    is_lower_better,
    rank_dataframe,
)

st.set_page_config(page_title="Ranking de Municípios", page_icon="🏆", layout="wide")
st.title("🏆 Ranking de Municípios Do BRAZIL")

opcoes_indicador = get_indicator_options()

# ------------------------------- Filtros ------------------------------- #
with st.sidebar:
    st.header("Filtros")

    indicador_label = st.selectbox("Indicador", list(opcoes_indicador.keys()))
    chave = opcoes_indicador[indicador_label]

    df = get_indicator_df(chave)

    ano = st.select_slider("Ano", options=sorted(df["year"].unique()), value=df["year"].max())

    nivel = st.radio("Nível geográfico", ["Brasil (todos os municípios)", "Filtrar por região/UF"])

    regioes_sel, ufs_sel = None, None
    if nivel == "Filtrar por região/UF":
        regioes_sel = st.multiselect("Região", REGIOES_ORDEM)
        ufs_disponiveis = sorted(df["uf_sigla"].unique())
        ufs_sel = st.multiselect("UF", ufs_disponiveis)

    ordem_default = "Menor valor é melhor" if is_lower_better(chave) else "Maior valor é melhor"
    ordem = st.radio(
        "Direção do ranking",
        ["Menor valor é melhor", "Maior valor é melhor"],
        index=0 if ordem_default == "Menor valor é melhor" else 1,
        help="Definida no catálogo do indicador — confira antes de publicar.",
    )
    ascending = ordem == "Menor valor é melhor"

    top_n = st.slider("Quantos municípios mostrar em cada extremo", 5, 50, 15)

# ------------------------------- Dados ------------------------------- #
st.caption(f"Grupo: {indicator_group(chave)}")

df_ano = df[df["year"] == ano].copy()
df_ano = filter_geo(df_ano, regioes_sel, ufs_sel)

if df_ano.empty:
    st.warning("Nenhum município encontrado para os filtros selecionados.")
    st.stop()

ranked = rank_dataframe(df_ano, ascending=ascending)
ranked["valor_fmt"] = ranked["valor"].apply(lambda v: format_value(chave, v))

st.caption(
    f"{indicador_label} · {ano} · {len(ranked)} município(s) no recorte selecionado"
)

melhores = ranked.head(top_n)
piores = ranked.tail(top_n).sort_values("posicao", ascending=False)

tab1, tab2, tab3 = st.tabs(["🥇 Melhores", "🚩 Piores", "📋 Ranking completo"])

with tab1:
    fig = px.bar(
        melhores.sort_values("valor", ascending=not ascending),
        x="valor",
        y="municipio",
        orientation="h",
        color="regiao",
        category_orders={"regiao": REGIOES_ORDEM},
        hover_data={"uf_sigla": True, "posicao": True},
        labels={"valor": indicador_label, "municipio": ""},
    )
    fig.update_layout(height=max(400, top_n * 28))
    st.plotly_chart(fig, use_container_width=True)
    st.dataframe(
        melhores[["posicao", "municipio", "uf_sigla", "regiao", "valor_fmt"]].rename(
            columns={
                "posicao": "#",
                "municipio": "Município",
                "uf_sigla": "UF",
                "regiao": "Região",
                "valor_fmt": indicador_label,
            }
        ),
        hide_index=True,
        use_container_width=True,
    )

with tab2:
    fig = px.bar(
        piores.sort_values("valor", ascending=ascending),
        x="valor",
        y="municipio",
        orientation="h",
        color="regiao",
        category_orders={"regiao": REGIOES_ORDEM},
        hover_data={"uf_sigla": True, "posicao": True},
        labels={"valor": indicador_label, "municipio": ""},
        color_discrete_sequence=px.colors.qualitative.Set2,
    )
    fig.update_layout(height=max(400, top_n * 28))
    st.plotly_chart(fig, use_container_width=True)
    st.dataframe(
        piores[["posicao", "municipio", "uf_sigla", "regiao", "valor_fmt"]].rename(
            columns={
                "posicao": "#",
                "municipio": "Município",
                "uf_sigla": "UF",
                "regiao": "Região",
                "valor_fmt": indicador_label,
            }
        ),
        hide_index=True,
        use_container_width=True,
    )

with tab3:
    busca = st.text_input("Filtrar por nome do município")
    tabela = ranked
    if busca:
        tabela = tabela[tabela["municipio"].str.contains(busca, case=False, na=False)]
    st.dataframe(
        tabela[["posicao", "municipio", "uf_sigla", "regiao", "valor_fmt"]].rename(
            columns={
                "posicao": "#",
                "municipio": "Município",
                "uf_sigla": "UF",
                "regiao": "Região",
                "valor_fmt": indicador_label,
            }
        ),
        hide_index=True,
        use_container_width=True,
        height=500,
    )
    st.download_button(
        "⬇️ Baixar ranking completo (CSV)",
        tabela.to_csv(index=False).encode("utf-8-sig"),
        file_name=f"ranking_{chave}_{ano}.csv",
        mime="text/csv",
    )
