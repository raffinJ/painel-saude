# 6. Deploy e operação

## 6.1 Publicação (frontend React)

`[A DEFINIR]` — onde publicar `web/` (TanStack Start).
Opções mais comuns para esse stack: publicação direta pelo Lovable,
Vercel ou Netlify — todas com deploy automático a cada `git push`, de
forma parecida com o antigo Streamlit Community Cloud. Decidir:
- Qual dessas (ou outra) a equipe vai usar.
- Se o link público exige login/autenticação ou fica aberto (a maioria
  dos planos gratuitos desses serviços publica com link público sem
  login — mesma atenção que valia para o Streamlit Community Cloud).

> O deploy antigo era via GitHub + Streamlit Community Cloud (link
> `*.streamlit.app`). Essa via está obsoleta como site oficial — só serve
> se alguém quiser publicar o protótipo arquivado
> ([_legacy_streamlit/](../_legacy_streamlit/)) para referência.

## 6.2 Política de dados públicos x dados não validados

`[A DEFINIR]` — regra da equipe para decidir quando um indicador pode ir
para o ambiente publicado:
- Precisa de validação institucional antes de publicar? De quem?
- Como isso se aplica ao fluxo atual: os dados do frontend vêm de um JSON
  estático (`web/public/data/`) gerado por
  `scripts/export_ranking_frontend.py` — um indicador só fica público
  quando alguém decide rodar a exportação e commitar o JSON atualizado
  (ver [05-guia-de-contribuicao.md §5.5](05-guia-de-contribuicao.md#55-dados-sensíveis)).
  Isso já dá um ponto de controle natural, mas precisa de um responsável
  definido.
- Como remover rapidamente um indicador do ar se for identificado um erro
  metodológico depois da publicação (hoje: bastaria reverter o JSON e
  fazer novo deploy).

## 6.3 Ambientes

`[A DEFINIR]` — hoje existe só "local" e "produção" (o deploy escolhido em
6.1)? Se houver ambiente de homologação/preview (Vercel e Netlify dão
preview automático por PR, por exemplo), documentar a URL e quem tem
acesso.

## 6.4 Domínio e identidade

`[A DEFINIR]` — domínio próprio (se houver) além do subdomínio padrão do
serviço de hospedagem escolhido, responsável pelo registro/DNS. Ver
também a pendência sobre o nome oficial do projeto ("QualiPréNeo" vs.
"CuidadoPreNeo", usado hoje no frontend) em
[02-arquitetura.md §2.6](02-arquitetura.md#26-frontend-react-web).

## 6.5 Monitoramento

`[A DEFINIR]` — como a equipe fica sabendo se o site cair, ou se os dados
pararam de atualizar. Decidir se isso é necessário para este projeto e,
se sim, com qual ferramenta.

## 6.6 Atualização de dados em produção

`[A DEFINIR]` — frequência esperada de atualização dos indicadores
(anual, conforme o DataSUS libera?), e o processo: alguém roda o pipeline
localmente (`build_dataset.py` + `export_ranking_frontend.py`) e sobe o
JSON atualizado via `git push`, ou há um processo automatizado (ex.: CI
agendado)?

## 6.7 Backup

`[A DEFINIR]` — os dados processados (`data/processed/`) e as planilhas
brutas (`data/raw/`) têm alguma cópia fora do repositório/máquina local?
Relevante especialmente para `qualipreneo.db` (bem maior que os demais
arquivos) — nenhum dos dois está versionado no git (ver `.gitignore`),
então hoje a única cópia é local.
