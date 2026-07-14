import { Fragment, useMemo, useState } from "react";
import { colorForValue, extentOf, type Direcao } from "@/lib/color-scale";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  ufs: Record<string, SeriePonto[]>;
  anos: number[];
  direcao: Direcao;
  formato: string;
  selectedUf?: string;
  onSelectUf: (uf: string) => void;
};

export function IndicatorHeatmap({ ufs: ufsSeries, anos, direcao, formato, selectedUf, onSelectUf }: Props) {
  const [hover, setHover] = useState<{ uf: string; ano: number; valor?: number } | null>(null);

  const ufs = useMemo(() => Object.keys(ufsSeries).sort(), [ufsSeries]);

  const grid = useMemo(() => {
    const byUf: Record<string, Record<number, number>> = {};
    for (const uf of ufs) {
      byUf[uf] = {};
      for (const p of ufsSeries[uf] ?? []) byUf[uf][p.ano] = p.valor;
    }
    return byUf;
  }, [ufs, ufsSeries]);

  const [min, max] = useMemo(() => {
    const todos = ufs.flatMap((uf) => (ufsSeries[uf] ?? []).map((p) => p.valor));
    return extentOf(todos);
  }, [ufs, ufsSeries]);

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-[2px] text-[10px]"
        style={{
          gridTemplateColumns: `56px repeat(${anos.length}, minmax(28px, 1fr))`,
        }}
      >
        <div />
        {anos.map((ano) => (
          <div key={ano} className="text-center font-mono text-muted-foreground">
            {String(ano).slice(2)}
          </div>
        ))}
        {ufs.map((uf) => (
          <Fragment key={uf}>
            <button
              onClick={() => onSelectUf(uf)}
              className={`text-left font-mono uppercase pr-1 hover:text-brand-dark ${
                selectedUf === uf ? "font-bold text-brand-dark" : "text-muted-foreground"
              }`}
            >
              {uf}
            </button>
            {anos.map((ano) => {
              const valor = grid[uf]?.[ano];
              return (
                <div
                  key={`${uf}-${ano}`}
                  className="aspect-square cursor-pointer rounded-[2px]"
                  style={{
                    backgroundColor:
                      valor !== undefined ? colorForValue(valor, min, max, direcao) : "var(--color-muted)",
                  }}
                  onClick={() => onSelectUf(uf)}
                  onMouseEnter={() => setHover({ uf, ano, valor })}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="mt-2 h-5 text-xs text-muted-foreground">
        {hover
          ? `${hover.uf} · ${hover.ano} · ${formatValor(hover.valor, formato)}`
          : "Passe o mouse sobre uma célula para ver o valor"}
      </div>
    </div>
  );
}
