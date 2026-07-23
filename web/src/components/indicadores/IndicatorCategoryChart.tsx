import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  seriesPorCategoria: Record<string, SeriePonto[]>;
  categorias: string[];
  anos: number[];
  formato: string;
  unidade: string;
};

const CORES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

// Nomes de categoria vêm dos dados brutos (podem ter espaço, acento, "/",
// "." — ex. "Enfermeira/Obstetriz", "1. Causas evitáveis") e não são
// identificadores CSS válidos para as variáveis --color-<key> que o
// ChartContainer gera. Por isso usamos chaves sintéticas (cat0, cat1, ...)
// internamente e só mostramos o nome real via ChartConfig.label.
export function IndicatorCategoryChart({
  seriesPorCategoria,
  categorias,
  anos,
  formato,
  unidade,
}: Props) {
  const catKeys = categorias.map((_, i) => `cat${i}`);

  const config = Object.fromEntries(
    catKeys.map((key, i) => [
      key,
      { label: categorias[i], color: CORES[i % CORES.length] },
    ]),
  ) satisfies ChartConfig;

  const dados = anos.map((ano) => {
    const linha: Record<string, number | string> = { ano };
    categorias.forEach((cat, i) => {
      linha[catKeys[i]] =
        seriesPorCategoria[cat]?.find((p) => p.ano === ano)?.valor ?? 0;
    });
    return linha;
  });

  const temAlgumDado = dados.some((linha) =>
    catKeys.some((k) => (linha[k] as number) > 0),
  );
  if (!temAlgumDado) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        Sem série histórica para este recorte.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {unidade}
      </div>
      <ChartContainer config={config} className="aspect-auto h-[300px] w-full">
        <BarChart
          data={dados}
          margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ano"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={56}
            tickFormatter={(v) => formatValor(v, formato)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(v) => `Ano ${v}`}
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono tabular-nums">
                      {formatValor(Number(value), formato)}
                    </span>
                  </div>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {catKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              name={categorias[i]}
              stackId="categorias"
              fill={`var(--color-${key})`}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
