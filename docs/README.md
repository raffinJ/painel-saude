# Documentação do QualiPréNeo

Esta pasta reúne a documentação do projeto, escrita e mantida pela equipe
(saúde pública + desenvolvimento). É um **modelo base**: várias seções têm
trechos marcados com `[A DEFINIR]` — preencham em conjunto conforme o
projeto avança. O objetivo é que qualquer pessoa nova na equipe consiga
entender o projeto, os dados e como contribuir sem precisar perguntar tudo
verbalmente.

## Índice

| Arquivo | Conteúdo |
|---|---|
| [01-visao-geral.md](01-visao-geral.md) | O que é o projeto, objetivos, público-alvo, equipe e papéis |
| [02-arquitetura.md](02-arquitetura.md) | Stack técnica, estrutura de pastas, fluxo de dados ponta a ponta |
| [03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md) | Dicionário de dados, catálogo de indicadores, regras de cálculo, fontes |
| [04-pipeline-de-dados.md](04-pipeline-de-dados.md) | Como os dados brutos viram os arquivos que o site consome |
| [05-guia-de-contribuicao.md](05-guia-de-contribuicao.md) | Ambiente de dev, git, padrões de código, revisão |
| [06-deploy-e-operacao.md](06-deploy-e-operacao.md) | Publicação, ambientes, dados sensíveis, monitoramento |
| [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md) | Registro de decisões arquiteturais (ADR) e por quê |
| [08-glossario.md](08-glossario.md) | Termos de saúde pública e termos técnicos usados no projeto |
| [09-roadmap-e-perguntas-abertas.md](09-roadmap-e-perguntas-abertas.md) | Próximos passos e decisões pendentes da equipe |

## Convenções

- Documentação em **português**, código e nomes de variáveis em português
  (segue o padrão já usado no projeto).
- Ao resolver um `[A DEFINIR]`, apague a marcação e deixe só o conteúdo
  final — não é preciso manter histórico de "quem decidiu o quê" aqui (isso
  fica no [07-decisoes-tecnicas.md](07-decisoes-tecnicas.md) quando for uma
  decisão técnica relevante, ou no controle de versão do git para o resto).
- Sempre que um indicador novo for adicionado ao catálogo
  (`data/catalogo_indicadores.csv`), atualizar
  [03-catalogo-e-metodologia-indicadores.md](03-catalogo-e-metodologia-indicadores.md)
  com a metodologia de cálculo e a fonte.
- O [README.md](../README.md) na raiz do projeto continua sendo o guia
  rápido de "como rodar o site" — esta pasta é para documentação mais
  ampla (contexto, decisões, dados, contribuição). Evitem duplicar conteúdo
  entre os dois; quando houver sobreposição, o README aponta para cá.
