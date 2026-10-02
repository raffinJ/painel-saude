// Camada de dados da aba "Custos hospitalares".
//
// O arquivo public/data/custos/custos.json (gerado por scripts/custos_sihsus.R +
// scripts/export_custos_frontend.R) é um "cubo": uma linha por ano x UF x
// categoria (via de parto ou CID) x uso de UTI, com SOMAS de custos, dias e
// óbitos. Qualquer recorte do usuário é só somar linhas; médias e desvios
// saem das somas (e das somas de quadrados) no próprio navegador.

export type Tipo = "parto" | "neonatal";
export type Moeda = "brl" | "int";

export type UfInfo = {
  cod: number;
  sigla: string;
  nome: string;
  regiao: string;
};
export type ViaInfo = { id: string; label: string; grupo: string };
export type CidInfo = { cod: string; nome: string; grupo: string };

type CustosJson = {
  meta: {
    periodo: [number, number];
    ano_base_preco: number;
    ipca: Record<string, number>;
    ppc: number;
    nascidos_vivos_regiao: Record<string, number>;
    /** todos os nascidos vivos (SINASC) por sigla de UF, alinhado a `anos` */
    nascidos_vivos_uf: Record<string, number[]>;
    idh_regiao: Record<string, number>;
  };
  anos: number[];
  ufs: UfInfo[];
  vias: ViaInfo[];
  cids: CidInfo[];
  cols: string[];
  parto: number[][];
  neonatal: number[][];
};

/** Somas acumuladas de um recorte. Valores monetários em R$ de dez/2023. */
export type Acc = {
  n: number;
  n_obito: number;
  n_uti: number;
  val_tot: number;
  val_tot2: number;
  val_sh: number;
  val_sp: number;
  val_uti: number;
  val_uti2: number;
  dias: number;
  dias2: number;
  dias_uti: number;
  dias_uti2: number;
  val_tot_nom: number;
};

const ACC_KEYS = [
  "n",
  "n_obito",
  "n_uti",
  "val_tot",
  "val_tot2",
  "val_sh",
  "val_sp",
  "val_uti",
  "val_uti2",
  "dias",
  "dias2",
  "dias_uti",
  "dias_uti2",
  "val_tot_nom",
] as const satisfies readonly (keyof Acc)[];

export function novoAcc(): Acc {
  return Object.fromEntries(ACC_KEYS.map((k) => [k, 0])) as Acc;
}

type Linha = Acc & { ano: number; uf: number; cat: number; uti: number };

export type CustosData = {
  meta: CustosJson["meta"];
  anos: number[];
  ufs: UfInfo[];
  vias: ViaInfo[];
  cids: CidInfo[];
  linhas: Record<Tipo, Linha[]>;
};

let cache: Promise<CustosData> | null = null;

export function carregarCustos(): Promise<CustosData> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/custos/custos.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: CustosJson) => {
        const parse = (rows: number[][]): Linha[] =>
          rows.map((r) => {
            const o: Record<string, number> = {};
            j.cols.forEach((c, i) => (o[c] = r[i]));
            // ano e uf vêm como índices relativos (ver export_custos_frontend.R)
            o.ano = j.anos[0] + o.ano;
            return o as unknown as Linha;
          });
        return {
          meta: j.meta,
          anos: j.anos,
          ufs: j.ufs,
          vias: j.vias,
          cids: j.cids,
          linhas: { parto: parse(j.parto), neonatal: parse(j.neonatal) },
        };
      })
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
}

// ---------------------------------------------------------------- filtros ---

export type UtiFiltro = "todas" | "com" | "sem";

export type Filtro = {
  tipo: Tipo;
  anoIni: number;
  anoFim: number;
  /** "" = Brasil; nome de região; ou sigla de UF */
  geo: string;
  uti: UtiFiltro;
  /** "" = todas; "g:<grupo>" = grupo; senão id da via / código do CID */
  cat: string;
};

function catIndices(
  d: CustosData,
  tipo: Tipo,
  cat: string,
): Set<number> | null {
  if (!cat) return null;
  const out = new Set<number>();
  if (tipo === "parto") {
    d.vias.forEach((v, i) => {
      if (cat === `g:${v.grupo}` || cat === v.id) out.add(i);
    });
  } else {
    d.cids.forEach((c, i) => {
      if (cat === `g:${c.grupo}` || cat === c.cod) out.add(i);
    });
  }
  return out;
}

function ufIndices(d: CustosData, geo: string): Set<number> | null {
  if (!geo) return null;
  const out = new Set<number>();
  d.ufs.forEach((u, i) => {
    if (u.regiao === geo || u.sigla === geo) out.add(i);
  });
  return out;
}

