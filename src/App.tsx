import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DebtDetails from "./pages/DebtDetails";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
import Badges from "./pages/Badges";
import Challenges from "./pages/Challenges";
import Payments from "./pages/Payments";
import Income from "./pages/Income";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Streaks from "./pages/Streaks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/debts" element={<DebtDetails />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/income" element={<Income />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/streaks" element={<Streaks />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
