import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface User {
  name: string;
  email: string;
  avatar?: string;
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

// Interfaz que define el pago (faltaba en algunas versiones)
export interface Payment {
  id: string;
  debtId: string;
  debtName: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

// Context type
interface AppContextType {
  // === PROPIEDADES DE SESIÓN ===
  userId: string | null;
  handleLogin: (id: string) => void;
  handleLogout: () => void;

  // Propiedades del juego
  user: User | null;
  setUser: (user: User | null) => void;
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id">) => void;
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
  payments: Payment[]; // Añadido para compatibilidad
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// === ESTA ES LA CORRECCIÓN CLAVE ===
// Definimos que el Provider acepta las props de login
interface AppProviderProps {
  children: ReactNode;
  userId: string | null;
  handleLogin: (id: string) => void;
  handleLogout: () => void;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, userId, handleLogin, handleLogout }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('finmate_user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem('finmate_user_data', JSON.stringify(u));
    } else {
      localStorage.removeItem('finmate_user_data');
    }
  };

  // Datos iniciales
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Tarjeta de Crédito A", amount: 5200, paid: 1500, rate: 18.5, dueDate: "2025-12-15", cutoffDay: 15 },
    { id: "2", name: "Préstamo Personal B", amount: 4500, paid: 1200, rate: 12.0, dueDate: "2025-12-20", cutoffDay: 20 },
    { id: "3", name: "Crédito de Tienda C", amount: 2750, paid: 800, rate: 21.0, dueDate: "2025-12-10", cutoffDay: 10 },
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

  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const generatedPayments = debts.map(debt => ({
      id: `payment-${debt.id}`,
      debtId: debt.id,
      debtName: debt.name,
      amount: (debt.amount - debt.paid) / 12,
      dueDate: debt.dueDate,
      paid: false,
    }));
    setPayments(generatedPayments);
  }, [debts]);

  const generatePaymentSchedule = (debtId: string, monthlyPayment: number, months: number) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    setScheduledPayments(prev => prev.filter(p => p.debtId !== debtId));
    const cutoffDay = debt.cutoffDay || new Date(debt.dueDate).getDate();
    const newPayments: ScheduledPayment[] = [];
    for (let i = 1; i <= months; i++) {
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + i);
      paymentDate.setDate(cutoffDay);
      const amount = i === months ? debt.amount - debt.paid - (monthlyPayment * (months - 1)) : monthlyPayment;
      newPayments.push({
        id: `scheduled-${debtId}-${i}`,
        debtId: debt.id,
        debtName: debt.name,
        amount: Math.max(0, amount),
        dueDate: paymentDate.toISOString().split('T')[0],
        paid: false,
        paidAmount: 0,
        monthNumber: i,
      });
    }
    setScheduledPayments(prev => [...prev, ...newPayments]);
  };

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = { ...debt, id: Date.now().toString() };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => debt.id === id ? { ...debt, ...updates } : debt));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  const markPaymentAsPaid = (id: string, paidAmount: number, expenseId: string) => {
    const payment = scheduledPayments.find(p => p.id === id);
    if (!payment) return;
    const debt = debts.find(d => d.id === payment.debtId);
    if (!debt) return;
    const newPaymentPaidAmount = payment.paidAmount + paidAmount;
    const isPaymentComplete = newPaymentPaidAmount >= payment.amount;
    setScheduledPayments(prev => prev.map(p => p.id === id ? { ...p, paidAmount: newPaymentPaidAmount, paid: isPaymentComplete } : p));
    const newDebtPaid = debt.paid + paidAmount;
    updateDebt(payment.debtId, { paid: newDebtPaid });
    
    if (newDebtPaid >= debt.amount) {
      setScheduledPayments(prev => prev.filter(p => p.debtId !== payment.debtId || p.paid || p.id === id));
    } else if (isPaymentComplete) {
      const nextMonthNumber = payment.monthNumber + 1;
      const nextDueDate = new Date(payment.dueDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      const hasNextMonth = scheduledPayments.some(p => p.debtId === payment.debtId && p.monthNumber === nextMonthNumber);
      if (!hasNextMonth) {
        const newPayment: ScheduledPayment = {
          id: Date.now().toString(),
          debtId: payment.debtId,
          debtName: payment.debtName,
          amount: payment.amount,
          dueDate: nextDueDate.toISOString().split('T')[0],
          paid: false,
          paidAmount: 0,
          monthNumber: nextMonthNumber,
        };
        setScheduledPayments(prev => [...prev, newPayment]);
      }
    }
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === expenseId && transaction.type === "expense") {
        return { ...transaction, used: transaction.used + paidAmount };
      }
      return transaction;
    }));
  };

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

  const earnBadge = (id: string) => {
    setBadges(prev => prev.map(badge => badge.id === id ? { ...badge, earned: true, date: new Date().toISOString().split("T")[0] } : badge));
  };

  const updateChallengeProgress = (id: string, progress: number) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === id) {
        const completed = progress >= challenge.target;
        return { ...challenge, progress, completed };
      }
      return challenge;
    }));
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = new Date(streak.lastActivityDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return;
    else if (diffDays === 1) {
      const newCurrent = streak.current + 1;
      setStreak({ current: newCurrent, longest: Math.max(newCurrent, streak.longest), lastActivityDate: today });
    } else {
      setStreak({ current: 1, longest: streak.longest, lastActivityDate: today });
    }
  };

  const getDebtProgress = () => {
    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalPaid = debts.reduce((sum, debt) => sum + debt.paid, 0);
    return totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;
  };

  const getPlantStage = () => {
    const progress = getDebtProgress();
    if (progress === 0) return 1;
    if (progress < 20) return 2;
    if (progress < 40) return 3;
    if (progress < 60) return 4;
    if (progress < 80) return 5;
    return 6;
  };

  const value: AppContextType = {
    userId,
    handleLogin,
    handleLogout,
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
    payments,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};