/** Soma as linhas do cubo que atendem ao filtro, agrupando por `chave`. */
export function agrupar<K extends string | number>(
  d: CustosData,
  f: Filtro,
  chave: (l: Linha) => K,
  opts: {
    ignorarCat?: boolean;
    ignorarGeo?: boolean;
    ignorarAno?: boolean;
  } = {},
): Map<K, Acc> {
  const cats = opts.ignorarCat ? null : catIndices(d, f.tipo, f.cat);
  const ufs = opts.ignorarGeo ? null : ufIndices(d, f.geo);
  const out = new Map<K, Acc>();
  for (const l of d.linhas[f.tipo]) {
    if (!opts.ignorarAno && (l.ano < f.anoIni || l.ano > f.anoFim)) continue;
    if (cats && !cats.has(l.cat)) continue;
    if (ufs && !ufs.has(l.uf)) continue;
    if (f.uti === "com" && l.uti !== 1) continue;
    if (f.uti === "sem" && l.uti !== 0) continue;
    const k = chave(l);
    let a = out.get(k);
    if (!a) {
      a = novoAcc();
      out.set(k, a);
    }
    for (const key of ACC_KEYS) a[key] += l[key];
  }
  return out;
}

export function total(
  d: CustosData,
  f: Filtro,
  opts?: Parameters<typeof agrupar>[3],
): Acc {
  return agrupar(d, f, () => 0, opts).get(0) ?? novoAcc();
}

export function somar(a: Acc, b: Acc): Acc {
  const out = novoAcc();
  for (const k of ACC_KEYS) out[k] = a[k] + b[k];
  return out;
}

// --------------------------------------------------------------- medidas ----

export type MedidaId =
  | "custo_total"
  | "custo_medio"
  | "n"
  | "custo_uti_medio"
  | "pct_uti"
  | "letalidade"
  | "permanencia";

export type Medida = {
  id: MedidaId;
  label: string;
  /** soma de valores (vira barra) ou razão/média (vira linha) */
  aditiva: boolean;
  monetaria: boolean;
  descricao: string;
};

export const MEDIDAS: Medida[] = [
  {
    id: "custo_total",
    label: "Custo total",
    aditiva: true,
    monetaria: true,
    descricao: "Soma do valor total pago pelo SUS nas internações do recorte.",
  },
  {
    id: "custo_medio",
    label: "Custo médio por internação",
    aditiva: false,
    monetaria: true,
    descricao: "Custo total ÷ número de internações.",
  },
  {
    id: "n",
    label: "Nº de internações (AIH)",
    aditiva: true,
    monetaria: false,
    descricao: "Autorizações de Internação Hospitalar aprovadas.",
  },
  {
    id: "custo_uti_medio",
    label: "Custo médio de UTI",
    aditiva: false,
    monetaria: true,
    descricao: "Valor de UTI ÷ internações que usaram UTI.",
  },
  {
    id: "pct_uti",
    label: "% das internações com UTI",
    aditiva: false,
    monetaria: false,
    descricao: "Internações com algum uso de UTI ÷ total.",
  },
  {
    id: "letalidade",
    label: "Mortalidade intra-hospitalar",
    aditiva: false,
    monetaria: false,
    descricao: "Óbitos ocorridos na internação ÷ internações.",
  },
  {
    id: "permanencia",
    label: "Permanência média (dias)",
    aditiva: false,
    monetaria: false,
    descricao: "Média de dias de internação por AIH.",
  },
];

export function medidaPorId(id: MedidaId): Medida {
  return MEDIDAS.find((m) => m.id === id)!;
}

/** Nascidos vivos (todos, SINASC) das UFs `siglas` entre anoIni e anoFim. */
export function nascidosVivos(
  d: CustosData,
  siglas: string[],
  anoIni: number,
  anoFim: number,
): number {
  let soma = 0;
  for (const sg of siglas) {
    d.meta.nascidos_vivos_uf[sg]?.forEach((v, i) => {
      const ano = d.anos[i];
      if (ano >= anoIni && ano <= anoFim) soma += v;
    });
  }
  return soma;
}

/** Fator de conversão R$ -> moeda escolhida. */
export function fatorMoeda(d: CustosData, moeda: Moeda): number {
  return moeda === "int" ? 1 / d.meta.ppc : 1;
}

/** Fator de escala da mortalidade: 100 mil (parto) ou 1.000 (neonatal). */
export function baseLetalidade(tipo: Tipo): number {
  return tipo === "parto" ? 1e5 : 1e3;
}

/** Valor da medida para um conjunto de somas (já na moeda pedida). */
export function valorMedida(
  a: Acc,
  m: MedidaId,
  tipo: Tipo,
  fm: number,
): number | undefined {
  if (a.n === 0) return undefined;
  switch (m) {
    case "custo_total":
      return a.val_tot * fm;
    case "custo_medio":
      return (a.val_tot / a.n) * fm;
    case "n":
      return a.n;
    case "custo_uti_medio":
      return a.n_uti > 0 ? (a.val_uti / a.n_uti) * fm : undefined;
    case "pct_uti":
      return (100 * a.n_uti) / a.n;
    case "letalidade":
      return (baseLetalidade(tipo) * a.n_obito) / a.n;
    case "permanencia":
      return a.dias / a.n;
  }
}

