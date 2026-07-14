"""
Pipeline de importação de indicadores.

COMO ADICIONAR UM NOVO INDICADOR (isso é tudo que precisa ser feito):
1. Coloque o arquivo .xlsx do tipo "..._munic_ano.xlsx" (com colunas year,
   codibge e a coluna de valor) dentro de data/raw/.
2. Adicione uma linha em data/catalogo_indicadores.csv com:
   chave, arquivo, coluna_valor, nome_amigavel, grupo, direcao, formato
3. Rode: python scripts/importar_indicadores.py
4. Rode o site normalmente (streamlit run app.py) — o indicador novo já
   aparece em todos os seletores, rankings, mapas e comparações.

O script é tolerante a arquivos com número de linhas diferente entre
indicadores (nem todo município/ano tem dado para todo indicador — comum
quando o denominador é pequeno demais e o dado é suprimido).
"""

import sys
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
CATALOGO_PATH = BASE_DIR / "data" / "catalogo_indicadores.csv"
OUTPUT_PATH = BASE_DIR / "data" / "indicadores_long.csv"

UF_INFO = {
    "11": ("RO", "Rondônia", "Norte"), "12": ("AC", "Acre", "Norte"),
    "13": ("AM", "Amazonas", "Norte"), "14": ("RR", "Roraima", "Norte"),
    "15": ("PA", "Pará", "Norte"), "16": ("AP", "Amapá", "Norte"),
    "17": ("TO", "Tocantins", "Norte"),
    "21": ("MA", "Maranhão", "Nordeste"), "22": ("PI", "Piauí", "Nordeste"),
    "23": ("CE", "Ceará", "Nordeste"), "24": ("RN", "Rio Grande do Norte", "Nordeste"),
    "25": ("PB", "Paraíba", "Nordeste"), "26": ("PE", "Pernambuco", "Nordeste"),
    "27": ("AL", "Alagoas", "Nordeste"), "28": ("SE", "Sergipe", "Nordeste"),
    "29": ("BA", "Bahia", "Nordeste"),
    "31": ("MG", "Minas Gerais", "Sudeste"), "32": ("ES", "Espírito Santo", "Sudeste"),
    "33": ("RJ", "Rio de Janeiro", "Sudeste"), "35": ("SP", "São Paulo", "Sudeste"),
    "41": ("PR", "Paraná", "Sul"), "42": ("SC", "Santa Catarina", "Sul"),
    "43": ("RS", "Rio Grande do Sul", "Sul"),
    "50": ("MS", "Mato Grosso do Sul", "Centro-Oeste"), "51": ("MT", "Mato Grosso", "Centro-Oeste"),
    "52": ("GO", "Goiás", "Centro-Oeste"), "53": ("DF", "Distrito Federal", "Centro-Oeste"),
}


def enrich_geo(df: pd.DataFrame) -> pd.DataFrame:
    df["codibge"] = df["codibge"].astype(str).str.extract(r"(\d+)")[0].str.zfill(6)
    df["cod_mapa"] = df["cod_mapa"].astype(str).str.extract(r"(\d+)")[0].str.zfill(7)
    df["uf_codigo"] = df["codibge"].str[:2]
    df = df[df["uf_codigo"].isin(UF_INFO.keys())].copy()
    df["uf_sigla"] = df["uf_codigo"].map(lambda c: UF_INFO[c][0])
    df["uf_nome"] = df["uf_codigo"].map(lambda c: UF_INFO[c][1])
    df["regiao"] = df["uf_codigo"].map(lambda c: UF_INFO[c][2])
    return df.drop(columns=["uf_codigo"])


def load_one_indicator(row: pd.Series) -> pd.DataFrame:
    path = RAW_DIR / row["arquivo"]
    if not path.exists():
        print(f"  ⚠️  aviso: arquivo não encontrado, pulando: {path.name}")
        return pd.DataFrame()

    df = pd.read_excel(path)
    df = df.rename(columns={"NOME DO MUNICÍPIO": "municipio"})

    required = {"year", "codibge", "cod_mapa", "municipio", row["coluna_valor"]}
    missing = required - set(df.columns)
    if missing:
        print(f"  ⚠️  aviso: {path.name} não tem as colunas {missing}, pulando.")
        return pd.DataFrame()

    # remove linhas de agregados de UF (sem município individualizado)
    df = df.dropna(subset=["municipio", row["coluna_valor"], "codibge"])

    df = df[["year", "codibge", "cod_mapa", "municipio", row["coluna_valor"]]].copy()
    df = df.rename(columns={row["coluna_valor"]: "valor"})
    df["indicador"] = row["chave"]
    return df


def main():
    if not CATALOGO_PATH.exists():
        sys.exit(f"Catálogo não encontrado em {CATALOGO_PATH}")

    catalogo = pd.read_csv(CATALOGO_PATH)
    print(f"Catálogo com {len(catalogo)} indicador(es) cadastrado(s).")

    partes = []
    for _, row in catalogo.iterrows():
        print(f"→ processando '{row['chave']}' ({row['arquivo']})")
        parte = load_one_indicator(row)
        if not parte.empty:
            parte = enrich_geo(parte)
            print(f"  ✓ {len(parte):,} linhas".replace(",", "."))
            partes.append(parte)

    if not partes:
        sys.exit("Nenhum indicador foi carregado. Verifique data/raw/ e o catálogo.")

    long_df = pd.concat(partes, ignore_index=True)
    long_df["year"] = long_df["year"].astype(int)
    long_df = long_df.sort_values(["indicador", "year", "valor"])

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    long_df.to_csv(OUTPUT_PATH, index=False)

    print(f"\n✅ Base consolidada salva em {OUTPUT_PATH}")
    print(f"   Total de linhas: {len(long_df):,}".replace(",", "."))
    print(f"   Indicadores: {sorted(long_df['indicador'].unique())}")
    print(f"   Anos: {long_df['year'].min()}–{long_df['year'].max()}")


if __name__ == "__main__":
    main()
