import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TOP_15,
  BOTTOM_15,
  NATIONAL_MEAN,
  NATIONAL_STDDEV,
} from "@/lib/ranking-data";
import { RouletteRanking } from "@/components/RouletteRanking";
import { MunicipalityDetail } from "@/components/MunicipalityDetail";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ranking Nacional — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Ranking dos municípios brasileiros pelo Índice Composto QualiPréNeo de qualidade da assistência perinatal e materno-infantil.",
      },
      { property: "og:title", content: "Ranking Nacional — CuidadoPreNeo" },
      {
        property: "og:description",
        content:
          "Navegue pelos 15 melhores e 15 piores municípios do Brasil em qualidade da assistência perinatal.",
      },
    ],
  }),
  component: RankingHome,
});

function RankingHome() {
  const [selected, setSelected] = useState(TOP_15[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        {/* Hero / filter bar */}
        <section className="pt-10 pb-8 border-b border-foreground/90">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
                Índice Composto QualiPréNeo · Ano-base 2023
              </div>
              <h1 className="font-display text-5xl md:text-7xl leading-[0.9] text-balance">
                Como cada município do Brasil cuida da mãe e do recém-nascido.
              </h1>
              <p className="mt-5 max-w-md text-muted-foreground">
                Ranking de 5.570 municípios baseado em 43 indicadores de
                pré-natal, parto, neonatal, puerpério e perinatal. Arraste a
                roleta para explorar os extremos.
              </p>
            </div>
            <FilterBar />
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat label="Municípios avaliados" value="5.570" />
            <Stat label="Média nacional" value={NATIONAL_MEAN.toFixed(1)} />
            <Stat label="Desvio padrão" value={`± ${NATIONAL_STDDEV.toFixed(1)}`} />
            <Stat label="Amplitude 2023" value="21.4 – 64.0" />
          </div>
        </section>

        {/* Main split: roulette + detail */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                Roleta · 15 melhores + 15 piores
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-brand" /> Top 15
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: "var(--color-accent-warm)" }}
                  />{" "}
                  Bottom 15
                </span>
              </div>
            </div>
            <div className="border border-border bg-card">
              <RouletteRanking
                top={TOP_15}
                bottom={BOTTOM_15}
                selectedIbge={selected.ibge}
                onSelect={setSelected}
              />
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-7">
            <MunicipalityDetail m={selected} />
          </div>
        </section>

        <MethodologyStrip />
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="px-4 py-2.5 bg-brand-dark text-background font-mono text-[10px] uppercase tracking-widest">
        Índice Composto
      </div>
      <select
        className="px-4 py-2.5 border border-border bg-card font-mono text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand"
        defaultValue="2023"
      >
        {[2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
          <option key={y} value={y}>
            Ano {y}
          </option>
        ))}
      </select>
      <select
        className="px-4 py-2.5 border border-border bg-card font-mono text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand"
        defaultValue="brasil"
      >
        <option value="brasil">Brasil</option>
        <option value="regiao">Por região</option>
        <option value="uf">Por UF</option>
        <option value="regsaude">Região de saúde</option>
      </select>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-4xl md:text-5xl leading-none mt-2 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function MethodologyStrip() {
  const groups = [
    { name: "Pré-natal", count: 12, desc: "Acesso, adequação e qualidade do acompanhamento gestacional." },
    { name: "Parto", count: 8, desc: "Práticas assistenciais e desfechos no momento do parto." },
    { name: "Neonatal", count: 10, desc: "Cuidado ao recém-nascido nos primeiros 28 dias de vida." },
    { name: "Puerpério", count: 6, desc: "Acompanhamento da mãe após o parto." },
    { name: "Perinatal", count: 7, desc: "Mortalidade, letalidade e desfechos combinados." },
  ];
  return (
    <section className="mt-24 pt-12 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
            Como o índice é construído
          </div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            5 grupos temáticos, 43 indicadores.
          </h2>
        </div>
        <a
          href="#"
          className="font-mono text-[10px] uppercase tracking-widest text-brand-dark border-b border-brand-dark pb-1"
        >
          Ler nota metodológica →
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 border-t border-l border-border">
        {groups.map((g) => (
          <div key={g.name} className="p-6 border-r border-b border-border">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Grupo
              </span>
              <span className="font-mono text-[10px] tabular-nums text-brand-dark">
                {g.count} ind.
              </span>
            </div>
            <div className="font-display text-2xl mt-3">{g.name}</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {g.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

