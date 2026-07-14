# 5. Guia de contribuição

## 5.1 Ambiente de desenvolvimento

Ver [README.md §1](../README.md#1-rodando-o-site-no-seu-computador) para
o passo a passo de instalação. Resumo do dia a dia (depois do primeiro
setup):

```bash
.venv\Scripts\activate    # Windows
streamlit run app.py
```

`[A DEFINIR]` — setup do frontend experimental (`teste_not_streamlit/`,
usa `bun`/`npm` — ver `teste_not_streamlit/package.json`), se a equipe for
mexer nele também.

## 5.2 Controle de versão

`[A DEFINIR]` — o projeto ainda precisa ser inicializado como repositório
git e publicado (ver [README.md §4](../README.md#4-colocando-no-ar-github--streamlit-community-cloud-de-graça)).
Decisões pendentes da equipe:

- **Hospedagem**: GitHub (organização/conta de quem?), repositório
  privado ou público?
- **Convenção de branches**: ex. `main` protegida + branches por
  feature/pessoa (`nome/indicador-cesarea`)?
- **Convenção de commits**: mensagens em português, formato livre ou
  [Conventional Commits](https://www.conventionalcommits.org/)?
- **Revisão de código**: todo mundo revisa tudo, ou há um responsável
  técnico que aprova antes do merge em `main`?
- `teste_not_streamlit/` está conectado ao Lovable — **não fazer
  force-push nem reescrever histórico** dessa branch (ver
  `teste_not_streamlit/AGENTS.md`), senão o histórico no editor do
  Lovable quebra.

## 5.3 Padrões de código

Observados no projeto hoje (mantenham a consistência):
- Nomes de variáveis, funções e comentários em **português**.
- Funções de dados centralizadas em `utils/data.py`, reutilizadas por
  todas as páginas (evitar duplicar lógica de carregamento/agregação
  dentro de `pages/*.py`).
- Cache de leitura de dados com `@st.cache_data`.
- Cada página do site é um arquivo em `pages/`, nomeado
  `N_emoji_Nome.py` (a numeração define a ordem no menu lateral).

`[A DEFINIR]` — formatação automática (black/ruff?), linting, se há CI
rodando testes/lint antes do merge.

## 5.4 Testes

`[A DEFINIR]` — o projeto ainda não tem suíte de testes automatizados.
Decidir, pelo menos:
- Testes mínimos para `utils/data.py` (cálculo de agregação ponderada,
  ranking com valores nulos) — já mencionados como pendência nas
  anotações internas do projeto.
- Como validar manualmente um indicador novo antes de publicar (ver
  checklist em
  [03-catalogo-e-metodologia-indicadores.md §3.4](03-catalogo-e-metodologia-indicadores.md#34-como-adicionar-um-indicador-novo)).

## 5.5 Dados sensíveis

Planilhas em `data/raw/` e os arquivos gerados em `data/processed/` **não
devem** ser versionados com dados que ainda não podem ser públicos (ver
[06-deploy-e-operacao.md](06-deploy-e-operacao.md)). Checar o
[.gitignore](../.gitignore) antes do primeiro `git push`.

## 5.6 Comunicação da equipe

`[A DEFINIR]` — canal principal (WhatsApp, Slack, e-mail?), onde ficam
registradas decisões e onde pedir ajuda quando travar em algo.
