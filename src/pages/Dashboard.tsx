import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Sprout, Mountain, Calendar, Award, MessageCircle, BookOpen, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Financial Garden</h1>
        
        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Financial Garden */}
          <Card className="p-6 bg-gradient-to-br from-growth-light to-card border-growth/20 animate-fade-in">
            <Link to="/dashboard/progress" className="block group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 rounded-full bg-growth/20 group-hover:bg-growth/30 transition-colors">
                  <Sprout className="h-16 w-16 text-growth" />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Financial Garden</h3>
                  <p className="text-sm text-muted-foreground mb-4">Watch your progress grow</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-growth">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </div>
              </div>
            </Link>
          </Card>

          {/* Center Column: Debt Mountain */}
          <Card className="p-6 bg-gradient-to-br from-earth-light to-card border-earth/20 animate-scale-in lg:col-span-1">
            <Link to="/debts" className="block group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Mountain className="h-20 w-20 text-earth" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl font-bold text-foreground">35%</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Debt Mountain</h3>
                  <p className="text-sm text-muted-foreground mb-2">Total Debt: $12,450</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <span className="px-3 py-1 rounded-full bg-earth/20 text-xs font-medium text-earth">Card A</span>
                    <span className="px-3 py-1 rounded-full bg-earth/20 text-xs font-medium text-earth">Loan B</span>
                    <span className="px-3 py-1 rounded-full bg-earth/20 text-xs font-medium text-earth">Credit C</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-earth text-earth hover:bg-earth/10">
                  View Details
                </Button>
              </div>
            </Link>
          </Card>

          {/* Right Column: Mini Cards */}
          <div className="space-y-4 animate-slide-up">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/dashboard/payments" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-trust/10">
                  <Calendar className="h-5 w-5 text-trust" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Upcoming Payments</h4>
                  <p className="text-sm text-muted-foreground">3 due this month</p>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/dashboard/badges" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-growth/10">
                  <Award className="h-5 w-5 text-growth" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Badges & Goals</h4>
                  <p className="text-sm text-muted-foreground">5 achievements</p>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/dashboard/support" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Support & Negotiation</h4>
                  <p className="text-sm text-muted-foreground">Get help</p>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        {/* Bottom: Micro-Lessons */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Micro-Lessons for Growth</h2>
            <Link to="/lessons">
              <Button variant="ghost" className="text-growth hover:text-growth/80">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <Link to="/lessons" className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-growth/10 group-hover:bg-growth/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-growth" />
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Smart Savings Strategies</h4>
                  <p className="text-sm text-muted-foreground">Learn how to save more effectively</p>
                </div>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <Link to="/lessons" className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-trust/10 group-hover:bg-trust/20 transition-colors">
                    <Calendar className="h-6 w-6 text-trust" />
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Payment Planning</h4>
                  <p className="text-sm text-muted-foreground">Master your payment schedule</p>
                </div>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <Link to="/lessons" className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-accent" />
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Negotiation Tactics</h4>
                  <p className="text-sm text-muted-foreground">Lower your interest rates</p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
