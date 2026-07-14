# 8. Glossário

Termos usados no projeto — tanto de saúde pública quanto técnicos —
reunidos aqui para nivelar o vocabulário entre quem vem da área de saúde
e quem vem de desenvolvimento.

## 8.1 Termos de saúde pública

| Termo | Significado |
|---|---|
| Apgar | `[A DEFINIR]` |
| Coeficiente de mortalidade neonatal | `[A DEFINIR]` |
| Pré-natal / puerpério / perinatal | `[A DEFINIR]` |
| SINASC | `[A DEFINIR]` — Sistema de Informações sobre Nascidos Vivos |
| SIM | `[A DEFINIR]` — Sistema de Informações sobre Mortalidade |
| CNES | `[A DEFINIR]` — Cadastro Nacional de Estabelecimentos de Saúde |
| Sigilo estatístico / supressão de dado | `[A DEFINIR]` |

## 8.2 Termos técnicos do projeto

| Termo | Significado |
|---|---|
| `codibge` | Código IBGE do município, 6 dígitos, sempre tratado como texto |
| `cod_mapa` | Código IBGE com dígito verificador (7 dígitos), usado para casar com GeoJSON do mapa |
| Star schema | Modelo de dados com uma tabela fato (`fato_indicadores`) e tabelas dimensão (`dim_municipios`, `dim_indicadores`, `dim_populacao`) — ver [02-arquitetura.md](02-arquitetura.md) |
| Indicador composto | `[A DEFINIR]` — como esse indicador é calculado a partir dos demais |
| "Direção" do indicador | Se valores maiores ou menores são melhores (`maior_melhor` / `menor_melhor`) — define ordenação no ranking |
| Média ponderada (agregação) | Ver [ADR-001](07-decisoes-tecnicas.md#adr-001--agregação-por-média-ponderada-numeradordenominador-não-média-simples-das-taxas-municipais) |

## 8.3 Siglas do projeto

| Sigla | Significado |
|---|---|
| QualiPréNeo | `[A DEFINIR]` — nome/significado completo do projeto |
| IMAPI | Referência de projeto similar ([imapi.org](https://www.imapi.org)) que inspirou o formato do site |
| DataSUS | Departamento de Informática do SUS — fonte oficial dos dados |
