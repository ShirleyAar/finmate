import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// =================================================================
// 1. TIPOS (TYPES)
// =================================================================

export interface User {
  name: string;
  email: string;
  avatar?: string;
  registeredAt?: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  paid: number;
  rate: number;
  dueDate: string;
  cutoffDay?: number;
  termMonths?: number;
  notes?: string;
  countedInProgress: boolean;
}

export interface ScheduledPayment {
  id: string;
  debtId: string;
  debtName: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAmount: number;
  monthNumber: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string;
  used: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  date?: string;
  icon: string;
}

export interface GardenPlant {
  id: string;
  name: string;
  tier: number;
  requiredDebts: number;
  stage: number; 
  completed: boolean;
  completedAt?: string;
  unlockedAt?: string;
}

export interface GardenBadge {
  id: string;
  plantId: string;
  name: string;
  description: string;
  icon: string;
  awardedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: string;
}

const PLANT_CATALOG: { name: string; icon: string }[] = [
  { name: "Rosa", icon: "🌹" },
  { name: "Girasol", icon: "🌻" },
  { name: "Orquídea", icon: "🌸" },
  { name: "Tulipán", icon: "🌷" },
  { name: "Lirio", icon: "💐" },
  { name: "Margarita", icon: "🌼" },
  { name: "Jazmín", icon: "🪻" },
  { name: "Lavanda", icon: "💜" },
];

