# 4. Pipeline de dados

Documentação operacional de como os arquivos brutos do DataSUS viram os
dados que o site consome. Para o "porquê" das regras de cálculo, ver
[03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md).
Para o modelo de dados resultante, ver
[02-arquitetura.md §2.3](02-arquitetura.md#23-modelo-de-dados-star-schema).

## 4.1 Pré-requisitos

Mesmo ambiente virtual do pipeline (ver [README.md §2](../README.md#2-rodando-o-pipeline-de-dados-python)):

```bash
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## 4.2 Rodando o pipeline atual

```bash
python scripts/build_dataset.py
```

Lê tudo em `data/raw/*.xlsx`, padroniza colunas e grava em
`data/processed/`:
- `fato_indicadores.parquet`, `dim_municipios.parquet`,
  `dim_indicadores.parquet`, `dim_populacao.parquet`
- `qualipreneo.db` (réplica SQLite)

`[A DEFINIR]` — como cadastrar um indicador novo no manifesto interno do
script (hoje é editado direto no `MANIFESTO` dentro de
[scripts/build_dataset.py](../scripts/build_dataset.py) — documentar aqui
o formato esperado de cada entrada, com um exemplo).

## 4.3 Rodando o pipeline legado

```bash
python scripts/importar_indicadores.py
```

Lê `data/catalogo_indicadores.csv` + `data/raw/*.xlsx` e gera
`data/indicadores_long.csv` — hoje usado só pelo protótipo Streamlit
arquivado em [`_legacy_streamlit/`](../_legacy_streamlit/). Formato do catálogo:

```
chave,arquivo,coluna_valor,nome_amigavel,grupo,direcao,formato
taxa_cesarea,taxa_cesarea_munic_ano.xlsx,proporcao,Proporção de Cesáreas,Grupo 2 - Parto,menor_melhor,{:.1f}%
```

| Coluna | Significado |
|---|---|
| `chave` | identificador interno, sem espaços/acentos |
| `arquivo` | nome do arquivo dentro de `data/raw/` |
| `coluna_valor` | nome exato da coluna com o valor na planilha original |
| `nome_amigavel` | como aparece nos menus do protótipo arquivado |
| `grupo` | um dos 5 grupos (ver [03-catalogo-e-metodologia-indicadores.md §3.2](03-catalogo-e-metodologia-indicadores.md#32-os-5-grupos-da-proposta)) |
| `direcao` | `menor_melhor` ou `maior_melhor` — confirmar com a metodologia do indicador |
| `formato` | máscara de exibição (`{:.1f}%`, `{:.2f}`, etc.) |

> Ver [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)
> — este pipeline é considerado legado; confirmar com a equipe antes de
> investir tempo nele.

## 4.4 Formato dos arquivos de origem

Convenção de nome: `..._munic_ano.xlsx` (série temporal por
município/ano), com colunas mínimas `year`, `codibge`, `cod_mapa`,
`NOME DO MUNICÍPIO` + a(s) coluna(s) de valor.

`[A DEFINIR]` — arquivos `_munic.xlsx` (sem `_ano`, só total do período):
decidir se/quando o frontend vai exibir também esse "resumo do período
completo".

## 4.5 Logs e validação após rodar o pipeline

O que checar depois de cada `build_dataset.py`:
- Quantidade de linhas lidas x descartadas por arquivo (grandes descartes,
  ex. >50%, merecem investigação — ver nota sobre CNES/leitos nas
  decisões técnicas).
- Municípios sem `cod_mapa` (hoje: 2 pendentes — identificar quais).
- `[A DEFINIR]` — checklist formal de validação antes de "homologar" um
  indicador novo (quem revisa, o que revisa).

## 4.6 Exportando para o frontend (React)

```bash
python scripts/export_ranking_frontend.py
```

Gera `web/public/data/ranking-composto-2023.json` a
partir de `montar_ranking()` em `utils/data.py`. Esse script não depende
mais de Streamlit (usa `functools.lru_cache`, não `@st.cache_data` — ver
[ADR-004](07-decisoes-tecnicas.md#adr-004--frontend-oficial-passa-a-ser-o-react-streamlit-fica-arquivado-como-protótipo)),
então basta o `requirements.txt` da raiz para rodá-lo.

`[A DEFINIR]` — se/quando isso deve rodar automaticamente (ex.: como
parte do build do frontend, ou de um CI) em vez de manualmente.

## 4.7 Exportando para a aba Indicadores (React)

```bash
python scripts/export_indicadores_frontend.py
```

Para cada um dos 26 indicadores em `dim_indicadores`, gera:
- `web/public/data/indicadores/_index.json` — metadados
  dos 26 indicadores (chave, nome, grupo, direção, formato), para popular
  o seletor sem baixar as séries inteiras.
- `web/public/data/indicadores/<chave>.json` — série por
  ano em Brasil, cada Região, cada UF (via
  `utils.data.calcular_taxa_agregada`, mesma regra do
  [ADR-001](07-decisoes-tecnicas.md#adr-001--agregação-por-média-ponderada-numeradordenominador-não-média-simples-das-taxas-municipais))
  e por Município (direto de `fato_indicadores`, já é o grão nativo).

**Demora**: por indicador, o script faz uma chamada a
`calcular_taxa_agregada` para cada combinação ano × (Brasil + 5 regiões +
27 UFs) — na ordem de 13.700 chamadas no total para os 26 indicadores.
Rodar leva **~15 minutos**. É um script de pipeline, não é executado em
runtime pelo site, então esse tempo é aceitável — mas rodem uma vez e
reaproveitem o resultado em vez de rodar a cada teste pequeno.

**Indicadores com categoria** (`proporcao_parto_vaginal_profissional`,
`coef_obito_neonatal_causa`): têm mais de uma linha por município/ano no
`fato_indicadores` (uma por categoria — profissional que assistiu o
parto, causa do óbito). O script **não combina** essas linhas — soma
numerador/denominador por cima de categorias dá um resultado sem
sentido para indicadores de composição (ex.: as proporções por
profissional somam ~100% em qualquer município/ano; "juntar tudo" só
confirma isso, não é "a" taxa do indicador). Em vez disso, o JSON exporta
uma série **por categoria**, aninhada em cada nível geográfico
(`brasil`/`regioes`/`ufs` viram `Record<categoria, série>`, e cada
município ganha `series: Record<categoria, série>` em vez de `serie`) —
usa `utils.data.calcular_taxa_agregada(..., categoria=...)` para agregar
dentro de cada categoria separadamente. O indicador vem marcado com
`"multi_categoria": true` e `"categorias": [...]` no JSON.

Na aba Indicadores, esses dois indicadores mostram um gráfico de barras
empilhadas e uma tabela pivotada (ano × categoria) com todas as
categorias visíveis; o mapa e o heatmap (que só conseguem colorir um
valor por UF) têm um seletor de categoria à parte.

## 4.8 Malha geográfica (UF)

`web/public/data/geo/brazil-uf.geojson` é uma cópia local
(vendorizada) de um GeoJSON público das 27 UFs
(`codeforgermany/click_that_hood`, a mesma fonte que o Streamlit arquivado
usava via URL). Foi simplificado de 3,4 MB para ~120 KB com
[mapshaper](https://github.com/mbloch/mapshaper) (`npx mapshaper -i
brazil-uf.geojson -simplify 5% -o brazil-uf.geojson force`) — se precisar
regenerar (ex.: trocar a fonte), rodar essa mesma simplificação antes de
commitar, senão o mapa fica pesado.

## 4.9 Aba Custos hospitalares (R + SIH/SUS)

Reproduz a metodologia do artigo *Healthcare Costs and Main Characteristics of
Childbirth and Neonatal Inpatient Care From the Brazilian Public Health System
Perspective* (Value Health Reg Issues 2025;50:101161) direto dos microdados do
SIH/SUS. Este pipeline é independente do Python e usa **R** (`read.dbc`,
`data.table`, `jsonlite`). Os scripts originais do artigo estão em
<https://github.com/raffinJ/childbirth_neonatal_healthcare_costs_article>.

```bash
# 1. Lê os 3.888 arquivos RD*.dbc (27 UF x 12 meses x 12 anos) e gera o cubo.
#    ~10-12 min com 8 núcleos; precisa dos .dbc em disco (~10 GB).
Rscript scripts/custos_sihsus.R "/Volumes/HD JULIA/TabWin/SIH/Dados" data/custos

# 2. Converte o cubo em JSON para o site.
Rscript scripts/export_custos_frontend.R
```

| Etapa | Saída | Observação |
|---|---|---|
| 1 | `data/custos/cubo_parto.csv` | ano × UF × via de parto × UTI, com **somas** de custos, dias e óbitos |
| 1 | `data/custos/cubo_neonatal_cid_completo.csv` | ano × UF × CID × UTI (23 MB, **não versionado**) |
| 2 | `web/public/data/custos/custos.json` | cubo de partos + cubo neonatal com os 30 CIDs de maior custo e "Outros" (~1,7 MB) |

**Recortes** (iguais ao artigo): *parto* = `PROC_REA` ∈ {0310010039, 0310010047,
0310010055, 0411010026, 0411010034, 0411010042}; *neonatal* = idade 0–27 dias
(`COD_IDADE` 0/1, ou 2 com `IDADE ≤ 27`), excluindo os registros de parto.
**Custo** = `VAL_TOT`, corrigido pelo IPCA para dez/2023 (fatores do artigo);
Int$ = R$ ÷ 2,44 (PPC 2023). **UTI** = `MARCA_UTI != "00"`; o custo de UTI
(`VAL_UTI`) só é contado nessas AIHs (~R$ 86 mi de `VAL_UTI` em AIHs sem marca de
UTI ficam apenas no `VAL_TOT`, como no artigo). A UF é a do estabelecimento
(`MUNIC_MOV`).

**Por que um "cubo" de somas?** Médias e desvios-padrão de qualquer recorte
escolhido no site saem de `n`, `Σx` e `Σx²`, sem precisar de microdados no
navegador. O site só soma linhas do cubo (`web/src/lib/custos-data.ts`).

**Validação** (o script imprime ao final; valores do artigo entre parênteses):

| | Reproduzido | Artigo |
|---|---|---|
| Internações de parto | 23.135.767 | 23.135.767 |
| Partos vaginais | 13.165.422 | 13.165.422 |
| Partos com UTI | 89.248 | 89.248 |
| Custo total de parto (R$) | 22.894.711.855 | 22.894.711.855 |
| Internações neonatais | 3.834.791 | 3.835.128 (−0,009%) |
| Custo total neonatal (R$) | 14.689.019.175 | 14.689.319.222 |
| Custo de UTI neonatal (R$) | 9.571.225.234 | 9.571.225.234 |
| Mortalidade intra-hosp. materna / neonatal | 29,7 /100 mil · 43,3 /mil | 29,7 · 43,2 |

A pequena diferença no neonatal (337 AIHs) vem da extração original no TabWin,
que não temos mais; os custos, médias, DPs e o top-20 de diagnósticos coincidem.

**Denominadores por 1.000 nascidos vivos.** Dois, rotulados no site:
- *Todos os nascidos vivos* (SINASC, por UF de residência e ano, 2011–2022 = 34.264.484), somados da planilha
  `natalidade_munic_ano.xlsx` (`/Volumes/HD JULIA/QualiPreNeo/indicadores/taxa_bruta_natalidade/`, colunas
  `year`, `codibge`, `nv_ano`). O `export_custos_frontend.R` aceita outro caminho como 1º argumento e grava
  `data/custos/nascidos_vivos_uf_ano.csv`. Permite filtrar por ano e UF.
- *Nascidos vivos em estabelecimentos públicos* por região, 2011–2022, copiados do artigo
  (`meta.nascidos_vivos_regiao`; 13,9 milhões) — só valem para o período completo e reproduzem a Tabela 2.
  O resultado muda bastante conforme o denominador (Sul: ~2,8× o Norte com o do artigo; ~1,2× com todos os nascidos vivos).
`[A DEFINIR]` — como o artigo filtrou "estabelecimentos públicos" (os scripts do GitHub não mostram).
