import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadCsv } from "@/lib/csv";
import { formatValor, type SeriePonto } from "@/lib/indicadores-data";

type Props = {
  serie: SeriePonto[];
  label: string;
  chave: string;
  formato: string;
};

export function IndicatorTable({ serie, label, chave, formato }: Props) {
  const ordenada = [...serie].sort((a, b) => b.ano - a.ano);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label} · série por ano
        </span>
        <button
          onClick={() =>
            downloadCsv(
              `${chave}_${label.toLowerCase().replace(/\s+/g, "-")}.csv`,
              ["ano", "valor"],
              ordenada.map((p) => [p.ano, p.valor]),
            )
          }
          disabled={!ordenada.length}
          className="px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Baixar CSV
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenada.length ? (
              ordenada.map((p) => (
                <TableRow key={p.ano}>
                  <TableCell className="font-mono">{p.ano}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatValor(p.valor, formato)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Sem dados para este recorte.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
