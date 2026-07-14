# 2. Arquitetura técnica

## 2.1 Stack

| Camada | Tecnologia |
|---|---|
| Site principal | [Streamlit](https://streamlit.io) (Python) |
| Gráficos | Plotly Express |
| Manipulação de dados | pandas |
| Formato analítico | Parquet (colunar) + réplica SQLite |
| Leitura de planilhas de origem | openpyxl |
| Frontend experimental | React + Vite + TypeScript (via [Lovable](https://lovable.dev)) — ver [2.5](#25-frontend-experimental-teste_not_streamlit) |

Versões mínimas em [requirements.txt](../requirements.txt).

## 2.2 Estrutura de pastas

```
painel-saude/
├── app.py                    # página inicial do Streamlit
├── pages/                    # cada arquivo = uma página no menu lateral
│   ├── 1_🏆_Ranking.py
│   ├── 2_🔍_Buscar_Município.py
│   ├── 3_📊_Comparar.py
│   └── 4_🗺️_Mapa.py
├── utils/
│   └── data.py                # carregamento, cache (@st.cache_data) e agregação — usado por todas as páginas
├── scripts/
│   ├── build_dataset.py       # pipeline atual: gera o modelo dimensional (star schema)
│   ├── importar_indicadores.py# pipeline legado: gera indicadores_long.csv (ver 2.4)
│   └── export_ranking_frontend.py # exporta ranking em JSON para o frontend experimental
├── data/
│   ├── raw/                   # planilhas .xlsx originais por grupo de indicador
│   ├── processed/             # saída do pipeline atual (parquet + qualipreneo.db)
│   ├── catalogo_indicadores.csv   # catálogo usado pelo pipeline legado
│   └── indicadores_long.csv       # saída do pipeline legado
├── teste_not_streamlit/       # protótipo React separado (experimental)
├── .streamlit/config.toml     # tema visual do site
└── docs/                      # esta documentação
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
  consumo por uma futura API/Next.js (não é o que o Streamlit lê hoje).

Regra de padronização: `codibge` (6 dígitos) e `cod_mapa` (7 dígitos, com
dígito verificador) são sempre texto, com zero à esquerda preservado.

**Regra de agregação (importante)**: para qualquer nível geográfico acima
do município (UF, região, Brasil), quando o indicador tem `numerador` e
`denominador` válidos, a taxa é recalculada como
`soma(numerador) / soma(denominador) × fator_escala` — **não** pela média
simples das taxas municipais. Isso evita o erro clássico de dashboards de
saúde de dar o mesmo peso a municípios de tamanhos muito diferentes. Ver
[07-decisoes-tecnicas.md](07-decisoes-tecnicas.md).

## 2.4 Dois pipelines convivendo (atenção)

O projeto tem hoje **dois** pipelines de dados em paralelo:

1. **Legado** — [scripts/importar_indicadores.py](../scripts/importar_indicadores.py)
   lê `data/catalogo_indicadores.csv` + `data/raw/*.xlsx` e gera
   `data/indicadores_long.csv` (formato longo simples, sem numerador/
   denominador nem star schema).
2. **Atual** — [scripts/build_dataset.py](../scripts/build_dataset.py) lê
   um manifesto interno no próprio script e gera o modelo dimensional em
   `data/processed/` (ver 2.3).

`[A DEFINIR]` — qual pipeline o site (`utils/data.py`) está lendo
efetivamente *neste momento*, e o plano para aposentar o legado (apagar
`importar_indicadores.py` e `indicadores_long.csv` quando o novo pipeline
cobrir todos os indicadores). Enquanto os dois existirem, checar sempre
qual arquivo `utils/data.py` está carregando antes de mexer em dados.

## 2.5 Frontend experimental (`teste_not_streamlit/`)

Protótipo separado em React + Vite + TypeScript, gerado/sincronizado via
Lovable (ver `teste_not_streamlit/AGENTS.md` — **não fazer force-push nem
reescrever histórico da branch conectada ao Lovable**). Consome hoje um
JSON estático (`public/data/ranking-composto-2023.json`) exportado por
[scripts/export_ranking_frontend.py](../scripts/export_ranking_frontend.py).

`[A DEFINIR]` — este frontend vai substituir o Streamlit, coexistir como
site institucional/marketing, ou é só um experimento a ser descartado?
Isso muda a prioridade de manutenção dos dois.

## 2.6 Fluxo de dados ponta a ponta

```
data/raw/*.xlsx (DataSUS, por indicador)
        │
        ▼
scripts/build_dataset.py  ──────────────► data/processed/*.parquet + qualipreneo.db
        │                                          │
        │ (legado, ver 2.4)                        │
        ▼                                          ▼
scripts/importar_indicadores.py          utils/data.py (@st.cache_data)
        │                                          │
        ▼                                          ▼
data/indicadores_long.csv                app.py + pages/*.py (Streamlit)
                                                     │
                                                     ▼ (opcional)
                                    scripts/export_ranking_frontend.py
                                                     │
                                                     ▼
                                    teste_not_streamlit/public/data/*.json
```

## 2.7 Tema visual

Definido em [.streamlit/config.toml](../.streamlit/config.toml)
(cor primária `#0E7C7B`). `[A DEFINIR]` — se há uma identidade visual
institucional (logo, paleta oficial) a seguir também no frontend React.
