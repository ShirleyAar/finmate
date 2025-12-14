import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Flower2, Award, Sparkles } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const STAGE_NAMES = ["Semilla", "Brote", "Planta Joven", "Capullo", "Florecida"];
const STAGE_DESCRIPTIONS = [
  "Tu planta está comenzando su viaje",
  "Un pequeño brote emerge de la tierra",
  "Hojas verdes comienzan a aparecer",
  "El capullo está por abrir",
  "¡Tu planta ha florecido completamente!",
];

const PlantVisual = ({ stage, name, icon }: { stage: number; name: string; icon?: string }) => {
  const stages = [
    // Semilla
    <div key="0" className="relative w-24 h-24 flex items-center justify-center">
      <div className="w-8 h-8 bg-earth rounded-full shadow-lg animate-pulse" />
      <div className="absolute bottom-0 w-16 h-4 bg-earth/30 rounded-full blur-sm" />
    </div>,
    // Brote
    <div key="1" className="relative w-24 h-24 flex items-center justify-center">
      <div className="w-2 h-8 bg-growth rounded-full" />
      <div className="absolute top-4 w-4 h-4 bg-growth-light rounded-full -left-1" />
      <div className="absolute bottom-0 w-16 h-4 bg-earth/30 rounded-full blur-sm" />
    </div>,
    // Planta Joven
    <div key="2" className="relative w-24 h-24 flex items-center justify-center">
      <div className="w-2 h-12 bg-growth rounded-full" />
      <div className="absolute top-2 w-6 h-4 bg-growth rounded-full -left-2 rotate-45" />
      <div className="absolute top-4 w-6 h-4 bg-growth rounded-full -right-2 -rotate-45" />
      <div className="absolute bottom-0 w-16 h-4 bg-earth/30 rounded-full blur-sm" />
    </div>,
    // Capullo
    <div key="3" className="relative w-24 h-24 flex items-center justify-center">
      <div className="w-2 h-14 bg-growth rounded-full" />
      <div className="absolute top-0 w-8 h-8 bg-growth-light rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-growth rounded-full" />
      </div>
      <div className="absolute top-6 w-6 h-4 bg-growth rounded-full -left-2 rotate-45" />
      <div className="absolute top-8 w-6 h-4 bg-growth rounded-full -right-2 -rotate-45" />
      <div className="absolute bottom-0 w-16 h-4 bg-earth/30 rounded-full blur-sm" />
    </div>,
    // Florecida
    <div key="4" className="relative w-24 h-24 flex items-center justify-center animate-bounce">
      <div className="text-5xl">{icon || "🌸"}</div>
      <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
    </div>,
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-4 rounded-full bg-gradient-to-br from-growth/20 to-growth-light/30">
        {stages[stage]}
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{STAGE_NAMES[stage]}</span>
    </div>
  );
};

const Garden = () => {
  const navigate = useNavigate();
  const { 
    historicalDebtsPaid, 
    gardenPlants, 
    gardenBadges, 
    getCurrentPlant, 
    getCompletedPlants 
  } = useApp();

  const currentPlant = getCurrentPlant();
  const completedPlants = getCompletedPlants();
  const currentProgress = historicalDebtsPaid % 5;
  const progressPercent = (currentProgress / 5) * 100;

  // Map plant names to icons
  const plantIcons: { [key: string]: string } = {
    "Rosa": "🌹",
    "Girasol": "🌻",
    "Orquídea": "🌸",
    "Tulipán": "🌷",
    "Lirio": "💐",
    "Margarita": "🌼",
    "Jazmín": "🪻",
    "Lavanda": "💜",
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

        <div className="flex items-center gap-3 mb-2">
          <Flower2 className="h-8 w-8 text-growth" />
          <h1 className="text-3xl font-bold text-foreground">Mi Jardín Financiero</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Cada 5 deudas pagadas desbloquean una nueva planta florecida
        </p>

        {/* Stats Card */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-growth/10 to-card border-growth/20 animate-fade-in">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-growth">{historicalDebtsPaid}</p>
              <p className="text-sm text-muted-foreground">Deudas pagadas (histórico)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-earth">{completedPlants.length}</p>
              <p className="text-sm text-muted-foreground">Plantas florecidas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-trust">{gardenBadges.length}</p>
              <p className="text-sm text-muted-foreground">Insignias de jardín</p>
            </div>
          </div>
        </Card>

        {/* Current Plant Progress */}
        {currentPlant && (
          <Card className="p-8 mb-8 animate-scale-in">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Planta en Progreso: {currentPlant.name}
            </h2>
            
            <div className="flex flex-col items-center gap-6">
              <PlantVisual 
                stage={currentPlant.stage} 
                name={STAGE_NAMES[currentPlant.stage]}
                icon={plantIcons[currentPlant.name]}
              />
              
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Progreso del {currentPlant.name}
                  </span>
                  <span className="font-bold text-growth">
                    {currentProgress}/5 deudas
                  </span>
                </div>
                <Progress value={progressPercent} className="h-4" />
                <p className="text-center text-sm text-muted-foreground">
                  {STAGE_DESCRIPTIONS[currentPlant.stage]}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Completed Plants Gallery */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Jardín de Plantas Florecidas
          </h2>
          
          {completedPlants.length === 0 ? (
            <Card className="p-8 text-center">
              <Flower2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aún no tienes plantas florecidas. ¡Completa 5 deudas para desbloquear tu primera planta!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {completedPlants.map((plant) => (
                <Card 
                  key={plant.id} 
                  className="p-4 text-center bg-gradient-to-br from-growth-light/50 to-card border-growth/30 animate-fade-in"
                >
                  <PlantVisual 
                    stage={4} 
                    name={plant.name}
                    icon={plantIcons[plant.name]}
                  />
                  {plant.completedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(plant.completedAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Garden Badges */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-growth" />
            Insignias del Jardín
          </h2>
          
          {gardenBadges.length === 0 ? (
            <Card className="p-8 text-center">
              <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Las insignias se otorgan al completar plantas. ¡Paga 5 deudas para ganar tu primera insignia!
              </p>
            </Card>
          ) : (
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
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-trust/10 to-growth/10">
          <div className="flex items-start gap-4">
            <Flower2 className="h-8 w-8 text-growth flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">¿Cómo funciona el Jardín?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cada vez que pagas completamente una deuda, tu progreso histórico aumenta +1. 
                Al completar 5 deudas, desbloqueas una planta florecida y una insignia. 
                Tu progreso es permanente: agregar nuevas deudas no reduce tus logros.
              </p>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Garden;
