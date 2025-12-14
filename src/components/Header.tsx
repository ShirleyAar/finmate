import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-growth/10 group-hover:bg-growth/20 transition-colors">
            <Sprout className="h-6 w-6 text-growth" />
          </div>
          <span className="text-xl font-semibold text-foreground">Klimba</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/faq" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Preguntas
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
