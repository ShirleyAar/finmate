import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Award, Zap, Target, PiggyBank, Lock, Flower2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Badges = () => {
  const navigate = useNavigate();
  const { badges, gardenBadges } = useApp();

  const iconMap: { [key: string]: any } = {
    award: Award,
    zap: Zap,
    target: Target,
    "piggy-bank": PiggyBank,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver al Panel
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Insignias</h1>
        <p className="text-muted-foreground mb-8">Celebra tus logros financieros</p>

        {/* Garden Badges Section */}
        {gardenBadges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Flower2 className="h-5 w-5 text-growth" />
                Insignias del Jardín
              </h2>
              <Link to="/garden">
                <Button variant="outline" size="sm" className="border-growth text-growth hover:bg-growth/10">
                  Ver Jardín
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gardenBadges.map((badge) => (
                <Card 
                  key={badge.id} 
                  className="p-6 bg-gradient-to-br from-growth-light to-card border-growth/30 animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {badge.awardedAt && (
                        <p className="text-xs text-growth mt-1">
                          Ganada el {new Date(badge.awardedAt).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Badges Section */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Insignias de Actividad</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon] || Award;
            
            return (
              <Card 
                key={badge.id} 
                className={`p-6 transition-all ${
                  badge.earned 
                    ? "bg-gradient-to-br from-growth-light to-card border-growth/30 animate-fade-in" 
                    : "opacity-60 border-muted"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-6 rounded-full ${
                    badge.earned ? "bg-growth/20" : "bg-muted"
                  }`}>
                    {badge.earned ? (
                      <Icon className="h-12 w-12 text-growth" />
                    ) : (
                      <Lock className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    {badge.earned && badge.date && (
                      <p className="text-xs text-growth font-medium">
                        Ganada el {new Date(badge.date).toLocaleDateString('es-ES')}
                      </p>
                    )}
                    {!badge.earned && (
                      <p className="text-xs text-muted-foreground italic">Insignia bloqueada</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6 bg-gradient-to-r from-growth/10 to-trust/10">
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-growth" />
            <div>
              <h3 className="font-semibold text-foreground">¿Cómo Ganar Insignias?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Insignias del Jardín:</strong> Se ganan al completar 5 deudas pagadas (una planta florecida = una insignia).
                <br />
                <strong>Insignias de Actividad:</strong> Se ganan completando retos semanales y manteniendo rachas de actividad.
              </p>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Badges;
