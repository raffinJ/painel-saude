import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { colorForValue, extentOf, type Direcao } from "@/lib/color-scale";
import { formatValor } from "@/lib/indicadores-data";

type MunicipioProperties = { id: string; name: string };

type MunicipioInfo = { nome: string; uf: string };

type Props = {
  valoresPorCodibge: Record<string, number | undefined>;
  infoPorCodibge: Record<string, MunicipioInfo>;
  direcao: Direcao;
  formato: string;
  selectedCodibge?: string;
  onSelectCodibge: (codibge: string) => void;
};

const WIDTH = 760;
const HEIGHT = 760;
const MIN_SCALE = 1;
const MAX_SCALE = 14;
// Acima desse deslocamento (em px de tela) entre mousedown e mouseup, o
// clique é tratado como arrastar o mapa, não como seleção de município.
const DRAG_CLICK_THRESHOLD = 4;

type Transform = { k: number; x: number; y: number };

export function MunicipalityMap({
  valoresPorCodibge,
  infoPorCodibge,
  direcao,
  formato,
  selectedCodibge,
  onSelectCodibge,
}: Props) {
  const [topology, setTopology] = useState<Topology | null>(null);
  const [hoverCodibge, setHoverCodibge] = useState<string | null>(null);
  const [transform, setTransform] = useState<Transform>({ k: 1, x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{
    lastX: number;
    lastY: number;
    moved: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/geo/brazil-municipios-topo.json`)
      .then((r) => r.json())
      .then((d: Topology) => {
        if (!cancelled) setTopology(d);
      })
      .catch(() => {
        if (!cancelled) setTopology(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const geo = useMemo(() => {
    if (!topology) return null;
    const objectName = Object.keys(topology.objects)[0];
    const object = topology.objects[
      objectName
    ] as GeometryCollection<MunicipioProperties>;
    return feature(topology, object);
  }, [topology]);

  const path = useMemo(() => {
    if (!geo) return null;
    const projection = geoMercator().fitSize(
      [WIDTH, HEIGHT],
      geo as unknown as GeoJSON.GeoJSON,
    );
    return geoPath(projection);
  }, [geo]);

  const [min, max] = useMemo(
    () =>
      extentOf(
        Object.values(valoresPorCodibge).filter(
          (v): v is number => v !== undefined,
        ),
      ),
    [valoresPorCodibge],
  );

  // Um único array calculado por mudança de dados (não a cada hover) — o
  // hover/seleção usa overlays separados por cima, em vez de recolorir e
  // re-renderizar as ~5.560 paths a cada movimento do mouse.
  const municipios = useMemo(() => {
    if (!geo || !path) return [];
    return geo.features.map((f) => {
      // O geojson traz o código IBGE de 7 dígitos (cod_mapa); nossos dados
      // usam o codibge de 6 dígitos (sem o dígito verificador) — ver
      // docs/02-arquitetura.md.
      const codibge = f.properties.id.slice(0, 6);
      const valor = valoresPorCodibge[codibge];
      const d = path(f as never) ?? "";
      const fill =
        valor !== undefined
          ? colorForValue(valor, min, max, direcao)
          : "var(--color-muted)";
      return { codibge, d, fill, valor };
    });
  }, [geo, path, valoresPorCodibge, min, max, direcao]);

  const dPorCodibge = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of municipios) map.set(m.codibge, m.d);
    return map;
  }, [municipios]);

  // Wheel precisa de preventDefault para não rolar a página atrás do mapa —
  // React trata onWheel como passivo por padrão, então o listener precisa
  // ser nativo (mesmo problema resolvido em RouletteRanking.tsx). Depende de
  // `path` (só existe depois que o geo carrega) porque antes disso o
  // componente renderiza o placeholder "Carregando…" em vez do <svg> real —
  // um efeito com deps `[]` rodaria só nesse primeiro render e nunca
  // encontraria `svgRef.current`, deixando o zoom por scroll morto.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const vx = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const vy = ((e.clientY - rect.top) / rect.height) * HEIGHT;
      const factor = e.deltaY < 0 ? 1.25 : 1 / 1.25;
      setTransform((t) => zoomAt(t, vx, vy, factor));
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [path]);

  function zoomAt(
    t: Transform,
    vx: number,
    vy: number,
    factor: number,
  ): Transform {
    const kNew = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.k * factor));
    const ratio = kNew / t.k;
    return {
      k: kNew,
      x: vx * (1 - ratio) + t.x * ratio,
      y: vy * (1 - ratio) + t.y * ratio,
    };
  }

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    dragState.current = { lastX: e.clientX, lastY: e.clientY, moved: 0 };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragState.current;
      const el = svgRef.current;
      if (!drag || !el) return;
      const rect = el.getBoundingClientRect();
      const dxView = ((e.clientX - drag.lastX) / rect.width) * WIDTH;
      const dyView = ((e.clientY - drag.lastY) / rect.height) * HEIGHT;
      drag.moved +=
        Math.abs(e.clientX - drag.lastX) + Math.abs(e.clientY - drag.lastY);
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      setTransform((t) => ({ ...t, x: t.x + dxView, y: t.y + dyView }));
    };
    const onUp = () => {
      dragState.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleMouseMoveOver = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const codibge = target.dataset.codibge;
    setHoverCodibge(codibge ?? null);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((dragState.current?.moved ?? 0) > DRAG_CLICK_THRESHOLD) return;
    const target = e.target as SVGElement;
    const codibge = target.dataset.codibge;
    if (codibge) onSelectCodibge(codibge);
  };

  const zoomButton = (factor: number) => () =>
    setTransform((t) => zoomAt(t, WIDTH / 2, HEIGHT / 2, factor));

  if (!geo || !path) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-muted-foreground">
        Carregando mapa municipal…
      </div>
    );
  }

  const focusCodibge = hoverCodibge ?? selectedCodibge;
  const focusInfo = focusCodibge ? infoPorCodibge[focusCodibge] : undefined;
  const focusValor = focusCodibge ? valoresPorCodibge[focusCodibge] : undefined;
  const focusD = focusCodibge ? dPorCodibge.get(focusCodibge) : undefined;

  const piorEhMenor = direcao === "menor_melhor";
  const legendaEsquerda = direcao === "neutro" ? min : piorEhMenor ? max : min;
  const legendaDireita = direcao === "neutro" ? max : piorEhMenor ? min : max;

  return (
    <div className="relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveOver}
        onMouseLeave={() => setHoverCodibge(null)}
        onClick={handleClick}
      >
        <g
          transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
        >
          {municipios.map((m) => (
            <path
              key={m.codibge}
              d={m.d}
              fill={m.fill}
              data-codibge={m.codibge}
              stroke="none"
            />
          ))}
          {focusD && (
            <path
              d={focusD}
              fill="none"
              stroke="var(--color-foreground)"
              strokeWidth={1.5 / transform.k}
              pointerEvents="none"
            />
          )}
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
        <div className="pointer-events-auto flex gap-1">
          <button
            type="button"
            onClick={zoomButton(1.4)}
            aria-label="Aumentar zoom"
            className="size-7 border border-border bg-card font-mono text-sm hover:bg-brand-soft transition-colors"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomButton(1 / 1.4)}
            aria-label="Diminuir zoom"
            className="size-7 border border-border bg-card font-mono text-sm hover:bg-brand-soft transition-colors"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setTransform({ k: 1, x: 0, y: 0 })}
            aria-label="Redefinir zoom"
            className="px-2 h-7 border border-border bg-card font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors"
          >
            Redefinir
          </button>
        </div>

        {focusCodibge && focusInfo && (
          <div className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-md">
            <div className="font-medium">
              {focusInfo.nome}{" "}
              <span className="text-muted-foreground">· {focusInfo.uf}</span>
            </div>
            <div className="tabular-nums">
              {formatValor(focusValor, formato)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>
          {direcao === "neutro" ? "Menor" : "Pior"} ·{" "}
          {formatValor(legendaEsquerda, formato)}
        </span>
        <div
          className="h-2 flex-1"
          style={{
            background: `linear-gradient(to right, ${legendGradient(min, max, direcao)})`,
          }}
        />
        <span>
          {direcao === "neutro" ? "Maior" : "Melhor"} ·{" "}
          {formatValor(legendaDireita, formato)}
        </span>
      </div>
    </div>
  );
}

function legendGradient(min: number, max: number, direcao: Direcao): string {
  const steps = [0, 0.25, 0.5, 0.75, 1];
  return steps
    .map((t) => {
      const valor = min + t * (max - min);
      return `${colorForValue(valor, min, max, direcao)} ${Math.round(t * 100)}%`;
    })
    .join(", ");
}
