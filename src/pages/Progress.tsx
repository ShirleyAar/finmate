import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Sprout, Flower2, Leaf } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { getDebtProgress, getPlantStage, debts } = useApp();
  
  const progress = getDebtProgress();
  const plantStage = getPlantStage();

  const plantStages = [
    { stage: 1, name: "Semilla", icon: Sprout, description: "Tu viaje financiero comienza" },
    { stage: 2, name: "Brote", icon: Sprout, description: "Primeros pasos hacia la libertad" },
    { stage: 3, name: "Planta Joven", icon: Leaf, description: "Creciendo con constancia" },
    { stage: 4, name: "Planta Media", icon: Leaf, description: "Avanzando significativamente" },
    { stage: 5, name: "Planta Madura", icon: Flower2, description: "Casi en la meta" },
    { stage: 6, name: "Planta Florecida", icon: Flower2, description: "¡Libertad financiera alcanzada!" },
  ];

  const currentStage = plantStages[plantStage - 1];
  const CurrentIcon = currentStage.icon;

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.paid, 0);
  const remaining = totalDebt - totalPaid;

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Tu Jardín Financiero</h1>
        <p className="text-muted-foreground mb-8">Observa cómo crece tu progreso</p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Plant Stage Card */}
          <Card className="p-8 bg-gradient-to-br from-growth-light to-card border-growth/20 animate-fade-in">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-8 rounded-full bg-growth/20">
                <CurrentIcon className="h-32 w-32 text-growth" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{currentStage.name}</h3>
                <p className="text-muted-foreground">{currentStage.description}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso de Deudas</span>
                  <span className="font-bold text-growth">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>
          </Card>

          {/* Progress Details Card */}
          <Card className="p-8 animate-scale-in">
            <h3 className="text-2xl font-bold text-foreground mb-6">Detalles de Progreso</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Deuda Total</span>
                <span className="text-2xl font-bold text-foreground">${formatCurrency(totalDebt)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-growth/10 rounded-lg">
                <span className="text-muted-foreground">Pagado</span>
                <span className="text-2xl font-bold text-growth">${formatCurrency(totalPaid)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-earth/10 rounded-lg">
                <span className="text-muted-foreground">Restante</span>
                <span className="text-2xl font-bold text-earth">${formatCurrency(remaining)}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">Etapas de Crecimiento</h4>
                <div className="space-y-2">
                  {plantStages.map((stage) => {
                    const StageIcon = stage.icon;
                    const isComplete = plantStage > stage.stage;
                    const isCurrent = plantStage === stage.stage;
                    
                    return (
                      <div 
                        key={stage.stage}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          isCurrent ? "bg-growth/10" : isComplete ? "bg-muted/30" : "opacity-50"
                        }`}
                      >
                        <StageIcon className={`h-5 w-5 ${isComplete || isCurrent ? "text-growth" : "text-muted-foreground"}`} />
                        <span className={`text-sm ${isCurrent ? "font-semibold text-growth" : "text-foreground"}`}>
                          {stage.name}
                        </span>
                        {isComplete && <span className="ml-auto text-xs text-growth">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Individual Debts Progress */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Progreso por Deuda</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debts.map((debt) => {
              const debtProgress = Math.round((debt.paid / debt.amount) * 100);
              
              return (
                <Card key={debt.id} className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">{debt.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pagado</span>
                      <span className="font-medium">${formatCurrency(debt.paid)} / ${formatCurrency(debt.amount)}</span>
                    </div>
                    <Progress value={debtProgress} className="h-2" />
                    <div className="text-right">
                      <span className="text-sm font-semibold text-growth">{debtProgress}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgressPage;
