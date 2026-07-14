import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  serie: SeriePonto[];
  label: string;
  formato: string;
};

export function IndicatorLineChart({ serie, label, formato }: Props) {
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
    <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
      <LineChart data={serie} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="ano" tickLine={false} axisLine={false} tickMargin={8} />
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
              formatter={(value) => [formatValor(Number(value), formato), label]}
            />
          }
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
  );
}
