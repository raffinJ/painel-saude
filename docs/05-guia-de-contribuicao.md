# 5. Guia de contribuição

## 5.1 Ambiente de desenvolvimento

Ver [README.md §1](../README.md#1-rodando-o-site-frontend-react) (frontend)
e [README.md §2](../README.md#2-rodando-o-pipeline-de-dados-python)
(pipeline de dados) para o passo a passo de instalação. Resumo do dia a
dia (depois do primeiro setup):

```bash
# Frontend (o que a maioria do time vai rodar no dia a dia)
cd web
npm run dev

# Pipeline de dados (só quando um indicador novo entra ou os dados mudam)
.venv\Scripts\activate            # Windows, a partir da raiz do projeto
python scripts/build_dataset.py
python scripts/export_ranking_frontend.py
```

## 5.2 Controle de versão

O projeto já é um repositório git local. Decisões ainda pendentes da
equipe antes de publicar em algum lugar (ver
[README.md §5](../README.md#5-colocando-no-ar)):

- **Hospedagem**: GitHub (organização/conta de quem?), repositório
  privado ou público?
- **Convenção de branches**: ex. `main` protegida + branches por
  feature/pessoa (`nome/indicador-cesarea`)?
- **Convenção de commits**: mensagens em português, formato livre ou
  [Conventional Commits](https://www.conventionalcommits.org/)?
- **Revisão de código**: todo mundo revisa tudo, ou há um responsável
  técnico que aprova antes do merge em `main`?

**Atenção com `web/`**: essa pasta está conectada ao
Lovable — **não fazer force-push nem reescrever histórico** dessa branch
(ver `web/AGENTS.md`), senão o histórico no editor do
Lovable quebra. Isso vale mesmo depois de publicar no GitHub.

## 5.3 Padrões de código

### Frontend (`web/`, React + TypeScript)

- Segue a estrutura padrão do TanStack Start: páginas em `src/routes/`,
  componentes reutilizáveis em `src/components/`, componentes de UI base
  (shadcn/Radix) em `src/components/ui/` — evitar editar os de `ui/`
  diretamente; compor por cima deles.
- Tailwind CSS para estilo; utilitários em `src/lib/utils.ts`.
- `npm run lint` / `npm run format` (ESLint + Prettier) antes de commitar.
- Texto visível ao usuário em **português**; nomes de componentes/variáveis
  podem ficar em inglês (padrão do ecossistema React), mantendo o que já
  existe no projeto.
- Alterações feitas por aqui sincronizam com o editor do Lovable — commits
  com mensagens claras ajudam a equipe a entender o que mudou também por
  lá.

### Pipeline de dados (Python, raiz do projeto)

- Nomes de variáveis, funções e comentários em **português**.
- Funções de dados centralizadas em `utils/data.py`, reutilizadas por
  `scripts/export_ranking_frontend.py` (evitar duplicar lógica de
  carregamento/agregação em novos scripts).
- Cache de leitura de dados com `functools.lru_cache` (não usar
  `@st.cache_data` — essa camada não depende mais de Streamlit, ver
  [ADR-004](07-decisoes-tecnicas.md#adr-004--frontend-oficial-passa-a-ser-o-react-streamlit-fica-arquivado-como-protótipo)).

### Protótipo arquivado (`_legacy_streamlit/`)

Não é mais alvo de desenvolvimento ativo — mudanças ali devem se limitar
a manter o código rodável como referência (ver
[_legacy_streamlit/README.md](../_legacy_streamlit/README.md)), não a
adicionar funcionalidades novas. Funcionalidades novas vão direto para o
React.

`[A DEFINIR]` — formatação automática para o Python (black/ruff?), e se
há CI rodando lint/testes antes do merge (para o frontend e/ou pipeline).

## 5.4 Testes

`[A DEFINIR]` — o projeto ainda não tem suíte de testes automatizados.
Decidir, pelo menos:
- Testes mínimos para `utils/data.py` (cálculo de agregação ponderada,
  ranking com valores nulos) — já mencionados como pendência nas
  anotações internas do projeto.
- Como validar manualmente um indicador novo antes de publicar (ver
  checklist em
  [03-catalogo-e-metodologia-indicadores.md §3.4](03-catalogo-e-metodologia-indicadores.md#34-como-adicionar-um-indicador-novo)).
- Testes de componente/e2e para o frontend React (hoje inexistentes).

## 5.5 Dados sensíveis

Planilhas em `data/raw/` e os arquivos gerados em `data/processed/`
**não são versionados** (estão no `.gitignore`, por serem grandes e/ou
não terem sido validados para publicação — ver
[06-deploy-e-operacao.md](06-deploy-e-operacao.md)). O JSON exportado em
`web/public/data/` **é** versionado, porque é o que o
frontend publicado precisa para funcionar — cuidado para só exportar
indicadores já validados para publicação.

## 5.6 Comunicação da equipe

`[A DEFINIR]` — canal principal (WhatsApp, Slack, e-mail?), onde ficam
registradas decisões e onde pedir ajuda quando travar em algo.
