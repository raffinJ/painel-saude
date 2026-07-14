import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { colorForValue, extentOf, type Direcao } from "@/lib/color-scale";
import { formatValor } from "@/lib/indicadores-data";

type UfFeature = {
  type: "Feature";
  properties: { sigla: string; name: string };
  geometry: GeoJSON.Geometry;
};
type UfFeatureCollection = { type: "FeatureCollection"; features: UfFeature[] };

type Props = {
  valoresPorUf: Record<string, number | undefined>;
  direcao: Direcao;
  formato: string;
  selectedUf?: string;
  onSelectUf: (uf: string) => void;
};

const WIDTH = 480;
const HEIGHT = 460;

export function IndicatorUFMap({ valoresPorUf, direcao, formato, selectedUf, onSelectUf }: Props) {
  const [geo, setGeo] = useState<UfFeatureCollection | null>(null);
  const [hoverUf, setHoverUf] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/geo/brazil-uf.geojson")
      .then((r) => r.json())
      .then((d: UfFeatureCollection) => {
        if (!cancelled) setGeo(d);
      })
      .catch(() => {
        if (!cancelled) setGeo(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const path = useMemo(() => {
    if (!geo) return null;
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], geo as unknown as GeoJSON.GeoJSON);
    return geoPath(projection);
  }, [geo]);

  const [min, max] = useMemo(
    () => extentOf(Object.values(valoresPorUf).filter((v): v is number => v !== undefined)),
    [valoresPorUf],
  );

  if (!geo || !path) {
    return (
      <div className="flex h-[460px] items-center justify-center text-sm text-muted-foreground">
        Carregando mapa…
      </div>
    );
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full">
        {geo.features.map((f) => {
          const uf = f.properties.sigla;
          const valor = valoresPorUf[uf];
          const d = path({ type: "Feature", properties: {}, geometry: f.geometry } as never) ?? "";
          const fill =
            valor !== undefined ? colorForValue(valor, min, max, direcao) : "var(--color-muted)";
          return (
            <path
              key={uf}
              d={d}
              fill={fill}
              stroke="var(--color-background)"
              strokeWidth={selectedUf === uf ? 2 : 1}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => onSelectUf(uf)}
              onMouseEnter={() => setHoverUf(uf)}
              onMouseLeave={() => setHoverUf(null)}
            />
          );
        })}
      </svg>
      {hoverUf && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-md">
          <div className="font-mono font-medium">{hoverUf}</div>
          <div className="tabular-nums">{formatValor(valoresPorUf[hoverUf], formato)}</div>
        </div>
      )}
    </div>
  );
}
