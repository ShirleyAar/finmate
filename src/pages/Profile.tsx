import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, User, Mail, Camera, LogOut } from "lucide-react"; // Agregamos LogOut
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Traemos handleLogout del contexto
  const { user, setUser, handleLogout } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setUser({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    });

    toast({
      title: "Perfil Actualizado",
      description: "Tus cambios han sido guardados exitosamente",
    });
    
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    // La redirección a home ocurre automáticamente al cambiar el estado de sesión
    navigate("/"); 
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

        <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>

        <div className="max-w-2xl mx-auto">
          {/* --- TARJETA PRINCIPAL (Datos + Logout) --- */}
          <Card className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-growth-light to-growth flex items-center justify-center overflow-hidden">
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
                {isEditing && (
                  <button 
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-growth text-white hover:bg-growth/90 transition-colors"
                    onClick={() => {
                      const url = prompt("Ingresa la URL de tu avatar:");
                      if (url) setFormData({ ...formData, avatar: url });
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>

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
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <Button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-growth hover:bg-growth/90 text-white"
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
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          avatar: user?.avatar || "",
                        });
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>

            {/* --- SECCIÓN NUEVA: CERRAR SESIÓN --- */}
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

          {/* --- TARJETA PREMIUM (MANTENIDA) --- */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-accent/10 to-card border-accent/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">FinMate Premium ✨</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Desbloquea todas las funciones avanzadas
                </p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span>
                Simulador de estrategias de pago avanzadas
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span>
                Análisis predictivo de tu deuda
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span>
                Exportación de reportes en PDF
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span>
                Soporte prioritario 24/7
              </li>
            </ul>

            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold">
              Actualizar a Premium
            </Button>
          </Card>

          {/* --- TARJETA PRIVACIDAD (MANTENIDA) --- */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-trust-light to-card border-trust/20">
            <h3 className="font-semibold text-foreground mb-2">Privacidad y Seguridad</h3>
            <p className="text-sm text-muted-foreground">
              Tus datos están seguros con nosotros. No solicitamos información bancaria 
              ni compartimos tus datos personales con terceros.
            </p>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;