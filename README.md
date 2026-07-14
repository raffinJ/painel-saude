# Painel de Indicadores de Saúde Materna e Infantil — QualiPréNeo

Protótipo funcional de um site de indicadores em saúde, no estilo do
[IMAPI](https://www.imapi.org), construído com **Streamlit** (Python).

Já vem com 3 indicadores reais carregados:
- Indicador Composto
- Proporção de Apgar Adequado
- Coeficiente de Mortalidade Neonatal

E 4 páginas: Início, Ranking, Buscar Município, Comparar e Mapa.

> 📖 Este README é o guia rápido de instalação. Para visão geral do
> projeto, metodologia dos indicadores, arquitetura, decisões técnicas e
> guia de contribuição, veja a [documentação completa em `docs/`](docs/README.md).

---

## 1. Rodando o site no seu computador

### 1.1 Pré-requisitos
- Python 3.10 ou mais recente instalado ([python.org/downloads](https://www.python.org/downloads/))
- Ao instalar no Windows, marque a caixa **"Add Python to PATH"**

### 1.2 Passo a passo

Abra o terminal (Prompt de Comando / PowerShell no Windows, Terminal no Mac) dentro
da pasta `painel-saude` e rode, uma linha de cada vez:

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

# 4. Rodar o site
streamlit run app.py
```

O navegador vai abrir automaticamente em `http://localhost:8501` com o site
rodando. Para parar, use `Ctrl+C` no terminal.

Sempre que for trabalhar no projeto de novo, você só precisa repetir os
passos 2 e 4 (não precisa recriar o ambiente virtual nem reinstalar tudo).

---

## 2. Estrutura do projeto

```
painel-saude/
├── app.py                          # página inicial
├── pages/                          # cada arquivo = uma página do menu lateral
│   ├── 1_🏆_Ranking.py
│   ├── 2_🔍_Buscar_Município.py
│   ├── 3_📊_Comparar.py
│   └── 4_🗺️_Mapa.py
├── utils/
│   └── data.py                     # funções de carregamento e cálculo, usadas por todas as páginas
├── scripts/
│   └── importar_indicadores.py     # pipeline que gera a base consolidada (ver seção 3)
├── data/
│   ├── raw/                        # arquivos .xlsx originais de cada indicador (entram aqui)
│   ├── catalogo_indicadores.csv    # "de-para" de cada indicador (editar para adicionar um novo)
│   └── indicadores_long.csv        # base consolidada gerada pelo script — o site lê só este arquivo
├── .streamlit/config.toml          # cores/tema do site
└── requirements.txt
```

---

## 3. Como adicionar um indicador novo (o fluxo do dia a dia)

Isso é o que muda **a cada novo indicador que vocês tiverem pronto** — o
resto do código não precisa ser tocado.

1. Copie o arquivo `.xlsx` do indicador (formato `..._munic_ano.xlsx`, com
   colunas `year`, `codibge`, `cod_mapa`, `NOME DO MUNICÍPIO` e a coluna do
   valor) para dentro de `data/raw/`.

2. Abra `data/catalogo_indicadores.csv` (dá pra editar no Excel também) e
   adicione uma linha, por exemplo:

   ```
   chave,arquivo,coluna_valor,nome_amigavel,grupo,direcao,formato
   taxa_cesarea,taxa_cesarea_munic_ano.xlsx,proporcao,Proporção de Cesáreas,Grupo 2 - Parto,menor_melhor,{:.1f}%
   ```

   - `chave`: identificador interno, sem espaços/acentos
   - `arquivo`: nome do arquivo dentro de `data/raw/`
   - `coluna_valor`: nome exato da coluna com o valor do indicador na planilha
   - `nome_amigavel`: como vai aparecer nos menus do site
   - `grupo`: um dos 5 grupos da proposta (pré-natal, parto, neonatal, puerpério, perinatal) — só organizacional por enquanto
   - `direcao`: `menor_melhor` ou `maior_melhor` — **confiram isso com a
     metodologia de cada indicador**, é o que define quem aparece no topo do ranking
   - `formato`: como o número aparece na tela (`{:.1f}%`, `{:.2f}`, etc.)

3. Rode o script de importação:

   ```bash
   python scripts/importar_indicadores.py
   ```

   Ele vai avisar quantas linhas leu de cada indicador e regravar
   `data/indicadores_long.csv`.

4. Rode `streamlit run app.py` de novo (ou aperte "Rerun" se o site já
   estiver aberto) — o novo indicador já aparece em todos os seletores,
   rankings, buscas, comparações e no mapa, automaticamente.

> **Nota sobre os arquivos `_munic.xlsx` (sem `_ano`)**: eles trazem só o
> total do período inteiro por município, sem separar por ano. O pipeline
> atual usa as versões `_munic_ano.xlsx` (série temporal). Se vocês quiserem
> mostrar também um "resumo do período completo" em algum lugar do site
> (não obrigatório para o funcionamento atual), me avisem que adiciono essa
> visão.

---

## 4. Colocando no ar (GitHub + Streamlit Community Cloud, de graça)

### 4.1 Criar o repositório no GitHub
1. Crie uma conta em [github.com](https://github.com) se ainda não tiver.
2. Crie um novo repositório (pode ser privado), ex.: `painel-qualipreneo`.
3. Dentro da pasta `painel-saude`, no terminal:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do painel"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/painel-qualipreneo.git
   git push -u origin main
   ```

### 4.2 Publicar no Streamlit Community Cloud
1. Acesse [share.streamlit.io](https://share.streamlit.io) e entre com sua conta do GitHub.
2. Clique em **"New app"**.
3. Selecione o repositório `painel-qualipreneo`, branch `main`, e o arquivo
   principal `app.py`.
4. Clique em **Deploy**. Em poucos minutos o site fica no ar num endereço
   tipo `https://painel-qualipreneo.streamlit.app`, gratuito.
5. Qualquer novo `git push` no repositório atualiza o site automaticamente.

> Atenção: o plano gratuito é público na internet (mesmo que o repositório
> seja privado, o link do app não exige login). Se os dados só puderem ser
> divulgados depois de validação institucional, mantenham em execução local
> até estarem prontos para publicar.

---

## 5. Próximos passos sugeridos (conforme a proposta)

- [ ] Trazer os 40 indicadores restantes (repetindo a seção 3 para cada um)
- [ ] Mapa por município (instruções detalhadas na página "Mapa" do site,
      dentro do expansor "Como evoluir para o mapa municipal")
- [ ] Tooltips explicando metodologia de cálculo de cada indicador (dá pra
      usar a coluna `descricao` do catálogo com `st.help`/`help=` nos widgets)
- [ ] Filtro por "região de saúde" (a proposta cita esse nível — precisamos
      de uma tabela de-para código do município → região de saúde para isso)
- [ ] Geração automática de relatório em PDF/Word por município
- [ ] Comparação por perfil semelhante (tamanho populacional, IDH etc.) —
      precisa de uma base auxiliar com essas variáveis por município
- [ ] Página "Sobre" com a metodologia do QualiPréNeo e créditos institucionais
