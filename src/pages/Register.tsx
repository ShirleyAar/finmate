import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, handleLogin, userId } = useApp();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({ title: "Términos Requeridos", description: "Por favor acepta los términos.", variant: "destructive" });
      return;
    }

    if (!formData.email || !formData.password || !formData.name) {
      toast({ title: "Información Incompleta", description: "Por favor completa todos los campos.", variant: "destructive" });
      return;
    }

    // 1. Guardar datos del usuario PRIMERO
    const newUser = {
      name: formData.name,
      email: formData.email,
    };
    setUser(newUser);

    // 2. Iniciar sesión
    if (userId) {
        handleLogin(userId);
    }

    toast({
      title: "¡Bienvenido a FinMate!",
      description: `Hola, ${formData.name}. Tu cuenta ha sido creada.`,
    });
    
    // La redirección es manejada por App.tsx al detectar el login, 
    // pero navigate asegura la transición suave.
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">Crea tu Cuenta</h2>
            <p className="text-muted-foreground mb-6">Comienza tu viaje financiero hoy</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" type="text" placeholder="Tu nombre completo" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="tu@correo.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="Crea una contraseña segura" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })} />
                <label htmlFor="terms" className="text-sm text-muted-foreground">Acepto los términos y condiciones</label>
              </div>
              <Button type="submit" className="w-full bg-growth hover:bg-growth/90 text-white" size="lg">Entrar a mi Jardín Financiero</Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-growth hover:underline font-medium">
                Iniciar sesión
              </Link>
            </div>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-trust-light to-card border-trust/20 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-trust/20"><Lock className="h-12 w-12 text-trust" /></div>
              <h3 className="text-2xl font-semibold text-foreground">Tu Privacidad es Importante</h3>
              <p className="text-muted-foreground">No solicitamos datos bancarios ni información financiera sensible.</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;