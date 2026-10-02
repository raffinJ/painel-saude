import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  REGIOES,
  agrupar,
  fmtDec,
  fmtInt,
  fmtMoeda,
  nascidosVivos,
  nomeCurtoCid,
  total,
  type Acc,
  type CustosData,
  type Filtro,
  type MedidaId,
  type Moeda,
} from "@/lib/custos-data";

type Props = {
  data: CustosData;
  moeda: Moeda;
  fm: number;
  onExplorar: (f: Partial<Filtro>, medida?: MedidaId) => void;
};

function Card({
  rotulo,
  destaque,
  titulo,
  children,
  onExplorar,
}: {
  rotulo: string;
  destaque: string;
  titulo: string;
  children: React.ReactNode;
  onExplorar: () => void;
}) {
  return (
    <article className="flex flex-col border border-border bg-card p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
        {rotulo}
      </div>
      <div className="font-display text-5xl mt-3 tabular-nums text-brand-dark leading-none">
        {destaque}
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug">{titulo}</h3>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {children}
      </div>
      <button
        type="button"
        onClick={onExplorar}
        className="mt-4 self-start px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors"
      >
        Explorar este achado ↓
      </button>
    </article>
  );
}

const pct = (a: number, b: number) => (b ? (100 * a) / b : 0);

