# 9. Roadmap e perguntas abertas

## 9.1 Próximos passos (do README original)

- [ ] Trazer os 40 indicadores restantes (repetir o fluxo de
      [03-catalogo-e-metodologia-indicadores.md §3.4](03-catalogo-e-metodologia-indicadores.md#34-como-adicionar-um-indicador-novo)
      para cada um, com ficha metodológica preenchida)
- [ ] Mapa por município (instruções na página "Mapa" do site, dentro do
      expansor "Como evoluir para o mapa municipal")
- [ ] Tooltips explicando a metodologia de cálculo de cada indicador
      (usar a coluna `descricao` do catálogo com `help=` nos widgets)
- [ ] Filtro por "região de saúde" (precisa de tabela de-para
      código do município → região de saúde)
- [ ] Geração automática de relatório em PDF/Word por município
- [ ] Comparação por perfil semelhante (porte populacional, IDH etc.) —
      precisa de base auxiliar com essas variáveis por município
- [ ] Página "Sobre" com metodologia do QualiPréNeo e créditos
      institucionais

## 9.2 Decisões pendentes identificadas nesta documentação

Cada uma aponta para a seção correspondente — resolvam em conjunto e
apaguem da lista quando decidido (movendo a decisão final para o lugar
certo: seção específica ou [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md)
se for uma decisão técnica).

- [ ] Qual pipeline de dados é o "oficial" hoje e quando aposentar o
      legado — [02-arquitetura.md §2.4](02-arquitetura.md#24-dois-pipelines-convivendo-atenção)
- [ ] Futuro do frontend experimental React (`teste_not_streamlit/`) —
      [02-arquitetura.md §2.5](02-arquitetura.md#25-frontend-experimental-teste_not_streamlit)
- [ ] Os 2 municípios sem `cod_mapa` — identificar e corrigir —
      [03-catalogo-e-metodologia-indicadores.md §3.5](03-catalogo-e-metodologia-indicadores.md#35-regras-gerais-de-qualidade-de-dado)
- [ ] Repositório git: onde hospedar, público ou privado, convenção de
      branches/commits — [05-guia-de-contribuicao.md §5.2](05-guia-de-contribuicao.md#52-controle-de-versão)
- [ ] Regra de validação institucional antes de publicar um indicador —
      [06-deploy-e-operacao.md §6.2](06-deploy-e-operacao.md#62-política-de-dados-públicos-x-dados-não-validados)
- [ ] Critério de soma x média para indicadores com consolidação
      mensal→anual (ex.: leitos CNES) —
      [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md#a-definir--decisões-ainda-não-registradas)

## 9.3 Ideias não priorizadas

`[A DEFINIR]` — espaço livre para ideias da equipe que ainda não viraram
tarefa formal.
