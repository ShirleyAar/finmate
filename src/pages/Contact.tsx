import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Mail, Send, MessageCircle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Mensaje Enviado",
      description: "Nuestro equipo te responderá lo antes posible.",
    });
    
    setFormData({ name: "", email: "", message: "" });
  };

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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
              <Mail className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Contacto</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ¿Tienes dudas o necesitas ayuda? Escríbenos y te responderemos lo antes posible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-6 md:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-growth/20">
                  <MessageCircle className="h-6 w-6 text-growth" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Envíanos un mensaje</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

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
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="growth"
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </Card>

            {/* Info Cards */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-growth/10 to-card border-growth/20 animate-scale-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-growth/20">
                    <Mail className="h-6 w-6 text-growth" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Correo de Soporte</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Para consultas generales o asistencia técnica:
                    </p>
                    <p className="text-growth font-medium">soporte@klimba.com</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-card border-accent/20 animate-scale-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-accent/20">
                    <HelpCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Preguntas Frecuentes</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Quizás tu duda ya tiene respuesta en nuestra sección de FAQ.
                    </p>
                    <Link to="/faq">
                      <Button variant="outline" size="sm">
                        Ver Preguntas Frecuentes
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 animate-fade-in">
                <h3 className="font-semibold text-foreground mb-3">Tiempo de Respuesta</h3>
                <p className="text-muted-foreground text-sm">
                  Nuestro equipo se esfuerza por responder todas las consultas en un plazo de 24-48 horas hábiles. 
                  Agradecemos tu paciencia.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
