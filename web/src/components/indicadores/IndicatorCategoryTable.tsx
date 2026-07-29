import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadCsv } from "@/lib/csv";
import {
  formatValor,
  indicadorRawCsv,
  type IndicadorDataCategorias,
  type SeriePonto,
} from "@/lib/indicadores-data";

type Props = {
  seriesPorCategoria: Record<string, SeriePonto[]>;
  categorias: string[];
  anos: number[];
  label: string;
  chave: string;
  formato: string;
  data: IndicadorDataCategorias;
};

export function IndicatorCategoryTable({
  seriesPorCategoria,
  categorias,
  anos,
  label,
  chave,
  formato,
  data,
}: Props) {
  const anosOrdenados = [...anos].sort((a, b) => b - a);

  const valorEm = (cat: string, ano: number) => seriesPorCategoria[cat]?.find((p) => p.ano === ano)?.valor;

  const temAlgumDado = anosOrdenados.some((ano) => categorias.some((c) => valorEm(c, ano) !== undefined));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label} · todas as categorias por ano
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
      <div className="max-h-72 overflow-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              {categorias.map((cat) => (
                <TableHead key={cat} className="text-right whitespace-nowrap">
                  {cat}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {temAlgumDado ? (
              anosOrdenados.map((ano) => (
                <TableRow key={ano}>
                  <TableCell className="font-mono">{ano}</TableCell>
                  {categorias.map((cat) => (
                    <TableCell key={cat} className="text-right font-mono tabular-nums whitespace-nowrap">
                      {formatValor(valorEm(cat, ano), formato)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={1 + categorias.length} className="text-center text-muted-foreground">
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
