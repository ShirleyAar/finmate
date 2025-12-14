import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "../components/DashboardHeader"; 
import Footer from "../components/Footer"; 
import { ChevronLeft, Zap, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Premium = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = () => {
    // FIX SOLICITADO: El botón no simulará éxito, solo mostrará un mensaje
    // que indica que la pasarela de pago no está activa.
    console.log("Simulación de pago iniciada. La pasarela real no está conectada.");
    
    toast({
        title: "Pasarela de Pago Desactivada",
        description: "El sistema de suscripción Premium no está activo en este momento.",
        variant: "destructive",
    });

    // Se mantiene la navegación a /profile por si el usuario presiona muchas veces
    navigate("/profile"); 
  };

  // FIX: Lista de características más clara. isPremium: true significa que NO es gratis.
  const features = [
    { title: "Gestión básica de Deudas (Añadir/Editar)", isPremium: false },
    { title: "Seguimiento de Pagos y Racha", isPremium: false },
    { title: "Acceso a Micro-Lecciones", isPremium: false },
    { title: "Simulador de Estrategias Avanzadas", isPremium: true }, // ESTÁ INCLUIDO
    { title: "Análisis Predictivo y Proyecciones", isPremium: true }, // ESTÁ INCLUIDO
    { title: "Exportación de Reportes PDF", isPremium: true }, // ESTÁ INCLUIDO
    { title: "Soporte Prioritario 24/7", isPremium: true }, // ESTÁ INCLUIDO
    { title: "Experiencia Sin Publicidad", isPremium: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/profile")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver al Perfil
        </Button>

        <Card className="p-8 md:p-12 text-center bg-white shadow-xl border-green-200">
          <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-foreground mb-3">Klimba Premium</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Desbloquea el poder total de Klimba para acelerar tu libertad financiera.
          </p>

          {/* Precios */}
          <div className="flex justify-center gap-6 mb-10">
            <Card className="p-6 border-growth shadow-lg transition-all transform hover:scale-[1.02] cursor-default">
                <h3 className="text-2xl font-bold text-growth mb-2">Mensual</h3>
                <p className="text-4xl font-extrabold text-foreground mb-1">$9.99<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
                <p className="text-sm text-muted-foreground">Facturado cada mes</p>
            </Card>
            <Card className="p-6 bg-green-50 border-green-400 shadow-xl transition-all transform hover:scale-[1.02] cursor-default relative">
                <span className="absolute top-0 right-0 bg-growth text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">Ahorras 20%</span>
                <h3 className="text-2xl font-bold text-green-700 mb-2">Anual</h3>
                <p className="text-4xl font-extrabold text-foreground mb-1">$99.99<span className="text-lg font-normal text-muted-foreground">/año</span></p>
                <p className="text-sm text-muted-foreground">Ahorra $19.89</p>
            </Card>
          </div>

          {/* Botón de Pago (Simulado) */}
          <Button 
            onClick={handleSubscribe} 
            className="w-full max-w-sm bg-growth hover:bg-growth/90 text-white font-bold text-lg py-7 mx-auto shadow-lg"
          >
            Suscribirme Ahora
          </Button>
        </Card>
        
        {/* Comparación de Características */}
        <Card className="mt-8 p-6 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Comparación de Planes</h2>
            <div className="grid grid-cols-3 gap-4 font-semibold text-sm border-b pb-2 mb-4">
                <div className="text-left">Característica</div>
                <div className="text-center">Gratis</div>
                <div className="text-center text-growth">Premium</div>
            </div>
            
            {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
                    <div className="text-left text-muted-foreground">{feature.title}</div>
                    <div className="text-center">
                        {/* Lógica: Si es Premium (isPremium=true), muestra X (no gratis). Si es Gratis (isPremium=false), muestra Check. */}
                        {feature.isPremium ? <XCircle className="h-5 w-5 text-destructive mx-auto" /> : <CheckCircle className="h-5 w-5 text-growth mx-auto" />}
                    </div>
                    <div className="text-center">
                        <CheckCircle className="h-5 w-5 text-growth mx-auto" />
                    </div>
                </div>
            ))}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;