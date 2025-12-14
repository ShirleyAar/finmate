import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Zap, Calendar, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Streaks = () => {
  const navigate = useNavigate();
  const { streak } = useApp();

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Rachas de Actividad</h1>
        <p className="text-muted-foreground mb-8">Mantén tu constancia financiera</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 bg-gradient-to-br from-accent/20 to-card border-accent/30 animate-fade-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-6 rounded-full bg-accent/30">
                <Zap className="h-16 w-16 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Racha Actual</p>
                <p className="text-6xl font-bold text-accent">{streak.current}</p>
                <p className="text-lg text-muted-foreground mt-2">días consecutivos</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-growth-light to-card border-growth/30 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-6 rounded-full bg-growth/30">
                <TrendingUp className="h-16 w-16 text-growth" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Racha Más Larga</p>
                <p className="text-6xl font-bold text-growth">{streak.longest}</p>
                <p className="text-lg text-muted-foreground mt-2">días consecutivos</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <Calendar className="h-6 w-6 text-accent mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Última Actividad</h3>
              <p className="text-muted-foreground">
                {new Date(streak.lastActivityDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-accent/10 to-growth/10">
          <h3 className="font-semibold text-foreground mb-3">¿Cómo Funcionan las Rachas?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Las rachas miden tu constancia en usar Klimba.</p>
            <p>• Cada día que registras una actividad (pago, transacción, lección), tu racha aumenta.</p>
            <p>• Si pasas más de un día sin actividad, tu racha se reinicia.</p>
            <p>• Mantén rachas largas para ganar insignias especiales.</p>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Streaks;