export function desvio(
  soma: number,
  soma2: number,
  n: number,
): number | undefined {
  if (n < 2) return undefined;
  const v = (soma2 - (soma * soma) / n) / (n - 1);
  return v > 0 ? Math.sqrt(v) : 0;
}

// ------------------------------------------------------------ formatação ----

const nf = (digits: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
const NF0 = nf(0);
const NF1 = nf(1);
const NF2 = nf(2);

export const fmtInt = (v: number | undefined) =>
  v === undefined || !Number.isFinite(v) ? "—" : NF0.format(v);
export const fmtDec = (v: number | undefined, d = 1) =>
  v === undefined || !Number.isFinite(v) ? "—" : nf(d).format(v);

export function simboloMoeda(moeda: Moeda): string {
  return moeda === "int" ? "Int$" : "R$";
}

/** "R$ 37,6 bi", "R$ 174 mi", "R$ 8.799". */
export function fmtMoeda(
  v: number | undefined,
  moeda: Moeda,
  compacto = false,
): string {
  if (v === undefined || !Number.isFinite(v)) return "—";
  const s = simboloMoeda(moeda);
  const abs = Math.abs(v);
  if (compacto) {
    if (abs >= 1e9) return `${s} ${NF1.format(v / 1e9)} bi`;
    if (abs >= 1e6)
      return `${s} ${abs >= 1e8 ? NF0.format(v / 1e6) : NF1.format(v / 1e6)} mi`;
    if (abs >= 1e4) return `${s} ${NF1.format(v / 1e3)} mil`;
  }
  return `${s} ${NF0.format(v)}`;
}

export function fmtMedida(
  v: number | undefined,
  m: MedidaId,
  tipo: Tipo,
  moeda: Moeda,
  compacto = true,
): string {
  if (v === undefined) return "—";
  switch (m) {
    case "custo_total":
      return fmtMoeda(v, moeda, compacto);
    case "custo_medio":
    case "custo_uti_medio":
      return fmtMoeda(v, moeda);
    case "n":
      return compacto && v >= 1e6 ? `${NF2.format(v / 1e6)} mi` : fmtInt(v);
    case "pct_uti":
      return `${NF1.format(v)}%`;
    case "letalidade":
      return `${v < 100 ? NF1.format(v) : NF0.format(v)}`;
    case "permanencia":
      return NF1.format(v);
  }
}

export function unidadeMedida(m: MedidaId, tipo: Tipo, moeda: Moeda): string {
  switch (m) {
    case "custo_total":
      return `${simboloMoeda(moeda)} de 2023, soma do período`;
    case "custo_medio":
    case "custo_uti_medio":
      return `${simboloMoeda(moeda)} de 2023 por internação`;
    case "n":
      return "internações";
    case "pct_uti":
      return "% das internações";
    case "letalidade":
      return tipo === "parto"
        ? "óbitos por 100 mil internações"
        : "óbitos por 1.000 internações";
    case "permanencia":
      return "dias por internação";
  }
}

// ------------------------------------------------------- recortes e rótulos --

export const REGIOES = [
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
] as const;

export function labelTipo(t: Tipo): string {
  return t === "parto"
    ? "Partos (internação da mãe)"
    : "Recém-nascidos (0–27 dias)";
}

export function labelCategoria(d: CustosData, tipo: Tipo, cat: string): string {
  if (!cat)
    return tipo === "parto"
      ? "Todas as vias de parto"
      : "Todos os diagnósticos";
  if (cat.startsWith("g:")) return cat.slice(2);
  if (tipo === "parto") return d.vias.find((v) => v.id === cat)?.label ?? cat;
  const c = d.cids.find((x) => x.cod === cat);
  return c ? `${c.cod} · ${c.nome}` : cat;
}

export function descreverFiltro(d: CustosData, f: Filtro): string {
  const partes = [
    labelTipo(f.tipo),
    f.anoIni === f.anoFim ? `${f.anoIni}` : `${f.anoIni}–${f.anoFim}`,
    f.geo || "Brasil",
  ];
  if (f.cat) partes.push(labelCategoria(d, f.tipo, f.cat));
  if (f.uti !== "todas") partes.push(f.uti === "com" ? "com UTI" : "sem UTI");
  return partes.join(" · ");
}

/** Rótulo curto de CID para eixos de gráfico. */
export function nomeCurtoCid(nome: string): string {
  return nome.length > 42 ? `${nome.slice(0, 40)}…` : nome;
}
