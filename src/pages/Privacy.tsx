import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Shield, Lock, Eye, Trash2, Server } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  const privacyPoints = [
    {
      icon: Lock,
      title: "No solicitamos datos bancarios",
      description: "Klimba NO solicita ni almacena datos bancarios reales. No pedimos números de tarjetas, claves ni accesos a tus cuentas financieras.",
    },
    {
      icon: Eye,
      title: "Información para uso personal",
      description: "La información que registras (deudas, gastos, ingresos) es solo para tu uso interno dentro de la aplicación. Tú controlas qué información ingresas.",
    },
    {
      icon: Shield,
      title: "No vendemos tus datos",
      description: "Tus datos personales y financieros no se venden ni se comparten con terceros. Tu información es tuya y solo tuya.",
    },
    {
      icon: Trash2,
      title: "Derecho a eliminación",
      description: "Puedes solicitar la eliminación completa de tu información en cualquier momento. Solo tienes que contactarnos y procesaremos tu solicitud.",
    },
    {
      icon: Server,
      title: "Medidas de protección",
      description: "Aplicamos medidas básicas de protección de datos para mantener tu información segura dentro de nuestra plataforma.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-trust/10 mb-4">
              <Shield className="h-12 w-12 text-trust" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
            <p className="text-muted-foreground">Tu privacidad y seguridad son nuestra prioridad</p>
          </div>

          {/* Main Privacy Card */}
          <Card className="p-6 md:p-8 mb-6 bg-gradient-to-br from-trust/5 to-card border-trust/20 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">Compromiso de Klimba</h2>
              <p className="text-muted-foreground leading-relaxed">
                En Klimba entendemos que la información financiera es sensible. Por eso, hemos diseñado 
                nuestra plataforma para que puedas organizar tus finanzas <strong>sin comprometer tu privacidad</strong>. 
                No necesitas conectar cuentas bancarias ni compartir datos sensibles para usar nuestros servicios.
              </p>
            </div>
          </Card>

          {/* Privacy Points */}
          <div className="space-y-4">
            {privacyPoints.map((point, index) => (
              <Card key={index} className="p-5 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-growth/10 shrink-0">
                    <point.icon className="h-5 w-5 text-growth" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Message */}
          <Card className="p-6 mt-6 text-center bg-gradient-to-br from-growth/10 to-card border-growth/20 animate-fade-in">
            <Lock className="h-8 w-8 text-growth mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Tu confianza es importante</h3>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Klimba es una herramienta de organización financiera. No manejamos dinero real ni tenemos 
              acceso a tus cuentas bancarias. Tu información está segura y bajo tu control.
            </p>
          </Card>

          {/* Contact for Privacy */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>
              ¿Tienes preguntas sobre privacidad?{" "}
              <a href="/contact" className="text-growth hover:underline font-medium">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;