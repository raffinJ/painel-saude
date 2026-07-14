# 1. Visão geral do projeto

## 1.1 O que é

O **QualiPréNeo** é um painel público de indicadores de saúde materna e
neonatal para os municípios brasileiros, inspirado no
[IMAPI](https://www.imapi.org). Permite comparar, ranquear e acompanhar a
evolução de indicadores ao longo do tempo em diferentes recortes
geográficos (município, UF, região, Brasil).

`[A DEFINIR]` — Uma frase-síntese do "porquê" institucional do projeto:
qual problema de saúde pública ele ajuda a resolver, e para quem
(gestores municipais? pesquisadores? sociedade civil?).

## 1.2 Objetivos

`[A DEFINIR]` — Objetivos do projeto, por exemplo:
- Dar visibilidade pública à qualidade da atenção pré-natal, ao parto e
  neonatal por município.
- Permitir que gestores comparem seu município com pares (mesma UF,
  região, porte populacional).
- Servir de base para pesquisa acadêmica sobre desigualdades regionais.

## 1.3 Público-alvo

`[A DEFINIR]` — Quem usa o site e como. Sugestão de tabela:

| Perfil | O que busca no painel |
|---|---|
| Gestor municipal de saúde | `[A DEFINIR]` |
| Pesquisador / academia | `[A DEFINIR]` |
| Sociedade civil / imprensa | `[A DEFINIR]` |

## 1.4 Escopo atual x escopo futuro

- **Hoje**: protótipo funcional em Streamlit com 3 indicadores reais
  carregados e pipeline pronto para os demais (ver
  [03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md)).
- **Em avaliação**: um segundo frontend em React (pasta
  `teste_not_streamlit/`), ainda experimental — ver
  [02-arquitetura.md](02-arquitetura.md#25-frontend-experimental-teste_not_streamlit).
- `[A DEFINIR]` — o que fica fora do escopo do projeto (ex.: não é um
  prontuário, não substitui os sistemas oficiais do DataSUS, etc.).

## 1.5 Equipe e papéis

`[A DEFINIR]` — Preencher com nome, papel e área de responsabilidade de
cada autor do projeto. Sugestão de tabela:

| Nome | Papel | Responsável por |
|---|---|---|
| | Coordenação / metodologia em saúde | Validar direção e fórmula de cada indicador |
| | Desenvolvimento (dados) | Pipeline (`scripts/`, `data/`) |
| | Desenvolvimento (site) | Streamlit (`app.py`, `pages/`, `utils/`) |

## 1.6 Instituição e créditos

`[A DEFINIR]` — Instituição(ões) responsável(is), financiamento (se houver),
como citar o projeto, licença de uso dos dados e do código.

## 1.7 Fontes de dados

Os dados vêm do **DataSUS** (ver detalhamento por indicador em
[03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md)).
`[A DEFINIR]` — sistemas de origem específicos (SINASC, SIM, CNES, etc.),
período coberto (hoje: 2008–2023) e frequência de atualização prevista.
