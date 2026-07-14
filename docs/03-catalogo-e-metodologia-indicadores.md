# 3. Catálogo e metodologia dos indicadores

Este é o documento mais importante para quem cuida da parte de saúde
pública do projeto: aqui ficam registradas as decisões de **o que cada
indicador mede** e **como ele é calculado** — coisas que não dá para
inferir olhando só o código.

## 3.1 Indicadores já carregados

**26 indicadores** já estão processados em `data/processed/` (pipeline
atual, `scripts/build_dataset.py` — ver
[02-arquitetura.md §2.3](02-arquitetura.md#23-modelo-de-dados-star-schema))
e disponíveis na aba Indicadores do frontend. O pipeline legado
([data/catalogo_indicadores.csv](../data/catalogo_indicadores.csv), usado
só pelo protótipo Streamlit arquivado) tem apenas 3 desses cadastrados —
não é a lista completa, não usem esse CSV como referência do que existe.

| Chave | Nome amigável | Grupo | Direção | Formato |
|---|---|---|---|---|
| `cobertura_estabelecimentos_saude` | Coeficiente de Estabelecimentos de Saúde (Atenção Primária) | Grupo 1 - Pré-natal | maior é melhor | `{:.2f}` |
| `taxa_hiv_gestantes` | Taxa de HIV Positivo em Gestantes | Grupo 1 - Pré-natal | menor é melhor | `{:.2f}` |
| `coef_obitos_fetais` | Coeficiente de Óbitos Fetais | Grupo 1 - Pré-natal | menor é melhor | `{:.2f}` |
| `proporcao_pre_natal_adequado` | Proporção de Gestantes com Pré-natal Adequado | Grupo 1 - Pré-natal | maior é melhor | `{:.1f}%` |
| `taxa_deteccao_sifilis_gestantes` | Taxa de Detecção de Sífilis em Gestantes | Grupo 1 - Pré-natal | menor é melhor | `{:.2f}` |
| `proporcao_enfermeiros_obstetricos` | Proporção de Enfermeiros Obstétricos | Grupo 2 - Parto | maior é melhor | `{:.2f}` |
| `proporcao_cesareas` | Proporção de Cesáreas | Grupo 2 - Parto | neutro | `{:.1f}%` |
| `proporcao_parto_vaginal_profissional` * | Proporção de Partos Vaginais por Profissional que Assistiu | Grupo 2 - Parto | maior é melhor | `{:.1f}%` |
| `apgar_adequado` | Proporção de Apgar Adequado (1º/5º min) | Grupo 3 - Neonatal | maior é melhor | `{:.1f}%` |
| `proporcao_asfixia_perinatal` | Proporção de Asfixia Perinatal | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `coef_mortalidade_neonatal` | Coeficiente de Mortalidade Neonatal | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `coef_obito_neonatal_causa` * | Coeficiente de Óbito Neonatal por Causa | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `proporcao_hiv_vertical` | Proporção de Transmissão Vertical de HIV | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `taxa_infeccoes_sistemicas_neonatais` | Proporção de Infecções Sistêmicas Neonatais | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `taxa_baixo_peso_nascer` | Taxa de Baixo Peso ao Nascer | Grupo 3 - Neonatal | menor é melhor | `{:.1f}%` |
| `taxa_leitos_neonatais` | Taxa Total de Leitos Neonatais | Grupo 3 - Neonatal | maior é melhor | `{:.2f}` |
| `taxa_incidencia_sifilis_congenita` | Taxa de Incidência de Sífilis Congênita | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `taxa_bruta_natalidade` | Taxa Bruta de Natalidade | Grupo 3 - Neonatal | neutro | `{:.2f}` |
| `proporcao_obitos_neonatais_24h` | Proporção de Óbitos Neonatais nas Primeiras 24h | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |
| `taxa_leitos_uti_adulto` | Taxa de Leitos em UTI Adulto | Grupo 4 - Puerpério | maior é melhor | `{:.2f}` |
| `taxa_leitos_obstetricos` | Taxa de Leitos Obstétricos | Grupo 4 - Puerpério | maior é melhor | `{:.2f}` |
| `razao_desfecho_materno_grave` | Razão de Desfecho Materno Grave | Grupo 4 - Puerpério | menor é melhor | `{:.2f}` |
| `razao_mortalidade_materna` | Razão de Mortalidade Materna | Grupo 4 - Puerpério | menor é melhor | `{:.2f}` |
| `proporcao_obitos_maternos_evitaveis` | Proporção de Óbitos Maternos Evitáveis | Grupo 4 - Puerpério | menor é melhor | `{:.1f}%` |
| `coef_mortalidade_perinatal` | Coeficiente de Mortalidade Perinatal | Grupo 5 - Perinatal | menor é melhor | `{:.2f}` |
| `indicador_composto` | Indicador Composto | Indicador Composto | menor é melhor | `{:.2f}` |

\* Tem quebra por categoria (mais de uma linha por município/ano — ver
[04-pipeline-de-dados.md §4.7](04-pipeline-de-dados.md#47-exportando-para-a-aba-indicadores-react)
e o item correspondente em
[09-roadmap-e-perguntas-abertas.md](09-roadmap-e-perguntas-abertas.md)).

(fonte: `data/processed/dim_indicadores.parquet`, gerado pelo manifesto em
[scripts/build_dataset.py](../scripts/build_dataset.py) — mantenha esta
tabela sincronizada quando o manifesto mudar.)

## 3.2 Os 5 grupos da proposta

`[A DEFINIR]` — descrever o que cada grupo representa clinicamente:

| Grupo | Descrição |
|---|---|
| Grupo 1 — Pré-natal | `[A DEFINIR]` |
| Grupo 2 — Parto | `[A DEFINIR]` |
| Grupo 3 — Neonatal | `[A DEFINIR]` |
| Grupo 4 — Puerpério | `[A DEFINIR]` |
| Grupo 5 — Perinatal | `[A DEFINIR]` |

## 3.3 Ficha por indicador (preencher uma por indicador)

Copiem este bloco para cada indicador do catálogo — inclusive os 26 já
carregados, que ainda não têm ficha completa.

### `[chave_do_indicador]`

- **Nome amigável**:
- **Grupo**:
- **O que mede** (definição em 1–2 frases, em linguagem não técnica):
- **Fórmula** (numerador / denominador, explícita):
- **Fonte de dados original** (sistema DataSUS: SINASC, SIM, CNES, etc.):
- **Direção** (`maior_melhor` / `menor_melhor`) e por quê:
- **Limitações conhecidas** (ex.: subnotificação, municípios pequenos com
  denominador raro, supressão de dado por sigilo estatístico):
- **Responsável pela validação metodológica**:

> Dica: se o indicador tem `numerador`/`denominador` no
> `fato_indicadores.parquet`, a agregação acima do município já usa média
> ponderada automaticamente (ver
> [02-arquitetura.md §2.3](02-arquitetura.md#23-modelo-de-dados-star-schema)).
> Se não tiver, registrem aqui como a agregação deve ser feita.

## 3.4 Como adicionar um indicador novo

Fluxo operacional (o "dia a dia" de quem cuida dos dados) — hoje descrito
tanto no [README.md](../README.md#3-como-adicionar-um-indicador-novo-o-fluxo-do-dia-a-dia)
quanto no cabeçalho de
[scripts/build_dataset.py](../scripts/build_dataset.py). Resumo:

1. Copiar o `.xlsx` do indicador para `data/raw/` (no grupo correspondente).
2. Cadastrar o indicador (catálogo/manifesto — ver
   [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)
   para saber qual dos dois pipelines está ativo).
3. Rodar o script de importação/build correspondente.
4. Preencher a ficha da seção 3.3 acima **antes** de considerar o
   indicador pronto para publicação — dado sem metodologia documentada
   não deveria ir para produção.

## 3.5 Regras gerais de qualidade de dado

`[A DEFINIR]` — critérios da equipe para:
- Nível mínimo de completude de dados para um indicador entrar no site
  (ex.: percentual mínimo de municípios com dado no ano).
- Tratamento de valores nulos/suprimidos nos rankings (hoje: municípios
  sem dado no ano são removidos do ranking daquele ano, não jogados para
  as pontas — ver [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md)).
- Tratamento de outliers.
- Pendência conhecida: 2 municípios ficaram sem `cod_mapa` no último
  processamento (ver anotações internas) — identificar e corrigir para
  não deixar buracos no mapa interativo.
