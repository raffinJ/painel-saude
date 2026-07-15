import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia — CuidadoPreNeo" },
      {
        name: "description",
        content:
          "Fontes de dados, definição dos indicadores e ferramentas usadas na construção do observatório CuidadoPreNeo.",
      },
    ],
  }),
  component: MetodologiaPage,
});

function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="max-w-[880px] mx-auto px-6 md:px-10 pb-24">
        <section className="pt-10 pb-8 border-b border-foreground/90">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-dark mb-4">
            Metodologia
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-[0.95] text-balance">
            De onde vêm os dados e como os indicadores são calculados.
          </h1>
        </section>

        <section className="py-10 space-y-4 border-b border-border">
          <h2 className="font-display text-2xl">O que é o CuidadoPreNeo</h2>
          <p className="text-muted-foreground leading-relaxed">
            O CuidadoPreNeo é um painel público de indicadores de qualidade
            da assistência pré-natal, ao parto e neonatal nos municípios
            brasileiros, desenvolvido no âmbito do Projeto Cuidado Pré e
            Neonatal (Chamada 46/2022 Decit/CNPq), coordenado pela Profa.
            Aline M. Toledo.
          </p>
        </section>

        <section className="py-10 space-y-4 border-b border-border">
          <h2 className="font-display text-2xl">Fontes de dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Os indicadores são calculados a partir de bases públicas do
            DataSUS — principalmente SINASC (Sistema de Informações sobre
            Nascidos Vivos), SIM (Sistema de Informações sobre Mortalidade)
            e CNES (Cadastro Nacional de Estabelecimentos de Saúde). Todos
            os dados são públicos e agregados por município; nenhuma
            informação identificável é utilizada.
          </p>
        </section>

        <section className="py-10 space-y-4 border-b border-border">
          <h2 className="font-display text-2xl">Os indicadores</h2>
          <p className="text-muted-foreground leading-relaxed">
            São 26 indicadores organizados em 5 grupos — Pré-natal, Parto,
            Neonatal, Puerpério e Perinatal —, além do Indicador Composto,
            que resume os grupos em um único número por município. Cada
            indicador tem uma direção definida (maior é melhor ou menor é
            melhor) usada para colorir mapas, heatmaps e rankings.
          </p>
        </section>

        <section className="py-10 space-y-3">
          <h2 className="font-display text-2xl">Ferramentas usadas</h2>
          <p className="text-muted-foreground leading-relaxed">
            Este site foi desenvolvido com o apoio do{" "}
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Claude Code
            </a>{" "}
            (Anthropic), usado no desenvolvimento da aplicação web, e do{" "}
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Lovable
            </a>
            , usado na prototipação do design da interface.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
