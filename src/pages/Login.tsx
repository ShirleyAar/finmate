import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleLogin, userId } = useApp();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
        toast({ 
            title: "Datos incompletos", 
            description: "Por favor ingresa tu correo y contraseña.", 
            variant: "destructive" 
        });
        return;
    }
    
    if (userId) {
        handleLogin(userId);
        toast({ title: "¡Hola de nuevo!", description: "Has iniciado sesión correctamente." });
        navigate("/dashboard");
    } else {
        toast({ title: "Error", description: "No se pudo iniciar sesión.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">Iniciar Sesión</h2>
            <p className="text-muted-foreground mb-6">Accede a tu jardín financiero</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@correo.com" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    required 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <a href="#" className="text-xs text-growth hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="Tu contraseña" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    required 
                />
              </div>
              
              <Button type="submit" className="w-full bg-growth hover:bg-growth/90 text-white" size="lg">
                Ingresar
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-growth hover:underline font-medium">
                    Crear cuenta
                </Link>
            </div>
          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-trust-light to-card border-trust/20 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-trust/20">
                <Lock className="h-12 w-12 text-trust" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Seguridad Garantizada</h3>
              <p className="text-muted-foreground">
                Tus datos están encriptados y seguros. 
                Vuelve a tomar el control de tus finanzas hoy mismo.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// ¡ESTA ES LA LÍNEA QUE TE FALTABA!
export default Login;