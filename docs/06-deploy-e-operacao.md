# 6. Deploy e operação

## 6.1 Publicação (Streamlit Community Cloud)

Passo a passo já documentado em
[README.md §4](../README.md#4-colocando-no-ar-github--streamlit-community-cloud-de-graça):
GitHub + [share.streamlit.io](https://share.streamlit.io), deploy
automático a cada `git push` na branch `main`.

**Atenção**: o plano gratuito do Streamlit Community Cloud é **público na
internet**, mesmo com repositório privado — o link do app não exige
login.

## 6.2 Política de dados públicos x dados não validados

`[A DEFINIR]` — regra da equipe para decidir quando um indicador pode ir
para o ambiente publicado:
- Precisa de validação institucional antes de publicar? De quem?
- Enquanto não validado, o app roda só localmente, ou existe um ambiente
  de "staging" separado do público?
- Como remover rapidamente um indicador do ar se for identificado um erro
  metodológico depois da publicação.

## 6.3 Ambientes

`[A DEFINIR]` — hoje existe só "local" e "produção" (o próprio deploy do
Streamlit Cloud)? Se houver ambiente de homologação, documentar a URL e
quem tem acesso.

## 6.4 Domínio e identidade

`[A DEFINIR]` — domínio próprio (se houver) além do
`*.streamlit.app` padrão, responsável pelo registro/DNS.

## 6.5 Monitoramento

`[A DEFINIR]` — como a equipe fica sabendo se o site cair, ou se os dados
pararam de atualizar. O Streamlit Community Cloud não tem alerta nativo;
decidir se isso é necessário para este projeto.

## 6.6 Atualização de dados em produção

`[A DEFINIR]` — frequência esperada de atualização dos indicadores
(anual, conforme o DataSUS libera?), e o processo: alguém roda o pipeline
localmente e sobe os `.parquet`/`.csv` atualizados via `git push`, ou há
um processo automatizado?

## 6.7 Backup

`[A DEFINIR]` — os dados processados (`data/processed/`) e as planilhas
brutas (`data/raw/`) têm alguma cópia fora do repositório/máquina local?
Relevante especialmente para `qualipreneo.db` (bem maior que os demais
arquivos).
