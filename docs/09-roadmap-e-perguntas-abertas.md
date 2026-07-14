# 9. Roadmap e perguntas abertas

## 9.1 Portabilidade: Streamlit (arquivado) → React (oficial)

Decisão tomada em [ADR-004](07-decisoes-tecnicas.md#adr-004--frontend-oficial-passa-a-ser-o-react-streamlit-fica-arquivado-como-protótipo):
o React (`teste_not_streamlit/`) é o site oficial; o Streamlit
(`_legacy_streamlit/`) fica só como referência. Checklist do que ainda
falta portar (ver comparação detalhada em
[02-arquitetura.md §2.5](02-arquitetura.md#25-protótipo-arquivado-_legacy_streamlit)):

- [x] Aba **Indicadores** (`/indicadores`) — escolher qualquer um dos 26
      indicadores e ver Brasil/Região/UF/Município, série histórica, mapa
      por UF, heatmap UF×Ano e tabela com download em CSV. Feito em
      2026-07-14 (ver `scripts/export_indicadores_frontend.py` e
      `src/routes/indicadores.tsx`).
- [ ] **Mapa por município** (hoje o mapa da aba Indicadores é só por UF —
      o Streamlit arquivado tinha a mesma limitação e já documentava o
      caminho para evoluir, ver o expansor "Como evoluir para o mapa
      municipal" em `_legacy_streamlit/pages/4_Mapa.py`: baixar a malha
      municipal do IBGE, simplificar com `mapshaper` como já foi feito
      para a malha de UF em `public/data/geo/brazil-uf.geojson`, e trocar
      `IndicatorUFMap` por um equivalente municipal)
- [ ] **Visualização por categoria** para os indicadores que têm quebra
      por categoria (`proporcao_parto_vaginal_profissional` — por
      profissional que assistiu o parto; `coef_obito_neonatal_causa` —
      por causa do óbito). Hoje `export_indicadores_frontend.py` combina
      as categorias num único valor por ano (soma de
      numerador/denominador) e a aba Indicadores só avisa que isso
      aconteceu (`multi_categoria: true`) — decidir como mostrar a
      quebra (ex.: stacked bar por categoria, seletor de categoria)
- [ ] Ligar a página de Ranking do React aos dados reais exportados
      (`public/data/ranking-composto-2023.json`), substituindo os dados
      mockados de `src/lib/ranking-data.ts`
- [ ] Portar a página **Buscar Município** dedicada (a aba Indicadores já
      permite chegar a um município via drill-down UF→Município, mas não
      tem busca livre por nome como a página do Streamlit arquivado)
- [ ] Portar a página **Comparar** (evolução de vários municípios lado a
      lado — a aba Indicadores hoje mostra só um recorte geográfico por
      vez)
- [ ] Portar a visão de "Início" (evolução nacional/por região de um
      indicador ao longo do tempo — parcialmente coberta pela aba
      Indicadores com Brasil selecionado, mas sem o comparativo por
      região lado a lado que a home do Streamlit tinha)
- [ ] Alinhar o nome do projeto no frontend ("CuidadoPreNeo") com o resto
      da documentação ("QualiPréNeo") — ver
      [02-arquitetura.md §2.6](02-arquitetura.md#26-frontend-react-teste_not_streamlit)
- [ ] Decidir se/quando `_legacy_streamlit/` pode ser removido de vez
      (só depois que os itens acima estiverem cobertos)

## 9.2 Próximos passos (do README original)

- [ ] Trazer os 40 indicadores restantes (repetir o fluxo de
      [03-catalogo-e-metodologia-indicadores.md §3.4](03-catalogo-e-metodologia-indicadores.md#34-como-adicionar-um-indicador-novo)
      para cada um, com ficha metodológica preenchida)
- [ ] Mapa por município (ver checklist 9.1 acima)
- [ ] Tooltips explicando a metodologia de cálculo de cada indicador
- [ ] Filtro por "região de saúde" (precisa de tabela de-para
      código do município → região de saúde)
- [ ] Geração automática de relatório em PDF/Word por município
- [ ] Comparação por perfil semelhante (porte populacional, IDH etc.) —
      precisa de base auxiliar com essas variáveis por município
- [ ] Página "Sobre" com metodologia do QualiPréNeo e créditos
      institucionais

## 9.3 Decisões pendentes identificadas nesta documentação

Cada uma aponta para a seção correspondente — resolvam em conjunto e
apaguem da lista quando decidido (movendo a decisão final para o lugar
certo: seção específica ou [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md)
se for uma decisão técnica).

- [ ] Qual pipeline de dados é o "oficial" hoje e quando aposentar o
      legado — [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)
- [ ] Os 2 municípios sem `cod_mapa` — identificar e corrigir —
      [03-catalogo-e-metodologia-indicadores.md §3.5](03-catalogo-e-metodologia-indicadores.md#35-regras-gerais-de-qualidade-de-dado)
- [ ] Repositório git: onde hospedar (GitHub), público ou privado,
      convenção de branches/commits —
      [05-guia-de-contribuicao.md §5.2](05-guia-de-contribuicao.md#52-controle-de-versão)
      (o repositório local já existe — falta decidir hospedagem remota)
- [ ] Onde publicar o frontend (Lovable / Vercel / Netlify) —
      [06-deploy-e-operacao.md §6.1](06-deploy-e-operacao.md#61-publicação-frontend-react)
- [ ] Regra de validação institucional antes de publicar um indicador —
      [06-deploy-e-operacao.md §6.2](06-deploy-e-operacao.md#62-política-de-dados-públicos-x-dados-não-validados)
- [ ] Critério de soma x média para indicadores com consolidação
      mensal→anual (ex.: leitos CNES) —
      [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md#a-definir--decisões-ainda-não-registradas)

## 9.4 Ideias não priorizadas

`[A DEFINIR]` — espaço livre para ideias da equipe que ainda não viraram
tarefa formal.
