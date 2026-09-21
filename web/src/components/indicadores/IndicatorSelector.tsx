import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { IndicadorMeta } from "@/lib/indicadores-data";

type Props = {
  indicadores: IndicadorMeta[];
  value: string;
  onChange: (chave: string) => void;
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function IndicatorSelector({ indicadores, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const grupos = new Map<string, IndicadorMeta[]>();
  for (const ind of indicadores) {
    if (!grupos.has(ind.grupo)) grupos.set(ind.grupo, []);
    grupos.get(ind.grupo)!.push(ind);
  }

  const selecionado = indicadores.find((i) => i.chave === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto w-full justify-between rounded-md border-input px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-widest shadow-sm"
        >
          <span className="truncate normal-case tracking-normal">
            {selecionado ? selecionado.nome : "Escolha um indicador"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command
          filter={(value, search) =>
            normalize(value).includes(normalize(search)) ? 1 : 0
          }
        >
          <CommandInput placeholder="Buscar indicador por palavra-chave…" />
          <CommandList>
            <CommandEmpty>Nenhum indicador encontrado.</CommandEmpty>
            {[...grupos.entries()].map(([grupo, itens]) => (
              <CommandGroup
                key={grupo}
                heading={grupo}
                className="[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-brand-dark"
              >
                {itens.map((ind) => (
                  <CommandItem
                    key={ind.chave}
                    value={`${ind.nome} ${grupo}`}
                    onSelect={() => {
                      onChange(ind.chave);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === ind.chave ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {ind.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
