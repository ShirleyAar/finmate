import { Link, useLocation } from "react-router-dom";
import { Sprout, CreditCard, DollarSign, BookOpen, User } from "lucide-react";

const DashboardHeader = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/debts", label: "Deudas", icon: CreditCard },
    { path: "/income", label: "Ingresos", icon: DollarSign },
    { path: "/lessons", label: "Lecciones", icon: BookOpen },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-growth/10 group-hover:bg-growth/20 transition-colors">
            <Sprout className="h-6 w-6 text-growth" />
          </div>
          <span className="text-xl font-semibold text-foreground">Klimba</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-growth/10 text-growth"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
