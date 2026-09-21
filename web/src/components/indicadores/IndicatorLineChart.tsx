import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  serie: SeriePonto[];
  label: string;
  formato: string;
  unidade: string;
};

export function IndicatorLineChart({ serie, label, formato, unidade }: Props) {
  const config = {
    valor: { label, color: "var(--color-brand)" },
  } satisfies ChartConfig;

  if (!serie.length) {
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
      <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
        <LineChart
          data={serie}
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
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wide tabular-nums shadow-xl">
                  {formatValor(Number(payload[0]?.value), formato)}{" "}
                  {unidade.toUpperCase()}
                </div>
              );
            }}
          />
          <Line
            dataKey="valor"
            type="monotone"
            stroke="var(--color-valor)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
