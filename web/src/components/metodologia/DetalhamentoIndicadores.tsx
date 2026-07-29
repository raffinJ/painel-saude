import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { METODOLOGIA_INDICADORES } from "@/lib/metodologia-indicadores";
import { normalizeSearch } from "@/lib/search";

export function DetalhamentoIndicadores() {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const q = normalizeSearch(busca);
    if (!q) return METODOLOGIA_INDICADORES;
    return METODOLOGIA_INDICADORES.filter((i) =>
      normalizeSearch(i.titulo).includes(q),
    );
  }, [busca]);

  return (
    <div>
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder={`Buscar entre os ${METODOLOGIA_INDICADORES.length} indicadores…`}
        aria-label="Buscar indicador"
        className="w-full px-3 py-2 mb-4 border border-border bg-card font-mono text-xs uppercase tracking-widest placeholder:normal-case focus:outline-none focus:border-brand"
      />
      {filtrados.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum indicador encontrado para "{busca}".
        </p>
      ) : (
        <Accordion type="multiple">
          {filtrados.map((indicador) => (
            <AccordionItem key={indicador.titulo} value={indicador.titulo}>
              <AccordionTrigger className="font-display text-lg">
                {indicador.titulo}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {indicador.resumo}
                </p>
                <Campo label="Fonte dos dados" texto={indicador.fonte} />
                {indicador.filtros && (
                  <Campo label="Filtros aplicados" texto={indicador.filtros} />
                )}
                <Campo label="Cálculo" texto={indicador.calculo} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

function Campo({ label, texto }: { label: string; texto: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark mb-1">
        {label}
      </div>
      <p className="text-muted-foreground leading-relaxed">{texto}</p>
    </div>
  );
}
