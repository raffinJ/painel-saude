import {
  MEDIDAS,
  REGIOES,
  labelTipo,
  type CustosData,
  type Filtro,
  type MedidaId,
  type Moeda,
  type Tipo,
  type UtiFiltro,
} from "@/lib/custos-data";

type Props = {
  data: CustosData;
  filtro: Filtro;
  medida: MedidaId;
  moeda: Moeda;
  onFiltro: (f: Filtro) => void;
  onMedida: (m: MedidaId) => void;
  onMoeda: (m: Moeda) => void;
  onLimpar: () => void;
};

const selectCls =
  "border border-border bg-card px-2 py-1.5 text-xs font-sans normal-case tracking-normal w-full min-w-0";
const labelCls =
  "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block";

function Segmentado<T extends string>({
  opcoes,
  valor,
  onChange,
  nome,
}: {
  opcoes: { id: T; label: string }[];
  valor: T;
  onChange: (v: T) => void;
  nome: string;
}) {
  return (
    <div
      role="group"
      aria-label={nome}
      className="flex border border-border bg-card"
    >
      {opcoes.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={valor === o.id}
          onClick={() => onChange(o.id)}
          className={`flex-1 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            valor === o.id
              ? "bg-brand-dark text-primary-foreground"
              : "text-muted-foreground hover:bg-brand-soft hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CustosFiltros({
  data,
  filtro,
  medida,
  moeda,
  onFiltro,
  onMedida,
  onMoeda,
  onLimpar,
}: Props) {
  const set = (parcial: Partial<Filtro>) => onFiltro({ ...filtro, ...parcial });
  const anos = data.anos;

  const grupos = Array.from(
    new Set(
      filtro.tipo === "parto"
        ? data.vias.map((v) => v.grupo)
        : data.cids.map((c) => c.grupo),
    ),
  );

  return (
    <div className="border border-border bg-card/60 p-4 md:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-5 gap-y-4">
        <div className="lg:col-span-4">
          <span className={labelCls}>Tipo de internação</span>
          <Segmentado<Tipo>
            nome="Tipo de internação"
            valor={filtro.tipo}
            onChange={(tipo) => {
              // categorias e medidas mudam de sentido entre parto e neonatal
              onFiltro({ ...filtro, tipo, cat: "" });
            }}
            opcoes={[
              { id: "parto", label: "Parto" },
              { id: "neonatal", label: "Recém-nascido" },
            ]}
          />
          <div className="mt-1.5 text-[11px] text-muted-foreground">
            {labelTipo(filtro.tipo)}
          </div>
        </div>

        <div className="lg:col-span-3">
          <span className={labelCls}>Período</span>
          <div className="flex items-center gap-2">
            <select
              aria-label="Ano inicial"
              value={filtro.anoIni}
              onChange={(e) => {
                const anoIni = Number(e.target.value);
                set({ anoIni, anoFim: Math.max(anoIni, filtro.anoFim) });
              }}
              className={`${selectCls} font-mono`}
            >
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground">a</span>
            <select
              aria-label="Ano final"
              value={filtro.anoFim}
              onChange={(e) => {
                const anoFim = Number(e.target.value);
                set({ anoFim, anoIni: Math.min(anoFim, filtro.anoIni) });
              }}
              className={`${selectCls} font-mono`}
            >
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-5">
          <span className={labelCls}>Local da internação</span>
          <select
            aria-label="Local da internação"
            value={filtro.geo}
            onChange={(e) => set({ geo: e.target.value })}
            className={selectCls}
          >
            <option value="">Brasil</option>
            <optgroup label="Região">
              {REGIOES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </optgroup>
            {REGIOES.map((r) => (
              <optgroup key={r} label={`UF · ${r}`}>
                {data.ufs
                  .filter((u) => u.regiao === r)
                  .map((u) => (
                    <option key={u.sigla} value={u.sigla}>
                      {u.nome} ({u.sigla})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="lg:col-span-5">
          <span className={labelCls}>
            {filtro.tipo === "parto"
              ? "Via de parto"
              : "Diagnóstico principal (CID-10)"}
          </span>
          <select
            aria-label="Categoria"
            value={filtro.cat}
            onChange={(e) => set({ cat: e.target.value })}
            className={selectCls}
          >
            <option value="">
              {filtro.tipo === "parto"
                ? "Todas as vias de parto"
                : "Todos os diagnósticos"}
            </option>
            <optgroup
              label={filtro.tipo === "parto" ? "Grupos" : "Grupos clínicos"}
            >
              {grupos.map((g) => (
                <option key={g} value={`g:${g}`}>
                  {g}
                </option>
              ))}
            </optgroup>
            <optgroup
              label={
                filtro.tipo === "parto"
                  ? "Procedimentos"
                  : "Diagnósticos mais custosos"
              }
            >
              {filtro.tipo === "parto"
                ? data.vias.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))
                : data.cids
                    .filter((c) => c.cod !== "OUTROS")
                    .map((c) => (
                      <option key={c.cod} value={c.cod}>
                        {c.cod} · {c.nome}
                      </option>
                    ))}
            </optgroup>
          </select>
        </div>

        <div className="lg:col-span-3">
          <span className={labelCls}>Uso de UTI</span>
          <Segmentado<UtiFiltro>
            nome="Uso de UTI"
            valor={filtro.uti}
            onChange={(uti) => set({ uti })}
            opcoes={[
              { id: "todas", label: "Todas" },
              { id: "com", label: "Com UTI" },
              { id: "sem", label: "Sem UTI" },
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <span className={labelCls}>Moeda</span>
          <Segmentado<Moeda>
            nome="Moeda"
            valor={moeda}
            onChange={onMoeda}
            opcoes={[
              { id: "brl", label: "R$" },
              { id: "int", label: "Int$" },
            ]}
          />
        </div>

        <div className="lg:col-span-5">
          <span className={labelCls}>Medida nos gráficos</span>
          <select
            aria-label="Medida"
            value={medida}
            onChange={(e) => onMedida(e.target.value as MedidaId)}
            className={selectCls}
          >
            {MEDIDAS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-7 flex items-end justify-between gap-4">
          <p className="text-[11px] leading-snug text-muted-foreground max-w-xl">
            Valores de custo corrigidos pela inflação pelo IPCA para dezembro de
            2023 (um real de 2011 vale mais de um real de 2023, então todos os
            anos são trazidos para o mesmo preço). Int$ = dólar internacional
            (paridade do poder de compra de 2,44 R$/Int$). Mortalidade = óbitos
            ocorridos <em>dentro</em> da internação.
          </p>
          <button
            type="button"
            onClick={onLimpar}
            className="shrink-0 px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
