import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "¿Qué es Klimba?",
      answer: "Klimba es una plataforma de organización y educación financiera que te ayuda a visualizar, planificar y gestionar el pago de tus deudas de manera estratégica. Usamos una metáfora de jardín para hacer el proceso más amigable y motivador.",
    },
    {
      question: "¿Klimba maneja dinero real?",
      answer: "No. Klimba NO maneja dinero real, NO se conecta a cuentas bancarias y NO solicita datos financieros sensibles. Es una herramienta de organización donde tú registras manualmente tu información para visualizar y planificar tus finanzas.",
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Sí. No solicitamos ni almacenamos datos bancarios reales. La información que registras (deudas, ingresos, gastos) es solo para tu uso personal dentro de la aplicación. No compartimos ni vendemos tus datos a terceros.",
    },
    {
      question: "¿Qué es la versión Premium?",
      answer: "La versión Premium desbloquea funciones avanzadas como simuladores de estrategias de pago, análisis predictivo y herramientas adicionales de planificación. La versión gratuita incluye todas las funciones básicas para organizar tus finanzas.",
    },
    {
      question: "¿Puedo editar o eliminar mis deudas?",
      answer: "Sí. Puedes editar todos los datos de tus deudas (nombre, monto, tasa de interés, fecha límite) y también eliminarlas cuando lo necesites. Los cambios se reflejan automáticamente en tus recordatorios de pago.",
    },
    {
      question: "¿Cómo funcionan los recordatorios de pago?",
      answer: "Cuando registras una deuda y eliges una forma de pago, el sistema genera automáticamente un calendario de pagos mensuales. Puedes ver tus próximos pagos en la sección 'Próximos Pagos' y marcarlos como pagados cuando los realices.",
    },
    {
      question: "¿Cómo funciona el Jardín Financiero?",
      answer: "El Jardín es un sistema de progreso gamificado. Cada vez que pagas completamente una deuda, tu contador histórico aumenta +1. Al completar 5 deudas, desbloqueas una planta florecida y una insignia especial. Tu progreso es acumulativo y permanente.",
    },
    {
      question: "¿Por qué mi progreso no baja si agrego nuevas deudas?",
      answer: "Tu progreso refleja las deudas que ya pagaste completamente. Es un registro histórico de tus logros; agregar nuevas deudas no borra lo que ya lograste. Esto está diseñado para motivarte y celebrar cada victoria.",
    },
    {
      question: "¿Qué ocurre si borro una deuda que ya conté?",
      answer: "Por diseño, los logros históricos no se eliminan automáticamente. Si eliminas una deuda que ya fue contabilizada como pagada, tu progreso de jardín permanece intacto. Si es necesario revisar casos excepcionales, contáctanos.",
    },
    {
      question: "¿Cómo se ganan las insignias del Jardín?",
      answer: "Las insignias del Jardín se otorgan automáticamente al completar cada grupo de 5 deudas pagadas. Cada planta florecida viene con su propia insignia única que puedes ver en la sección 'Mi Jardín'.",
    },
    {
      question: "¿Cómo se ganan otras insignias?",
      answer: "Además de las insignias del Jardín, puedes ganar insignias al completar retos semanales y mantener rachas de actividad constante en la app. Estas premian tu constancia y participación.",
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
            <div className="inline-flex p-4 rounded-full bg-growth/10 mb-4">
              <HelpCircle className="h-12 w-12 text-growth" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Preguntas Frecuentes</h1>
            <p className="text-muted-foreground">Encuentra respuestas a las dudas más comunes</p>
          </div>

          <Card className="p-6 md:p-8 animate-fade-in">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <Card className="p-6 mt-6 bg-gradient-to-br from-growth/10 to-card border-growth/20 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-growth/20">
                <MessageCircle className="h-6 w-6 text-growth" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">¿No encuentras lo que buscas?</h3>
                <p className="text-sm text-muted-foreground">Contáctanos y te ayudaremos con gusto.</p>
              </div>
              <Link to="/contact">
                <Button variant="growth">
                  Contactar
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
