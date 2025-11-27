import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext"; 
import { useState, useEffect } from "react"; 

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
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

// --- COMPONENTE DE PROTECCIÓN ---
// Este componente actúa como un guardia de seguridad.
// Si no tienes pase (sesión), te manda a la fila de registro.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

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
    // Al cambiar el estado isLoggedIn a false, el ProtectedRoute
    // automáticamente expulsará al usuario de cualquier página privada.
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
              {/* Rutas Públicas */}
              <Route 
                  path="/" 
                  element={
                      isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />
                  } 
              />
              <Route 
                  path="/register" 
                  element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} 
              />
              <Route 
                  path="/login" 
                  element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} 
              />
              <Route path="/home" element={<Home />} />

              {/* Rutas Privadas (PROTEGIDAS) */}
              {/* Envolvemos cada página con <ProtectedRoute> */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/debts" element={<ProtectedRoute><DebtDetails /></ProtectedRoute>} />
              <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
              <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/streaks" element={<ProtectedRoute><Streaks /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;