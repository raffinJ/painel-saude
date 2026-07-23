import { useMemo, useState } from "react";
import { downloadCsv } from "@/lib/csv";
import { formatValor } from "@/lib/indicadores-data";
import { normalizeSearch } from "@/lib/search";
import type { Direcao } from "@/lib/color-scale";

export type MunicipioRankeado = {
  codibge: string;
  nome: string;
  uf: string;
  valor: number;
};

type Props = {
  municipios: MunicipioRankeado[];
  direcao: Direcao;
  formato: string;
  chave: string;
  selectedCodibge?: string;
  onSelectCodibge: (codibge: string) => void;
};

const TOP_N = 30;
const TOP_COLOR = "var(--color-brand)";
const BOTTOM_COLOR = "var(--color-accent-warm)";

export function MunicipalityRanking({
  municipios,
  direcao,
  formato,
  chave,
  selectedCodibge,
  onSelectCodibge,
}: Props) {
  const [aba, setAba] = useState<"piores" | "melhores">("piores");
  const [query, setQuery] = useState("");

  // Ordem "melhor primeiro": indicadores menor_melhor ordenam crescente
  // (menor valor = melhor), os demais ordenam decrescente.
  const ordenados = useMemo(() => {
    const sinal = direcao === "menor_melhor" ? -1 : 1;
    return [...municipios].sort((a, b) => sinal * (b.valor - a.valor));
  }, [municipios, direcao]);

  const total = ordenados.length;
  const melhores = ordenados.slice(0, TOP_N);
  const piores = [...ordenados.slice(-TOP_N)].reverse();
  const lista = aba === "piores" ? piores : melhores;

  const rankPorCodibge = useMemo(() => {
    const map = new Map<string, number>();
    ordenados.forEach((m, i) => map.set(m.codibge, i + 1));
    return map;
  }, [ordenados]);
  const rankOf = (codibge: string) => rankPorCodibge.get(codibge) ?? 0;

  const matches = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) return [];
    return ordenados
      .filter(
        (m) =>
          normalizeSearch(m.nome).includes(q) || normalizeSearch(m.uf) === q,
      )
      .slice(0, 8);
  }, [ordenados, query]);

  const handleDownload = () => {
    downloadCsv(
      `${chave}_ranking_municipios.csv`,
      ["rank", "codibge", "municipio", "uf", "valor"],
      ordenados.map((m, i) => [i + 1, m.codibge, m.nome, m.uf, m.valor]),
    );
  };

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border p-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar entre os ${total.toLocaleString("pt-BR")} municípios…`}
          aria-label="Buscar município"
          className="w-full px-3 py-2 bg-background font-mono text-xs uppercase tracking-widest placeholder:normal-case focus:outline-none"
        />
        {query && (
          <div className="mt-2 max-h-48 overflow-y-auto border border-border">
            {matches.length > 0 ? (
              matches.map((m) => (
                <button
                  key={m.codibge}
                  type="button"
                  onClick={() => {
                    onSelectCodibge(m.codibge);
                    setQuery("");
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-brand-soft transition-colors text-sm"
                >
                  <span className="truncate">
                    {m.nome}{" "}
                    <span className="text-muted-foreground">· {m.uf}</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    #{rankOf(m.codibge)}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum município encontrado.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex border-b border-border font-mono text-[10px] uppercase tracking-widest">
        <button
          type="button"
          onClick={() => setAba("piores")}
          className={`flex-1 px-3 py-2 transition-colors ${aba === "piores" ? "bg-accent-warm-soft text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Piores desempenhos
        </button>
        <button
          type="button"
          onClick={() => setAba("melhores")}
          className={`flex-1 px-3 py-2 transition-colors ${aba === "melhores" ? "bg-brand-soft text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Melhores desempenhos
        </button>
      </div>

      <div className="max-h-[520px] overflow-y-auto divide-y divide-border">
        {lista.map((m) => {
          const rank = rankOf(m.codibge);
          const isSelected = m.codibge === selectedCodibge;
          const accent = aba === "piores" ? BOTTOM_COLOR : TOP_COLOR;
          return (
            <button
              key={m.codibge}
              type="button"
              onClick={() => onSelectCodibge(m.codibge)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-brand-soft/60 ${isSelected ? "bg-brand-soft" : ""}`}
            >
              <span className="w-10 shrink-0 font-mono text-[10px] text-muted-foreground">
                #{rank}
              </span>
              <span className="flex-1 min-w-0 truncate text-sm">
                {m.nome} <span className="text-muted-foreground">· {m.uf}</span>
              </span>
              <span
                className="shrink-0 font-mono text-sm tabular-nums"
                style={{ color: accent }}
              >
                {formatValor(m.valor, formato)}
              </span>
            </button>
          );
        })}
        {!lista.length && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            Sem dados para este ano.
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!total}
          className="w-full px-3 py-2 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Baixar ranking completo (CSV)
        </button>
      </div>
    </div>
  );
}
