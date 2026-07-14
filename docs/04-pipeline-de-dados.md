# 4. Pipeline de dados

Documentação operacional de como os arquivos brutos do DataSUS viram os
dados que o site consome. Para o "porquê" das regras de cálculo, ver
[03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md).
Para o modelo de dados resultante, ver
[02-arquitetura.md §2.3](02-arquitetura.md#23-modelo-de-dados-star-schema).

## 4.1 Pré-requisitos

Mesmo ambiente virtual do site (ver [README.md](../README.md#1-rodando-o-site-no-seu-computador)):

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
`data/indicadores_long.csv`. Formato do catálogo:

```
chave,arquivo,coluna_valor,nome_amigavel,grupo,direcao,formato
taxa_cesarea,taxa_cesarea_munic_ano.xlsx,proporcao,Proporção de Cesáreas,Grupo 2 - Parto,menor_melhor,{:.1f}%
```

| Coluna | Significado |
|---|---|
| `chave` | identificador interno, sem espaços/acentos |
| `arquivo` | nome do arquivo dentro de `data/raw/` |
| `coluna_valor` | nome exato da coluna com o valor na planilha original |
| `nome_amigavel` | como aparece nos menus do site |
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

`[A DEFINIR]` — nota do README sobre arquivos `_munic.xlsx` (sem `_ano`,
só total do período): decidir se/quando o site vai exibir também esse
"resumo do período completo".

## 4.5 Logs e validação após rodar o pipeline

O que checar depois de cada `build_dataset.py`:
- Quantidade de linhas lidas x descartadas por arquivo (grandes descartes,
  ex. >50%, merecem investigação — ver nota sobre CNES/leitos nas
  decisões técnicas).
- Municípios sem `cod_mapa` (hoje: 2 pendentes — identificar quais).
- `[A DEFINIR]` — checklist formal de validação antes de "homologar" um
  indicador novo (quem revisa, o que revisa).

## 4.6 Exportando para o frontend experimental

```bash
python scripts/export_ranking_frontend.py
```

Gera `teste_not_streamlit/public/data/ranking-composto-2023.json` a
partir de `montar_ranking()` em `utils/data.py`. `[A DEFINIR]` — se/quando
isso deve rodar automaticamente (ex.: como parte do build do frontend) em
vez de manualmente.
