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

- **Hoje**: frontend oficial em React (pasta `teste_not_streamlit/`),
  ainda com só a página de Ranking (dados majoritariamente mockados);
  pipeline de dados em Python pronto com 3 indicadores reais e capaz de
  receber os demais. Ver checklist de portabilidade em
  [09-roadmap-e-perguntas-abertas.md §9.1](09-roadmap-e-perguntas-abertas.md#91-portabilidade-streamlit-arquivado--react-oficial).
- **Arquivado**: o protótipo original em Streamlit (4 páginas com dados
  reais) fica em `_legacy_streamlit/` como referência enquanto o React
  não tem paridade de funcionalidades — ver
  [02-arquitetura.md §2.5](02-arquitetura.md#25-protótipo-arquivado-_legacy_streamlit)
  e [ADR-004](07-decisoes-tecnicas.md#adr-004--frontend-oficial-passa-a-ser-o-react-streamlit-fica-arquivado-como-protótipo).
- `[A DEFINIR]` — o que fica fora do escopo do projeto (ex.: não é um
  prontuário, não substitui os sistemas oficiais do DataSUS, etc.).

## 1.5 Equipe e papéis

`[A DEFINIR]` — Preencher com nome, papel e área de responsabilidade de
cada autor do projeto. Sugestão de tabela:

| Nome | Papel | Responsável por |
|---|---|---|
| | Coordenação / metodologia em saúde | Validar direção e fórmula de cada indicador |
| | Desenvolvimento (dados) | Pipeline (`scripts/`, `data/`) |
| | Desenvolvimento (frontend) | React (`teste_not_streamlit/`) |

## 1.6 Instituição e créditos

`[A DEFINIR]` — Instituição(ões) responsável(is), financiamento (se houver),
como citar o projeto, licença de uso dos dados e do código.

## 1.7 Fontes de dados

Os dados vêm do **DataSUS** (ver detalhamento por indicador em
[03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md)).
`[A DEFINIR]` — sistemas de origem específicos (SINASC, SIM, CNES, etc.),
período coberto (hoje: 2008–2023) e frequência de atualização prevista.
