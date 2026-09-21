import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatValor,
  type IndicadorData,
  type SeriePonto,
} from "@/lib/indicadores-data";
import { BRASIL_CODIBGE } from "@/lib/ranking-real";

type MunicipioSelecionado = { codibge: string; nome: string; uf: string };

type Props = {
  chave: string;
  nome: string;
  municipios: MunicipioSelecionado[];
  onRemove: () => void;
};

function serieDoMunicipio(
  data: IndicadorData,
  codibge: string,
  categoria: string | null,
): SeriePonto[] {
  if (codibge === BRASIL_CODIBGE) {
    if (data.multi_categoria) {
      const cat = categoria ?? data.categorias[0];
      return data.brasil[cat] ?? [];
    }
    return data.brasil;
  }
  if (data.multi_categoria) {
    const m = data.municipios.find((mm) => mm.codibge === codibge);
    const cat = categoria ?? data.categorias[0];
    return m?.series[cat] ?? [];
  }
  const m = data.municipios.find((mm) => mm.codibge === codibge);
  return m?.serie ?? [];
}

export function IndicatorComparisonBlock({
  chave,
  nome,
  municipios,
  onRemove,
}: Props) {
  const [data, setData] = useState<IndicadorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    fetch(`${import.meta.env.BASE_URL}data/indicadores/${chave}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: IndicadorData) => {
        if (cancelled) return;
        setData(d);
        setAno(d.anos[d.anos.length - 1] ?? null);
        setCategoria(d.multi_categoria ? (d.categorias[0] ?? null) : null);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chave]);

  if (loading) {
    return (
      <div className="border border-border bg-card p-5 text-sm text-muted-foreground">
        Carregando {nome}…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border bg-card p-5 text-sm text-muted-foreground">
        Não foi possível carregar os dados de {nome}.
      </div>
    );
  }

  const valores = municipios.map((m) => ({
    ...m,
    valor: serieDoMunicipio(data, m.codibge, categoria).find(
      (p) => p.ano === ano,
    )?.valor,
  }));
  const nums = valores
    .map((v) => v.valor)
    .filter((v): v is number => v !== undefined);
  const min = nums.length ? Math.min(...nums) : undefined;
  const max = nums.length ? Math.max(...nums) : undefined;
  const melhorValor =
    data.direcao === "neutro"
      ? undefined
      : data.direcao === "menor_melhor"
        ? min
        : max;

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-sm">{nome}</span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {data.unidade} ·{" "}
            {data.direcao === "maior_melhor"
              ? "maior é melhor"
              : data.direcao === "menor_melhor"
                ? "menor é melhor"
                : "sem direção definida"}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
          {data.multi_categoria && (
            <select
              value={categoria ?? ""}
              onChange={(e) => setCategoria(e.target.value)}
              className="border border-border bg-card px-2 py-1.5"
            >
              {data.categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <select
            value={ano ?? ""}
            onChange={(e) => setAno(Number(e.target.value))}
            className="border border-border bg-card px-2 py-1.5"
          >
            {data.anos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${nome} da comparação`}
            className="size-7 rounded-full border border-border hover:bg-brand-soft transition-colors normal-case"
          >
            ×
          </button>
        </div>
      </div>

      {/* Cartões de valor no ano selecionado */}
      <div
        className="grid gap-4 p-5"
        style={{
          gridTemplateColumns: `repeat(${municipios.length}, minmax(0, 1fr))`,
        }}
      >
        {valores.map((v) => {
          const isMelhor = melhorValor !== undefined && v.valor === melhorValor;
          const width =
            v.valor !== undefined && max !== undefined && max > 0
              ? (v.valor / max) * 100
              : 0;
          return (
            <div key={v.codibge}>
              <div className="text-sm font-medium truncate">{v.nome}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {v.uf}
              </div>
              <div
                className={`font-display text-3xl mt-1 tabular-nums ${
                  isMelhor ? "text-brand-dark" : ""
                }`}
              >
                {formatValor(v.valor, data.formato)}
              </div>
              <div className="relative h-1.5 mt-2 bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${width}%`,
                    backgroundColor: isMelhor
                      ? "var(--color-brand)"
                      : "var(--color-accent-warm)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Série completa por ano */}
      <div className="border-t border-border max-h-72 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              {municipios.map((m) => (
                <TableHead key={m.codibge} className="text-right">
                  {m.nome}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...data.anos]
              .sort((a, b) => b - a)
              .map((a) => (
                <TableRow key={a}>
                  <TableCell className="font-mono">{a}</TableCell>
                  {municipios.map((m) => (
                    <TableCell
                      key={m.codibge}
                      className="text-right font-mono tabular-nums"
                    >
                      {formatValor(
                        serieDoMunicipio(data, m.codibge, categoria).find(
                          (p) => p.ano === a,
                        )?.valor,
                        data.formato,
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