// Context type
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "countedInProgress">) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  scheduledPayments: ScheduledPayment[]; 
  generatePaymentSchedule: (debtId: string, monthlyPayment: number, months: number) => void;
  markPaymentAsPaid: (id: string, paidAmount: number, expenseId: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  badges: Badge[];
  earnBadge: (id: string) => void;
  challenges: Challenge[];
  updateChallengeProgress: (id: string, progress: number) => void;
  streak: Streak;
  updateStreak: () => void;
  getDebtProgress: () => number;
  getPlantStage: () => number;
  // Garden system
  historicalDebtsPaid: number;
  gardenPlants: GardenPlant[];
  gardenBadges: GardenBadge[];
  getCurrentPlant: () => GardenPlant | null;
  getCompletedPlants: () => GardenPlant[];
  // Sesión (Añadido para App.tsx)
  userId: string | null;
  handleLogin: (id: string) => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =================================================================
// 2. IMPLEMENTACIÓN DEL PROVEEDOR (PROVIDER)
// =================================================================

// Propiedades que App.tsx pasa al AppProvider
interface AppProviderProps {
  children: ReactNode;
  userId: string | null;
  handleLogin: (id: string) => void;
  handleLogout: () => void;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, userId, handleLogin, handleLogout }) => {
  
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('klimba_user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // CORRECCIÓN CLAVE: MANEJA EL TIPO 'User' COMPLETO
  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      // Aseguramos que registeredAt tenga un valor si se está creando un nuevo usuario
      localStorage.setItem('klimba_user_data', JSON.stringify({
          ...u,
          registeredAt: u.registeredAt || new Date().toISOString(),
      }));
    } else {
      localStorage.removeItem('klimba_user_data');
    }
  };

  // Datos iniciales
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Tarjeta de Crédito A", amount: 5200, paid: 1500, rate: 18.5, dueDate: "2025-12-15", cutoffDay: 15, countedInProgress: false },
    { id: "2", name: "Préstamo Personal B", amount: 4500, paid: 1200, rate: 12.0, dueDate: "2025-12-20", cutoffDay: 20, countedInProgress: false },
    { id: "3", name: "Crédito de Tienda C", amount: 2750, paid: 800, rate: 21.0, dueDate: "2025-12-10", cutoffDay: 10, countedInProgress: false },
  ]);
  
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "income", amount: 3000, category: "Salario", date: "2025-11-01", description: "Sueldo mensual", used: 0 },
    { id: "2", type: "expense", amount: 500, category: "Alimentación", date: "2025-11-05", description: "Supermercado", used: 0 },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: "1", name: "Primer Paso", description: "Registraste tu primera deuda", earned: true, date: "2025-11-01", icon: "award" },
    { id: "2", name: "Racha 7 Días", description: "7 días seguidos activo", earned: false, icon: "zap" },
    { id: "3", name: "Estratega", description: "Completaste un reto semanal", earned: false, icon: "target" },
    { id: "4", name: "Ahorrador", description: "Registraste 10 ingresos", earned: false, icon: "piggy-bank" },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "1", title: "Ahorra $500 esta semana", description: "Registra ingresos y gastos para ahorrar $500", progress: 200, target: 500, completed: false, reward: "Insignia Ahorrador" },
    { id: "2", title: "Paga 2 deudas a tiempo", description: "Marca 2 pagos como completados", progress: 1, target: 2, completed: false, reward: "Insignia Puntual" },
    { id: "3", title: "Completa 3 micro-lecciones", description: "Aprende sobre finanzas personales", progress: 0, target: 3, completed: false, reward: "Insignia Estudiante" },
  ]);

  const [streak, setStreak] = useState<Streak>({
    current: 5,
    longest: 12,
    lastActivityDate: new Date().toISOString().split("T")[0],
  });

  // Garden System State
  const [historicalDebtsPaid, setHistoricalDebtsPaid] = useState<number>(0);
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
  const [gardenBadges, setGardenBadges] = useState<GardenBadge[]>([]);

  // Initialize garden on mount
  useEffect(() => {
    // Si no hay datos previos en localStorage, inicializa el estado del jardín
    if (historicalDebtsPaid === 0) {
      updateGardenState(0);
    }
  }, []);

  useEffect(() => {
    updateGardenState(historicalDebtsPaid);
  }, [historicalDebtsPaid]);


  // Update garden state based on historical debts paid
  const updateGardenState = (totalPaid: number) => {
    const completedPlantsCount = Math.floor(totalPaid / 5);
    const currentStage = totalPaid % 5;
    
    const newPlants: GardenPlant[] = [];
    const newBadges: GardenBadge[] = [];
    
    // Create completed plants
    for (let i = 0; i < completedPlantsCount; i++) {
      const plantInfo = PLANT_CATALOG[i % PLANT_CATALOG.length];
      newPlants.push({
        id: `plant-${i + 1}`,
        name: plantInfo.name,
        tier: i + 1,
        requiredDebts: 5,
        stage: 4, // Florecida
        completed: true,
        completedAt: new Date().toISOString(),
        unlockedAt: new Date().toISOString(),
      });
      
      newBadges.push({
        id: `garden-badge-${i + 1}`,
        plantId: `plant-${i + 1}`,
        name: `Jardinero de ${plantInfo.name}`,
        description: `Completaste 5 deudas y desbloqueaste la ${plantInfo.name}`,
        icon: plantInfo.icon,
        awardedAt: new Date().toISOString(),
      });
    }
    
    // Create current plant in progress (if not at a multiple of 5)
    if (currentStage > 0 || completedPlantsCount === 0) {
      const currentPlantIndex = completedPlantsCount;
      const plantInfo = PLANT_CATALOG[currentPlantIndex % PLANT_CATALOG.length];
      newPlants.push({
        id: `plant-${currentPlantIndex + 1}`,
        name: plantInfo.name,
        tier: currentPlantIndex + 1,
        requiredDebts: 5,
        stage: currentStage,
        completed: false,
        unlockedAt: new Date().toISOString(),
      });
    }
    
    setGardenPlants(newPlants);
    setGardenBadges(newBadges);
  };

  // Count a debt as completed (only once)
  const countDebtAsCompleted = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt || debt.countedInProgress) return;
    
    // Mark debt as counted
    setDebts(prev => prev.map(d => 
      d.id === debtId ? { ...d, countedInProgress: true } : d
    ));
    
    const newTotal = historicalDebtsPaid + 1;
    setHistoricalDebtsPaid(newTotal);
    
    // Show notification
    toast.success("¡Genial! Has pagado por completo una deuda. Tu progreso histórico aumentó +1.", {
      duration: 4000,
    });
    
    // Check if completing a plant (every 5 debts)
    if (newTotal % 5 === 0) {
      const plantIndex = Math.floor(newTotal / 5) - 1;
      const plantInfo = PLANT_CATALOG[plantIndex % PLANT_CATALOG.length];
      const nextPlantInfo = PLANT_CATALOG[(plantIndex + 1) % PLANT_CATALOG.length];
      
      setTimeout(() => {
        toast.success(`¡Felicidades! 🎉 Has desbloqueado la ${plantInfo.name} y ganado la insignia Jardinero de ${plantInfo.name}. Sigue así.`, {
          duration: 6000,
        });
        
        setTimeout(() => {
          toast.info(`Nuevo nivel desbloqueado: ahora tienes la semilla del ${nextPlantInfo.name}. Completa 5 deudas más para hacerlo florecer.`, {
            duration: 5000,
          });
        }, 2000);
      }, 1000);
    }
    
    updateGardenState(newTotal);
  };

  // Generate payment schedule for a debt with proper proration
  const generatePaymentSchedule = (debtId: string, monthlyPayment: number, months: number) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    // Remove existing payments for this debt
    setScheduledPayments(prev => prev.filter(p => p.debtId !== debtId));

    const cutoffDay = debt.cutoffDay || new Date(debt.dueDate).getDate();
    const newPayments: ScheduledPayment[] = [];
    const pendingAmount = debt.amount - debt.paid;

    // Proper proration algorithm to avoid cent discrepancies
    const basePayment = Math.round((pendingAmount / months) * 100) / 100;
    const totalWithBase = Math.round(basePayment * months * 100) / 100;
    const difference = Math.round((pendingAmount - totalWithBase) * 100) / 100;

    for (let i = 1; i <= months; i++) {
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + i);
      paymentDate.setDate(cutoffDay);

      const amount = i === 1 
        ? Math.round((basePayment + difference) * 100) / 100
        : basePayment;

      if (amount > 0) {
        newPayments.push({
          id: `scheduled-${debtId}-${i}`,
          debtId: debt.id,
          debtName: debt.name,
          amount: amount,
          dueDate: paymentDate.toISOString().split('T')[0],
          paid: false,
          paidAmount: 0,
          monthNumber: i,
        });
      }
    }

    setScheduledPayments(prev => [...prev, ...newPayments]);
  };

  // Debt functions
  const addDebt = (debt: Omit<Debt, "id" | "countedInProgress">) => {
    const newDebt = { ...debt, id: Date.now().toString(), countedInProgress: false };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => debt.id === id ? { ...debt, ...updates } : debt));
  };

  const deleteDebt = (id: string) => {
    const debt = debts.find(d => d.id === id);
    if (debt?.countedInProgress) {
      toast.warning("Atención: esta deuda ya cuenta en tu historia de progreso. Eliminarla no borrará tu logro histórico.", {
        duration: 5000,
      });
    }
    setDebts(prev => prev.filter(debt => debt.id !== id));
    // Also remove scheduled payments for this debt
    setScheduledPayments(prev => prev.filter(p => p.debtId !== id));
  };

  // Payment functions
  const markPaymentAsPaid = (id: string, paidAmount: number, expenseId: string) => {
    const payment = scheduledPayments.find(p => p.id === id);
    if (!payment) return;
    
    const debt = debts.find(d => d.id === payment.debtId);
    if (!debt) return;

    const newPaymentPaidAmount = payment.paidAmount + paidAmount;
    const isPaymentComplete = newPaymentPaidAmount >= payment.amount;
    const newDebtPaid = debt.paid + paidAmount;

    updateDebt(payment.debtId, { paid: newDebtPaid });

    // Check if debt is fully paid
    const isDebtFullyPaid = newDebtPaid >= debt.amount;

    if (isDebtFullyPaid) {
      // Count this debt as completed for garden progress
      if (!debt.countedInProgress) {
        countDebtAsCompleted(payment.debtId);
      }
      
      setScheduledPayments(prev => {
        const updated = prev.map(p => {
          if (p.id === id) {
            return { ...p, paidAmount: newPaymentPaidAmount, paid: true };
          }
          return p;
        });
        return updated.filter(p => p.debtId !== payment.debtId || p.paid);
      });
    } else {
      setScheduledPayments(prev => prev.map(p => 
        p.id === id ? { 
          ...p, 
          paidAmount: newPaymentPaidAmount,
          paid: isPaymentComplete 
        } : p
      ));
    }

    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === expenseId && transaction.type === "expense") {
        return { ...transaction, used: transaction.used + paidAmount };
      }
      return transaction;
    }));
  };

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: Date.now().toString(), used: 0 };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Badge functions
  const earnBadge = (id: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === id ? { ...badge, earned: true, date: new Date().toISOString().split("T")[0] } : badge
    ));
  };

  // Challenge functions
  const updateChallengeProgress = (id: string, progress: number) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === id) {
        const completed = progress >= challenge.target;
        return { ...challenge, progress, completed };
      }
      return challenge;
    }));
  };

  // Streak functions
  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = new Date(streak.lastActivityDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return;
    } else if (diffDays === 1) {
      const newCurrent = streak.current + 1;
      setStreak({
        current: newCurrent,
        longest: Math.max(newCurrent, streak.longest),
        lastActivityDate: today,
      });
    } else {
      setStreak({
        current: 1,
        longest: streak.longest,
        lastActivityDate: today,
      });
    }
  };

  // Calculate debt progress (0-100%)
  const getDebtProgress = () => {
    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalPaid = debts.reduce((sum, debt) => sum + debt.paid, 0);
    return totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;
  };

  // Get plant stage based on debt progress
  const getPlantStage = () => {
    const progress = getDebtProgress();
    if (progress === 0) return 1;
    if (progress < 20) return 2;
    if (progress < 40) return 3;
    if (progress < 60) return 4;
    if (progress < 80) return 5;
    return 6;
  };

  // Garden helper functions
  const getCurrentPlant = (): GardenPlant | null => {
    return gardenPlants.find(p => !p.completed) || null;
  };

  const getCompletedPlants = (): GardenPlant[] => {
    return gardenPlants.filter(p => p.completed);
  };

  const value: AppContextType = {
    user,
    setUser,
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    scheduledPayments,
    generatePaymentSchedule,
    markPaymentAsPaid,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    badges,
    earnBadge,
    challenges,
    updateChallengeProgress,
    streak,
    updateStreak,
    getDebtProgress,
    getPlantStage,
    // Garden
    historicalDebtsPaid,
    gardenPlants,
    gardenBadges,
    getCurrentPlant,
    getCompletedPlants,
    // Sesión
    userId,
    handleLogin,
    handleLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context (EXPORTACIÓN CLAVE)
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};