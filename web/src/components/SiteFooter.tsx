import logo from "@/assets/logo_qualipreneo.jpeg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div className="max-w-md">
          <img src={logo} alt="" className="h-10 w-auto object-contain mb-3" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Projeto Cuidado Pré e Neonatal · Chamada 46/2022 Decit/CNPq ·
            Coordenação: Profa. Aline M. Toledo.
          </p>
        </div>
        <div className="flex gap-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-foreground">Metodologia</a>
          <a href="#" className="hover:text-foreground">Microdados</a>
          <a href="#" className="hover:text-foreground">Equipe</a>
          <a href="#" className="hover:text-foreground">Contato</a>
        </div>
      </div>
    </footer>
  );
}
