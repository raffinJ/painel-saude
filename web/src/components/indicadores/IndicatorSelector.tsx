import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IndicadorMeta } from "@/lib/indicadores-data";

type Props = {
  indicadores: IndicadorMeta[];
  value: string;
  onChange: (chave: string) => void;
};

export function IndicatorSelector({ indicadores, value, onChange }: Props) {
  const grupos = new Map<string, IndicadorMeta[]>();
  for (const ind of indicadores) {
    if (!grupos.has(ind.grupo)) grupos.set(ind.grupo, []);
    grupos.get(ind.grupo)!.push(ind);
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="font-mono text-[10px] uppercase tracking-widest">
        <SelectValue placeholder="Escolha um indicador" />
      </SelectTrigger>
      <SelectContent>
        {[...grupos.entries()].map(([grupo, itens]) => (
          <SelectGroup key={grupo}>
            <SelectLabel className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
              {grupo}
            </SelectLabel>
            {itens.map((ind) => (
              <SelectItem key={ind.chave} value={ind.chave} className="text-sm">
                {ind.nome}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
