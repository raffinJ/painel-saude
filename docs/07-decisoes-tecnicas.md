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
- **Decisão**: o pipeline de exportação (`scripts/export_ranking_frontend.py`,
  que alimenta o frontend React) lê os `.parquet` (colunar, rápido para
  agregação em pandas, ~14,5 MB). O SQLite é mantido pensando numa futura
  API separada, não é consumido pelo frontend atual.
- **Alternativas consideradas**: usar só SQLite (descartado por
  performance inferior em memória para agregação em pandas).
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

## ADR-004 — Frontend oficial passa a ser o React, Streamlit fica arquivado como protótipo

- **Contexto**: o projeto tinha dois frontends em paralelo — o site
  Streamlit original (`app.py` + `pages/`, com 4 páginas e dados reais) e
  um protótipo React em `teste_not_streamlit/` (via Lovable), que na
  época tinha só a página de Ranking, majoritariamente com dados
  mockados. Isso estava registrado como pergunta em aberto (ver histórico
  deste documento e do roadmap).
- **Decisão**: o time optou por seguir com o **React como frontend
  oficial**. O código Streamlit foi movido para
  `_legacy_streamlit/` (arquivado, não apagado) para servir de referência
  enquanto as páginas que faltam (Buscar Município, Comparar, Mapa, e a
  própria página de Ranking com dados reais em vez de mockados) são
  portadas para o React.
- **Alternativas consideradas**: apagar o código Streamlit imediatamente
  (descartada — o React ainda não tem paridade de funcionalidades, então
  o Streamlit continua útil como referência de UX/lógica até a migração
  terminar); manter os dois frontends ativos indefinidamente (descartada
  — duplicaria manutenção sem necessidade, já que a decisão de qual é o
  site oficial já foi tomada).
- **Consequências**:
  - `utils/data.py` (camada de dados) deixou de depender do Streamlit
    (`@st.cache_data` → `functools.lru_cache`) para poder ser usado só
    pelo pipeline de exportação, sem exigir Streamlit instalado.
  - `requirements.txt` na raiz do projeto não inclui mais `streamlit`
    nem `plotly` — essas dependências ficaram isoladas em
    `_legacy_streamlit/requirements.txt`.
  - Enquanto durar a migração, o `_legacy_streamlit/` pode ficar
    temporariamente com dados mais "à frente" que o React nas páginas
    ainda não portadas — ver checklist de portabilidade em
    [09-roadmap-e-perguntas-abertas.md](09-roadmap-e-perguntas-abertas.md).

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
