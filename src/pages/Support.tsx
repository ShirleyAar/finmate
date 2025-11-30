import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
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
      description: "Nuestro equipo te responderá pronto",
    });
    
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      question: "¿Cómo funciona la planta de progreso?",
      answer: "La planta crece automáticamente según el porcentaje de deudas que hayas pagado. Cada vez que registras un pago, tu planta avanza hacia la siguiente etapa. NO se ve afectada por insignias o retos.",
    },
    {
      question: "¿Cómo se ganan las insignias?",
      answer: "Las insignias se otorgan al completar retos semanales y mantener rachas de actividad. No se ganan por pagar deudas, sino por tu constancia y participación en la app.",
    },
    {
      question: "¿Necesito conectar mi cuenta bancaria?",
      answer: "No, FinMate NO requiere acceso a tu cuenta bancaria. Registras manualmente tus deudas, pagos e ingresos para mantener tu privacidad y seguridad.",
    },
    {
      question: "¿Qué son los retos semanales?",
      answer: "Son objetivos que cambian cada semana, como ahorrar cierta cantidad o completar micro-lecciones. Al completarlos, ganas insignias especiales y fortaleces tus hábitos financieros.",
    },
  ];

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Soporte y Ayuda</h1>
        <p className="text-muted-foreground mb-8">Estamos aquí para ayudarte</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-accent/20">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Contáctanos</h2>
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
                className="w-full bg-accent hover:bg-accent/90 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
            </form>
          </Card>

          {/* FAQ Section */}
          <Card className="p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-foreground mb-6">Preguntas Frecuentes</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 p-4 bg-growth/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ¿No encuentras lo que buscas? Envíanos un mensaje y te responderemos pronto.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;