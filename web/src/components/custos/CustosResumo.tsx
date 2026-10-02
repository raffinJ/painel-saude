import {
  baseLetalidade,
  desvio,
  fmtDec,
  fmtInt,
  fmtMoeda,
  type Acc,
  type Moeda,
  type Tipo,
} from "@/lib/custos-data";

type Props = {
  acc: Acc;
  tipo: Tipo;
  moeda: Moeda;
  fm: number;
  descricao: string;
};

function Kpi({
  label,
  valor,
  detalhe,
}: {
  label: string;
  valor: string;
  detalhe?: string;
}) {
  return (
    <div className="border-l-2 border-brand/50 pl-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-3xl md:text-4xl mt-1.5 tabular-nums text-brand-dark leading-none">
        {valor}
      </div>
      {detalhe && (
        <div className="mt-1.5 text-xs text-muted-foreground tabular-nums">
          {detalhe}
        </div>
      )}
    </div>
  );
}

export function CustosResumo({ acc, tipo, moeda, fm, descricao }: Props) {
  if (acc.n === 0) {
    return (
      <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma internação neste recorte. Tente ampliar o período ou remover
        algum filtro.
      </div>
    );
  }

  const sdTot = desvio(acc.val_tot, acc.val_tot2, acc.n);
  const sdDias = desvio(acc.dias, acc.dias2, acc.n);
  const utiMedio = acc.n_uti > 0 ? acc.val_uti / acc.n_uti : undefined;
  const sdUti = desvio(acc.val_uti, acc.val_uti2, acc.n_uti);

  // UTI é uma parcela dos serviços hospitalares (VAL_SH); o total = SH + SP.
  const uti = Math.min(acc.val_uti, acc.val_sh);
  const hospSemUti = Math.max(acc.val_sh - uti, 0);
  const prof = acc.val_sp;
  const soma = uti + hospSemUti + prof || 1;
  const partes = [
    { id: "uti", label: "UTI", v: uti, cor: "var(--color-accent-warm)" },
    {
      id: "hosp",
      label: "Serviços hospitalares (sem UTI)",
      v: hospSemUti,
      cor: "var(--color-brand)",
    },
    {
      id: "prof",
      label: "Serviços profissionais",
      v: prof,
      cor: "var(--color-chart-4)",
    },
  ];

  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark mb-4">
        {descricao}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-7">
        <Kpi label="Internações" valor={fmtInt(acc.n)} />
        <Kpi
          label="Custo total"
          valor={fmtMoeda(acc.val_tot * fm, moeda, true)}
          detalhe={`${fmtMoeda(acc.val_tot * fm, moeda)}`}
        />
        <Kpi
          label="Custo médio / internação"
          valor={fmtMoeda((acc.val_tot / acc.n) * fm, moeda)}
          detalhe={
            sdTot !== undefined
              ? `DP ${fmtMoeda(sdTot * fm, moeda)}`
              : undefined
          }
        />
        <Kpi
          label="Com UTI"
          valor={`${fmtDec((100 * acc.n_uti) / acc.n, 1)}%`}
          detalhe={
            utiMedio !== undefined
              ? `custo médio de UTI ${fmtMoeda(utiMedio * fm, moeda)}${sdUti !== undefined ? ` (DP ${fmtMoeda(sdUti * fm, moeda)})` : ""}`
              : "sem internações com UTI"
          }
        />
        <Kpi
          label="Permanência média"
          valor={`${fmtDec(acc.dias / acc.n, 1)} dias`}
          detalhe={
            sdDias !== undefined ? `DP ${fmtDec(sdDias, 1)} dias` : undefined
          }
        />
        <Kpi
          label="Mortalidade intra-hospitalar"
          valor={fmtDec(
            (baseLetalidade(tipo) * acc.n_obito) / acc.n,
            tipo === "parto" ? 1 : 1,
          )}
          detalhe={`${tipo === "parto" ? "por 100 mil" : "por 1.000"} internações · ${fmtInt(acc.n_obito)} óbitos`}
        />
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Para onde vai o dinheiro
          </div>
        </div>
        <div
          className="flex h-7 w-full overflow-hidden border border-border"
          role="img"
          aria-label={partes
            .map((p) => `${p.label}: ${((100 * p.v) / soma).toFixed(1)}%`)
            .join("; ")}
        >
          {partes.map((p) => (
            <div
              key={p.id}
              style={{ width: `${(100 * p.v) / soma}%`, background: p.cor }}
              title={`${p.label}: ${fmtMoeda(p.v * fm, moeda, true)}`}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
          {partes.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5"
                style={{ background: p.cor }}
              />
              <span className="text-muted-foreground">{p.label}</span>
              <span className="tabular-nums font-medium">
                {fmtDec((100 * p.v) / soma, 1)}%
              </span>
              <span className="tabular-nums text-muted-foreground">
                · {fmtMoeda(p.v * fm, moeda, true)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
