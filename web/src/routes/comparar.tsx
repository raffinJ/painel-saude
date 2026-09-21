import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MunicipioMultiSelect } from "@/components/comparar/MunicipioMultiSelect";
import { IndicatorMultiSelect } from "@/components/comparar/IndicatorMultiSelect";
import { IndicatorComparisonBlock } from "@/components/comparar/IndicatorComparisonBlock";
import {
  BRASIL_CODIBGE,
  BRASIL_ENTRY,
  fetchRankingReal,
  type RankingMunicipioReal,
} from "@/lib/ranking-real";
import {
  COMPARADOR_MAX,
  addToComparador,
  getComparador,
  removeFromComparador,
  useComparador,
} from "@/lib/comparador";
import type { IndicadorMeta } from "@/lib/indicadores-data";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparador de municípios — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Compare lado a lado qualquer um dos indicadores QualiPréNeo entre até 4 municípios brasileiros.",
      },
    ],
  }),
  component: ComparadorPage,
});

function ComparadorPage() {
  const codibges = useComparador();
  const [todosMunicipios, setTodosMunicipios] = useState<
    RankingMunicipioReal[]
  >([]);
  const [indicadores, setIndicadores] = useState<IndicadorMeta[]>([]);
  const [chavesSelecionadas, setChavesSelecionadas] = useState<string[]>([
    "indicador_composto",
  ]);

  useEffect(() => {
    fetchRankingReal()
      .then(setTodosMunicipios)
      .catch(() => setTodosMunicipios([]));
  }, []);

  // Brasil entra pré-selecionado quando o comparador está vazio (primeira
  // visita, ou depois de remover todo mundo) — só uma vez por montagem,
  // pra não voltar sozinho toda vez que o usuário remove ele de propósito
  // depois de já ter outros municípios escolhidos. Lê o localStorage direto
  // (em vez do `codibges` reativo) porque, com SSR, o primeiro render usa o
  // snapshot do servidor (sempre vazio) antes de sincronizar com o valor
  // real do navegador — se o efeito confiasse em `codibges`, rodaria cedo
  // demais e semearia o Brasil mesmo já havendo municípios salvos.
  const jaSemeouBrasil = useRef(false);
  useEffect(() => {
    if (jaSemeouBrasil.current) return;
    jaSemeouBrasil.current = true;
    if (getComparador().length === 0) addToComparador(BRASIL_CODIBGE);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/indicadores/_index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((idx: IndicadorMeta[]) => {
        if (!cancelled) setIndicadores(idx);
      })
      .catch(() => {
        if (!cancelled) setIndicadores([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Brasil entra como mais uma opção selecionável, ao lado dos municípios
  // reais — permite comparar qualquer indicador contra o agregado nacional.
  const municipiosDisponiveis = useMemo(
    () => [BRASIL_ENTRY, ...todosMunicipios],
    [todosMunicipios],
  );

  const municipios = codibges
    .map((codibge) => municipiosDisponiveis.find((m) => m.codibge === codibge))
    .filter((m): m is RankingMunicipioReal => m !== undefined);

  // Códigos salvos (ex.: de uma sessão antiga) que não existem na base atual
  // — o usuário ainda consegue removê-los pelos chips do seletor acima,
  // mas não entram na comparação porque não há dado nenhum para eles.
  const naoEncontrados = codibges.length - municipios.length;

  const toggleIndicador = (chave: string) => {
    setChavesSelecionadas((atual) =>
      atual.includes(chave)
        ? atual.filter((c) => c !== chave)
        : [...atual, chave],
    );
  };

  const removerIndicador = (chave: string) => {
    setChavesSelecionadas((atual) => atual.filter((c) => c !== chave));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <section className="pt-10 pb-8 border-b border-foreground/90">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
            Comparador de municípios
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
            Compare até {COMPARADOR_MAX} municípios em qualquer indicador.
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Municípios
              </div>
              <MunicipioMultiSelect
                municipios={municipiosDisponiveis}
                selected={codibges}
                onAdd={(codibge) => addToComparador(codibge)}
                onRemove={removeFromComparador}
                max={COMPARADOR_MAX}
              />
              {naoEncontrados > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {naoEncontrados === 1
                    ? "1 município salvo anteriormente"
                    : `${naoEncontrados} municípios salvos anteriormente`}{" "}
                  não{" "}
                  {naoEncontrados === 1
                    ? "foi encontrado"
                    : "foram encontrados"}{" "}
                  na base atual — remova{naoEncontrados === 1 ? "-o" : "-os"}{" "}
                  pelo × acima e busque de novo.
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Indicadores
              </div>
              <IndicatorMultiSelect
                indicadores={indicadores}
                selected={chavesSelecionadas}
                onToggle={toggleIndicador}
                onRemove={removerIndicador}
              />
            </div>
          </div>
        </section>

        {municipios.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8">
            {/* Cartões de resumo — posição real no ranking do indicador composto */}
            <div
              className="grid gap-4 mb-10"
              style={{
                gridTemplateColumns: `repeat(${municipios.length}, minmax(0, 1fr))`,
              }}
            >
              {municipios.map((m) => (
                <div
                  key={m.codibge}
                  className="p-5 text-background relative"
                  style={{ backgroundColor: "var(--color-brand-dark)" }}
                >
                  <button
                    onClick={() => removeFromComparador(m.codibge)}
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
                  {m.codibge === BRASIL_CODIBGE ? (
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-70">
                      Agregado de todos os municípios
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-70">
                        Indicador Composto · 2023
                      </div>
                      <div className="font-display text-4xl leading-none tabular-nums">
                        {m.composite.toFixed(1)}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mt-1">
                        {m.rank}º de{" "}
                        {todosMunicipios.length.toLocaleString("pt-BR")}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {chavesSelecionadas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Escolha ao menos um indicador acima para comparar os municípios
                selecionados.
              </p>
            ) : (
              <div className="grid gap-8">
                {chavesSelecionadas.map((chave) => (
                  <IndicatorComparisonBlock
                    key={chave}
                    chave={chave}
                    nome={
                      indicadores.find((i) => i.chave === chave)?.nome ?? chave
                    }
                    municipios={municipios.map((m) => ({
                      codibge: m.codibge,
                      nome: m.name,
                      uf: m.uf,
                    }))}
                    onRemove={() => removerIndicador(chave)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyState() {
  return (
    <section className="py-24 flex flex-col items-center text-center gap-2">
      <p className="text-muted-foreground max-w-md">
        Nenhum município no comparador ainda. Busque acima por nome ou UF — ou
        vá até o Ranking e clique em "Adicionar ao comparador".
      </p>
    </section>
  );
}
