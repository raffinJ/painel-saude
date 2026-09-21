import { useMemo, useState } from "react";
import { normalizeSearch } from "@/lib/search";
import type { RankingMunicipioReal } from "@/lib/ranking-real";

type Props = {
  municipios: RankingMunicipioReal[];
  selected: string[];
  onAdd: (codibge: string) => void;
  onRemove: (codibge: string) => void;
  max: number;
};

export function MunicipioMultiSelect({
  municipios,
  selected,
  onAdd,
  onRemove,
  max,
}: Props) {
  const [query, setQuery] = useState("");
  const cheio = selected.length >= max;

  const matches = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) return [];
    return municipios
      .filter(
        (m) =>
          normalizeSearch(m.name).includes(q) || normalizeSearch(m.uf) === q,
      )
      .slice(0, 8);
  }, [municipios, query]);

  const selecionados = selected
    .map((codibge) => municipios.find((m) => m.codibge === codibge))
    .filter((m): m is RankingMunicipioReal => m !== undefined);

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches.length > 0 && !cheio) {
              onAdd(matches[0].codibge);
              setQuery("");
            }
          }}
          disabled={cheio}
          placeholder={
            cheio
              ? `Máximo de ${max} municípios — remova um para adicionar outro`
              : municipios.length
                ? "Buscar município por nome ou UF…"
                : "Carregando base de municípios…"
          }
          aria-label="Buscar município"
          className="w-full border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        />
        {query && !cheio && (
          <div className="absolute left-0 right-0 top-full z-30 border border-t-0 border-border bg-card shadow-lg max-h-64 overflow-y-auto">
            {matches.length > 0 ? (
              matches.map((m) => {
                const jaSelecionado = selected.includes(m.codibge);
                return (
                  <button
                    key={m.codibge}
                    type="button"
                    disabled={jaSelecionado}
                    onClick={() => {
                      onAdd(m.codibge);
                      setQuery("");
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-brand-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">
                      {m.name}{" "}
                      <span className="text-muted-foreground">· {m.uf}</span>
                    </span>
                    {jaSelecionado && (
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                        já adicionado
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-sm text-muted-foreground">
                Nenhum município encontrado.
              </div>
            )}
          </div>
        )}
      </div>

      {selecionados.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selecionados.map((m) => (
            <span
              key={m.codibge}
              className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 text-xs"
            >
              {m.name} · {m.uf}
              <button
                type="button"
                onClick={() => onRemove(m.codibge)}
                aria-label={`Remover ${m.name} da comparação`}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
