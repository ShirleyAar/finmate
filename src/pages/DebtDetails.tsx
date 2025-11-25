import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Edit, TrendingDown, Shield, Zap, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DebtDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const debts = [
    { id: 1, name: "Credit Card A", amount: 5200, rate: 18.5, dueDate: "2025-12-15" },
    { id: 2, name: "Personal Loan B", amount: 4500, rate: 12.0, dueDate: "2025-12-20" },
    { id: 3, name: "Store Credit C", amount: 2750, rate: 21.0, dueDate: "2025-12-10" },
  ];

  const strategies = [
    { id: "interest", name: "Reduce Interest", icon: TrendingDown, description: "Focus on high-rate debts first" },
    { id: "late", name: "Avoid Late Payments", icon: Shield, description: "Prioritize upcoming due dates" },
    { id: "simplify", name: "Simplify Accounts", icon: Zap, description: "Consolidate multiple debts" },
  ];

  const handleSimulate = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    toast({
      title: "Strategy Simulated",
      description: `Showing results for ${strategies.find(s => s.id === strategyId)?.name}`,
    });
  };

  const handleApplyStrategy = () => {
    if (!selectedStrategy) {
      toast({
        title: "No Strategy Selected",
        description: "Please simulate a strategy first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Strategy Applied",
      description: "Your debt plan has been updated successfully",
    });
    navigate("/dashboard");
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
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Debt & Strategy Details</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Debt List */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Debts</h2>
            
            {debts.map((debt) => (
              <Card key={debt.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{debt.name}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Amount</span>
                        <p className="font-medium text-foreground">${debt.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rate</span>
                        <p className="font-medium text-foreground">{debt.rate}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due Date</span>
                        <p className="font-medium text-foreground">{debt.dueDate}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Simulate Strategy */}
          <div className="space-y-4 animate-scale-in">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-foreground mb-4">Simulate Strategy</h3>
              
              <div className="space-y-3 mb-6">
                {strategies.map((strategy) => {
                  const Icon = strategy.icon;
                  const isSelected = selectedStrategy === strategy.id;
                  
                  return (
                    <button
                      key={strategy.id}
                      onClick={() => handleSimulate(strategy.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-growth bg-growth/10"
                          : "border-border hover:border-growth/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-growth/20" : "bg-muted"}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? "text-growth" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{strategy.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedStrategy && (
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <h4 className="font-semibold text-foreground mb-3">Before vs After</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Monthly Payment</span>
                      <span className="font-medium">$850</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">With Strategy</span>
                      <span className="font-medium text-growth">$720</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="font-semibold text-growth">$130/mo</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={handleApplyStrategy} 
                  className="w-full bg-growth hover:bg-growth/90 text-white"
                  disabled={!selectedStrategy}
                >
                  Apply Strategy
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DebtDetails;
