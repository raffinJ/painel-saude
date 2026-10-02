import { useMemo, useState } from "react";
import { IndicatorUFMap } from "@/components/indicadores/IndicatorUFMap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv } from "@/lib/csv";
import {
  REGIOES,
  nascidosVivos,
  agrupar,
  baseLetalidade,
  fmtDec,
  fmtInt,
  fmtMedida,
  fmtMoeda,
  medidaPorId,
  unidadeMedida,
  valorMedida,
  type Acc,
  type CustosData,
  type Filtro,
  type MedidaId,
  type Moeda,
} from "@/lib/custos-data";

type Props = {
  data: CustosData;
  filtro: Filtro;
  medida: MedidaId;
  moeda: Moeda;
  fm: number;
  onSelecionarGeo: (geo: string) => void;
};

type Linha = {
  id: string;
  nome: string;
  regiao?: string;
  acc: Acc;
  idh?: number;
  porMilNv?: number;
  /** só região, período completo: nascidos vivos em hospitais públicos (artigo) */
  porMilNvPub?: number;
};

type Ordem =
  | "nome"
  | "n"
  | "custo_total"
  | "custo_medio"
  | "pct_uti"
  | "letalidade"
  | "porMilNv"
  | "porMilNvPub";

export function CustosUf({
  data,
  filtro,
  medida,
  moeda,
  fm,
  onSelecionarGeo,
}: Props) {
  const [visao, setVisao] = useState<"uf" | "regiao">("uf");
  const [ordem, setOrdem] = useState<Ordem>("custo_total");
  const [asc, setAsc] = useState(false);
  const m = medidaPorId(medida);

  // Mapa e tabela por UF ignoram o filtro geográfico (senão só sobraria uma UF).
  const porUf = useMemo(
    () => agrupar(data, filtro, (l) => l.uf, { ignorarGeo: true }),
    [data, filtro],
  );

  const periodoCompleto =
    filtro.anoIni === data.anos[0] &&
    filtro.anoFim === data.anos[data.anos.length - 1];

  const linhas: Linha[] = useMemo(() => {
    if (visao === "uf") {
      return data.ufs
        .map((u, i) => {
          const acc = porUf.get(i)!;
          const nv = nascidosVivos(
            data,
            [u.sigla],
            filtro.anoIni,
            filtro.anoFim,
          );
          return {
            id: u.sigla,
            nome: u.nome,
            regiao: u.regiao,
            acc,
            porMilNv: acc && nv ? (acc.val_tot * fm * 1000) / nv : undefined,
          };
        })
        .filter((l) => l.acc);
    }
    return REGIOES.map((r) => {
      const acc = data.ufs.reduce<Acc | null>((soma, u, i) => {
        if (u.regiao !== r) return soma;
        const a = porUf.get(i);
        if (!a) return soma;
        if (!soma) return { ...a };
        const s = { ...soma };
        (Object.keys(a) as (keyof Acc)[]).forEach((k) => (s[k] += a[k]));
        return s;
      }, null);
      const nvPub = data.meta.nascidos_vivos_regiao[r];
      const siglas = data.ufs.filter((u) => u.regiao === r).map((u) => u.sigla);
      const nv = nascidosVivos(data, siglas, filtro.anoIni, filtro.anoFim);
      return {
        id: r,
        nome: r,
        acc: acc!,
        idh: data.meta.idh_regiao[r],
        porMilNv: acc && nv ? (acc.val_tot * fm * 1000) / nv : undefined,
        porMilNvPub:
          acc && periodoCompleto
            ? (acc.val_tot * fm * 1000) / nvPub
            : undefined,
      };
    }).filter((l) => l.acc);
  }, [data, porUf, visao, fm, periodoCompleto, filtro.anoIni, filtro.anoFim]);

  const valoresMapa = useMemo(() => {
    const out: Record<string, number | undefined> = {};
    data.ufs.forEach((u, i) => {
      const a = porUf.get(i);
      out[u.sigla] = a ? valorMedida(a, medida, filtro.tipo, fm) : undefined;
    });
    return out;
  }, [data, porUf, medida, filtro.tipo, fm]);

  const ordenadas = useMemo(() => {
    const chave = (l: Linha): number | string => {
      switch (ordem) {
        case "nome":
          return l.nome;
        case "n":
          return l.acc.n;
        case "custo_total":
          return l.acc.val_tot;
        case "custo_medio":
          return l.acc.val_tot / l.acc.n;
        case "pct_uti":
          return l.acc.n_uti / l.acc.n;
        case "letalidade":
          return l.acc.n_obito / l.acc.n;
        case "porMilNv":
          return l.porMilNv ?? -1;
        case "porMilNvPub":
          return l.porMilNvPub ?? -1;
      }
    };
    const arr = [...linhas].sort((a, b) => {
      const ka = chave(a);
      const kb = chave(b);
      return typeof ka === "string"
        ? ka.localeCompare(kb as string, "pt-BR")
        : (ka as number) - (kb as number);
    });
    return asc ? arr : arr.reverse();
  }, [linhas, ordem, asc]);

  function Cab({
    id,
    children,
    className = "",
  }: {
    id: Ordem;
    children: React.ReactNode;
    className?: string;
  }) {
    const ativo = ordem === id;
    return (
      <TableHead className={className}>
        <button
          type="button"
          onClick={() => {
            if (ativo) setAsc(!asc);
            else {
              setOrdem(id);
              setAsc(id === "nome");
            }
          }}
          className={`font-mono text-[10px] uppercase tracking-widest hover:text-foreground ${ativo ? "text-brand-dark font-semibold" : ""}`}
        >
          {children}
          {ativo ? (asc ? " ↑" : " ↓") : ""}
        </button>
      </TableHead>
    );
  }

  const geoSigla = data.ufs.find((u) => u.sigla === filtro.geo)?.sigla;

  function baixar() {
    const base = visao === "uf" ? ["uf", "regiao"] : ["regiao"];
    const headers = [
      ...base,
      "registros_internacao",
      `custo_total_${moeda}`,
      `custo_medio_${moeda}`,
      "pct_uti",
      filtro.tipo === "parto" ? "obitos_por_100mil" : "obitos_por_1000",
      "permanencia_media_dias",
      `custo_por_1000_nascidos_vivos_${moeda}`,
      ...(visao === "regiao"
        ? [
            "idh_2010",
            `custo_por_1000_nascidos_vivos_hosp_publicos_artigo_${moeda}`,
          ]
        : []),
    ];
    const rows = ordenadas.map((l) => [
      ...(visao === "uf" ? [l.id, l.regiao ?? ""] : [l.nome]),
      l.acc.n,
      Math.round(l.acc.val_tot * fm),
      +((l.acc.val_tot / l.acc.n) * fm).toFixed(2),
      +((100 * l.acc.n_uti) / l.acc.n).toFixed(2),
      +((baseLetalidade(filtro.tipo) * l.acc.n_obito) / l.acc.n).toFixed(2),
      +(l.acc.dias / l.acc.n).toFixed(2),
      l.porMilNv !== undefined ? Math.round(l.porMilNv) : "",
      ...(visao === "regiao"
        ? [
            l.idh ?? "",
            l.porMilNvPub !== undefined ? Math.round(l.porMilNvPub) : "",
          ]
        : []),
    ]);
    downloadCsv(
      `custos_${filtro.tipo}_${visao}_${filtro.anoIni}-${filtro.anoFim}.csv`,
      headers,
      rows,
    );
  }

  const valores = Object.values(valoresMapa).filter(
    (v): v is number => v !== undefined,
  );
  const mapaDirecao = "neutro" as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
          Mapa por UF · {m.label}
        </div>
        <div className="border border-border bg-card p-4">
          {valores.length ? (
            <IndicatorUFMap
              valoresPorUf={valoresMapa}
              direcao={mapaDirecao}
              formato="{:.1f}"
              unidade={unidadeMedida(medida, filtro.tipo, moeda)}
              selectedUf={geoSigla}
              onSelectUf={onSelecionarGeo}
              formatador={(v) => fmtMedida(v, medida, filtro.tipo, moeda)}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              Sem dados para este recorte.
            </div>
          )}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Clique em uma UF para filtrar o restante da página. O mapa usa uma
          escala contínua do menor ao maior valor — sem juízo de “melhor” ou
          “pior”, já que custos e registros de internação dependem do tamanho e
          da estrutura de cada estado.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex border border-border bg-card"
            role="group"
            aria-label="Agrupamento da tabela"
          >
            {(["uf", "regiao"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={visao === v}
                onClick={() => setVisao(v)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  visao === v
                    ? "bg-brand-dark text-primary-foreground"
                    : "text-muted-foreground hover:bg-brand-soft"
                }`}
              >
                {v === "uf" ? "Por UF" : "Por região"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={baixar}
            className="px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors"
          >
            Baixar CSV
          </button>
        </div>
        <div className="max-h-[470px] overflow-auto border border-border bg-card">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <Cab id="nome">{visao === "uf" ? "UF" : "Região"}</Cab>
                <Cab id="n" className="text-right">
                  Registros
                </Cab>
                <Cab id="custo_total" className="text-right">
                  Custo total
                </Cab>
                <Cab id="custo_medio" className="text-right">
                  Custo médio
                </Cab>
                <Cab id="pct_uti" className="text-right">
                  % UTI
                </Cab>
                <Cab id="letalidade" className="text-right">
                  Óbitos / {filtro.tipo === "parto" ? "100 mil" : "mil"}
                </Cab>
                <Cab id="porMilNv" className="text-right">
                  Custo / mil NV
                </Cab>
                {visao === "regiao" && (
                  <>
                    <Cab id="porMilNvPub" className="text-right">
                      Custo / mil NV púb.
                    </Cab>
                    <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest">
                      IDH
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenadas.map((l) => (
                <TableRow
                  key={l.id}
                  onClick={() => onSelecionarGeo(l.id)}
                  className={`cursor-pointer ${filtro.geo === l.id ? "bg-brand-soft" : ""}`}
                >
                  <TableCell className="whitespace-nowrap">
                    <span className="font-medium">
                      {visao === "uf" ? l.id : l.nome}
                    </span>
                    {visao === "uf" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {l.regiao}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {fmtInt(l.acc.n)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                    {fmtMoeda(l.acc.val_tot * fm, moeda, true)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                    {fmtMoeda((l.acc.val_tot / l.acc.n) * fm, moeda)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {fmtDec((100 * l.acc.n_uti) / l.acc.n, 1)}%
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {fmtDec(
                      (baseLetalidade(filtro.tipo) * l.acc.n_obito) / l.acc.n,
                      1,
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                    {l.porMilNv !== undefined
                      ? fmtMoeda(l.porMilNv, moeda, true)
                      : "—"}
                  </TableCell>
                  {visao === "regiao" && (
                    <>
                      <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                        {l.porMilNvPub !== undefined
                          ? fmtMoeda(l.porMilNvPub, moeda, true)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {l.idh !== undefined
                          ? l.idh.toLocaleString("pt-BR", {
                              minimumFractionDigits: 3,
                            })
                          : "—"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground leading-snug">
          “Custo / mil NV” divide o custo do recorte pelo total de nascidos
          vivos (SINASC, por UF de residência) nos anos selecionados — inclui
          nascimentos fora do SUS.
          {visao === "regiao" &&
            " “Custo / mil NV púb.” usa, como no artigo, só os nascidos vivos em estabelecimentos públicos de 2011–2022 e por isso só aparece com o período completo. IDH regional de 2010."}
        </p>
      </div>
    </div>
  );
}
