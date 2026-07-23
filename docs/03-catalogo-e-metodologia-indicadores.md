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

A coluna **Unidade** abaixo foi verificada empiricamente contra o dado
real (`data/processed/fato_indicadores.parquet`), não só copiada da
planilha de planejamento — ver método em
[§3.3](#33-ficha-por-indicador-preencher-uma-por-indicador) e as
divergências encontradas em
[§3.6](#36-pontos-a-confirmar-com-a-equipe).

| Chave | Nome amigável | Grupo | Direção | Unidade |
|---|---|---|---|---|
| `cobertura_estabelecimentos_saude` | Coeficiente de Estabelecimentos de Saúde (Atenção Primária) | Grupo 1 - Pré-natal | maior é melhor | por 10.000 habitantes |
| `taxa_hiv_gestantes` | Taxa de HIV Positivo em Gestantes | Grupo 1 - Pré-natal | menor é melhor | por 1.000 nascidos vivos |
| `coef_obitos_fetais` | Coeficiente de Óbitos Fetais | Grupo 1 - Pré-natal | menor é melhor | por 1.000 nascimentos totais |
| `proporcao_pre_natal_adequado` | Proporção de Gestantes com Pré-natal Adequado | Grupo 1 - Pré-natal | maior é melhor | % |
| `taxa_deteccao_sifilis_gestantes` | Taxa de Detecção de Sífilis em Gestantes | Grupo 1 - Pré-natal | menor é melhor | % |
| `proporcao_enfermeiros_obstetricos` | Proporção de Enfermeiros Obstétricos | Grupo 2 - Parto | maior é melhor | por 10.000 habitantes |
| `proporcao_cesareas` | Proporção de Cesáreas | Grupo 2 - Parto | neutro | % |
| `proporcao_parto_vaginal_profissional` * | Proporção de Partos Vaginais por Profissional que Assistiu | Grupo 2 - Parto | maior é melhor | % (por categoria) |
| `apgar_adequado` | Proporção de Apgar Adequado (1º/5º min) | Grupo 3 - Neonatal | maior é melhor | % |
| `proporcao_asfixia_perinatal` | Proporção de Asfixia Perinatal | Grupo 3 - Neonatal | menor é melhor | % |
| `coef_mortalidade_neonatal` | Coeficiente de Mortalidade Neonatal | Grupo 3 - Neonatal | menor é melhor | por 1.000 nascidos vivos |
| `coef_obito_neonatal_causa` * | Coeficiente de Óbito Neonatal por Causa | Grupo 3 - Neonatal | menor é melhor | por 1.000 NV (por categoria) |
| `proporcao_hiv_vertical` | Proporção de Transmissão Vertical de HIV | Grupo 3 - Neonatal | menor é melhor | % |
| `taxa_infeccoes_sistemicas_neonatais` | Proporção de Infecções Sistêmicas Neonatais | Grupo 3 - Neonatal | menor é melhor | por 1.000 nascidos vivos |
| `taxa_baixo_peso_nascer` | Taxa de Baixo Peso ao Nascer | Grupo 3 - Neonatal | menor é melhor | % |
| `taxa_leitos_neonatais` | Taxa Total de Leitos Neonatais | Grupo 3 - Neonatal | maior é melhor | por 1.000 nascidos vivos |
| `taxa_incidencia_sifilis_congenita` | Taxa de Incidência de Sífilis Congênita | Grupo 3 - Neonatal | menor é melhor | por 1.000 nascidos vivos |
| `taxa_bruta_natalidade` | Taxa Bruta de Natalidade | Grupo 3 - Neonatal | neutro | por 1.000 habitantes |
| `proporcao_obitos_neonatais_24h` | Proporção de Óbitos Neonatais nas Primeiras 24h | Grupo 3 - Neonatal | menor é melhor | por 1.000 nascidos vivos |
| `taxa_leitos_uti_adulto` | Taxa de Leitos em UTI Adulto | Grupo 4 - Puerpério | maior é melhor | nº absoluto de leitos — **não é taxa** (ver §3.6) |
| `taxa_leitos_obstetricos` | Taxa de Leitos Obstétricos | Grupo 4 - Puerpério | maior é melhor | por 1.000 habitantes |
| `razao_desfecho_materno_grave` | Razão de Desfecho Materno Grave | Grupo 4 - Puerpério | menor é melhor | por 100.000 nascidos vivos |
| `razao_mortalidade_materna` | Razão de Mortalidade Materna | Grupo 4 - Puerpério | menor é melhor | por 100.000 nascidos vivos |
| `proporcao_obitos_maternos_evitaveis` | Proporção de Óbitos Maternos Evitáveis | Grupo 4 - Puerpério | menor é melhor | % (dos óbitos maternos) |
| `coef_mortalidade_perinatal` | Coeficiente de Mortalidade Perinatal | Grupo 5 - Perinatal | menor é melhor | por 1.000 nascimentos totais |
| `indicador_composto` | Indicador Composto | Indicador Composto | menor é melhor | escore 0-100 (sem unidade física) |

\* Tem quebra por categoria (mais de uma linha por município/ano — ver
[04-pipeline-de-dados.md §4.7](04-pipeline-de-dados.md#47-exportando-para-a-aba-indicadores-react)
e o item correspondente em
[09-roadmap-e-perguntas-abertas.md](09-roadmap-e-perguntas-abertas.md)).

(fonte: `data/processed/dim_indicadores.parquet`, gerado pelo manifesto em
[scripts/build_dataset.py](../scripts/build_dataset.py) — mantenha esta
tabela sincronizada quando o manifesto mudar.)

## 3.2 Os 5 grupos da proposta

| Grupo | Descrição |
|---|---|
| Grupo 1 — Pré-natal | Estrutura, processos e desfechos relacionados ao acompanhamento da gestante antes do parto: cobertura de unidades básicas, detecção de sífilis/HIV, adequação do pré-natal, óbitos fetais. |
| Grupo 2 — Parto | Como e por quem o parto é assistido: proporção de cesáreas, disponibilidade de enfermeiros obstétricos, profissional que assistiu o parto vaginal. |
| Grupo 3 — Neonatal | Desfechos do recém-nascido do nascimento até os 27 dias de vida: Apgar, asfixia perinatal, mortalidade neonatal (geral e por causa), infecções sistêmicas, sífilis congênita, transmissão vertical de HIV, baixo peso, leitos neonatais, natalidade. |
| Grupo 4 — Puerpério | Estrutura e desfechos maternos após o parto: leitos obstétricos/UTI adulto, near miss materno (desfecho materno grave), mortalidade materna e óbitos maternos evitáveis. |
| Grupo 5 — Perinatal | Recorte que combina óbitos fetais tardios e neonatais precoces num único coeficiente (mortalidade perinatal), a métrica mais comparável internacionalmente (OMS). |

## 3.3 Ficha por indicador (preencher uma por indicador)

Copiem este bloco para cada indicador do catálogo — inclusive os 26 já
carregados, que agora têm ficha preenchida abaixo (§3.3.1).

### `[chave_do_indicador]`

- **Nome amigável**:
- **Grupo**:
- **O que mede** (definição em 1–2 frases, em linguagem não técnica):
- **Fórmula** (numerador / denominador / multiplicador, explícita):
- **Unidade** (ex.: `%`, `por 1.000 nascidos vivos`, `por 100.000
  habitantes`) — verificar empiricamente contra o dado real quando
  possível (ver método abaixo), não copiar só da planilha de
  planejamento, que tem itens desatualizados (ver §3.6).
- **Fonte de dados original** (sistema DataSUS: SINASC, SIM, CNES, etc.):
- **Direção** (`maior_melhor` / `menor_melhor`) e por quê:
- **Limitações conhecidas** (ex.: subnotificação, municípios pequenos com
  denominador raro, supressão de dado por sigilo estatístico):
- **Referência bibliográfica**:
- **Responsável pela validação metodológica**:

> Dica: se o indicador tem `numerador`/`denominador` no
> `fato_indicadores.parquet`, a agregação acima do município já usa média
> ponderada automaticamente (ver
> [02-arquitetura.md §2.3](02-arquitetura.md#23-modelo-de-dados-star-schema)).
> Se não tiver, registrem aqui como a agregação deve ser feita.

> **Como verificar a unidade empiricamente**: para qualquer indicador com
> numerador/denominador, `utils/data.py::_fator_escala` já calcula o
> multiplicador real a partir do dado (mediana de
> `valor * denominador / numerador` entre os municípios). Rodar algo como:
> ```python
> from utils.data import load_fato_indicadores
> df = load_fato_indicadores()
> d = df[df["indicador_chave"] == "<chave>"]
> v = d[(d["numerador"] > 0) & (d["denominador"] > 0)]
> (v["valor"] * v["denominador"] / v["numerador"]).describe()
> ```
> Um resultado limpo (ex.: mediana 1000, quartis colados nela) confirma
> a unidade; um resultado disperso (ex.: `taxa_leitos_uti_adulto` abaixo)
> é sinal de que a unidade não está bem definida e precisa de atenção da
> equipe antes de documentar com confiança.

### 3.3.1 Fichas preenchidas — os 26 indicadores carregados

As fichas abaixo foram montadas cruzando três fontes: a planilha de
planejamento da equipe (`Lista_Final_Indicadores(Planilha1).csv`, na raiz
do repo — está em `cp1252`, não UTF-8, e tem 2 linhas em branco antes do
cabeçalho), as notas de implementação em `detalhamento_indicadores.md`
(raiz — mais técnicas, com filtros SIGTAP/CID e limitações encontradas na
prática) e o `MANIFESTO` de `scripts/build_dataset.py` (a fonte da
verdade de qual coluna do Excel é numerador/denominador). A Unidade foi
conferida contra o dado real (ver método acima) sempre que possível.

#### `cobertura_estabelecimentos_saude`
- **O que mede**: Densidade de unidades básicas de saúde do SUS disponíveis para atenção primária, em relação à população.
- **Fórmula**: Nº de UBS (CNES, `TP_UNID='02'`) / Nº total de habitantes × 10.000
- **Unidade**: por 10.000 habitantes (verificado empiricamente — mediana ~10.000, desvio baixo)
- **Fonte**: CNES - Estabelecimentos (numerador) + IBGE - População (denominador)
- **Direção**: maior é melhor (mais UBS por habitante = melhor acesso)
- **Limitações**: granularidade mínima é município; 2023-2024 usam o Censo 2022 (projeção); um estabelecimento pode mudar de tipo ao longo do tempo
- **Referência**: Migoto, M. T., Oliveira, R. P., & Freire, M. H. (2022). Validação de indicadores para monitoramento da qualidade do pré-natal. Escola Anna Nery, 26, e20210262.

#### `taxa_hiv_gestantes`
- **O que mede**: Notificações de gestantes com HIV positivo, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de notificações SINAN de HIV em gestante / Nº de nascidos vivos (SINASC) × 1.000
- **Unidade**: por 1.000 nascidos vivos
- **Fonte**: SINAN (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: dado de notificação compulsória (SINAN), sujeito a subnotificação
- **Referência**: MS — Boletim Epidemiológico HIV/Aids 2022.

#### `coef_obitos_fetais`
- **O que mede**: Óbitos fetais (a partir da 22ª semana de gestação, ou ≥500g, ou ≥25cm) em relação ao total de nascimentos.
- **Fórmula**: Nº de óbitos fetais (SIM-DOFET, ≥22 sem.) / (Nº de NV + óbitos fetais ≥22 sem.) × 1.000
- **Unidade**: por 1.000 nascimentos totais
- **Fonte**: SIM-DOFET (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: depende da qualidade do preenchimento da idade gestacional na Declaração de Óbito; subnotificação em regiões com sistemas de informação frágeis
- **Referência**: MS, Manual de Vigilância do Óbito Infantil e Fetal, 2ª ed.

#### `proporcao_pre_natal_adequado`
- **O que mede**: Gestantes com 6 ou mais consultas de pré-natal **e** início do acompanhamento até a 12ª semana de gestação.
- **Fórmula**: Nº de gestantes com pré-natal adequado / Nº total de nascidos vivos (SINASC) × 100
- **Unidade**: %
- **Fonte**: SINASC (numerador e denominador — a planilha de planejamento previa "gestantes acompanhadas" como denominador; a implementação usa nascidos vivos do SINASC, alternativa que a própria equipe já havia registrado como válida)
- **Direção**: maior é melhor
- **Limitações**: sem dado de nº de consultas/início do pré-natal em 2008-2009 (proporção artificialmente ~0% nesses dois anos, não um valor real)
- **Referência**: MS — Portaria SAS/MS n° 650/2011.

#### `taxa_deteccao_sifilis_gestantes`
- **O que mede**: Casos confirmados de sífilis em gestantes, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de casos SINAN (`TPCONFIRMA=1`, teste treponêmico) / Nº de NV (SINASC) × 100
- **Unidade**: % (verificado empiricamente — mediana exatamente 100; ver §3.6, a planilha de planejamento diz "x 1.000")
- **Fonte**: SINAN (numerador) + SINASC (denominador)
- **Direção**: menor é melhor — mas com ambiguidade conhecida: alta detecção pode refletir tanto mais casos quanto melhor rastreamento
- **Limitações**: subnotificação; interpretação da direção precisa de cautela (ver acima)
- **Referência**: MS, Boletim Epidemiológico Sífilis 2023.

#### `proporcao_enfermeiros_obstetricos`
- **O que mede**: Disponibilidade de enfermeiros obstétricos (CBO `223545`) em relação à população.
- **Fórmula**: Nº de enfermeiros obstétricos (CNES) / Nº total de habitantes × 10.000
- **Unidade**: por 10.000 habitantes (verificado empiricamente; bate com o valor nacional citado em `detalhamento_indicadores.md` — 0,17/10.000 hab. em 2022 — e diverge da planilha de planejamento, que diz "x 100"; ver §3.6)
- **Fonte**: CNES - Profissionais (numerador) + IBGE - População (denominador)
- **Direção**: maior é melhor
- **Limitações**: 2023-2024 usam o Censo 2022; granularidade mínima é município
- **Referência**: Migoto, Oliveira & Freire (2022), Escola Anna Nery.

#### `proporcao_cesareas`
- **O que mede**: Partos realizados por cesárea em relação ao total de partos (vaginal + cesáreo).
- **Fórmula**: Nº total de partos cesáreos / Nº total de partos × 100
- **Unidade**: %
- **Fonte**: SINASC
- **Direção**: neutro — a OMS recomenda faixa de 10-15%; nem "quanto menor melhor" nem "quanto maior melhor" fazem sentido isoladamente (o Brasil está bem acima da faixa recomendada: ~55% no período 2008-2023)
- **Limitações**: 53.974 partos sem informação da via de parto foram excluídos
- **Referência**: ANS, Fichas de Indicadores Painel Parto.

#### `proporcao_parto_vaginal_profissional` (multi-categoria)
- **O que mede**: Distribuição percentual de partos vaginais por categoria de profissional que assistiu (Médico, Enfermeira-Obstetriz, Parteira, Outros, Ign/NI).
- **Fórmula**: Nº de partos por categoria de profissional / Nº total de partos vaginais assistidos × 100
- **Unidade**: % (por categoria — as categorias somam ~100% em qualquer recorte, ver nota em `IndicadorCategoryChart`)
- **Fonte**: SINASC (categoria só identificada a partir de 2013)
- **Direção**: maior é melhor **só faz sentido lida junto com a categoria** (mais "Enfermeira-Obstetriz" é bom; mais "Ign/NI" não é)
- **Limitações**: categoria do profissional só existe no SINASC a partir de 2013
- **Referência**: ANS, Fichas de Indicadores Painel Parto.

#### `apgar_adequado`
- **O que mede**: Nascidos vivos com índice de Apgar **adequado** (≥7) no 1º e 5º minuto de vida.
- **Fórmula**: Nº de recém-nascidos com Apgar ≥7 no 1º/5º min / Nº total de nascidos vivos × 100
- **Unidade**: % (verificado empiricamente — mediana exatamente 100)
- **Fonte**: SINASC
- **Direção**: maior é melhor
- **Limitações**: ver §3.6 — a planilha de planejamento descreve o numerador como "Apgar **< 7**" (o oposto do que o nome/direção sugerem); a implementação conta Apgar adequado, confirmado tanto pela direção `maior_melhor` quanto pelo valor nacional citado em `detalhamento_indicadores.md` (84,6% — típico de "proporção de bons resultados", não de complicação)
- **Referência**: Indicadores estratégicos para a Rede Cegonha.

#### `proporcao_asfixia_perinatal`
- **O que mede**: Óbitos (neonatais e fetais) por asfixia perinatal (CID-10 P21), em relação ao total de nascimentos.
- **Fórmula**: Nº de óbitos por asfixia perinatal (SIM-DO/DOFET) / Nº de nascimentos totais (NV + óbitos fetais ≥22 sem.) × 100
- **Unidade**: % (verificado empiricamente — mediana exatamente 100; ver §3.6, a planilha de planejamento diz "x 1.000")
- **Fonte**: SIM-DO e SIM-DOFET (numerador) + SINASC e SIM-DOFET (denominador)
- **Direção**: menor é melhor
- **Limitações**: depende da qualidade do CID-10 preenchido na Declaração de Óbito
- **Referência**: Ficha de Qualificação do Indicador — Índice de Asfixia Perinatal (SES-BA).

#### `coef_mortalidade_neonatal`
- **O que mede**: Óbitos de recém-nascidos até 27 dias de vida, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de óbitos neonatais (SIM-DOINF) / Nº de nascidos vivos (SINASC) × 1.000
- **Unidade**: por 1.000 nascidos vivos
- **Fonte**: SIM-DOINF (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: idade no óbito calculada pela diferença entre data de óbito e data de nascimento (sem hora), pode incluir imprecisão de até 1 dia
- **Referência**: Indicadores estratégicos para a Rede Cegonha.

#### `coef_obito_neonatal_causa` (multi-categoria)
- **O que mede**: Óbitos neonatais por grande grupo de causa (evitável / não claramente evitável / mal definida), em relação ao total de nascidos vivos.
- **Fórmula**: Nº de óbitos neonatais por categoria de causa (`Agrupamento_Nivel_1`) / Nº de nascidos vivos × 1.000
- **Unidade**: por 1.000 nascidos vivos (por categoria)
- **Fonte**: SIM-DO (numerador, causa classificada pela lista de "Causas de Mortes Evitáveis em Menores de 5 Anos" do MS) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: ~25% da base não foi classificada por ter CID fora da lista oficial de causas evitáveis; idade calculada sem considerar hora do óbito
- **Referência**: Baptista & Poton (2021), Rev Bras Saúde Matern Infant.

#### `proporcao_hiv_vertical`
- **O que mede**: Nascidos vivos com diagnóstico de HIV por transmissão vertical, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de NV com HIV por transmissão vertical (SINAN) / Nº total de NV × 100
- **Unidade**: % (verificado empiricamente — mediana ~100, com dispersão maior por ser indicador de baixa contagem; `formato` no código não tem `%`, só inconsistência de exibição, não de cálculo — ver §3.6)
- **Fonte**: SINAN (AIDA/AIDC, filtro de transmissão perinatal) + SINASC
- **Direção**: menor é melhor
- **Limitações**: dados semelhantes ao TabNet para o filtro de transmissão vertical, mas com casos de idade acima de 1 ano; não bate com o painel oficial `indicadorestransmissaovertical.aids.gov.br`
- **Referência**: Migoto, Oliveira & Freire (2022), Escola Anna Nery.

#### `taxa_infeccoes_sistemicas_neonatais`
- **O que mede**: Internações por infecção sistêmica no período neonatal (até 3 dias de vida), em relação ao total de nascidos vivos.
- **Fórmula**: Nº de internados por infecção sistêmica neonatal (SIH, CID-10 conforme Quadro 1 de `detalhamento_indicadores.md`) / Nº de nascidos vivos × 1.000
- **Unidade**: por 1.000 nascidos vivos (apesar do nome "proporção" no catálogo — é um coeficiente, não percentual)
- **Fonte**: SIH-SUS (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: 10,4% dos registros hospitalares não foram relacionáveis via record linkage; CIDs não foram filtrados por especificidade na base bruta
- **Referência**: Proqualis/Fiocruz — Taxa de Infecção Neonatal Precoce; ANVISA — Critérios Diagnósticos de IRAS Neonatologia.

#### `taxa_baixo_peso_nascer`
- **O que mede**: Nascidos vivos com menos de 2.500g ao nascer.
- **Fórmula**: Nº de NV com peso < 2.500g / Nº total de NV × 100
- **Unidade**: %
- **Fonte**: SINASC
- **Direção**: menor é melhor
- **Limitações**: —
- **Referência**: ANS, Fichas de Indicadores Painel Parto.

#### `taxa_leitos_neonatais`
- **O que mede**: Disponibilidade de leitos de UTI/UCI Neonatal (CNES), em relação ao total de nascidos vivos.
- **Fórmula**: Nº de leitos neonatais (CNES, códigos de leito 41/63/65/80/81/82/92/93) / Nº de nascidos vivos × 1.000
- **Unidade**: por 1.000 nascidos vivos
- **Fonte**: CNES - Leitos (numerador) + SINASC (denominador)
- **Direção**: maior é melhor
- **Limitações**: um mesmo leito é contabilizado mais de uma vez ao longo do tempo (grão mensal reduzido para anual); municípios sem hospital com leito neonatal ficam com 0 legítimo, não dado ausente
- **Referência**: Documento de orientação de indicadores de saúde materna e infantil (SES-MS).

#### `taxa_incidencia_sifilis_congenita`
- **O que mede**: Casos novos confirmados de sífilis congênita em menores de 1 ano, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de casos novos de sífilis congênita (SINAN) / Nº de nascidos vivos (SINASC) × 1.000
- **Unidade**: por 1.000 nascidos vivos
- **Fonte**: SINAN (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: SINAN não tem tipo de parto, peso ao nascer, semanas gestacionais
- **Referência**: Indicadores estratégicos para a Rede Cegonha.

#### `taxa_bruta_natalidade`
- **O que mede**: Nascidos vivos em relação à população total residente.
- **Fórmula**: Nº de nascidos vivos residentes / População total residente × 1.000
- **Unidade**: por 1.000 habitantes
- **Fonte**: SINASC (numerador) + IBGE (denominador)
- **Direção**: neutro — reflete fecundidade e estrutura etária da população, não é "melhor" ou "pior"
- **Limitações**: —
- **Referência**: RIPSA, Matriz de Indicadores.

#### `proporcao_obitos_neonatais_24h`
- **O que mede**: Óbitos de recém-nascidos nas primeiras 24h de vida, em relação ao total de nascidos vivos.
- **Fórmula**: Nº de óbitos de RN nas primeiras 24h (SIM-DOINF) / Nº de nascidos vivos × 1.000
- **Unidade**: por 1.000 nascidos vivos (apesar do nome "proporção" no catálogo — é um coeficiente)
- **Fonte**: SIM-DOINF (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: identificação das 24h por subtração de datas (sem horário) — pode incluir óbitos ligeiramente acima de 24h
- **Referência**: Indicadores estratégicos para a Rede Cegonha.

#### `taxa_leitos_uti_adulto`
- **O que mede**: Hoje, o **número absoluto** de leitos de UTI adulto (CNES) — apesar do nome, **não é uma taxa/razão por população**. Conferido diretamente no dado: `valor == numerador` em 100% das 89.093 linhas de `fato_indicadores` para este indicador (`denominador`, que é população, existe na base mas não é usado no cálculo de `valor`).
- **Fórmula (implementada hoje)**: Nº de leitos de UTI adulto (CNES), sem divisão por população
- **Unidade**: número absoluto de leitos — **não** "por 1.000" nem qualquer outro múltiplo (ver §3.6)
- **Fonte**: CNES - Leitos (numerador) + IBGE - População (denominador presente na base, mas não usado em `valor`; coluna de origem chamada `popoulation`, com erro de digitação)
- **Direção**: maior é melhor
- **Limitações**: um mesmo leito é contabilizado mais de uma vez ao longo do tempo; ver §3.6 — `detalhamento_indicadores.md` descreve uma metodologia bem diferente para um indicador de nome parecido ("Número de leitos de UTI adulto necessários para a atenção materna" = 6% dos leitos obstétricos estimados), que não parece ser o que está implementado hoje
- **Referência**: Documento de orientação de indicadores de saúde materna e infantil (SES-MS).

#### `taxa_leitos_obstetricos`
- **O que mede**: Disponibilidade de leitos de Obstetrícia Cirúrgica/Clínica (CNES), em relação à população.
- **Fórmula**: Nº de leitos obstétricos (CNES, códigos 10/43) / População total × 1.000
- **Unidade**: por 1.000 habitantes (verificado empiricamente — mediana muito próxima de 1000, baixíssima dispersão; parâmetro de referência da Rede Cegonha é 0,28/1.000 hab. usuários SUS)
- **Fonte**: CNES - Leitos (numerador) + IBGE - População (denominador)
- **Direção**: maior é melhor
- **Limitações**: um mesmo leito é contabilizado mais de uma vez ao longo do tempo
- **Referência**: Portaria SAS/MS nº 650/2011.

#### `razao_desfecho_materno_grave`
- **O que mede**: Mulheres com condições ameaçadoras à vida (near miss materno), em relação ao total de nascidos vivos.
- **Fórmula**: Nº de mulheres com near miss materno (SIH-SUS, CIDs/procedimentos SIGTAP conforme referência) / Nº de nascidos vivos × 100.000
- **Unidade**: por 100.000 nascidos vivos (verificado empiricamente — mediana exatamente 100.000; a planilha de planejamento diz "x 1.000", ver §3.6)
- **Fonte**: SIH-SUS (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: numerador contabiliza internações, não mulheres — uma mesma mulher pode ser internada mais de uma vez no mesmo ciclo gestacional
- **Referência**: "Sistema de Informações Hospitalares do SUS (SIH-SUS): uma avaliação do seu desempenho para a identificação do near miss materno".

#### `razao_mortalidade_materna`
- **O que mede**: Mortes maternas (relacionadas/agravadas pela gestação, parto ou puerpério até o 42º dia), em relação ao total de nascidos vivos.
- **Fórmula**: Nº de mortes maternas (SIM-DO) / Nº de nascidos vivos (SINASC) × 100.000
- **Unidade**: por 100.000 nascidos vivos
- **Fonte**: SIM-DO (numerador) + SINASC (denominador)
- **Direção**: menor é melhor
- **Limitações**: campos como peso, semana gestacional e tipo de parto têm >90% de não informado na base de mortalidade e não puderam ser usados para estratificação
- **Referência**: RIPSA — Qualificação de Indicadores.

#### `proporcao_obitos_maternos_evitaveis`
- **O que mede**: Óbitos maternos com causa evitável (CID-10 O00-O26, O29-O99), em relação ao **total de óbitos maternos** (não ao total de nascidos vivos).
- **Fórmula**: Nº de óbitos maternos evitáveis / Nº total de óbitos maternos no mesmo período × 100
- **Unidade**: % — atenção: a população-base é óbitos maternos, não nascidos vivos, diferente da maioria dos outros indicadores do Grupo 4
- **Fonte**: SIM-DO
- **Direção**: menor é melhor
- **Limitações**: mesma limitação de campos pouco preenchidos citada em `razao_mortalidade_materna`
- **Referência**: de Faria et al. (2012), Rev Med Minas Gerais.

#### `coef_mortalidade_perinatal`
- **O que mede**: Óbitos perinatais (perdas fetais a partir da 28ª semana + óbitos neonatais até 7 dias), em relação ao total de nascimentos.
- **Fórmula**: Nº de óbitos perinatais (SIM-DOINF/DOFET, ≥28 sem.) / Nº de nascimentos totais (perdas fetais tardias + NV) × 1.000
- **Unidade**: por 1.000 nascimentos totais
- **Fonte**: SIM-DOINF e SIM-DOFET (numerador) + SINASC e SIM-DOFET (denominador)
- **Direção**: menor é melhor
- **Limitações**: depende da qualidade do preenchimento de idade gestacional/data de óbito; usa local de residência da mãe, não o local de ocorrência do óbito
- **Referência**: RIPSA — Qualificação de Indicadores; WHO — Stillbirth.

#### `indicador_composto`
- **O que mede**: Índice sintético que combina os indicadores dos 5 grupos num único escore por município/ano, para permitir um ranking geral (usado na aba Ranking e no ranking de Mapas municipais).
- **Fórmula**: calculado fora do `MANIFESTO` padrão (sem numerador/denominador próprio — já vem pronto do arquivo `indicador_composto_munic_ano.xlsx`); agregação acima do município usa média ponderada por nascidos vivos, não recálculo de taxa (ver `utils/data.py::calcular_taxa_agregada`)
- **Unidade**: escore de 0 a 100 (sem unidade física — quanto menor, melhor)
- **Fonte**: derivado, não vem de um sistema DataSUS único
- **Direção**: menor é melhor
- **Limitações**: metodologia de composição (pesos por grupo/indicador) **não está documentada aqui ainda** — `[A DEFINIR]`, item para a equipe detalhar
- **Referência**: —

## 3.4 Como adicionar um indicador novo

Fluxo operacional (o "dia a dia" de quem cuida dos dados) — hoje descrito
tanto no [README.md](../README.md#3-como-adicionar-um-indicador-novo-o-fluxo-do-dia-a-dia)
quanto no cabeçalho de
[scripts/build_dataset.py](../scripts/build_dataset.py). Resumo:

1. Copiar o `.xlsx` do indicador para `data/raw/` (no grupo correspondente).
2. Cadastrar o indicador (catálogo/manifesto — ver
   [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)
   para saber qual dos dois pipelines está ativo), incluindo o campo
   `unidade` no `MANIFESTO` (ver `scripts/build_dataset.py`).
3. Rodar o script de importação/build correspondente.
4. Preencher a ficha da seção 3.3 acima **antes** de considerar o
   indicador pronto para publicação — dado sem metodologia documentada
   não deveria ir para produção. Conferir a unidade empiricamente (método
   descrito em §3.3) antes de documentá-la.

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

## 3.6 Pontos a confirmar com a equipe

Encontrados cruzando a planilha de planejamento
(`Lista_Final_Indicadores(Planilha1).csv`), `detalhamento_indicadores.md`,
o `MANIFESTO` do pipeline e o dado real processado. Documentados aqui
para a equipe confirmar — **nenhum cálculo foi alterado** só por causa
desta análise.

1. **`apgar_adequado`**: a planilha de planejamento descreve o numerador
   como "recém-nascidos com Apgar **< 7**" (casos inadequados), mas a
   chave/nome e a direção (`maior_melhor`) indicam o oposto. A
   implementação conta Apgar **adequado** (≥7) — confirmado tanto pela
   direção quanto pelo valor nacional citado em
   `detalhamento_indicadores.md` (84,6%, típico de "proporção de bons
   resultados"). Aparenta ser só um texto desatualizado na planilha de
   planejamento, não um bug no pipeline — mas vale confirmação formal.
2. **`cobertura_estabelecimentos_saude`** e
   **`proporcao_enfermeiros_obstetricos`**: a planilha de planejamento
   descreve ambos com multiplicador "x100" (por 100 habitantes), mas o
   dado real processado bate, de forma muito consistente (baixíssima
   dispersão), com **x10.000** (por 10.000 habitantes) — o segundo já é
   confirmado por `detalhamento_indicadores.md` (0,17/10.000 hab.
   nacional). Provavelmente a planilha de planejamento ficou desatualizada
   quando a escala foi ajustada na implementação.
3. **`taxa_deteccao_sifilis_gestantes`** e
   **`proporcao_asfixia_perinatal`**: a planilha de planejamento diz "x
   1.000", mas o dado real bate exatamente com **x100** (percentual). O
   `formato` já reflete isso corretamente (sem `%`, mas na escala 0-100).
4. **`razao_desfecho_materno_grave`**: a planilha de planejamento diz "x
   1.000", mas o dado real bate exatamente com **x100.000**.
5. **`proporcao_hiv_vertical`**: o cálculo bate com a planilha de
   planejamento (x100, percentual), mas o campo `formato` no código
   (`"{:.2f}"`) não tem `%`, diferente de outros indicadores x100 que têm
   (`"{:.1f}%"`) — inconsistência só de exibição, não de cálculo.
6. **`taxa_leitos_uti_adulto`**: confirmado no dado — `valor == numerador`
   em 100% das linhas (89.093/89.093). Ou seja, apesar do nome "taxa", o
   que está publicado hoje é o **número absoluto de leitos**, não dividido
   pela população. `detalhamento_indicadores.md` descreve, sob um nome
   parecido mas não idêntico ("Número de leitos de UTI adulto necessários
   para a atenção materna"), uma metodologia bem diferente e mais
   elaborada (6% dos leitos obstétricos estimados). Não ficou claro se o
   indicador hoje publicado deveria ter sido essa versão ponderada, ou uma
   razão simples leitos/população que não chegou a ser aplicada — **a
   equipe precisa decidir se recalcula este indicador como taxa de fato**
   antes de tratá-lo como comparável entre municípios de tamanhos
   diferentes (hoje ele favorece municípios grandes só por terem mais
   leitos em número absoluto).