export function CustosAchados({ data, moeda, fm, onExplorar }: Props) {
  const primeiro = data.anos[0];
  const ultimo = data.anos[data.anos.length - 1];
  const f = (tipo: Filtro["tipo"], extra: Partial<Filtro> = {}): Filtro => ({
    tipo,
    anoIni: primeiro,
    anoFim: ultimo,
    geo: "",
    uti: "todas",
    cat: "",
    ...extra,
  });

  const k = useMemo(() => {
    const parto = total(data, f("parto"));
    const neo = total(data, f("neonatal"));
    const cesarea = total(data, f("parto", { cat: "g:Cesárea" }));
    const vaginal = total(data, f("parto", { cat: "g:Vaginal" }));
    const neoUti = total(data, f("neonatal", { uti: "com" }));

    const porCid = agrupar(data, f("neonatal"), (l) => l.cat);
    const cidsOrd = data.cids
      .map((c, i) => ({ ...c, acc: porCid.get(i) as Acc | undefined }))
      .filter((c) => c.cod !== "OUTROS" && c.acc)
      .sort((a, b) => b.acc!.val_tot - a.acc!.val_tot);
    const top20 = cidsOrd.slice(0, 20).reduce((s, c) => s + c.acc!.val_tot, 0);
    const prematuridade = total(
      data,
      f("neonatal", { cat: "g:Prematuridade e baixo peso" }),
    );
    const respiratorios = total(
      data,
      f("neonatal", { cat: "g:Problemas respiratórios" }),
    );

    const serieAno = data.anos.map((ano) => {
      const p = total(data, f("parto", { anoIni: ano, anoFim: ano }));
      const n = total(data, f("neonatal", { anoIni: ano, anoFim: ano }));
      return {
        ano,
        parto: p.val_tot,
        neonatal: n.val_tot,
        letP: (1e5 * p.n_obito) / p.n,
        letN: (1e3 * n.n_obito) / n.n,
      };
    });
    const pico = serieAno.reduce((a, b) => (b.letP > a.letP ? b : a));

    const regioes = REGIOES.map((r) => {
      const p = total(data, f("parto", { geo: r }));
      const n = total(data, f("neonatal", { geo: r }));
      const nv = data.meta.nascidos_vivos_regiao[r];
      const nvTodos = nascidosVivos(
        data,
        data.ufs.filter((u) => u.regiao === r).map((u) => u.sigla),
        primeiro,
        ultimo,
      );
      return {
        regiao: r,
        partoMilNvTodos: (p.val_tot * 1000) / nvTodos,
        partoMilNv: (p.val_tot * 1000) / nv,
        neoMilNv: (n.val_tot * 1000) / nv,
        letN: (1e3 * n.n_obito) / n.n,
        letP: (1e5 * p.n_obito) / p.n,
      };
    });
    return {
      parto,
      neo,
      cesarea,
      vaginal,
      neoUti,
      cidsOrd,
      top20,
      prematuridade,
      respiratorios,
      serieAno,
      pico,
      regioes,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const totalGeral = k.parto.val_tot + k.neo.val_tot;
  const maxRegP = k.regioes.reduce((a, b) =>
    b.partoMilNv > a.partoMilNv ? b : a,
  );
  const minRegP = k.regioes.reduce((a, b) =>
    b.partoMilNv < a.partoMilNv ? b : a,
  );
  const maxTodos = k.regioes.reduce((a, b) =>
    b.partoMilNvTodos > a.partoMilNvTodos ? b : a,
  );
  const minTodos = k.regioes.reduce((a, b) =>
    b.partoMilNvTodos < a.partoMilNvTodos ? b : a,
  );
  const maxLetN = k.regioes.reduce((a, b) => (b.letN > a.letN ? b : a));
  const minLetN = k.regioes.reduce((a, b) => (b.letN < a.letN ? b : a));
  const sA = k.serieAno[0];
  const sZ = k.serieAno[k.serieAno.length - 1];
  const utiPartoTotal = k.cesarea.n_uti + k.vaginal.n_uti;

  const configAno = {
    parto: { label: "Parto", color: "var(--color-brand)" },
    neonatal: { label: "Recém-nascido", color: "var(--color-accent-warm)" },
  } satisfies ChartConfig;
  const dadosAno = k.serieAno.map((s) => ({
    ano: s.ano,
    parto: (s.parto * fm) / 1e9,
    neonatal: (s.neonatal * fm) / 1e9,
  }));

  const top10 = k.cidsOrd.slice(0, 10).map((c) => ({
    cod: c.cod,
    label: `${c.cod} · ${nomeCurtoCid(c.nome)}`,
    valor: (c.acc!.val_tot * fm) / 1e9,
  }));
  const configTop = {
    valor: { label: "Custo", color: "var(--color-accent-warm)" },
  } satisfies ChartConfig;

  return (
    <div>
      {/* manchete + gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-4 border-l-4 border-brand bg-brand-soft/60 px-5 py-6 flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
            {primeiro}–{ultimo} · valores de dez/2023
          </div>
          <div className="font-display text-6xl md:text-7xl mt-3 tabular-nums text-brand-dark leading-none">
            {fmtMoeda(totalGeral * fm, moeda, true).replace(
              /^(R\$|Int\$) /,
              "",
            )}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-brand-dark mt-1">
            {moeda === "int" ? "Int$" : "R$"}
          </div>
          <p className="mt-4 text-base font-semibold leading-snug">
            gastos diretos do SUS com internações para parto e para
            recém-nascidos de 0 a 27 dias.
          </p>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                Partos ({fmtInt(k.parto.n)} internações)
              </dt>
              <dd className="tabular-nums font-medium whitespace-nowrap">
                {fmtMoeda(k.parto.val_tot * fm, moeda, true)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                Recém-nascidos ({fmtInt(k.neo.n)} internações)
              </dt>
              <dd className="tabular-nums font-medium whitespace-nowrap">
                {fmtMoeda(k.neo.val_tot * fm, moeda, true)}
              </dd>
            </div>
          </dl>
          <p className="mt-auto pt-4 text-xs text-muted-foreground leading-snug">
            Segundo o artigo, isso equivale a cerca de 14,6% de todo o gasto com
            internações do SUS no período (8,9% com partos e 5,7% com
            recém-nascidos).
          </p>
        </div>

        <div className="lg:col-span-8 border border-border bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark mb-1">
            Custo por ano · {moeda === "int" ? "Int$" : "R$"} bilhões
          </div>
          <ChartContainer
            config={configAno}
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart
              data={dadosAno}
              margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="ano"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => String(v).slice(2)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                tickFormatter={(v) => fmtDec(Number(v), 0)}
              />
              <ChartTooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {label}
                      </div>
                      {payload.map((p) => (
                        <div
                          key={String(p.dataKey)}
                          className="font-mono tabular-nums"
                        >
                          {p.name}: {moeda === "int" ? "Int$" : "R$"}{" "}
                          {fmtDec(Number(p.value), 2)} bi
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="square"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar
                dataKey="parto"
                name="Parto"
                stackId="a"
                fill="var(--color-brand)"
              />
              <Bar
                dataKey="neonatal"
                name="Recém-nascido"
                stackId="a"
                fill="var(--color-accent-warm)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-5 border border-border bg-card p-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark mb-1">
          10 diagnósticos neonatais mais custosos ·{" "}
          {moeda === "int" ? "Int$" : "R$"} bi
        </div>
        <ChartContainer
          config={configTop}
          className="aspect-auto h-[330px] w-full"
        >
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ left: 0, right: 12, top: 4, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmtDec(Number(v), 1)}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={240}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as {
                  label: string;
                  valor: number;
                };
                return (
                  <div className="max-w-xs rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium leading-snug">{p.label}</div>
                    <div className="font-mono tabular-nums">
                      {moeda === "int" ? "Int$" : "R$"} {fmtDec(p.valor, 2)} bi
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="valor"
              fill="var(--color-accent-warm)"
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* cartões de achados */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card
          rotulo="Via de parto"
          destaque={`${fmtDec(pct(k.cesarea.val_tot, k.parto.val_tot), 0)}%`}
          titulo="do custo dos partos vem das cesáreas"
          onExplorar={() =>
            onExplorar({ tipo: "parto", cat: "g:Cesárea" }, "custo_medio")
          }
        >
          As cesáreas somam {fmtMoeda(k.cesarea.val_tot * fm, moeda, true)},
          contra {fmtMoeda(k.vaginal.val_tot * fm, moeda, true)} dos partos
          vaginais, embora sejam {fmtDec(pct(k.cesarea.n, k.parto.n), 0)}% das
          internações. O custo médio da cesárea é de{" "}
          {fmtMoeda((k.cesarea.val_tot / k.cesarea.n) * fm, moeda)} (vaginal:{" "}
          {fmtMoeda((k.vaginal.val_tot / k.vaginal.n) * fm, moeda)}), e elas
          respondem por {fmtDec(pct(k.cesarea.n_uti, utiPartoTotal), 0)}% das
          internações de parto com UTI.
        </Card>

        <Card
          rotulo="UTI neonatal"
          destaque={`${fmtDec(pct(k.neoUti.val_tot, k.neo.val_tot), 0)}%`}
          titulo="do custo neonatal está nas internações com UTI"
          onExplorar={() =>
            onExplorar({ tipo: "neonatal", uti: "com" }, "custo_total")
          }
        >
          Só {fmtDec(pct(k.neoUti.n, k.neo.n), 0)}% dos recém-nascidos
          internados usam UTI, mas essas internações custam em média{" "}
          {fmtMoeda((k.neoUti.val_tot / k.neoUti.n) * fm, moeda)} — o valor de
          UTI sozinho é {fmtMoeda((k.neoUti.val_uti / k.neoUti.n) * fm, moeda)}{" "}
          por internação — e duram {fmtDec(k.neoUti.dias / k.neoUti.n, 0)} dias,
          em média.
        </Card>

        <Card
          rotulo="Diagnósticos"
          destaque={`${fmtDec(pct(k.top20, k.neo.val_tot), 0)}%`}
          titulo="do custo neonatal concentrado em 20 diagnósticos"
          onExplorar={() =>
            onExplorar(
              { tipo: "neonatal", cat: "g:Prematuridade e baixo peso" },
              "custo_total",
            )
          }
        >
          “{k.cidsOrd[0].nome}” (CID {k.cidsOrd[0].cod}) sozinho responde por{" "}
          {fmtDec(pct(k.cidsOrd[0].acc!.val_tot, k.neo.val_tot), 0)}% do custo.
          Entre os 30 diagnósticos mais custosos, os problemas respiratórios
          somam {fmtDec(pct(k.respiratorios.val_tot, k.neo.val_tot), 0)}% e
          prematuridade e baixo peso{" "}
          {fmtDec(pct(k.prematuridade.val_tot, k.neo.val_tot), 0)}% do custo
          neonatal. A icterícia neonatal é o diagnóstico mais frequente, mas de
          baixo custo.
        </Card>

        <Card
          rotulo="Mortalidade materna intra-hospitalar"
          destaque={`${fmtDec(sA.letP, 1)} → ${fmtDec(sZ.letP, 1)}`}
          titulo="óbitos por 100 mil internações de parto, 2011 → 2022"
          onExplorar={() => onExplorar({ tipo: "parto" }, "letalidade")}
        >
          A taxa subiu entre 2011 e 2022, com pico de {fmtDec(k.pico.letP, 1)}{" "}
          em {k.pico.ano}, ano marcado pela pandemia de COVID-19 — quase 10
          vezes a dos Estados Unidos em 2021, segundo o artigo. Atenção: são
          óbitos ocorridos dentro da internação, não a razão de mortalidade
          materna oficial.
        </Card>

        <Card
          rotulo="Mortalidade neonatal intra-hospitalar"
          destaque={`${fmtDec(sA.letN, 1)} → ${fmtDec(sZ.letN, 1)}`}
          titulo="óbitos por mil internações de recém-nascidos, 2011 → 2022"
          onExplorar={() => onExplorar({ tipo: "neonatal" }, "letalidade")}
        >
          Ao contrário da materna, a mortalidade neonatal hospitalar caiu a cada
          ano da série. Considerando todo o período, é mais alta no{" "}
          {maxLetN.regiao} ({fmtDec(maxLetN.letN, 1)} por mil) e mais baixa no{" "}
          {minLetN.regiao} ({fmtDec(minLetN.letN, 1)} por mil).
        </Card>

        <Card
          rotulo="Desigualdade regional"
          destaque={`${fmtDec(maxRegP.partoMilNv / minRegP.partoMilNv, 1)}×`}
          titulo="entre a maior e a menor região no custo de partos por mil nascidos vivos (hospitais públicos)"
          onExplorar={() => onExplorar({ tipo: "parto" }, "custo_total")}
        >
          O {maxRegP.regiao} gasta{" "}
          {fmtMoeda(maxRegP.partoMilNv * fm, moeda, true)} com partos por mil
          nascidos vivos em hospitais públicos; o {minRegP.regiao},{" "}
          {fmtMoeda(minRegP.partoMilNv * fm, moeda, true)}. Mas esse denominador
          conta só nascimentos em hospitais públicos: dividindo pelo total de
          nascidos vivos (inclusive fora do SUS), a diferença cai para{" "}
          {fmtDec(maxTodos.partoMilNvTodos / minTodos.partoMilNvTodos, 1)}× (
          {maxTodos.regiao}:{" "}
          {fmtMoeda(maxTodos.partoMilNvTodos * fm, moeda, true)};{" "}
          {minTodos.regiao}:{" "}
          {fmtMoeda(minTodos.partoMilNvTodos * fm, moeda, true)}). A conclusão
          depende muito do denominador escolhido. Veja a tabela “Por região”
          com o IDH logo abaixo.
        </Card>
      </div>
    </div>
  );
}
