import { useState } from "react";
import type { Municipality } from "@/lib/ranking-data";
import { SUB_SCORE_LABELS, YEARS } from "@/lib/ranking-data";
import { downloadCsv } from "@/lib/csv";
import { fetchRankingReal } from "@/lib/ranking-real";
import {
  COMPARADOR_MAX,
  addToComparador,
  removeFromComparador,
  useComparador,
} from "@/lib/comparador";

type Props = { m: Municipality };

export function MunicipalityDetail({ m }: Props) {
  const [baixando, setBaixando] = useState(false);
  const isTop = m.rank <= 500;
  const accent = isTop ? "var(--color-brand)" : "var(--color-accent-warm)";
  const maxTrend = Math.max(...m.trend);

  const comparador = useComparador();
  const noComparador = comparador.includes(m.ibge);
  const comparadorCheio = !noComparador && comparador.length >= COMPARADOR_MAX;

  const handleToggleComparador = () => {
    if (noComparador) {
      removeFromComparador(m.ibge);
      return;
    }
    const ok = addToComparador(m.ibge);
    if (!ok) {
      alert(
        `Você pode comparar até ${COMPARADOR_MAX} municípios por vez. Remova um antes de adicionar outro.`,
      );
    }
  };

  const handleDownloadCsv = async () => {
    setBaixando(true);
    try {
      const municipios = await fetchRankingReal();
      downloadCsv(
        "indicador_composto_dados_brutos.csv",
        ["rank", "codibge", "municipio", "uf", "regiao", "indice_composto", "populacao"],
        municipios.map((r) => [
          r.rank,
          r.codibge,
          r.name,
          r.uf,
          r.region,
          r.composite,
          r.population ?? "",
        ]),
      );
    } catch {
      alert("Não foi possível carregar os dados para download. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Header card */}
      <div
        className="p-8 text-background relative overflow-hidden"
        style={{ backgroundColor: "var(--color-brand-dark)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              Munícipio em foco · {m.region}
            </div>
            <h2 className="font-display text-5xl md:text-6xl mt-2 leading-[0.95]">
              {m.name}
            </h2>
            <div className="mt-1 text-sm opacity-80">
              {m.uf} · {m.population.toLocaleString("pt-BR")} hab · IBGE {m.ibge}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              Índice Composto
            </div>
            <div className="font-display text-7xl leading-none tabular-nums">
              {m.composite.toFixed(1)}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mt-1">
              {m.rank}º de {m.totalMunicipalities.toLocaleString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Temporal trend */}
        <div className="mt-8">
          <div className="flex items-end justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              Série 2018–2023
            </span>
            <span className="font-mono text-[10px] opacity-70">
              Δ {(m.trend[m.trend.length - 1] - m.trend[0]).toFixed(1)} pts
            </span>
          </div>
          <div className="h-16 flex items-end gap-1">
            {m.trend.map((v, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-white/70"
                  style={{
                    height: `${(v / maxTrend) * 100}%`,
                    backgroundColor:
                      i === m.trend.length - 1
                        ? "white"
                        : "rgba(255,255,255,0.45)",
                  }}
                />
                <span className="font-mono text-[9px] opacity-60">
                  {YEARS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-scores table */}
      <div className="border border-border bg-card">
        <div className="border-b border-border px-5 py-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Decomposição por grupo de indicadores
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Escala 0–100
          </span>
        </div>
        <div className="divide-y divide-border">
          {(Object.keys(SUB_SCORE_LABELS) as (keyof typeof SUB_SCORE_LABELS)[]).map(
            (key) => {
              const v = m.scores[key];
              return (
                <div
                  key={key}
                  className="px-5 py-4 grid grid-cols-[140px_1fr_60px] items-center gap-4"
                >
                  <span className="font-medium text-sm">
                    {SUB_SCORE_LABELS[key]}
                  </span>
                  <div className="relative h-1.5 bg-muted overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${v}%`,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                  <span className="font-display text-2xl leading-none tabular-nums text-right">
                    {v.toFixed(0)}
                  </span>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors">
          Ver ficha completa
        </button>
        <button
          onClick={handleToggleComparador}
          disabled={comparadorCheio}
          className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
            noComparador
              ? "border-brand-dark bg-brand-soft text-brand-dark hover:bg-brand-soft/70"
              : "border-border bg-card hover:bg-brand-soft"
          }`}
        >
          {noComparador ? "Remover do comparador" : "Adicionar ao comparador"}
        </button>
        <button
          onClick={handleDownloadCsv}
          disabled={baixando}
          className="px-4 py-2 border border-border bg-card text-xs font-bold uppercase tracking-wider hover:bg-brand-soft transition-colors disabled:opacity-50"
        >
          {baixando ? "Baixando…" : "Baixar CSV"}
        </button>
      </div>
    </div>
  );
}