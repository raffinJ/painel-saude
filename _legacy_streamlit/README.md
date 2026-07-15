# [Arquivado] Protótipo Streamlit

Esta pasta guarda o protótipo original do painel, feito em Streamlit. O
projeto decidiu seguir com o **frontend em React** (pasta
[`web/`](../web) na raiz do repositório)
como site oficial — ver
[docs/07-decisoes-tecnicas.md](../docs/07-decisoes-tecnicas.md#adr-004).

Este código não é mais mantido ativamente, mas fica aqui como referência:
tem 4 páginas funcionais (Ranking, Buscar Município, Comparar, Mapa) que
ainda não têm equivalente completo no React — útil para consultar a
lógica/UX enquanto essas páginas são portadas.

## Rodando localmente (se precisar)

A partir da **raiz do repositório** (não desta pasta — os dados em
`data/` ficam lá):

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r _legacy_streamlit/requirements.txt
streamlit run _legacy_streamlit/app.py
```

A camada de dados (`utils/data.py`, na raiz) é compartilhada com o
pipeline atual — não foi duplicada aqui.
