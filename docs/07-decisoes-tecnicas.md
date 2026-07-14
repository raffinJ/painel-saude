# 7. Decisões técnicas (ADR)

Registro curto de decisões arquiteturais relevantes — o quê foi decidido,
por quê, e quais alternativas foram descartadas. Objetivo: quando alguém
novo perguntar "por que fizeram assim?", a resposta está aqui em vez de
precisar reconstruir a conversa.

Formato de cada entrada: **Contexto → Decisão → Alternativas consideradas
→ Consequências**. Numerem sequencialmente (ADR-001, ADR-002, ...) e nunca
editem uma decisão antiga — se ela mudar, criem uma nova entrada que
substitui a anterior e linkem as duas.

---

## ADR-001 — Agregação por média ponderada (numerador/denominador), não média simples das taxas municipais

- **Contexto**: ao mostrar um indicador no nível de UF, região ou Brasil,
  a forma ingênua de agregar seria tirar a média simples das taxas de
  cada município — mas isso dá o mesmo peso a um município de 2 mil
  habitantes e a um de 2 milhões, distorcendo o resultado.
- **Decisão**: quando o indicador tem `numerador` e `denominador`
  preservados no `fato_indicadores`, o valor agregado é
  `soma(numerador) / soma(denominador) × fator_escala`.
- **Alternativas consideradas**: média simples das taxas municipais
  (descartada — matematicamente incorreta para indicadores de saúde
  pública).
- **Consequências**: indicadores sem numerador/denominador explícitos no
  arquivo de origem não podem ser agregados corretamente acima do
  município até que a planilha de origem seja revisada para trazer esses
  campos.

## ADR-002 — Parquet como formato principal, SQLite como réplica secundária

- **Contexto**: o pipeline gera tanto arquivos `.parquet` quanto um banco
  `qualipreneo.db` (SQLite) a partir do mesmo modelo dimensional.
- **Decisão**: o Streamlit lê os `.parquet` (colunar, rápido para
  agregação em pandas, ~14,5 MB). O SQLite é mantido pensando numa futura
  API/frontend separado (ex.: Next.js), não é consumido pelo site atual.
- **Alternativas consideradas**: usar só SQLite (descartado por
  performance inferior em memória para o padrão de leitura do Streamlit).
- **Consequências**: qualquer mudança no modelo de dados precisa
  regenerar os dois formatos; se o SQLite ficar sem uso real por muito
  tempo, avaliar se vale manter a manutenção dele.

## ADR-003 — Municípios sem dado no ano são removidos do ranking, não jogados para as pontas

- **Contexto**: indicadores raros (ex.: notificações pouco frequentes)
  deixam muitos municípios sem valor em determinados anos. Se valores
  nulos entrassem no ranking como zero (ou não fossem filtrados), eles
  apareceriam incorretamente no topo ou no fundo.
- **Decisão**: municípios sem dado no ano/indicador selecionado são
  excluídos do ranking daquele ano, em vez de exibidos com valor nulo.
- **Consequências**: o ranking pode ter poucos municípios em indicadores
  raros — a UI deve deixar claro quantos municípios entraram no cálculo.

---

## `[A DEFINIR]` — decisões ainda não registradas

Sugestões de decisões que já foram tomadas no código mas ainda não têm
ADR formal — vale escrever:

- Convenção `codibge` (6 dígitos) x `cod_mapa` (7 dígitos, com dígito
  verificador) e por que os dois coexistem.
- Por que manter dois pipelines (`build_dataset.py` e
  `importar_indicadores.py`) em paralelo por enquanto, e o critério para
  aposentar o legado (ver
  [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)).
- Critério de tratamento para os arquivos com descarte massivo de linhas
  no pipeline (ex.: dados de leitos neonatais do CNES, que perdem ~98%
  das linhas na consolidação mensal→anual) — soma ou média foi o critério
  usado, e por quê.
