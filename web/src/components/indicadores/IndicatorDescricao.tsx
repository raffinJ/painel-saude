import { resumoDoIndicador } from "@/lib/metodologia-indicadores";
import type { IndicadorMeta } from "@/lib/indicadores-data";

/** Explicação curta do indicador selecionado + unidade e direção. */
export function IndicatorDescricao({ indicador }: { indicador: IndicadorMeta }) {
  const resumo = resumoDoIndicador(indicador.chave);
  const direcao =
    indicador.direcao === "maior_melhor"
      ? "maior é melhor"
      : indicador.direcao === "menor_melhor"
        ? "menor é melhor"
        : "sem direção definida";

  return (
    <div className="mt-3 max-w-2xl">
      {resumo && (
        <p className="text-sm leading-relaxed text-muted-foreground">{resumo}</p>
      )}
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {indicador.unidade} · {direcao}
      </div>
    </div>
  );
}
