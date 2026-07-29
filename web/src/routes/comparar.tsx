import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ALL_MOCK_MUNICIPIOS,
  SUB_SCORE_LABELS,
  YEARS,
  type Municipality,
  type SubScores,
} from "@/lib/ranking-data";
import { removeFromComparador, useComparador } from "@/lib/comparador";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparador de municípios — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Compare lado a lado o Índice Composto QualiPréNeo e a decomposição por grupo de indicadores de até 4 municípios brasileiros.",
      },
    ],
  }),
  component: ComparadorPage,
});

function ComparadorPage() {
  const ibges = useComparador();
  const municipios = ibges
    .map((ibge) => ALL_MOCK_MUNICIPIOS.find((m) => m.ibge === ibge))
    .filter((m): m is Municipality => m !== undefined);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <section className="pt-10 pb-8 border-b border-foreground/90 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
              Comparador de municípios
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
              Compare até 4 municípios lado a lado.
            </h1>
          </div>
        </section>

        {municipios.length === 0 ? (
          <EmptyState />
        ) : (
          <ComparisonBoard municipios={municipios} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyState() {
  return (
    <section className="py-24 flex flex-col items-center text-center gap-4">
      <p className="text-muted-foreground max-w-md">
        Nenhum município no comparador ainda. Vá até o Ranking, escolha um
        município e clique em "Adicionar ao comparador".
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors"
      >
        Ir para o Ranking
      </Link>
    </section>
  );
}

function ComparisonBoard({ municipios }: { municipios: Municipality[] }) {
  return (
    <div className="mt-8">
      {/* Cartões de resumo */}
      <div
        className="grid gap-4 mb-10"
        style={{
          gridTemplateColumns: `repeat(${municipios.length}, minmax(0, 1fr))`,
        }}
      >
        {municipios.map((m) => (
          <div
            key={m.ibge}
            className="p-5 text-background relative"
            style={{ backgroundColor: "var(--color-brand-dark)" }}
          >
            <button
              onClick={() => removeFromComparador(m.ibge)}
              aria-label={`Remover ${m.name} do comparador`}
              className="absolute top-3 right-3 size-6 rounded-full border border-white/40 hover:bg-white/10 transition-colors text-xs"
            >
              ×
            </button>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              {m.region}
            </div>
            <div className="font-display text-2xl mt-1 leading-tight pr-6">
              {m.name}
            </div>
            <div className="text-sm opacity-80">{m.uf}</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-70">
              Índice Composto
            </div>
            <div className="font-display text-4xl leading-none tabular-nums">
              {m.composite.toFixed(1)}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mt-1">
              {m.rank}º de {m.totalMunicipalities.toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
      </div>

      {/* Decomposição por grupo */}
      <div className="border border-border bg-card mb-10">
        <div className="border-b border-border px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Decomposição por grupo de indicadores · escala 0–100
          </span>
        </div>
        <div className="divide-y divide-border">
          {(Object.keys(SUB_SCORE_LABELS) as (keyof SubScores)[]).map((key) => {
            const max = Math.max(...municipios.map((m) => m.scores[key]));
            return (
              <div
                key={key}
                className="px-5 py-4 grid items-center gap-4"
                style={{
                  gridTemplateColumns: `140px repeat(${municipios.length}, minmax(0, 1fr))`,
                }}
              >
                <span className="font-medium text-sm">
                  {SUB_SCORE_LABELS[key]}
                </span>
                {municipios.map((m) => {
                  const v = m.scores[key];
                  const isMax = v === max;
                  return (
                    <div key={m.ibge} className="flex items-center gap-3">
                      <div className="relative h-1.5 flex-1 bg-muted overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0"
                          style={{
                            width: `${v}%`,
                            backgroundColor: isMax
                              ? "var(--color-brand)"
                              : "var(--color-accent-warm)",
                          }}
                        />
                      </div>
                      <span
                        className={`font-display text-lg leading-none tabular-nums w-8 text-right ${
                          isMax ? "text-brand-dark font-bold" : ""
                        }`}
                      >
                        {v.toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Série histórica */}
      <div className="border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Série 2018–2023 · Índice Composto
          </span>
        </div>
        <div
          className="divide-x divide-border grid"
          style={{
            gridTemplateColumns: `repeat(${municipios.length}, minmax(0, 1fr))`,
          }}
        >
          {municipios.map((m) => {
            const maxTrend = Math.max(...m.trend);
            return (
              <div key={m.ibge} className="p-5">
                <div className="text-sm font-semibold truncate mb-3">
                  {m.name}
                </div>
                <div className="h-16 flex items-end gap-1">
                  {m.trend.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full"
                        style={{
                          height: `${(v / maxTrend) * 100}%`,
                          backgroundColor:
                            i === m.trend.length - 1
                              ? "var(--color-brand-dark)"
                              : "var(--color-muted-foreground)",
                          opacity: i === m.trend.length - 1 ? 1 : 0.4,
                        }}
                      />
                      <span className="font-mono text-[9px] text-muted-foreground">
                        {YEARS[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
