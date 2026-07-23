# 2. Arquitetura técnica

## 2.1 Stack

| Camada | Tecnologia |
|---|---|
| Frontend (site oficial) | React + [TanStack Start](https://tanstack.com/start) + Vite + TypeScript, em `web/` |
| UI / componentes | Tailwind CSS + Radix UI (shadcn) |
| Gráficos (frontend) | Recharts |
| Pipeline de dados | Python + pandas |
| Formato analítico | Parquet (colunar) + réplica SQLite |
| Leitura de planilhas de origem | openpyxl |
| Protótipo arquivado | Streamlit + Plotly, em `_legacy_streamlit/` — ver [2.5](#25-protótipo-arquivado-_legacy_streamlit) |

Dependências do pipeline em [requirements.txt](../requirements.txt);
dependências do frontend em
[web/package.json](../web/package.json).

## 2.2 Estrutura de pastas

```
painel-saude/
├── web/       # frontend oficial (React / TanStack Start)
│   ├── src/routes/            # páginas (roteamento por arquivo)
│   ├── src/components/        # componentes de UI (inclui shadcn em components/ui/)
│   ├── src/lib/                # dados mockados, utilitários
│   └── public/data/           # JSON gerado pelo pipeline Python (ver 2.6)
├── _legacy_streamlit/         # protótipo Streamlit arquivado (não é mais o site oficial)
│   ├── app.py
│   ├── pages/
│   └── .streamlit/config.toml
├── utils/
│   └── data.py                 # camada de dados (carregamento, cache, agregação) usada pelo pipeline de exportação
├── scripts/
│   ├── build_dataset.py       # pipeline atual: gera o modelo dimensional (star schema)
│   ├── importar_indicadores.py# pipeline legado: gera indicadores_long.csv (ver 2.4)
│   └── export_ranking_frontend.py # exporta ranking em JSON para o frontend React
├── data/
│   ├── raw/                   # planilhas .xlsx originais por grupo de indicador
│   ├── processed/              # saída do pipeline atual (parquet + qualipreneo.db)
│   ├── catalogo_indicadores.csv   # catálogo usado pelo pipeline legado
│   └── indicadores_long.csv       # saída do pipeline legado
└── docs/                       # esta documentação
```

## 2.3 Modelo de dados (star schema)

Gerado por [scripts/build_dataset.py](../scripts/build_dataset.py) em
`data/processed/`:

- **`fato_indicadores.parquet`** — grão: município × ano × indicador
  (× categoria, quando aplicável). Colunas: `codibge`, `cod_mapa`, `ano`,
  `grupo`, `indicador_chave`, `indicador_nome`, `valor`, `numerador`,
  `denominador`, `categoria`, `fonte_arquivo`.
- **`dim_municipios.parquet`** — um registro por município: `codibge`,
  `cod_mapa`, `nome_municipio_bruto`, `uf_sigla`, `uf_nome`, `regiao`.
- **`dim_indicadores.parquet`** — catálogo de indicadores: `indicador_chave`,
  `indicador_nome`, `grupo`, `direcao`, `formato`, `arquivo_origem`.
- **`dim_populacao.parquet`** — grão: município × ano. Pesos demográficos
  para agregação ponderada e estratificação por porte: `codibge`, `ano`,
  `nascidos_vivos`, `populacao_municipio`, `populacao_uf`, `populacao_br`,
  `faixa_populacional`.
- **`qualipreneo.db`** — réplica SQLite do mesmo modelo, pensada para
  consumo por uma futura API (não é o que o frontend lê hoje — hoje o
  frontend lê JSON estático exportado, ver 2.6).

Regra de padronização: `codibge` (6 dígitos) e `cod_mapa` (7 dígitos, com
dígito verificador) são sempre texto, com zero à esquerda preservado.

**Regra de agregação (importante)**: para qualquer nível geográfico acima
do município (UF, região, Brasil), quando o indicador tem `numerador` e
`denominador` válidos, a taxa é recalculada como
`soma(numerador) / soma(denominador) × fator_escala` — **não** pela média
simples das taxas municipais. Isso evita o erro clássico de dashboards de
saúde de dar o mesmo peso a municípios de tamanhos muito diferentes. Ver
[ADR-001](07-decisoes-tecnicas.md#adr-001--agregação-por-média-ponderada-numeradordenominador-não-média-simples-das-taxas-municipais).

## 2.4 Dois pipelines convivendo (atenção)

O projeto tem hoje **dois** pipelines de dados em paralelo:

1. **Legado** — [scripts/importar_indicadores.py](../scripts/importar_indicadores.py)
   lê `data/catalogo_indicadores.csv` + `data/raw/*.xlsx` e gera
   `data/indicadores_long.csv` (formato longo simples, sem numerador/
   denominador nem star schema). Hoje só é consumido pelo protótipo
   arquivado em `_legacy_streamlit/`.
2. **Atual** — [scripts/build_dataset.py](../scripts/build_dataset.py) lê
   um manifesto interno no próprio script e gera o modelo dimensional em
   `data/processed/` (ver 2.3). É a base do
   [scripts/export_ranking_frontend.py](../scripts/export_ranking_frontend.py),
   que alimenta o frontend React.

`[A DEFINIR]` — plano para aposentar o legado (apagar
`importar_indicadores.py` e `indicadores_long.csv`) uma vez que
`_legacy_streamlit/` deixar de ser consultado como referência.

## 2.5 Protótipo arquivado (`_legacy_streamlit/`)

Site original do projeto, em Streamlit + Plotly. **Não é mais o frontend
oficial** (ver [ADR-004](07-decisoes-tecnicas.md#adr-004--frontend-oficial-passa-a-ser-o-react-streamlit-fica-arquivado-como-protótipo)), mas continua
no repositório como referência, porque tem 4 páginas com dados reais que
o frontend React ainda não replicou:

| Página (Streamlit, arquivada) | Equivalente no React hoje |
|---|---|
| Início — evolução nacional/regional de um indicador | Não portado |
| 🏆 Ranking | Parcial — página `/` mostra roleta top/bottom 15 com dados majoritariamente mockados (`src/lib/ranking-data.ts`) |
| 🔍 Buscar Município | Não portado — `MunicipalityDetail.tsx` existe mas mostra o município selecionado na roleta, não uma busca livre |
| 📊 Comparar | Não portado (link "Comparar" no menu ainda é `#`) |
| 🗺️ Mapa | Portado como "Mapas municipais" (`/mapas-municipais`), com mapa por município (não só por estado) e ranking — ver [2.6](#26-frontend-react-web) |

Ver checklist de portabilidade em
[09-roadmap-e-perguntas-abertas.md](09-roadmap-e-perguntas-abertas.md).

Para rodar o protótipo arquivado, ver
[_legacy_streamlit/README.md](../_legacy_streamlit/README.md).

## 2.6 Frontend React (`web/`)

Site oficial, em React + TanStack Start + Vite + TypeScript. O design
inicial foi prototipado com apoio do [Lovable](https://lovable.dev); o
projeto não está mais conectado à plataforma (sem sync de editor, sem
telemetria) — todo o desenvolvimento segue via Claude Code direto no
repositório. O crédito das ferramentas usadas aparece na aba
"Metodologia" do site.

Rotas hoje:

- `src/routes/index.tsx` (`/`) — página de Ranking. Consome um JSON
  estático (`public/data/ranking-composto-2023.json`) exportado por
  [scripts/export_ranking_frontend.py](../scripts/export_ranking_frontend.py),
  mas a página ainda usa principalmente os dados mockados de
  `src/lib/ranking-data.ts` — integrar o componente ao JSON real é um dos
  itens do roadmap.
- `src/routes/indicadores.tsx` (`/indicadores`) — aba "Indicadores":
  escolhe qualquer um dos 26 indicadores e mostra o valor em
  Brasil/Região/UF/Município, com série histórica (line chart), mapa
  coroplético por UF, heatmap UF×Ano e tabela com download em CSV. Consome
  `public/data/indicadores/_index.json` (metadados) e
  `public/data/indicadores/<chave>.json` (série completa por indicador),
  exportados por
  [scripts/export_indicadores_frontend.py](../scripts/export_indicadores_frontend.py).
  Usa `d3-geo` (sem wrapper React — `react-simple-maps` tem peer-dependency
  presa em React ≤18, incompatível com o React 19 deste projeto) para
  projetar o GeoJSON vendorizado em
  `public/data/geo/brazil-uf.geojson` (27 UFs, simplificado com
  `mapshaper` de 3,4 MB para ~120 KB).
  `SiteHeader`/`SiteFooter` foram extraídos para
  `src/components/SiteHeader.tsx`/`SiteFooter.tsx` (antes viviam dentro de
  `index.tsx`) para serem reaproveitados pelas rotas.
- `src/routes/mapas-municipais.tsx` (`/mapas-municipais`) — aba "Mapas
  municipais": igual à aba Indicadores, mas só com agregação por
  município (Brasil/Região/UF continuam só em `/indicadores`) — mapa
  coroplético do Brasil inteiro por município (zoom/pan, hover) ao lado
  do ranking de piores/melhores desempenhos no indicador selecionado,
  com busca e download em CSV. Consome os mesmos JSONs de
  `public/data/indicadores/` (o campo `municipios[]` de cada indicador já
  vem com série por `codibge`). A malha municipal vem de
  `public/data/geo/brazil-municipios-topo.json` — TopoJSON (não GeoJSON
  solto, para deduplicar fronteiras compartilhadas) gerado a partir do
  [tbrugz/geodata-br](https://github.com/tbrugz/geodata-br) (licença
  CC0, arquivo `geojson/geojs-100-mun.json`, 5.564 municípios) com:
  ```
  mapshaper -i geojs-100-mun.json -clean -simplify 1% keep-shapes \
    -o format=topojson quantization=1e5 brazil-municipios-topo.json
  ```
  De 22,5 MB para ~1,3 MB. O `-clean` é essencial antes do `-simplify`:
  sem ele, ~34 municípios costeiros (Rio de Janeiro, Ilhabela, Vitória,
  Angra dos Reis etc.) saem com o anel invertido e o d3-geo os renderiza
  como "o mapa inteiro menos um buraco minúsculo" — um bug clássico de
  winding order em geometria vinda de shapefile. O TopoJSON é convertido
  para GeoJSON no browser com `topojson-client` (`feature()`). O `id` de
  7 dígitos do geojson (`cod_mapa`) é truncado para 6 dígitos para bater
  com o `codibge` dos dados de indicadores. Faltam geometria só para 6
  municípios criados após 2013 e ainda não desmembrados nessa malha
  (Mojuí dos Campos, Nazária, Pescaria Brava, Balneário Rincão, Pinto
  Bandeira, Paraíso das Águas) — aparecem no ranking normalmente, só não
  têm polígono próprio no mapa.

`[A DEFINIR]` — nome final do projeto: o frontend usa a marca
"CuidadoPreNeo" no header/footer, enquanto o resto do projeto (dados,
docs) usa "QualiPréNeo" — alinhar com a equipe qual é o nome oficial.

## 2.7 Fluxo de dados ponta a ponta

```
data/raw/*.xlsx (DataSUS, por indicador)
        │
        ▼
scripts/build_dataset.py ────► data/processed/*.parquet + qualipreneo.db
        │                              │
        │                    ┌─────────┴─────────┐
        │                    ▼                    ▼
        │      export_ranking_frontend.py   export_indicadores_frontend.py
        │                    │                    │
        │                    ▼                    ▼
        │       public/data/ranking-*.json  public/data/indicadores/*.json
        │                              │
        │                              ▼
        │                 web/ (React, site oficial)
        │
        ▼ (legado, ver 2.4)
scripts/importar_indicadores.py
        │
        ▼
data/indicadores_long.csv ────► _legacy_streamlit/ (Streamlit, arquivado)
```

## 2.8 Tema visual

O frontend React define sua própria paleta em Tailwind
(`web/src/styles.css`). O tema do protótipo arquivado
está em
[_legacy_streamlit/.streamlit/config.toml](../_legacy_streamlit/.streamlit/config.toml)
(cor primária `#0E7C7B`) — só relevante se alguém rodar o Streamlit
localmente. `[A DEFINIR]` — se há uma identidade visual institucional
(logo, paleta oficial) formalizada para o React seguir.
