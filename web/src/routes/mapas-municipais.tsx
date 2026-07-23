import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IndicatorSelector } from "@/components/indicadores/IndicatorSelector";
import { IndicatorLineChart } from "@/components/indicadores/IndicatorLineChart";
import { MunicipalityMap } from "@/components/mapas/MunicipalityMap";
import {
  MunicipalityRanking,
  type MunicipioRankeado,
} from "@/components/mapas/MunicipalityRanking";
import {
  formatValor,
  serieForScope,
  type IndicadorData,
  type IndicadorMeta,
} from "@/lib/indicadores-data";

export const Route = createFileRoute("/mapas-municipais")({
  head: () => ({
    meta: [
      { title: "Mapas municipais — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Mapa coroplético do Brasil por município para qualquer indicador QualiPréNeo, com ranking dos melhores e piores desempenhos.",
      },
    ],
  }),
  component: MapasMunicipaisPage,
});

function MapasMunicipaisPage() {
  const [indicadores, setIndicadores] = useState<IndicadorMeta[]>([]);
  const [chave, setChave] = useState<string>("");
  const [data, setData] = useState<IndicadorData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [ano, setAno] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [selectedCodibge, setSelectedCodibge] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/indicadores/_index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((idx: IndicadorMeta[]) => {
        if (cancelled) return;
        setIndicadores(idx);
        const preferido =
          idx.find((i) => i.chave === "indicador_composto") ?? idx[0];
        if (preferido) setChave(preferido.chave);
      })
      .catch(() => {
        if (!cancelled) setIndicadores([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!chave) return;
    let cancelled = false;
    setLoadingData(true);
    fetch(`${import.meta.env.BASE_URL}data/indicadores/${chave}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: IndicadorData) => {
        if (cancelled) return;
        setData(d);
        setAno(d.anos[d.anos.length - 1] ?? null);
        setCategoria(d.multi_categoria ? (d.categorias[0] ?? null) : null);
        setSelectedCodibge(undefined);
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

  // Valor de cada município no ano/categoria atual — formato que o mapa e
  // o ranking entendem, independente de o indicador ter categoria ou não.
  const municipiosRankeados = useMemo<MunicipioRankeado[]>(() => {
    if (!data || ano === null) return [];
    const out: MunicipioRankeado[] = [];
    if (data.multi_categoria) {
      const cat = categoria ?? data.categorias[0];
      for (const m of data.municipios) {
        const valor = (m.series[cat] ?? []).find((p) => p.ano === ano)?.valor;
        if (valor !== undefined)
          out.push({ codibge: m.codibge, nome: m.nome, uf: m.uf, valor });
      }
    } else {
      for (const m of data.municipios) {
        const valor = m.serie.find((p) => p.ano === ano)?.valor;
        if (valor !== undefined)
          out.push({ codibge: m.codibge, nome: m.nome, uf: m.uf, valor });
      }
    }
    return out;
  }, [data, ano, categoria]);

  const valoresPorCodibge = useMemo(() => {
    const out: Record<string, number | undefined> = {};
    for (const m of municipiosRankeados) out[m.codibge] = m.valor;
    return out;
  }, [municipiosRankeados]);

  const infoPorCodibge = useMemo(() => {
    const out: Record<string, { nome: string; uf: string }> = {};
    for (const m of data?.municipios ?? [])
      out[m.codibge] = { nome: m.nome, uf: m.uf };
    return out;
  }, [data]);

  const municipioSelecionado = data?.municipios.find(
    (m) => m.codibge === selectedCodibge,
  );
  const serieSelecionada =
    data && municipioSelecionado
      ? serieForScope(
          data,
          {
            nivel: "municipio",
            codibge: municipioSelecionado.codibge,
            nome: municipioSelecionado.nome,
            uf: municipioSelecionado.uf,
          },
          categoria ?? undefined,
        )
      : [];
  const valorSelecionadoNoAno = serieSelecionada.find(
    (p) => p.ano === ano,
  )?.valor;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <section className="pt-10 pb-8 border-b border-foreground/90">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
            Mapas municipais · Brasil · 2008–2023
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
            Explore qualquer indicador nos 5.570 municípios do Brasil.
          </h1>
          <div className="mt-6 max-w-md">
            {indicadores.length > 0 && chave ? (
              <IndicatorSelector
                indicadores={indicadores}
                value={chave}
                onChange={setChave}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                Carregando indicadores…
              </div>
            )}
          </div>
        </section>

        {data && (
          <>
            <section className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
              {data.multi_categoria && (
                <>
                  <span className="text-muted-foreground">Categoria:</span>
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
                </>
              )}
              <span className="ml-0 md:ml-auto text-muted-foreground">
                Ano:
              </span>
              <select
                value={ano ?? ""}
                onChange={(e) => setAno(Number(e.target.value))}
                className="border border-border bg-card px-2 py-1.5 font-mono"
              >
                {data.anos.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </section>

            {/* Município selecionado */}
            <section className="mt-8 border border-border bg-card p-5">
              {municipioSelecionado ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                      {municipioSelecionado.nome} · {municipioSelecionado.uf}
                    </span>
                    <div className="font-display text-5xl mt-2 tabular-nums">
                      {formatValor(valorSelecionadoNoAno, data.formato)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      em {ano}
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <IndicatorLineChart
                      serie={serieSelecionada}
                      label={municipioSelecionado.nome}
                      formato={data.formato}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-6">
                  Clique em um município no mapa ou na lista de ranking para ver
                  o detalhe.
                </div>
              )}
            </section>

            {/* Mapa + ranking */}
            <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  Mapa por município · {ano}
                  {data.multi_categoria && categoria ? ` · ${categoria}` : ""}
                </div>
                <div className="border border-border bg-card p-4">
                  <MunicipalityMap
                    valoresPorCodibge={valoresPorCodibge}
                    infoPorCodibge={infoPorCodibge}
                    direcao={data.direcao}
                    formato={data.formato}
                    selectedCodibge={selectedCodibge}
                    onSelectCodibge={setSelectedCodibge}
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                  Ranking · {ano}
                  {data.multi_categoria && categoria ? ` · ${categoria}` : ""}
                </div>
                <MunicipalityRanking
                  municipios={municipiosRankeados}
                  direcao={data.direcao}
                  formato={data.formato}
                  chave={data.chave}
                  selectedCodibge={selectedCodibge}
                  onSelectCodibge={setSelectedCodibge}
                />
              </div>
            </section>
          </>
        )}

        {loadingData && !data && (
          <div className="mt-12 text-sm text-muted-foreground">
            Carregando indicador…
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
