import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CustosAchados } from "@/components/custos/CustosAchados";
import {
  CustosCategorias,
  type BarraCategoria,
} from "@/components/custos/CustosCategorias";
import { CustosFiltros } from "@/components/custos/CustosFiltros";
import { CustosResumo } from "@/components/custos/CustosResumo";
import { CustosSerie, type PontoAno } from "@/components/custos/CustosSerie";
import { CustosUf } from "@/components/custos/CustosUf";
import {
  agrupar,
  carregarCustos,
  descreverFiltro,
  fatorMoeda,
  medidaPorId,
  total,
  valorMedida,
  type CustosData,
  type Filtro,
  type MedidaId,
  type Moeda,
} from "@/lib/custos-data";

export const Route = createFileRoute("/custos")({
  head: () => ({
    meta: [
      { title: "Custos hospitalares — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Quanto o SUS gasta com internações para parto e com recém-nascidos (2011–2022): custos por via de parto, diagnóstico, UTI, região e UF.",
      },
    ],
  }),
  component: CustosPage,
});

const ARTIGO_URL = "https://doi.org/10.1016/j.vhri.2025.101161";
const GITHUB_URL =
  "https://github.com/raffinJ/childbirth_neonatal_healthcare_costs_article";

function filtroInicial(d: CustosData): Filtro {
  return {
    tipo: "parto",
    anoIni: d.anos[0],
    anoFim: d.anos[d.anos.length - 1],
    geo: "",
    uti: "todas",
    cat: "",
  };
}

