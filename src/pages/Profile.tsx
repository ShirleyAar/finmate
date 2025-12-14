import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, User, Mail, Camera, LogOut, Calendar, Save, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Importante: Traemos handleLogout del contexto con alias para evitar conflictos
  const { user, setUser, handleLogout: contextLogout } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  
  // Store original values to detect changes and restore on cancel
  const [originalData, setOriginalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Check if there are changes
  const hasChanges = 
    formData.name !== originalData.name || 
    formData.avatar !== originalData.avatar;

  // Validate name is not empty
  const isNameValid = formData.name.trim().length > 0;

  const handleStartEditing = () => {
    setOriginalData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNameValid) {
      toast({
        title: "Error",
        description: "El nombre no puede estar vacío",
        variant: "destructive",
      });
      return;
    }
    
    setUser({
      name: formData.name.trim(),
      email: user?.email || "", // Email stays unchanged (tied to auth)
      avatar: formData.avatar,
      registeredAt: user?.registeredAt,
    });

    // Update original data to new values
    setOriginalData({
      name: formData.name.trim(),
      email: user?.email || "",
      avatar: formData.avatar,
    });

    toast({
      title: "Perfil Actualizado",
      description: "Tus cambios han sido guardados exitosamente",
    });
    
    setIsEditing(false);
  };

  // FUNCIÓN PARA CERRAR SESIÓN
  const onLogoutConfirm = () => {
    contextLogout(); // Llama a la función que limpia sesión y navega en App.tsx
    
    toast({
      title: "Sesión Cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  // FUNCIÓN CLAVE: NAVEGACIÓN A PREMIUM
  const handleUpgrade = () => {
    navigate("/premium"); // <-- Redirige a la nueva página
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription>
                  Estás a punto de cerrar tu sesión. ¿Deseas continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                {/* Llama a la función corregida que usa el contexto */}
                <AlertDialogAction onClick={onLogoutConfirm} className="bg-destructive hover:bg-destructive/90">
                  Cerrar Sesión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Tarjeta de Edición de Perfil */}
          <Card className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-growth-light to-growth flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-growth text-white hover:bg-growth/90 transition-colors shadow-md cursor-pointer z-10"
                    onClick={() => {
                      const url = prompt("Ingresa la URL de tu avatar:");
                      if (url) setFormData({ ...formData, avatar: url });
                    }}
                    title="Cambiar foto"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {!isEditing && user?.name && (
                <h2 className="text-2xl font-semibold text-foreground mt-4 text-center">{user.name}</h2>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange} // Usamos el handleChange local
                  readOnly={!isEditing}
                  className={`${
                    isEditing 
                      ? "border-primary ring-1 ring-primary/30 bg-background" 
                      : "bg-muted/30"
                  } ${!isNameValid && isEditing ? "border-destructive" : ""}`}
                />
                {!isNameValid && isEditing && (
                  <p className="text-xs text-destructive">El nombre no puede estar vacío</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="flex-1 bg-muted/30 cursor-not-allowed text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  El correo está vinculado a tu cuenta y no puede modificarse
                </p>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Registro</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-transparent">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user?.registeredAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <Button 
                    type="button"
                    onClick={handleStartEditing}
                    className="flex-1 bg-growth hover:bg-growth/90 text-white"
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="submit"
                      disabled={!hasChanges || !isNameValid}
                      className="flex-1 bg-growth hover:bg-growth/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancelEditing}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Card>

          {/* Tarjeta Premium - DONDE VA EL BOTÓN */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-accent/10 to-card border-accent/20">
            <h3 className="font-semibold text-foreground mb-2 text-lg">Klimba Premium ✨</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Desbloquea todas las funciones avanzadas
            </p>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Simulador de estrategias de pago avanzadas
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Análisis predictivo de tu deuda
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Exportación de reportes en PDF
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-growth">✓</span> Soporte prioritario 24/7
              </li>
            </ul>

            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              Actualizar a Premium
            </Button>
          </Card>

          {/* Tarjeta Seguridad */}
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