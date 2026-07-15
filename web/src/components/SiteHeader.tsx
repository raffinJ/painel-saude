import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo_qualipreneo.jpeg";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="CuidadoPreNeo"
            className="h-10 w-auto object-contain"
          />
          <div className="hidden md:flex flex-col leading-none">
            <span className="font-display italic text-xl text-brand-dark">
              CuidadoPreNeo
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Observatório perinatal
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-widest">
          <Link
            to="/"
            className="text-foreground hover:text-brand-dark transition-colors [&.active]:text-brand-dark"
          >
            Ranking
          </Link>
          <Link
            to="/indicadores"
            className="text-muted-foreground hover:text-foreground transition-colors [&.active]:text-brand-dark [&.active]:font-semibold"
          >
            Indicadores
          </Link>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Mapa
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Comparar
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Metodologia
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-brand-soft transition-colors">
            Baixar dados
          </button>
        </div>
      </div>
    </header>
  );
}
