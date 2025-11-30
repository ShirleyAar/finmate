import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrendingUp, Sprout, Star } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const { toast } = useToast();

  const handleLogin = () => {
    // Check if user has registered by checking localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    if (registeredUsers.length === 0) {
      toast({
        title: "Registro Requerido",
        description: "Debes crear una cuenta antes de iniciar sesión.",
        variant: "destructive",
      });
      navigate("/register");
    } else if (!user) {
      toast({
        title: "Registro Requerido",
        description: "Primero crea una cuenta para continuar.",
        variant: "destructive",
      });
      navigate("/register");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Central Card */}
          <Card className="p-8 md:p-12 text-center max-w-2xl mx-auto animate-slide-up shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              FinMate — Tu Compañero Financiero
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Haz crecer tu jardín financiero con herramientas simples para gestionar deudas, seguir tu progreso y aprender estrategias inteligentes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-growth hover:bg-growth/90 text-white">
                  Crear Cuenta
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-growth text-growth hover:bg-growth/10"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
            </div>
          </Card>

          {/* Testimonials Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Lo Que Dicen Nuestros Usuarios
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-growth text-growth" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">
                  "El servicio es excelente. Me ayudó a organizar mis deudas de manera simple."
                </p>
                <p className="text-sm font-medium text-muted-foreground">— María G.</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-growth text-growth" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">
                  "Me ayudó a organizar mis deudas. Muy fácil de usar y sin complicaciones."
                </p>
                <p className="text-sm font-medium text-muted-foreground">— Carlos R.</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-growth text-growth" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">
                  "Muy fácil de usar. La planta que crece me motiva a seguir pagando mis deudas."
                </p>
                <p className="text-sm font-medium text-muted-foreground">— Ana L.</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
