import { useIsMobile } from "@/hooks/use-mobile";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  fmtMedida,
  medidaPorId,
  unidadeMedida,
  type MedidaId,
  type Moeda,
  type Tipo,
} from "@/lib/custos-data";

export type PontoAno = { ano: number; valor: number | null };

type Props = {
  serie: PontoAno[];
  medida: MedidaId;
  tipo: Tipo;
  moeda: Moeda;
  anoIni: number;
  anoFim: number;
};

export function CustosSerie({
  serie,
  medida,
  tipo,
  moeda,
  anoIni,
  anoFim,
}: Props) {
  const estreito = useIsMobile();
  const m = medidaPorId(medida);
  const config = {
    valor: { label: m.label, color: "var(--color-brand)" },
  } satisfies ChartConfig;
  const recortado =
    serie.length > 0 &&
    (anoIni > serie[0].ano || anoFim < serie[serie.length - 1].ano);
  const fmt = (v: number | undefined) => fmtMedida(v, medida, tipo, moeda);

  const tooltip = (
    <ChartTooltip
      cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
      content={({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const v = payload[0]?.value;
        return (
          <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
            <div className="font-mono font-medium tabular-nums">
              {fmt(typeof v === "number" ? v : undefined)}
            </div>
          </div>
        );
      }}
    />
  );

  const eixoY = (
    <YAxis
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      width={m.id === "custo_total" ? 74 : 62}
      tickFormatter={(v) => fmtMedida(Number(v), medida, tipo, moeda)}
      domain={m.aditiva || m.id === "pct_uti" ? [0, "auto"] : ["auto", "auto"]}
    />
  );
  const eixoX = (
    <XAxis
      dataKey="ano"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      interval={0}
      tick={{
        fontSize: 11,
        ...(estreito ? { angle: -45, textAnchor: "end" } : {}),
      }}
      height={estreito ? 72 : 46}
      label={{
        value: "Ano",
        position: "insideBottom",
        offset: estreito ? -4 : 0,
      }}
    />
  );
  const area = recortado ? (
    <ReferenceArea
      x1={anoIni}
      x2={anoFim}
      fill="var(--color-brand-soft)"
      fillOpacity={0.9}
      ifOverflow="visible"
    />
  ) : null;

  return (
    <div>
      <div className="mb-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {unidadeMedida(medida, tipo, moeda)}
      </div>
      <ChartContainer config={config} className="aspect-auto h-[290px] w-full">
        {m.aditiva ? (
          <BarChart
            data={serie}
            margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            {area}
            {eixoX}
            {eixoY}
            {tooltip}
            <Bar
              dataKey="valor"
              fill="var(--color-brand)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart
            data={serie}
            margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            {area}
            {eixoX}
            {eixoY}
            {tooltip}
            <Line
              dataKey="valor"
              type="monotone"
              stroke="var(--color-brand)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        )}
      </ChartContainer>
      {recortado && (
        <div className="mt-1 text-[11px] text-muted-foreground">
          A faixa clara marca o período selecionado ({anoIni}–{anoFim}); a série
          mostra todos os anos para dar contexto.
        </div>
      )}
    </div>
  );
}
