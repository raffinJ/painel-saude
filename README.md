# Painel de Indicadores de Saúde Materna e Infantil — QualiPréNeo

Site de indicadores em saúde com duas partes:

- **Frontend** — [`teste_not_streamlit/`](teste_not_streamlit/), em React
  (TanStack Start), é o site oficial do projeto.
- **Pipeline de dados** — scripts Python na raiz (`scripts/`, `utils/`)
  que transformam as planilhas do DataSUS em arquivos que o frontend
  consome.

> Havia um protótipo anterior em Streamlit — foi descontinuado como site
> oficial e fica arquivado em [`_legacy_streamlit/`](_legacy_streamlit/)
> como referência (tem 4 páginas funcionais — Ranking, Buscar Município,
> Comparar, Mapa — que ainda não têm equivalente completo no React). Ver
> [docs/07-decisoes-tecnicas.md](docs/07-decisoes-tecnicas.md#adr-004).

Já vem com **26 indicadores reais** processados (ver
[docs/03-catalogo-e-metodologia-indicadores.md](docs/03-catalogo-e-metodologia-indicadores.md)
para a lista completa), todos disponíveis na aba Indicadores do
frontend. A página de Ranking, por enquanto, usa só o Indicador Composto.

> 📖 Este README é o guia rápido de instalação. Para visão geral do
> projeto, metodologia dos indicadores, arquitetura, decisões técnicas e
> guia de contribuição, veja a [documentação completa em `docs/`](docs/README.md).

---

## 1. Rodando o site (frontend React)

### 1.1 Pré-requisitos
- [Node.js](https://nodejs.org) 20 ou mais recente (o projeto usa
  [Bun](https://bun.sh) como gerenciador de pacotes, mas `npm` também
  funciona)

### 1.2 Passo a passo

```bash
cd teste_not_streamlit
npm install       # ou: bun install
npm run dev       # ou: bun run dev
```

Abre em `http://localhost:3000` (porta padrão do Vite/TanStack Start — o
terminal mostra o endereço exato). Para parar, use `Ctrl+C`.

Esse frontend está conectado ao [Lovable](https://lovable.dev) — ver
[`teste_not_streamlit/AGENTS.md`](teste_not_streamlit/AGENTS.md) antes de
mexer em histórico de commits daquela pasta.

---

## 2. Rodando o pipeline de dados (Python)

O frontend lê arquivos estáticos (JSON) gerados a partir dos dados do
DataSUS por um pipeline em Python. Só é preciso rodar isso quando um
indicador novo entra ou os dados são atualizados.

### 2.1 Pré-requisitos
- Python 3.10 ou mais recente ([python.org/downloads](https://www.python.org/downloads/))
- Ao instalar no Windows, marque a caixa **"Add Python to PATH"**

### 2.2 Passo a passo

Abra o terminal dentro da pasta `painel-saude` (raiz do projeto) e rode,
uma linha de cada vez:

```bash
# 1. Criar um ambiente virtual (isola as bibliotecas deste projeto)
python -m venv .venv

# 2. Ativar o ambiente virtual
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# 3. Instalar as bibliotecas necessárias
pip install -r requirements.txt

# 4. Gerar a base consolidada (star schema em data/processed/)
python scripts/build_dataset.py

# 5. Exportar os dados que o frontend React consome
python scripts/export_ranking_frontend.py

# 6. Exportar os 26 indicadores para a aba "Indicadores" (demora ~15 min)
python scripts/export_indicadores_frontend.py
```

O passo 5 grava em
`teste_not_streamlit/public/data/ranking-composto-2023.json`; o passo 6
grava em `teste_not_streamlit/public/data/indicadores/` (um JSON por
indicador — ver [docs/04-pipeline-de-dados.md §4.7](docs/04-pipeline-de-dados.md#47-exportando-para-a-aba-indicadores-react)).
Depois é só
rodar o frontend (seção 1) normalmente.

---

## 3. Estrutura do projeto

```
painel-saude/
├── teste_not_streamlit/            # frontend oficial (React / TanStack Start)
│   ├── src/routes/                 # páginas
│   ├── src/components/             # componentes de UI
│   └── public/data/                # JSON gerado pelo pipeline (seção 2)
├── _legacy_streamlit/              # protótipo Streamlit arquivado (ver aviso acima)
├── utils/
│   └── data.py                     # funções de carregamento e cálculo (usadas pelo pipeline de exportação)
├── scripts/
│   ├── build_dataset.py            # pipeline atual: gera o modelo dimensional (star schema)
│   ├── importar_indicadores.py     # pipeline legado (ver docs/02-arquitetura.md)
│   ├── export_ranking_frontend.py  # exporta o ranking em JSON para o frontend
│   └── export_indicadores_frontend.py # exporta os 26 indicadores (aba Indicadores)
├── data/
│   ├── raw/                        # arquivos .xlsx originais de cada indicador (entram aqui)
│   ├── processed/                  # saída do pipeline atual (parquet + qualipreneo.db)
│   ├── catalogo_indicadores.csv    # "de-para" de cada indicador (pipeline legado)
│   └── indicadores_long.csv        # saída do pipeline legado
├── docs/                           # documentação completa do projeto
└── requirements.txt                # dependências do pipeline de dados (Python)
```

---

## 4. Como adicionar um indicador novo (o fluxo do dia a dia)

Isso é o que muda **a cada novo indicador que vocês tiverem pronto** — o
resto do código não precisa ser tocado. Detalhes de metodologia (fórmula,
fonte, direção) devem ser registrados em
[docs/03-catalogo-e-metodologia-indicadores.md](docs/03-catalogo-e-metodologia-indicadores.md).

1. Copie o arquivo `.xlsx` do indicador (formato `..._munic_ano.xlsx`, com
   colunas `year`, `codibge`, `cod_mapa`, `NOME DO MUNICÍPIO` e a coluna do
   valor) para dentro de `data/raw/`.

2. Cadastre o indicador no pipeline (ver
   [docs/04-pipeline-de-dados.md](docs/04-pipeline-de-dados.md) para o
   formato exato — hoje o cadastro fica no manifesto interno de
   `scripts/build_dataset.py`).

3. Rode o pipeline e a exportação:

   ```bash
   python scripts/build_dataset.py
   python scripts/export_ranking_frontend.py
   python scripts/export_indicadores_frontend.py   # demora ~15 min, ver docs/04 §4.7
   ```

4. Rode o frontend (`npm run dev` dentro de `teste_not_streamlit/`). A
   aba **Indicadores** (`/indicadores`) é orientada a catálogo — o
   indicador novo já aparece sozinho no seletor, agrupado pelo `grupo`
   cadastrado no manifesto, sem precisar mexer em código do frontend. Já
   a página de **Ranking** (`/`) ainda usa dados majoritariamente
   mockados — ver checklist em
   [docs/09-roadmap-e-perguntas-abertas.md](docs/09-roadmap-e-perguntas-abertas.md).

> **Nota sobre os arquivos `_munic.xlsx` (sem `_ano`)**: eles trazem só o
> total do período inteiro por município, sem separar por ano. O pipeline
> atual usa as versões `_munic_ano.xlsx` (série temporal).

---

## 5. Colocando no ar

`[A DEFINIR]` — hospedagem do frontend React (Vercel, Netlify, publicação
direta pelo Lovable, etc.) ainda precisa ser decidida pela equipe. Ver
[docs/06-deploy-e-operacao.md](docs/06-deploy-e-operacao.md).

---

## 6. Próximos passos

Ver o roadmap completo, com o que já foi decidido e o que ainda está em
aberto, em
[docs/09-roadmap-e-perguntas-abertas.md](docs/09-roadmap-e-perguntas-abertas.md).
