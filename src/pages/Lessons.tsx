import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { TrendingUp, Calendar, MessageCircle, PiggyBank, CreditCard, FileText, ChevronLeft, Play } from "lucide-react";

type LessonCategory = "savings" | "payments" | "negotiation";

interface Lesson {
  id: number;
  title: string;
  description: string;
  category: LessonCategory;
  icon: any;
  content: string;
}

const Lessons = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | "all">("all");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Smart Savings Strategies",
      description: "Learn how to save more effectively with proven methods",
      category: "savings",
      icon: TrendingUp,
      content: "Building an emergency fund is crucial for financial stability. Start by setting aside 10% of your income each month. Use automated transfers to make saving effortless. Track your progress and celebrate small wins along the way.",
    },
    {
      id: 2,
      title: "Payment Planning Basics",
      description: "Master your payment schedule and never miss a due date",
      category: "payments",
      icon: Calendar,
      content: "Create a payment calendar to visualize all your due dates. Set up automatic payments where possible. Always pay at least the minimum to avoid late fees. Consider bi-weekly payments to reduce interest over time.",
    },
    {
      id: 3,
      title: "Negotiation Tactics",
      description: "Lower your interest rates through effective communication",
      category: "negotiation",
      icon: MessageCircle,
      content: "Call your creditors and ask for lower rates. Be polite but persistent. Reference your payment history and competitor offers. Consider balance transfer options for high-interest debts.",
    },
    {
      id: 4,
      title: "Emergency Fund Essentials",
      description: "Build a safety net for unexpected expenses",
      category: "savings",
      icon: PiggyBank,
      content: "Aim for 3-6 months of expenses in your emergency fund. Keep it in a high-yield savings account. Use it only for true emergencies. Replenish it as soon as possible after withdrawals.",
    },
    {
      id: 5,
      title: "Credit Score Improvement",
      description: "Understand and boost your credit rating",
      category: "payments",
      icon: CreditCard,
      content: "Pay all bills on time. Keep credit utilization below 30%. Don't close old credit accounts. Monitor your credit report regularly for errors. Consider becoming an authorized user on a good account.",
    },
    {
      id: 6,
      title: "Debt Consolidation Guide",
      description: "Simplify multiple debts into one manageable payment",
      category: "negotiation",
      icon: FileText,
      content: "Evaluate consolidation loans vs. balance transfers. Calculate total interest savings. Ensure the new rate is lower than your current average. Avoid accumulating new debt after consolidating.",
    },
  ];

  const categories = [
    { id: "all" as const, label: "All" },
    { id: "savings" as const, label: "Savings" },
    { id: "payments" as const, label: "Payments" },
    { id: "negotiation" as const, label: "Negotiation" },
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
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Micro-Lessons</h1>
        <p className="text-muted-foreground mb-8">Bite-sized lessons to grow your financial knowledge</p>
        
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
                className="p-6 hover:shadow-lg transition-all cursor-pointer group animate-fade-in"
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-growth/10 group-hover:bg-growth/20 transition-colors">
                    <Icon className="h-6 w-6 text-growth" />
                  </div>
                  <div className="p-2 rounded-full bg-muted group-hover:bg-growth/10 transition-colors">
                    <Play className="h-4 w-4 text-muted-foreground group-hover:text-growth" />
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
                  View Lesson
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Lesson Modal */}
        <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
          <DialogContent className="max-w-2xl">
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
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground leading-relaxed">{selectedLesson.content}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => setSelectedLesson(null)}
                      className="flex-1 bg-growth hover:bg-growth/90 text-white"
                    >
                      Got it!
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1"
                    >
                      Back to Dashboard
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
