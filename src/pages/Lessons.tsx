import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { TrendingUp, Calendar, MessageCircle, PiggyBank, CreditCard, FileText, ChevronLeft, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LessonCategory = "savings" | "payments" | "negotiation";

interface Lesson {
  id: number;
  title: string;
  description: string;
  category: LessonCategory;
  icon: any;
  youtubeId: string;
  viewed: boolean;
}

const Lessons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | "all">("all");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [viewedLessons, setViewedLessons] = useState<Set<number>>(new Set());

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Estrategias Inteligentes de Ahorro",
      description: "Aprende a ahorrar de manera más efectiva con métodos comprobados",
      category: "savings",
      icon: TrendingUp,
      youtubeId: "U5wCPaNAjls",
      viewed: viewedLessons.has(1),
    },
    {
      id: 2,
      title: "Fundamentos de Planificación de Pagos",
      description: "Domina tu calendario de pagos y nunca pierdas una fecha límite",
      category: "payments",
      icon: Calendar,
      youtubeId: "Rir3GoHwgVs",
      viewed: viewedLessons.has(2),
    },
    {
      id: 3,
      title: "Tácticas de Negociación",
      description: "Reduce tus tasas de interés a través de comunicación efectiva",
      category: "negotiation",
      icon: MessageCircle,
      youtubeId: "lKV_21kISVs",
      viewed: viewedLessons.has(3),
    },
    {
      id: 4,
      title: "Elementos Esenciales del Fondo de Emergencia",
      description: "Construye una red de seguridad para gastos inesperados",
      category: "savings",
      icon: PiggyBank,
      youtubeId: "CnTY-lNfXg8",
      viewed: viewedLessons.has(4),
    },
    {
      id: 5,
      title: "Mejora de Puntaje Crediticio",
      description: "Comprende e impulsa tu calificación crediticia",
      category: "payments",
      icon: CreditCard,
      youtubeId: "40cN-fJawKk",
      viewed: viewedLessons.has(5),
    },
    {
      id: 6,
      title: "Guía de Consolidación de Deudas",
      description: "Simplifica múltiples deudas en un pago manejable",
      category: "negotiation",
      icon: FileText,
      youtubeId: "TY1oF-1EoKI",
      viewed: viewedLessons.has(6),
    },
  ];

  const handleMarkAsViewed = (lessonId: number) => {
    setViewedLessons(prev => new Set(prev).add(lessonId));
    toast({
      title: "Lección Completada",
      description: "Has marcado esta lección como vista",
    });
  };

  const categories = [
    { id: "all" as const, label: "Todas" },
    { id: "savings" as const, label: "Ahorro" },
    { id: "payments" as const, label: "Pagos" },
    { id: "negotiation" as const, label: "Negociación" },
  ];

  const filteredLessons = selectedCategory === "all" 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Micro-Lecciones</h1>
        <p className="text-muted-foreground mb-8">Lecciones breves para hacer crecer tu conocimiento financiero</p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-growth hover:bg-growth/90 text-white" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const Icon = lesson.icon;
            
            return (
              <Card 
                key={lesson.id} 
                className={`p-6 hover:shadow-lg transition-all cursor-pointer group animate-fade-in ${
                  lesson.viewed ? "bg-growth/5 border-growth/20" : ""
                }`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${lesson.viewed ? "bg-growth/20" : "bg-growth/10"} group-hover:bg-growth/20 transition-colors`}>
                    <Icon className="h-6 w-6 text-growth" />
                  </div>
                  <div className="flex gap-2">
                    {lesson.viewed && (
                      <div className="p-2 rounded-full bg-growth/20">
                        <CheckCircle className="h-4 w-4 text-growth" />
                      </div>
                    )}
                    <div className="p-2 rounded-full bg-muted group-hover:bg-growth/10 transition-colors">
                      <Play className="h-4 w-4 text-muted-foreground group-hover:text-growth" />
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-growth transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-center text-growth hover:text-growth/80 hover:bg-growth/10"
                >
                  {lesson.viewed ? "Ver de nuevo" : "Ver Lección"}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Lesson Modal */}
        <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedLesson && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-growth/10">
                      <selectedLesson.icon className="h-6 w-6 text-growth" />
                    </div>
                    {selectedLesson.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedLesson.description}</p>
                  
                  {/* YouTube Embed */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${selectedLesson.youtubeId}`}
                      title={selectedLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => {
                        handleMarkAsViewed(selectedLesson.id);
                        setSelectedLesson(null);
                      }}
                      className="flex-1 bg-growth hover:bg-growth/90 text-white"
                    >
                      Marcar como Visto
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedLesson(null)}
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Lessons;
