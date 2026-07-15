import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndicatorSelector } from "@/components/indicadores/IndicatorSelector";
import { IndicatorLineChart } from "@/components/indicadores/IndicatorLineChart";
import { IndicatorUFMap } from "@/components/indicadores/IndicatorUFMap";
import { IndicatorHeatmap } from "@/components/indicadores/IndicatorHeatmap";
import { IndicatorTable } from "@/components/indicadores/IndicatorTable";
import { IndicatorCategoryChart } from "@/components/indicadores/IndicatorCategoryChart";
import { IndicatorCategoryTable } from "@/components/indicadores/IndicatorCategoryTable";
import {
  formatValor,
  scopeLabel,
  serieForScope,
  seriesPorCategoriaForScope,
  ufsSeriesParaCategoria,
  type GeoScope,
  type IndicadorData,
  type IndicadorMeta,
} from "@/lib/indicadores-data";

export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Explore qualquer um dos indicadores QualiPréNeo por Brasil, Região, UF e Município, com série histórica, mapa e heatmap.",
      },
    ],
  }),
  component: IndicadoresPage,
});

function IndicadoresPage() {
  const [indicadores, setIndicadores] = useState<IndicadorMeta[]>([]);
  const [chave, setChave] = useState<string>("");
  const [data, setData] = useState<IndicadorData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [scope, setScope] = useState<GeoScope>({ nivel: "brasil" });
  const [ano, setAno] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);

  // Carrega o índice de indicadores uma vez.
  useEffect(() => {
    let cancelled = false;
    fetch("/data/indicadores/_index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((idx: IndicadorMeta[]) => {
        if (cancelled) return;
        setIndicadores(idx);
        const preferido = idx.find((i) => i.chave === "indicador_composto") ?? idx[0];
        if (preferido) setChave(preferido.chave);
      })
      .catch(() => {
        if (!cancelled) setIndicadores([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Carrega o JSON do indicador selecionado.
  useEffect(() => {
    if (!chave) return;
    let cancelled = false;
    setLoadingData(true);
    fetch(`/data/indicadores/${chave}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: IndicadorData) => {
        if (cancelled) return;
        setData(d);
        setAno(d.anos[d.anos.length - 1] ?? null);
        setScope({ nivel: "brasil" });
        setCategoria(d.multi_categoria ? d.categorias[0] ?? null : null);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chave]);

  const ufToRegiao = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of data?.municipios ?? []) map[m.uf] = m.regiao;
    return map;
  }, [data]);

  const regioes = useMemo(() => (data ? Object.keys(data.regioes) : []), [data]);

  const ufsDaRegiaoSelecionada = useMemo(() => {
    if (!data) return [];
    const regiaoAtual = scope.nivel === "regiao" ? scope.regiao : null;
    return Object.keys(data.ufs)
      .filter((uf) => !regiaoAtual || ufToRegiao[uf] === regiaoAtual)
      .sort();
  }, [data, scope, ufToRegiao]);

  const municipiosDaUf = useMemo(() => {
    const uf = scope.nivel === "uf" || scope.nivel === "municipio" ? scope.uf : null;
    if (!data || !uf) return [];
    return data.municipios.filter((m) => m.uf === uf).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [data, scope]);

  // Ufs reduzidas a um valor único (categoria selecionada, se houver) —
  // formato que o mapa e o heatmap entendem independente de o indicador
  // ter categoria ou não.
  const ufsSeriesUnica = useMemo(
    () => (data ? ufsSeriesParaCategoria(data, categoria ?? undefined) : {}),
    [data, categoria],
  );

  const valoresPorUfNoAno = useMemo(() => {
    const out: Record<string, number | undefined> = {};
    if (ano === null) return out;
    for (const uf of Object.keys(ufsSeriesUnica)) {
      out[uf] = ufsSeriesUnica[uf].find((p) => p.ano === ano)?.valor;
    }
    return out;
  }, [ufsSeriesUnica, ano]);

  const serieAtual = data ? serieForScope(data, scope, categoria ?? undefined) : [];
  const labelAtual = scopeLabel(scope);

  const seriesPorCategoriaAtual = useMemo(
    () => (data?.multi_categoria ? seriesPorCategoriaForScope(data, scope) : {}),
    [data, scope],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <section className="pt-10 pb-8 border-b border-foreground/90">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
            Indicadores QualiPréNeo · 2008–2023
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
            Explore qualquer indicador por Brasil, Região, UF e Município.
          </h1>
          <div className="mt-6 max-w-md">
            {indicadores.length > 0 && chave ? (
              <IndicatorSelector indicadores={indicadores} value={chave} onChange={setChave} />
            ) : (
              <div className="text-sm text-muted-foreground">Carregando indicadores…</div>
            )}
          </div>
        </section>

        {data && (
          <>
            {data.multi_categoria && (
              <div className="mt-6 border border-brand/40 bg-brand-soft px-4 py-3 text-sm">
                Este indicador é apurado por categoria — os gráficos e a tabela "todas as categorias"
                abaixo mostram a quebra completa. O mapa e o heatmap (que precisam de um valor só por
                UF) mostram a categoria selecionada no seletor abaixo.
              </div>
            )}

            {/* Drill-down Brasil > Região > UF > Município */}
            <section className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <button
                onClick={() => setScope({ nivel: "brasil" })}
                className={scope.nivel === "brasil" ? "text-brand-dark font-semibold" : "text-muted-foreground hover:text-foreground"}
              >
                Brasil
              </button>

              <span className="text-muted-foreground">›</span>
              <select
                value={scope.nivel === "regiao" || scope.nivel === "uf" || scope.nivel === "municipio" ? (scope.nivel === "regiao" ? scope.regiao : ufToRegiao[scope.uf] ?? "") : ""}
                onChange={(e) => (e.target.value ? setScope({ nivel: "regiao", regiao: e.target.value }) : setScope({ nivel: "brasil" }))}
                className="border border-border bg-card px-2 py-1.5"
              >
                <option value="">Região</option>
                {regioes.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <span className="text-muted-foreground">›</span>
              <select
                value={scope.nivel === "uf" || scope.nivel === "municipio" ? scope.uf : ""}
                onChange={(e) => (e.target.value ? setScope({ nivel: "uf", uf: e.target.value }) : setScope({ nivel: "brasil" }))}
                className="border border-border bg-card px-2 py-1.5"
              >
                <option value="">UF</option>
                {ufsDaRegiaoSelecionada.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>

              <span className="text-muted-foreground">›</span>
              <select
                value={scope.nivel === "municipio" ? scope.codibge : ""}
                onChange={(e) => {
                  const m = municipiosDaUf.find((mm) => mm.codibge === e.target.value);
                  if (m) setScope({ nivel: "municipio", codibge: m.codibge, nome: m.nome, uf: m.uf });
                }}
                disabled={!municipiosDaUf.length}
                className="border border-border bg-card px-2 py-1.5 disabled:opacity-40"
              >
                <option value="">Município{municipiosDaUf.length ? ` (${municipiosDaUf.length})` : ""}</option>
                {municipiosDaUf.map((m) => (
                  <option key={m.codibge} value={m.codibge}>{m.nome}</option>
                ))}
              </select>

              <span className="ml-auto flex items-center gap-2 normal-case">
                {data.multi_categoria && (
                  <>
                    <span className="text-muted-foreground">Categoria (mapa/heatmap):</span>
                    <select
                      value={categoria ?? ""}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="border border-border bg-card px-2 py-1.5"
                    >
                      {data.categorias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </>
                )}
                <span className="text-muted-foreground">Ano do mapa/heatmap:</span>
                <select
                  value={ano ?? ""}
                  onChange={(e) => setAno(Number(e.target.value))}
                  className="border border-border bg-card px-2 py-1.5 font-mono"
                >
                  {data.anos.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </span>
            </section>

            {/* Valor atual + line chart */}
            <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  {labelAtual}{data.multi_categoria && categoria ? ` · ${categoria}` : ""}
                </span>
                <div className="font-display text-5xl mt-2 tabular-nums">
                  {formatValor(serieAtual.find((p) => p.ano === ano)?.valor, data.formato)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  em {ano} · {data.direcao === "maior_melhor" ? "maior é melhor" : data.direcao === "menor_melhor" ? "menor é melhor" : "sem direção definida"}
                </div>
              </div>
              <div className="lg:col-span-8 border border-border bg-card p-4">
                <IndicatorLineChart
                  serie={serieAtual}
                  label={data.multi_categoria ? `${labelAtual} · ${categoria}` : labelAtual}
                  formato={data.formato}
                />
              </div>
            </section>

            {data.multi_categoria && (
              <section className="mt-12">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  {labelAtual} · todas as categorias
                </div>
                <div className="border border-border bg-card p-4">
                  <IndicatorCategoryChart
                    seriesPorCategoria={seriesPorCategoriaAtual}
                    categorias={data.categorias}
                    anos={data.anos}
                    formato={data.formato}
                  />
                </div>
              </section>
            )}

            {/* Mapa + heatmap */}
            <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  Mapa por UF · {ano}{data.multi_categoria && categoria ? ` · ${categoria}` : ""}
                </div>
                <div className="border border-border bg-card p-4">
                  <IndicatorUFMap
                    valoresPorUf={valoresPorUfNoAno}
                    direcao={data.direcao}
                    formato={data.formato}
                    selectedUf={scope.nivel === "uf" || scope.nivel === "municipio" ? scope.uf : undefined}
                    onSelectUf={(uf) => setScope({ nivel: "uf", uf })}
                  />
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  Heatmap · UF × Ano{data.multi_categoria && categoria ? ` · ${categoria}` : ""}
                </div>
                <div className="border border-border bg-card p-4">
                  <IndicatorHeatmap
                    ufs={ufsSeriesUnica}
                    anos={data.anos}
                    direcao={data.direcao}
                    formato={data.formato}
                    selectedUf={scope.nivel === "uf" || scope.nivel === "municipio" ? scope.uf : undefined}
                    onSelectUf={(uf) => setScope({ nivel: "uf", uf })}
                  />
                </div>
              </div>
            </section>

            {/* Tabela / download */}
            <section className="mt-12">
              {data.multi_categoria ? (
                <IndicatorCategoryTable
                  seriesPorCategoria={seriesPorCategoriaAtual}
                  categorias={data.categorias}
                  anos={data.anos}
                  label={labelAtual}
                  chave={data.chave}
                  formato={data.formato}
                />
              ) : (
                <IndicatorTable serie={serieAtual} label={labelAtual} chave={data.chave} formato={data.formato} />
              )}
            </section>
          </>
        )}

        {loadingData && !data && (
          <div className="mt-12 text-sm text-muted-foreground">Carregando indicador…</div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
