import { Fragment, useMemo, useRef, useState } from "react";
import { colorForValue, extentOf, type Direcao } from "@/lib/color-scale";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  ufs: Record<string, SeriePonto[]>;
  anos: number[];
  direcao: Direcao;
  formato: string;
  unidade: string;
  selectedUf?: string;
  onSelectUf: (uf: string) => void;
};

export function IndicatorHeatmap({
  ufs: ufsSeries,
  anos,
  direcao,
  formato,
  unidade,
  selectedUf,
  onSelectUf,
}: Props) {
  const [hover, setHover] = useState<{
    uf: string;
    ano: number;
    valor?: number;
  } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const ufs = useMemo(() => Object.keys(ufsSeries).sort(), [ufsSeries]);

  const grid = useMemo(() => {
    const byUf: Record<string, Record<number, number>> = {};
    for (const uf of ufs) {
      byUf[uf] = {};
      for (const p of ufsSeries[uf] ?? []) byUf[uf][p.ano] = p.valor;
    }
    return byUf;
  }, [ufs, ufsSeries]);

  // Um ano só entra como coluna se pelo menos uma UF tiver dado nele —
  // caso contrário o ano não fez parte da análise deste indicador (ex.:
  // apgar_adequado só apura 2008 e 2023; proporcao_parto_vaginal_profissional
  // só a partir de 2013). Isso é diferente de uma UF sem dado num ano que
  // foi analisado, que continua aparecendo em cinza.
  const anosAnalisados = useMemo(
    () => anos.filter((ano) => ufs.some((uf) => grid[uf]?.[ano] !== undefined)),
    [anos, ufs, grid],
  );

  const [min, max] = useMemo(() => {
    const todos = ufs.flatMap((uf) =>
      (ufsSeries[uf] ?? []).map((p) => p.valor),
    );
    return extentOf(todos);
  }, [ufs, ufsSeries]);

  return (
    <div className="overflow-x-auto">
      <div
        ref={gridRef}
        onMouseMove={handleMouseMove}
        className="relative grid gap-[2px] text-[10px]"
        style={{
          gridTemplateColumns: `56px repeat(${anosAnalisados.length}, minmax(28px, 1fr))`,
        }}
      >
        <div />
        {anosAnalisados.map((ano) => (
          <div
            key={ano}
            className="text-center font-mono text-muted-foreground"
          >
            {ano}
          </div>
        ))}
        {ufs.map((uf) => (
          <Fragment key={uf}>
            <button
              onClick={() => onSelectUf(uf)}
              className={`text-left font-mono uppercase pr-1 hover:text-brand-dark ${
                selectedUf === uf
                  ? "font-bold text-brand-dark"
                  : "text-muted-foreground"
              }`}
            >
              {uf}
            </button>
            {anosAnalisados.map((ano) => {
              const valor = grid[uf]?.[ano];
              return (
                <div
                  key={`${uf}-${ano}`}
                  className="aspect-square cursor-pointer rounded-[2px]"
                  style={{
                    backgroundColor:
                      valor !== undefined
                        ? colorForValue(valor, min, max, direcao)
                        : "var(--color-muted)",
                  }}
                  onClick={() => onSelectUf(uf)}
                  onMouseEnter={() => setHover({ uf, ano, valor })}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </Fragment>
        ))}

        {hover && pos && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="font-mono font-medium">
              {hover.uf} · {hover.ano}
            </div>
            <div className="tabular-nums">
              {formatValor(hover.valor, formato)}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 h-5 flex items-center justify-between text-xs text-muted-foreground">
        <span>Passe o mouse sobre uma célula para ver o valor</span>
        <span className="font-mono text-[10px] uppercase tracking-widest">
          {unidade}
        </span>
      </div>
    </div>
  );
}
