import { useIsMobile } from "@/hooks/use-mobile";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  fmtInt,
  fmtMedida,
  unidadeMedida,
  type MedidaId,
  type Moeda,
  type Tipo,
} from "@/lib/custos-data";

export type BarraCategoria = {
  id: string;
  label: string;
  valor: number;
  n: number;
  selecionada: boolean;
};

type Props = {
  barras: BarraCategoria[];
  medida: MedidaId;
  tipo: Tipo;
  moeda: Moeda;
  onSelecionar: (id: string) => void;
};

export function CustosCategorias({
  barras,
  medida,
  tipo,
  moeda,
  onSelecionar,
}: Props) {
  const estreito = useIsMobile();
  const config = {
    valor: { label: "Valor", color: "var(--color-brand)" },
  } satisfies ChartConfig;
  if (!barras.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
        Sem dados para este recorte.
      </div>
    );
  }
  const algumaSelecionada = barras.some((b) => b.selecionada);
  const altura = Math.max(180, barras.length * 40 + 40);

  return (
    <div>
      <div className="mb-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {unidadeMedida(medida, tipo, moeda)}
      </div>
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={{ height: altura }}
      >
        <BarChart
          data={barras}
          layout="vertical"
          margin={{ left: 0, right: 16, top: 4, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmtMedida(Number(v), medida, tipo, moeda)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={estreito ? 150 : 270}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: estreito ? 10 : 11 }}
          />
          <ChartTooltip
            cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const b = payload[0].payload as BarraCategoria;
              return (
                <div className="max-w-xs rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                  <div className="font-medium leading-snug">{b.label}</div>
                  <div className="font-mono tabular-nums">
                    {fmtMedida(b.valor, medida, tipo, moeda, false)}
                  </div>
                  <div className="text-muted-foreground tabular-nums">
                    {fmtInt(b.n)} registros de internação
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Clique para filtrar
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="valor"
            radius={[0, 2, 2, 0]}
            className="cursor-pointer"
            onClick={(b) => onSelecionar((b as unknown as BarraCategoria).id)}
          >
            {barras.map((b) => (
              <Cell
                key={b.id}
                fill="var(--color-brand)"
                fillOpacity={b.selecionada || !algumaSelecionada ? 1 : 0.35}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
