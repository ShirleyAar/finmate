import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, User, LogOut } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useApp(); 

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
              <div className="h-24 w-24 rounded-full bg-growth/20 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-growth" />
              </div>
              {/* Mostrar nombre o fallback */}
              <h2 className="text-xl font-semibold">{user?.name || "Usuario"}</h2>
              <p className="text-muted-foreground">{user?.email || "Sin correo registrado"}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  value={user?.name || ""} 
                  readOnly 
                  className="bg-muted/50"
                  placeholder="Nombre no disponible"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={user?.email || ""} 
                  readOnly 
                  className="bg-muted/50"
                  placeholder="Correo no disponible"
                />
              </div>

              <div className="pt-6 border-t mt-8">
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2 py-6"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;