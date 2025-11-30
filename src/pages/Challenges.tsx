import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Trophy, CheckCircle2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Challenges = () => {
  const navigate = useNavigate();
  const { challenges } = useApp();

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Retos Semanales</h1>
        <p className="text-muted-foreground mb-8">Completa retos para ganar insignias especiales</p>

        <div className="space-y-6">
          {challenges.map((challenge) => {
            const progressPercent = Math.round((challenge.progress / challenge.target) * 100);
            
            return (
              <Card 
                key={challenge.id} 
                className={`p-6 transition-all ${
                  challenge.completed 
                    ? "bg-gradient-to-br from-growth-light to-card border-growth/30" 
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    challenge.completed ? "bg-growth/20" : "bg-muted"
                  }`}>
                    {challenge.completed ? (
                      <CheckCircle2 className="h-8 w-8 text-growth" />
                    ) : (
                      <Trophy className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                      </div>
                      {challenge.completed && (
                        <span className="px-3 py-1 rounded-full bg-growth/20 text-growth text-sm font-medium">
                          ¡Completado!
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">
                          {challenge.progress} / {challenge.target}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Recompensa: </span>
                      <span className="text-sm font-semibold text-foreground">{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-growth/10">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-accent" />
            <div>
              <h3 className="font-semibold text-foreground">Retos Semanales</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Los retos se renuevan cada semana. ¡Completa todos para ganar insignias exclusivas!
              </p>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenges;