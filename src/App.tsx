import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext"; 
import { useState, useEffect } from "react"; 

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"; // <--- Verifica que esta línea exista
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

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let currentUserId = localStorage.getItem('guest_user_id');
    if (!currentUserId) {
      currentUserId = crypto.randomUUID();
      localStorage.setItem('guest_user_id', currentUserId);
    }
    setUserId(currentUserId);

    const sessionStatus = sessionStorage.getItem('is_logged_in') === 'true';
    setIsLoggedIn(sessionStatus);

    setAuthReady(true);
  }, []);

  const handleLogin = (id: string) => {
    sessionStorage.setItem('is_logged_in', 'true');
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('is_logged_in');
    setIsLoggedIn(false);
    window.location.reload(); 
  };

  if (!authReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-growth">Cargando...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider userId={userId} handleLogin={handleLogin} handleLogout={handleLogout}> 
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              {/* Redirección inicial */}
              <Route 
                  path="/" 
                  element={
                      isLoggedIn ? 
                      <Navigate to="/dashboard" replace /> : 
                      <Navigate to="/register" replace />
                  } 
              />
              
              {/* Si ya está logueado, no dejar ver registro/login */}
              <Route 
                  path="/register" 
                  element={
                      isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />
                  } 
              />
              
              {/* --- ESTA ES LA RUTA QUE TE FALTABA --- */}
              <Route 
                  path="/login" 
                  element={
                      isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
                  } 
              />
              
              <Route path="/home" element={<Home />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;