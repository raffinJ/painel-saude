import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadCsv } from "@/lib/csv";
import {
  formatValor,
  indicadorRawCsv,
  type IndicadorData,
  type SeriePonto,
} from "@/lib/indicadores-data";

type Props = {
  serie: SeriePonto[];
  label: string;
  chave: string;
  formato: string;
  data: IndicadorData;
};

export function IndicatorTable({ serie, label, chave, formato, data }: Props) {
  const ordenada = [...serie].sort((a, b) => b.ano - a.ano);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label} · série por ano
        </span>
        <button
          onClick={() => {
            const { headers, rows } = indicadorRawCsv(data);
            downloadCsv(`${chave}_dados_brutos.csv`, headers, rows);
          }}
          disabled={!data.municipios.length}
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
