import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import plotly.express as px
import streamlit as st

from utils.data import get_indicator_df, get_indicator_options, indicator_group

st.set_page_config(page_title="Mapa", page_icon="🗺️", layout="wide")
st.title("🗺️ Mapa por Estado")

st.markdown(
    """
Este protótipo mostra o mapa **agregado por estado** (média dos municípios),
que já funciona sem nenhum arquivo extra. Para o mapa **por município**
(como no IMAPI), veja a caixa "Como evoluir para o mapa municipal" no
final da página — é só um passo a mais.
"""
)

opcoes_indicador = get_indicator_options()

with st.sidebar:
    st.header("Filtros")
    indicador_label = st.selectbox("Indicador", list(opcoes_indicador.keys()))
    chave = opcoes_indicador[indicador_label]

df = get_indicator_df(chave)
st.caption(f"Grupo: {indicator_group(chave)}")

ano = st.select_slider("Ano", options=sorted(df["year"].unique()), value=df["year"].max())

df_ano = df[df["year"] == ano]
por_uf = df_ano.groupby(["uf_sigla"], as_index=False)["valor"].mean()

fig = px.choropleth(
    por_uf,
    geojson="https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson",
    locations="uf_sigla",
    featureidkey="properties.sigla",
    color="valor",
    color_continuous_scale="RdYlGn_r",
    scope="south america",
    labels={"valor": indicador_label},
    hover_name="uf_sigla",
)
fig.update_geos(fitbounds="locations", visible=False)
fig.update_layout(height=650, margin=dict(l=0, r=0, t=0, b=0))
st.plotly_chart(fig, use_container_width=True)

st.dataframe(
    por_uf.sort_values("valor").rename(columns={"uf_sigla": "UF", "valor": indicador_label}),
    hide_index=True,
    use_container_width=True,
)

with st.expander("🧩 Como evoluir para o mapa por município (nível IMAPI)"):
    st.markdown(
        """
1. Baixe a malha municipal do IBGE (formato GeoJSON), em:
   `https://servicodados.ibge.gov.br/api/v3/malhas/` ou pelo portal
   [Malhas Territoriais do IBGE](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html).
2. Salve o arquivo em `data/municipios.geojson`. Cada feature precisa ter
   uma propriedade com o código IBGE de 7 dígitos — no nosso CSV essa
   coluna já existe como `cod_mapa` (disponível em `get_indicator_df`,
   caso queiram reincluí-la no retorno).
3. Troque o `px.choropleth` acima por:

```python
import json
with open("data/municipios.geojson") as f:
    geojson_municipios = json.load(f)

fig = px.choropleth(
    df_ano,
    geojson=geojson_municipios,
    locations="cod_mapa",
    featureidkey="properties.CD_MUN",  # confira o nome exato da propriedade no seu arquivo
    color="valor",
    color_continuous_scale="RdYlGn_r",
)
```

4. Arquivos de malha municipal completos costumam pesar 20-60 MB — para
   manter o site rápido, o ideal é simplificar a geometria (menos pontos
   por polígono) com uma ferramenta como `mapshaper` antes de publicar.
"""
    )
