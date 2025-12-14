import { Link } from "react-router-dom";
import { Shield, HelpCircle, Lock, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-growth" />
            <span>Privacidad: No solicitamos datos bancarios.</span>
          </div>
          
          <nav className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/faq" 
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-transparent hover:bg-growth/10 hover:border-growth/30 hover:text-growth transition-all duration-200 active:scale-[0.98]"
            >
              <HelpCircle className="h-4 w-4" />
              Preguntas
            </Link>
            <Link 
              to="/privacy" 
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-transparent hover:bg-growth/10 hover:border-growth/30 hover:text-growth transition-all duration-200 active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" />
              Privacidad
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-transparent hover:bg-growth/10 hover:border-growth/30 hover:text-growth transition-all duration-200 active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" />
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
