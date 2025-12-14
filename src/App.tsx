import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"; 
import { AppProvider } from "./contexts/AppContext"; 
import { useState, useEffect } from "react"; 

// Page imports
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
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Garden from "./pages/Garden";
import Premium from "./pages/Premium";

const queryClient = new QueryClient();

// Componente que define el estado de la sesión
const RootApp = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Obtenemos navigate

  useEffect(() => {
    // 1. Cargar ID persistente (guest_user_id)
    let currentUserId = localStorage.getItem('guest_user_id');
    if (!currentUserId) {
      currentUserId = crypto.randomUUID();
      localStorage.setItem('guest_user_id', currentUserId);
    }
    setUserId(currentUserId);

    // 2. Verificar sesión (estado actual)
    const sessionStatus = sessionStorage.getItem('is_logged_in') === 'true';
    setIsLoggedIn(sessionStatus);

    setAuthReady(true);
  }, []);

  const handleLogin = (id: string) => {
    sessionStorage.setItem('is_logged_in', 'true');
    setIsLoggedIn(true); // Actualiza estado local
    setUserId(id);
    navigate('/dashboard'); // Navega inmediatamente al Dashboard
  };
  
  // FIX DEFINITIVO DE LOGOUT: Limpiamos todo el rastro de sesión
  const handleLogout = () => {
    // 1. Limpiamos la sesión volátil
    sessionStorage.removeItem('is_logged_in');
    
    // 2. LIMPIAMOS DATOS DE USUARIO PERSISTENTES (SOLUCIÓN AL BUCLÉ Y CONFUSIÓN)
    localStorage.removeItem('klimba_user_data');
    
    // 3. Limpiamos el estado de React (CLAVE)
    setIsLoggedIn(false); 
    setUserId(null); 
    
    // 4. Forzamos la navegación AHORA a la raíz. 
    // La ruta raíz (/) ahora siempre mostrará Home.
    navigate('/'); 
  };

  if (!authReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-growth">Cargando...</p>
      </div>
    );
  }

  // Guardia de ruta: Solo permite pasar si isLoggedIn es true
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider userId={userId} handleLogin={handleLogin} handleLogout={handleLogout}> 
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* 1. Ruta Raíz: Si está logueado -> Dashboard, sino -> Home (Pública) */}
            <Route 
                path="/" 
                element={
                    isLoggedIn ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Home /> 
                } 
            />
            
            {/* 2. Rutas de Acceso (Si isLoggedIn es TRUE, te saca a Dashboard) */}
            <Route 
                path="/register" 
                element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} 
            />
            <Route 
                path="/login" 
                element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            
            {/* 3. Rutas Públicas de Información */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} /> 
            
            {/* 4. Rutas Privadas (Protegidas) */}
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
            <Route path="/garden" element={<ProtectedRoute><Garden /></ProtectedRoute>} />
            <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};


const App = () => (
    // Encapsulamos RootApp con HashRouter para usar navigate
    <HashRouter>
        <RootApp />
    </HashRouter>
);

export default App;