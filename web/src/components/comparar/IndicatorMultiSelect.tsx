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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { normalizeSearch } from "@/lib/search";
import type { IndicadorMeta } from "@/lib/indicadores-data";

type Props = {
  indicadores: IndicadorMeta[];
  selected: string[];
  onToggle: (chave: string) => void;
  onRemove: (chave: string) => void;
};

export function IndicatorMultiSelect({
  indicadores,
  selected,
  onToggle,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(false);

  const grupos = new Map<string, IndicadorMeta[]>();
  for (const ind of indicadores) {
    if (!grupos.has(ind.grupo)) grupos.set(ind.grupo, []);
    grupos.get(ind.grupo)!.push(ind);
  }

  const selecionados = selected
    .map((chave) => indicadores.find((i) => i.chave === chave))
    .filter((i): i is IndicadorMeta => i !== undefined);

  const triggerLabel =
    selected.length === 0
      ? "Escolha um ou mais indicadores"
      : selected.length === 1
        ? (selecionados[0]?.nome ?? "1 indicador selecionado")
        : `${selected.length} indicadores selecionados`;

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto w-full justify-between rounded-md border-input px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-widest shadow-sm"
          >
            <span className="truncate normal-case tracking-normal">
              {triggerLabel}
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
              normalizeSearch(value).includes(normalizeSearch(search)) ? 1 : 0
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
                      onSelect={() => onToggle(ind.chave)}
                      className="text-sm"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selected.includes(ind.chave)
                            ? "opacity-100"
                            : "opacity-0",
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

      {selecionados.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selecionados.map((ind) => (
            <span
              key={ind.chave}
              className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 text-xs"
            >
              {ind.nome}
              <button
                type="button"
                onClick={() => onRemove(ind.chave)}
                aria-label={`Remover ${ind.nome} da comparação`}
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
