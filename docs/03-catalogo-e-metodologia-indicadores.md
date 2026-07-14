# 3. Catálogo e metodologia dos indicadores

Este é o documento mais importante para quem cuida da parte de saúde
pública do projeto: aqui ficam registradas as decisões de **o que cada
indicador mede** e **como ele é calculado** — coisas que não dá para
inferir olhando só o código.

## 3.1 Indicadores já carregados

| Chave | Nome amigável | Grupo | Direção | Formato |
|---|---|---|---|---|
| `indicador_composto` | Indicador Composto | Geral | menor é melhor | `{:.2f}` |
| `apgar_adequado` | Proporção de Apgar Adequado (1º/5º min) | Grupo 3 - Neonatal | maior é melhor | `{:.1f}%` |
| `coef_mortalidade_neonatal` | Coeficiente de Mortalidade Neonatal | Grupo 3 - Neonatal | menor é melhor | `{:.2f}` |

(fonte: [data/catalogo_indicadores.csv](../data/catalogo_indicadores.csv) —
mantenha esta tabela sincronizada quando o catálogo mudar, ou considere
gerar este trecho automaticamente a partir do CSV.)

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

Copiem este bloco para cada indicador do catálogo — inclusive os 3 já
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
