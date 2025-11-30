import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation
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
  const location = useLocation(); // Leemos la URL actual
  const { toast } = useToast();
  const { setUser, handleLogin, userId } = useApp();
  
  // ESTADO INTERNO: Determina si mostramos el login o el registro
  // Inicializamos basado en la URL
  const [isLoginMode, setIsLoginMode] = useState(location.pathname === "/login");

  // EFECTO: Si la URL cambia, actualizamos el modo automáticamente
  useEffect(() => {
    setIsLoginMode(location.pathname === "/login");
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  // Limpiar formulario al cambiar de modo (opcional)
  useEffect(() => {
    setFormData({
        name: "",
        email: "",
        password: "",
        termsAccepted: false,
    });
  }, [isLoginMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- LÓGICA DE INICIO DE SESIÓN ---
    if (isLoginMode) {
        if (!formData.email || !formData.password) {
            toast({ 
                title: "Datos faltantes", 
                description: "Ingresa tu correo y contraseña.", 
                variant: "destructive" 
            });
            return;
        }
        
        // Simular login
        if (userId) {
            handleLogin(userId);
            toast({ title: "¡Bienvenido de nuevo!", description: "Has iniciado sesión." });
            navigate("/dashboard");
        }
        return;
    }

    // --- LÓGICA DE REGISTRO ---
    if (!formData.termsAccepted) {
      toast({ title: "Acepta los términos", description: "Es necesario aceptar los términos.", variant: "destructive" });
      return;
    }

    if (!formData.email || !formData.password || !formData.name) {
      toast({ title: "Información incompleta", description: "Completa todos los campos.", variant: "destructive" });
      return;
    }

    // Guardar datos del nuevo usuario
    setUser({ name: formData.name, email: formData.email });
    
    // Iniciar sesión automáticamente
    if (userId) handleLogin(userId);

    toast({ title: "¡Cuenta Creada!", description: `Bienvenido, ${formData.name}.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          
          <Card className="p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">
                {isLoginMode ? "Iniciar Sesión" : "Crea tu Cuenta"}
            </h2>
            <p className="text-muted-foreground mb-6">
                {isLoginMode ? "Accede a tu jardín financiero" : "Comienza tu viaje financiero hoy"}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* CAMPO NOMBRE: Oculto en Login */}
              {!isLoginMode && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                        id="name" 
                        type="text" 
                        placeholder="Tu nombre completo" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required={!isLoginMode} 
                    />
                  </div>
              )}

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
                    {isLoginMode && <span className="text-xs text-muted-foreground cursor-pointer hover:text-growth">¿Olvidaste tu contraseña?</span>}
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="********" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    required 
                />
              </div>
              
              {/* CHECKBOX: Oculto en Login */}
              {!isLoginMode && (
                  <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
                    <Checkbox 
                        id="terms" 
                        checked={formData.termsAccepted} 
                        onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })} 
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                        Acepto los términos y condiciones
                    </label>
                  </div>
              )}
              
              <Button type="submit" className="w-full bg-growth hover:bg-growth/90 text-white" size="lg">
                {isLoginMode ? "Ingresar" : "Entrar a mi Jardín Financiero"}
              </Button>
            </form>
            
            {/* ENLACE PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
            <div className="text-center text-sm text-muted-foreground mt-6">
                {isLoginMode ? "¿No tienes cuenta? " : "¿Ya tienes una cuenta? "}
                <button 
                    type="button" 
                    // AQUÍ ESTÁ LA MAGIA: Cambiamos la URL para que React Router haga su trabajo
                    onClick={() => navigate(isLoginMode ? "/register" : "/login")}
                    className="text-growth hover:underline font-medium focus:outline-none"
                >
                    {isLoginMode ? "Crear cuenta" : "Iniciar sesión"}
                </button>
            </div>

          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-trust-light to-card border-trust/20 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-trust/20">
                <Lock className="h-12 w-12 text-trust" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Tu Privacidad es Importante</h3>
              <p className="text-muted-foreground">
                No solicitamos datos bancarios ni información financiera sensible. 
                FinMate te ayuda a organizar y estrategizar sin comprometer tu seguridad.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;