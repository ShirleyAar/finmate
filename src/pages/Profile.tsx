import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, User, Mail, Camera, LogOut } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser, handleLogout } = useApp();

  const [isEditing, setIsEditing] = useState(false);

 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setUser({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    });

    toast({
      title: "Perfil Actualizado",
      description: "Tus datos se han guardado correctamente.",
    });
    
    setIsEditing(false); 
  };

  const handleCancel = () => {
    
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  
  const handlePremiumClick = () => {
    toast({
      title: "✨ Función Premium",
      description: "¡Próximamente podrás suscribirte para obtener herramientas avanzadas!",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground p-0"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>

        <div className="max-w-2xl mx-auto">
          
          <Card className="p-8 animate-fade-in">
            <div className="flex flex-col items-center mb-8">
              {/* AVATAR */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-growth-light to-growth flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                
                {/* Botón flotante para cambiar foto (visible al editar) */}
                {isEditing && (
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-growth text-white hover:bg-growth/90 transition-colors shadow-md cursor-pointer z-10"
                    onClick={() => {
                      const url = prompt("Ingresa la URL de tu imagen:");
                      if (url) setFormData({ ...formData, avatar: url });
                    }}
                    title="Cambiar foto"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Nombre en modo lectura */}
              {!isEditing && (
                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {formData.name || "Usuario"}
                  </h2>
                  <p className="text-muted-foreground">{formData.email || "Sin correo"}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CAMPO NOMBRE */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing} 
                  required
                  // Estilo visual cuando está deshabilitado
                  className={!isEditing ? "bg-muted/30 border-transparent text-muted-foreground opacity-100" : "bg-white"}
                />
              </div>

              {/* CAMPO EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing} 
                    required
                    className={`flex-1 ${!isEditing ? "bg-muted/30 border-transparent text-muted-foreground opacity-100" : "bg-white"}`}
                  />
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <Button 
                    type="button"
                    onClick={() => setIsEditing(true)} 
                    className="w-full bg-growth hover:bg-growth/90 text-white"
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="submit"
                      className="flex-1 bg-growth hover:bg-growth/90 text-white"
                    >
                      Guardar Cambios
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancel} 
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>

            <div className="pt-8 border-t mt-8">
              <Button 
                variant="destructive" 
                className="w-full flex items-center justify-center gap-2 py-6 text-lg hover:bg-destructive/90 transition-colors shadow-sm"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </Button>
            </div>
          </Card>

          {/* TARJETA PREMIUM CON ACCIÓN */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-accent/10 to-card border-accent/20">
            <h3 className="font-semibold text-foreground mb-2 text-lg">FinMate Premium ✨</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Desbloquea todas las funciones avanzadas
            </p>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Simulador de estrategias
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Análisis predictivo
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Exportación PDF
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Soporte 24/7
              </li>
            </ul>

            {/* BOTÓN CON FUNCIÓN CONECTADA */}
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
              onClick={handlePremiumClick}
            >
              Actualizar a Premium
            </Button>
          </Card>

          <Card className="mt-6 p-6 bg-gradient-to-r from-trust-light to-card border-trust/20">
            <h3 className="font-semibold text-foreground mb-2">Privacidad y Seguridad</h3>
            <p className="text-sm text-muted-foreground">
              Tus datos están seguros con nosotros.
            </p>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;