function CustosPage() {
  const [data, setData] = useState<CustosData | null>(null);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState<Filtro | null>(null);
  const [medida, setMedida] = useState<MedidaId>("custo_total");
  const [moeda, setMoeda] = useState<Moeda>("brl");
  const [agruparGrupo, setAgruparGrupo] = useState(false);

  useEffect(() => {
    let cancelado = false;
    carregarCustos()
      .then((d) => {
        if (cancelado) return;
        setData(d);
        setFiltro(filtroInicial(d));
      })
      .catch(() => !cancelado && setErro(true));
    return () => {
      cancelado = true;
    };
  }, []);

  const explorar = useCallback(
    (parcial: Partial<Filtro>, m?: MedidaId) => {
      if (!data) return;
      setFiltro({ ...filtroInicial(data), ...parcial });
      if (m) setMedida(m);
      setAgruparGrupo(false);
      requestAnimationFrame(() =>
        document
          .getElementById("explorar")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    },
    [data],
  );

  const fm = data ? fatorMoeda(data, moeda) : 1;

  const acc = useMemo(
    () => (data && filtro ? total(data, filtro) : null),
    [data, filtro],
  );

  const serie: PontoAno[] = useMemo(() => {
    if (!data || !filtro) return [];
    const porAno = agrupar(data, filtro, (l) => l.ano, { ignorarAno: true });
    return data.anos.map((ano) => {
      const a = porAno.get(ano);
      return {
        ano,
        valor: a ? (valorMedida(a, medida, filtro.tipo, fm) ?? null) : null,
      };
    });
  }, [data, filtro, medida, fm]);

  const barras: BarraCategoria[] = useMemo(() => {
    if (!data || !filtro) return [];
    const razao = !medidaPorId(medida).aditiva;
    const minimo = razao ? 50 : 0; // evita razões instáveis em categorias minúsculas
    const lista: BarraCategoria[] = [];
    if (filtro.tipo === "parto") {
      const por = agrupar(data, filtro, (l) => l.cat, { ignorarCat: true });
      data.vias.forEach((v, i) => {
        const a = por.get(i);
        const valor = a ? valorMedida(a, medida, "parto", fm) : undefined;
        if (a && valor !== undefined && a.n >= minimo)
          lista.push({
            id: v.id,
            label: v.label,
            valor,
            n: a.n,
            selecionada: filtro.cat === v.id || filtro.cat === `g:${v.grupo}`,
          });
      });
    } else if (agruparGrupo) {
      const por = agrupar(data, filtro, (l) => data.cids[l.cat].grupo, {
        ignorarCat: true,
      });
      por.forEach((a, grupo) => {
        const valor = valorMedida(a, medida, "neonatal", fm);
        if (valor !== undefined && a.n >= minimo)
          lista.push({
            id: `g:${grupo}`,
            label: grupo,
            valor,
            n: a.n,
            selecionada: filtro.cat === `g:${grupo}`,
          });
      });
    } else {
      const por = agrupar(data, filtro, (l) => l.cat, { ignorarCat: true });
      data.cids.forEach((c, i) => {
        if (c.cod === "OUTROS") return;
        const a = por.get(i);
        const valor = a ? valorMedida(a, medida, "neonatal", fm) : undefined;
        if (a && valor !== undefined && a.n >= minimo)
          lista.push({
            id: c.cod,
            label: `${c.cod} · ${c.nome.length > 34 ? `${c.nome.slice(0, 32)}…` : c.nome}`,
            valor,
            n: a.n,
            selecionada: filtro.cat === c.cod || filtro.cat === `g:${c.grupo}`,
          });
      });
    }
    lista.sort((a, b) => b.valor - a.valor);
    return filtro.tipo === "neonatal" && !agruparGrupo
      ? lista.slice(0, 15)
      : lista;
  }, [data, filtro, medida, fm, agruparGrupo]);

  if (erro) {
    return (
      <Casca>
        <p className="py-20 text-center text-sm text-muted-foreground">
          Não foi possível carregar os dados de custos. Tente recarregar a
          página.
        </p>
      </Casca>
    );
  }
  if (!data || !filtro || !acc) {
    return (
      <Casca>
        <p className="py-20 text-center text-sm text-muted-foreground">
          Carregando dados de custos…
        </p>
      </Casca>
    );
  }

  const m = medidaPorId(medida);
  const [anoIni, anoFim] = [data.anos[0], data.anos[data.anos.length - 1]];

  return (
    <Casca>
      <section className="pt-10 pb-8 border-b border-foreground/90">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
          Custos hospitalares · SIH/SUS · {anoIni}–{anoFim}
        </div>
        <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
          Quanto o SUS gasta com partos e com internações de recém-nascidos?
        </h1>
        <p className="mt-5 max-w-3xl text-muted-foreground leading-relaxed">
          Custos diretos de todas as internações hospitalares pagas pelo SUS
          para <strong>parto</strong> e para{" "}
          <strong>recém-nascidos de 0 a 27 dias</strong>, em todo o Brasil.
          Comece pelos principais achados e depois use os filtros para explorar
          por via de parto, diagnóstico, UTI, região e UF. Resultados do artigo{" "}
          <a
            href={ARTIGO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Healthcare Costs and Main Characteristics of Childbirth and Neonatal
            Inpatient Care From the Brazilian Public Health System Perspective
          </a>{" "}
          (Value in Health Regional Issues, 2025), reproduzidos aqui a partir
          dos dados públicos do SIH.
        </p>
        <div className="mt-5 flex gap-2 items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Moeda dos achados
          </span>
          {(["brl", "int"] as const).map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={moeda === x}
              onClick={() => setMoeda(x)}
              className={`px-3 py-1 border border-border font-mono text-[10px] uppercase tracking-widest ${
                moeda === x
                  ? "bg-brand-dark text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-brand-soft"
              }`}
            >
              {x === "brl" ? "R$" : "Int$"}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="achados">
        <h2 id="achados" className="font-display text-3xl md:text-4xl mb-6">
          Principais achados
        </h2>
        <CustosAchados
          data={data}
          moeda={moeda}
          fm={fm}
          onExplorar={explorar}
        />
      </section>

      <section
        id="explorar"
        className="mt-16 scroll-mt-20 border-t border-foreground/90 pt-10"
        aria-labelledby="explore"
      >
        <h2 id="explore" className="font-display text-3xl md:text-4xl mb-2">
          Explore você mesmo
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Combine os filtros abaixo: tudo na página (números, gráficos, mapa e
          tabela) se atualiza junto.
        </p>

        <CustosFiltros
          data={data}
          filtro={filtro}
          medida={medida}
          moeda={moeda}
          onFiltro={setFiltro}
          onMedida={setMedida}
          onMoeda={setMoeda}
          onLimpar={() => {
            setFiltro(filtroInicial(data));
            setMedida("custo_total");
            setAgruparGrupo(false);
          }}
        />

        <div className="mt-8">
          <CustosResumo
            acc={acc}
            tipo={filtro.tipo}
            moeda={moeda}
            fm={fm}
            descricao={descreverFiltro(data, filtro)}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-dark">
              {m.label} · por ano
            </div>
            <div className="border border-border bg-card p-4">
              <CustosSerie
                serie={serie}
                medida={medida}
                tipo={filtro.tipo}
                moeda={moeda}
                anoIni={filtro.anoIni}
                anoFim={filtro.anoFim}
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-brand-dark">
                {m.label} ·{" "}
                {filtro.tipo === "parto"
                  ? "por via de parto"
                  : agruparGrupo
                    ? "por grupo clínico"
                    : "por diagnóstico (15 mais)"}
              </div>
              {filtro.tipo === "neonatal" && (
                <button
                  type="button"
                  onClick={() => setAgruparGrupo(!agruparGrupo)}
                  className="px-2.5 py-1 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors"
                >
                  {agruparGrupo
                    ? "Ver diagnósticos"
                    : "Agrupar por grupo clínico"}
                </button>
              )}
            </div>
            <div className="border border-border bg-card p-4">
              <CustosCategorias
                barras={barras}
                medida={medida}
                tipo={filtro.tipo}
                moeda={moeda}
                onSelecionar={(id) =>
                  setFiltro({ ...filtro, cat: filtro.cat === id ? "" : id })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CustosUf
            data={data}
            filtro={filtro}
            medida={medida}
            moeda={moeda}
            fm={fm}
            onSelecionarGeo={(geo) =>
              setFiltro({ ...filtro, geo: filtro.geo === geo ? "" : geo })
            }
          />
        </div>
      </section>

      <section
        className="mt-16 border-t border-border pt-10 max-w-3xl space-y-4"
        aria-labelledby="como"
      >
        <h2 id="como" className="font-display text-2xl">
          Como ler estes números
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Fonte:</strong> Sistema de
            Informações Hospitalares do SUS (SIH/SUS), arquivos reduzidos de
            AIH, competências {anoIni}–{anoFim}. Só entram internações pagas
            pelo SUS — partos e recém-nascidos atendidos pela saúde suplementar
            ou de forma particular não aparecem.
          </li>
          <li>
            <strong className="text-foreground">Partos:</strong> internações com
            procedimento principal de parto normal, parto normal em gestação de
            alto risco, parto normal em centro de parto normal, parto cesariano,
            cesariano em gestação de alto risco ou cesariano com laqueadura
            tubária.
          </li>
          <li>
            <strong className="text-foreground">Recém-nascidos:</strong>{" "}
            internações de 0 a 27 dias de vida, agrupadas pelo diagnóstico
            principal (CID-10). Aqui mostramos os 30 diagnósticos de maior
            custo; os demais ficam fora dos gráficos por diagnóstico, mas entram
            nos totais.
          </li>
          <li>
            <strong className="text-foreground">Custo:</strong> valor total da
            AIH (serviços hospitalares + serviços profissionais, incluindo a
            UTI), isto é, o que o SUS pagou — não o custo de produção do
            serviço. Valores de custo corrigidos pela inflação pelo IPCA para
            dezembro de 2023, para que anos diferentes possam ser comparados;
            Int$ usa a paridade do poder de compra do Banco Mundial para 2023
            (2,44 R$/Int$).
          </li>
          <li>
            <strong className="text-foreground">UTI:</strong> internações com
            algum registro de UTI. O custo de UTI conta apenas nessas
            internações.
          </li>
          <li>
            <strong className="text-foreground">
              Mortalidade intra-hospitalar:
            </strong>{" "}
            óbitos ocorridos durante a internação ÷ internações. Não é a
            mortalidade materna ou neonatal oficial, que usa nascidos vivos como
            denominador e inclui óbitos fora do hospital.
          </li>
          <li>
            <strong className="text-foreground">UF:</strong> estado do
            estabelecimento onde ocorreu a internação (não o local de
            residência). Análises por município ficam para uma próxima etapa.
          </li>
          <li>
            Os números foram recalculados a partir dos microdados do SIH com o
            método do artigo e conferem com ele (partos: 23.135.767 internações,
            igual ao publicado; recém-nascidos: diferença de 0,01% por causa de
            pequenas diferenças de extração). Código:{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              repositório do artigo
            </a>
            .
          </li>
        </ul>
      </section>
    </Casca>
  );
}

function Casca({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
