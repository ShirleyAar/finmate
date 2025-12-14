import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Edit, ChevronLeft, Trash2, Plus, AlertTriangle, Crown, Calculator, TrendingUp, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";

const DebtDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { debts, updateDebt, deleteDebt, addDebt, generatePaymentSchedule } = useApp();
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [editingDebt, setEditingDebt] = useState<typeof debts[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isMoraSimulatorOpen, setIsMoraSimulatorOpen] = useState(false);
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false);
  
  // Mora simulator states
  const [moraPercentage, setMoraPercentage] = useState("");
  const [lateDays, setLateDays] = useState("");
  const [moraType, setMoraType] = useState<"anual" | "diario">("anual");
  const [moraCompound, setMoraCompound] = useState(false);
  const [moraResults, setMoraResults] = useState<{
    moraAmount: number;
    newTotal: number;
    originalAmount: number;
    dailyRate: number;
  } | null>(null);

  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState<"standard" | "accelerated">("standard");
  const [acceleratedMonths, setAcceleratedMonths] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    rate: "",
    dueDate: "",
    cutoffDay: "",
    notes: "",
  });

  // Calcular meses restantes (n)
  const calculateRemainingMonths = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysBetween = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(daysBetween / 30));
  };

  // Fórmula de amortización estándar
  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
    if (principal <= 0) return 0;
    
    const monthlyRate = (annualRate / 100) / 12;
    
    if (monthlyRate === 0) {
      return principal / months;
    }
    
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  // Helper to check if debt is fully paid
  const isDebtPaid = (debt: typeof debts[0]) => debt.paid >= debt.amount;

  // Sort debts: unpaid first (by due date), then paid debts
  const sortedDebts = [...debts].sort((a, b) => {
    const aIsPaid = isDebtPaid(a);
    const bIsPaid = isDebtPaid(b);
    
    // Unpaid debts come first
    if (aIsPaid !== bIsPaid) {
      return aIsPaid ? 1 : -1;
    }
    
    // Within unpaid: sort by due date (soonest first)
    if (!aIsPaid && !bIsPaid) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Within paid: most recently paid first (we don't have completedAt, so keep original order)
    return 0;
  });

  const selectedDebt = selectedDebtId ? debts.find(d => d.id === selectedDebtId) : null;
  const selectedDebtIsPaid = selectedDebt ? isDebtPaid(selectedDebt) : false;
  
  // Calcular datos de la deuda seleccionada
  const getDebtData = (debt: typeof debts[0]) => {
    const principal = debt.amount - debt.paid;
    const remainingMonths = calculateRemainingMonths(debt.dueDate);
    const monthlyPayment = calculateMonthlyPayment(principal, debt.rate, remainingMonths);
    
    return {
      principal,
      remainingMonths,
      monthlyPayment,
    };
  };

  const handleEditDebt = (debt: typeof debts[0]) => {
    setEditingDebt(debt);
    const cutoffDay = debt.cutoffDay || new Date(debt.dueDate).getDate();
    setFormData({
      name: debt.name,
      amount: debt.amount.toString(),
      rate: debt.rate.toString(),
      dueDate: debt.dueDate,
      cutoffDay: cutoffDay.toString(),
      notes: debt.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveDebt = () => {
    if (editingDebt) {
      updateDebt(editingDebt.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        rate: parseFloat(formData.rate),
        dueDate: formData.dueDate,
        cutoffDay: parseInt(formData.cutoffDay) || new Date(formData.dueDate).getDate(),
        notes: formData.notes,
      });
      toast({
        title: "Deuda Actualizada",
        description: "Los cambios han sido guardados",
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteDebt = (id: string) => {
    deleteDebt(id);
    if (selectedDebtId === id) {
      setSelectedDebtId(null);
    }
    toast({
      title: "Deuda Eliminada",
      description: "La deuda y sus pagos programados han sido eliminados",
    });
  };

  const handleAddDebt = () => {
    setFormData({
      name: "",
      amount: "",
      rate: "",
      dueDate: "",
      cutoffDay: "",
      notes: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveNewDebt = () => {
    if (!formData.name || !formData.amount || !formData.rate || !formData.dueDate) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const rate = parseFloat(formData.rate);
    const dueDate = new Date(formData.dueDate);
    const today = new Date();

    if (amount <= 0) {
      toast({
        title: "Monto Inválido",
        description: "El monto total debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    if (rate < 0) {
      toast({
        title: "Tasa Inválida",
        description: "La tasa de interés no puede ser negativa",
        variant: "destructive",
      });
      return;
    }

    if (dueDate <= today) {
      toast({
        title: "Fecha Inválida",
        description: "La fecha límite debe ser mayor a la fecha actual",
        variant: "destructive",
      });
      return;
    }

    const cutoffDay = formData.cutoffDay 
      ? parseInt(formData.cutoffDay) 
      : new Date(formData.dueDate).getDate();

    addDebt({
      name: formData.name,
      amount: amount,
      paid: 0,
      rate: rate,
      dueDate: formData.dueDate,
      cutoffDay: cutoffDay,
      notes: formData.notes,
    });

    toast({
      title: "Deuda Agregada",
      description: "La nueva deuda ha sido registrada exitosamente",
    });
    setIsAddDialogOpen(false);
  };

  const handleOpenPaymentMethod = () => {
    if (!selectedDebtId) {
      toast({
        title: "Selecciona una Deuda",
        description: "Por favor selecciona una deuda primero",
        variant: "destructive",
      });
      return;
    }
    if (selectedDebtIsPaid) {
      toast({
        title: "Deuda Completada",
        description: "Esta deuda ya está completamente pagada",
        variant: "destructive",
      });
      return;
    }
    setPaymentMethod("standard");
    setAcceleratedMonths("");
    setIsPaymentMethodDialogOpen(true);
  };

  const handleSendToPayments = () => {
    if (!selectedDebt) return;

    const debtData = getDebtData(selectedDebt);
    let months = debtData.remainingMonths;
    let monthlyPayment = debtData.monthlyPayment;

    if (paymentMethod === "accelerated") {
      const customMonths = parseInt(acceleratedMonths);
      if (!customMonths || customMonths < 1) {
        toast({
          title: "Meses Inválidos",
          description: "Por favor ingresa un número válido de meses (mínimo 1)",
          variant: "destructive",
        });
        return;
      }
      months = customMonths;
      monthlyPayment = calculateMonthlyPayment(debtData.principal, selectedDebt.rate, months);
    }

    generatePaymentSchedule(selectedDebt.id, monthlyPayment, months);
    
    toast({
      title: "Plan Generado",
      description: `Se crearon ${months} pagos mensuales de $${formatCurrency(monthlyPayment)}`,
    });
    
    setIsPaymentMethodDialogOpen(false);
    navigate("/payments");
  };

  const handleOpenMoraSimulator = () => {
    if (!selectedDebtId) {
      toast({
        title: "Selecciona una Deuda",
        description: "Por favor selecciona una deuda para simular mora",
        variant: "destructive",
      });
      return;
    }
    if (selectedDebtIsPaid) {
      toast({
        title: "Deuda Completada",
        description: "Esta deuda ya está completamente pagada, no aplica mora",
        variant: "destructive",
      });
      return;
    }
    setMoraPercentage("");
    setLateDays("");
    setMoraType("anual");
    setMoraCompound(false);
    setMoraResults(null);
    setIsMoraSimulatorOpen(true);
  };

  const handleCalculateMora = () => {
    if (!selectedDebt || !moraPercentage || !lateDays) {
      toast({
        title: "Datos Incompletos",
        description: "Por favor completa el porcentaje de mora y los días de atraso",
        variant: "destructive",
      });
      return;
    }

    const principal = selectedDebt.amount - selectedDebt.paid;
    const moraRate = parseFloat(moraPercentage) / 100;
    const days = parseInt(lateDays);
    
    // Calcular tasa diaria
    const dailyRate = moraType === "anual" ? moraRate / 365 : moraRate;
    
    let totalMora = 0;
    
    if (moraCompound) {
      // Interés compuesto diario
      totalMora = principal * (Math.pow(1 + dailyRate, days) - 1);
    } else {
      // Interés simple
      totalMora = principal * dailyRate * days;
    }
    
    const newTotal = principal + totalMora;

    setMoraResults({
      moraAmount: totalMora,
      newTotal: newTotal,
      originalAmount: principal,
      dailyRate: dailyRate,
    });

    toast({
      title: "Simulación Completada",
      description: `Si te demoras ${days} días pagarás $${formatCurrency(totalMora)} adicionales por mora`,
    });
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
          Volver al Panel
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Detalles de Deudas y Estrategias</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Debt List */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Tus Deudas</h2>
              <Button 
                onClick={handleAddDebt}
                className="bg-growth hover:bg-growth/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Deuda
              </Button>
            </div>
            
            {sortedDebts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No tienes deudas registradas</p>
              </Card>
            ) : (
              sortedDebts.map((debt) => {
                const debtData = getDebtData(debt);
                const debtProgress = Math.round((debt.paid / debt.amount) * 100);
                const isSelected = selectedDebtId === debt.id;
                const isPaid = isDebtPaid(debt);
                
                return (
                  <Card 
                    key={debt.id} 
                    className={`p-6 cursor-pointer transition-all ${
                      isPaid 
                        ? "bg-growth/10 border-growth/30 opacity-80" 
                        : isSelected 
                          ? "border-2 border-growth bg-growth/5" 
                          : "hover:border-growth/30"
                    }`}
                    onClick={() => setSelectedDebtId(debt.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">{debt.name}</h3>
                          {isPaid && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-growth text-white font-medium">
                              ✓ Deuda Pagada
                            </span>
                          )}
                          {isSelected && !isPaid && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-growth text-white">
                              Seleccionada
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div>
                            <span className="text-muted-foreground">Monto Total</span>
                            <p className="font-medium text-foreground">${formatCurrency(debt.amount)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Pagado</span>
                            <p className="font-medium text-growth">${formatCurrency(debt.paid)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Saldo Pendiente</span>
                            <p className={`font-medium ${isPaid ? "text-growth" : "text-destructive"}`}>
                              {isPaid ? "Completado" : `$${formatCurrency(debtData.principal)}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tasa</span>
                            <p className="font-medium text-foreground">{debt.rate}%</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <span className="text-muted-foreground">Fecha Límite</span>
                            <p className="font-medium text-foreground">{new Date(debt.dueDate).toLocaleDateString('es-ES')}</p>
                          </div>
                          {!isPaid && (
                            <div>
                              <span className="text-muted-foreground">Meses Restantes</span>
                              <p className="font-medium text-foreground">{debtData.remainingMonths} meses</p>
                            </div>
                          )}
                        </div>
                        
                        {!isPaid && (
                          <div className="mt-4 p-4 bg-trust/10 rounded-lg border border-trust/20">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-muted-foreground">Pago mensual recomendado (hasta la fecha límite)</span>
                              <TrendingUp className="h-4 w-4 text-trust" />
                            </div>
                            <p className="text-2xl font-bold text-trust">${formatCurrency(debtData.monthlyPayment)}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Calculado para liquidar la deuda en {debtData.remainingMonths} meses, incluyendo intereses según la tasa anual indicada.
                            </p>
                          </div>
                        )}

                        {isPaid && (
                          <div className="mt-4 p-4 bg-growth/20 rounded-lg border border-growth/30">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-growth" />
                              <span className="font-semibold text-growth">¡Pago Completado!</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Has pagado el 100% de esta deuda.
                            </p>
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-semibold text-growth">{debtProgress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-growth transition-all" 
                              style={{ width: `${debtProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={isPaid}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPaid) handleEditDebt(debt);
                          }}
                          title={isPaid ? "No se puede editar una deuda pagada" : "Editar deuda"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDebt(debt.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-4 animate-scale-in">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-foreground mb-4">Acciones</h3>
              
              {!selectedDebtId && (
                <div className="p-4 bg-accent/10 rounded-lg mb-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    👈 Selecciona una deuda de la lista para ver las opciones disponibles
                  </p>
                </div>
              )}

              {selectedDebtIsPaid && selectedDebtId && (
                <div className="p-4 bg-growth/10 rounded-lg mb-4 border border-growth/20">
                  <div className="flex items-center gap-2 text-growth font-medium">
                    <CheckCircle2 className="h-5 w-5" />
                    Deuda Completada
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Esta deuda ya fue pagada por completo. No se pueden realizar más acciones de pago.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleOpenPaymentMethod}
                  disabled={!selectedDebtId || selectedDebtIsPaid}
                  className="w-full bg-growth hover:bg-growth/90 text-white justify-start h-auto p-4 disabled:opacity-50"
                >
                  <Calculator className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Elegir Forma de Pago</div>
                    <div className="text-xs opacity-90 font-normal">
                      {selectedDebtIsPaid ? "No disponible - Deuda pagada" : "Configura tu plan de pagos"}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleOpenMoraSimulator}
                  disabled={!selectedDebtId || selectedDebtIsPaid}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-2 disabled:opacity-50"
                >
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 text-destructive" />
                  <div className="text-left">
                    <div className="font-semibold">Simulador por Mora</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedDebtIsPaid ? "No disponible - Deuda pagada" : "Calcula cargos por retraso"}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => !selectedDebtIsPaid && setIsPremiumDialogOpen(true)}
                  disabled={!selectedDebtId || selectedDebtIsPaid}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-2 border-accent/30 disabled:opacity-50"
                >
                  <Crown className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
                  <div className="text-left flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      Evitar Pagos Tardíos
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Premium</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Prioriza fechas de vencimiento</div>
                  </div>
                </Button>

                <Button
                  onClick={() => !selectedDebtIsPaid && setIsPremiumDialogOpen(true)}
                  disabled={!selectedDebtId || selectedDebtIsPaid}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-2 border-accent/30 disabled:opacity-50"
                >
                  <Crown className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
                  <div className="text-left flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      Simplificar Cuentas
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Premium</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Consolida múltiples deudas</div>
                  </div>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Dialog: Edit Debt */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Deuda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre de la Deuda *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Tarjeta de Crédito"
                />
              </div>
              <div>
                <Label>Monto Total *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Tasa de Interés Anual (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label>Fecha Límite (fecha final del diferido) *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Día de Corte Mensual</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.cutoffDay}
                  onChange={(e) => setFormData({ ...formData, cutoffDay: e.target.value })}
                  placeholder="Día del mes (1-31)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Si se deja vacío, se usa el día de la fecha límite
                </p>
              </div>
              <div>
                <Label>Notas (opcional)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Cualquier detalle adicional"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveDebt} className="flex-1 bg-growth hover:bg-growth/90 text-white">
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Add Debt */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Deuda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre de la Deuda *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Tarjeta de Crédito"
                />
              </div>
              <div>
                <Label>Monto Total *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Tasa de Interés Anual (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label>Fecha Límite (fecha final del diferido) *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Día de Corte Mensual</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.cutoffDay}
                  onChange={(e) => setFormData({ ...formData, cutoffDay: e.target.value })}
                  placeholder="Día del mes (1-31)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Si se deja vacío, se usa el día de la fecha límite
                </p>
              </div>
              <div>
                <Label>Notas (opcional)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Cualquier detalle adicional"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveNewDebt} className="flex-1 bg-growth hover:bg-growth/90 text-white">
                  Agregar Deuda
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Payment Method */}
        <Dialog open={isPaymentMethodDialogOpen} onOpenChange={setIsPaymentMethodDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Elegir Forma de Pago</DialogTitle>
              <DialogDescription>
                Selecciona cómo deseas configurar tus pagos mensuales
              </DialogDescription>
            </DialogHeader>
            {selectedDebt && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{selectedDebt.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Saldo pendiente: ${formatCurrency(getDebtData(selectedDebt).principal)}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("standard")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === "standard"
                        ? "border-growth bg-growth/10"
                        : "border-border hover:border-growth/50"
                    }`}
                  >
                    <div className="font-semibold text-foreground mb-1">Pagar hasta la fecha límite</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Plan estándar según tu diferido
                    </p>
                    {paymentMethod === "standard" && (
                      <div className="mt-3 p-3 bg-background rounded border border-border">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Pago mensual:</span>
                          <span className="font-bold text-trust">${formatCurrency(getDebtData(selectedDebt).monthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Meses:</span>
                          <span className="font-medium">{getDebtData(selectedDebt).remainingMonths}</span>
                        </div>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("accelerated")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === "accelerated"
                        ? "border-growth bg-growth/10"
                        : "border-border hover:border-growth/50"
                    }`}
                  >
                    <div className="font-semibold text-foreground mb-1">Pagar en N meses (acelerado)</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ingresa en cuántos meses quieres pagar
                    </p>
                    {paymentMethod === "accelerated" && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label className="text-xs">Número de meses</Label>
                          <Input
                            type="number"
                            min="1"
                            value={acceleratedMonths}
                            onChange={(e) => setAcceleratedMonths(e.target.value)}
                            placeholder="Ej: 6"
                          />
                        </div>
                        {acceleratedMonths && parseInt(acceleratedMonths) > 0 && (
                          <div className="p-3 bg-background rounded border border-border">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Pago mensual requerido:</span>
                              <span className="font-bold text-trust">
                                ${formatCurrency(calculateMonthlyPayment(
                                  getDebtData(selectedDebt).principal,
                                  selectedDebt.rate,
                                  parseInt(acceleratedMonths)
                                ))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSendToPayments}
                    className="flex-1 bg-growth hover:bg-growth/90 text-white"
                  >
                    Enviar a Próximos Pagos
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPaymentMethodDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog: Mora Simulator */}
        <Dialog open={isMoraSimulatorOpen} onOpenChange={setIsMoraSimulatorOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Simulador por Mora</DialogTitle>
              <DialogDescription>
                Calcula el impacto de pagos tardíos
              </DialogDescription>
            </DialogHeader>
            {selectedDebt && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{selectedDebt.name}</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo pendiente:</span>
                      <span className="font-medium">${formatCurrency(getDebtData(selectedDebt).principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa:</span>
                      <span className="font-medium">{selectedDebt.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha límite:</span>
                      <span className="font-medium">{new Date(selectedDebt.dueDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Días de retraso</Label>
                  <Input
                    type="number"
                    min="1"
                    value={lateDays}
                    onChange={(e) => setLateDays(e.target.value)}
                    placeholder="Ej: 15"
                  />
                </div>

                <div>
                  <Label>Porcentaje por mora</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={moraPercentage}
                    onChange={(e) => setMoraPercentage(e.target.value)}
                    placeholder="Ej: 3.5"
                  />
                </div>

                <div>
                  <Label>Tipo de porcentaje</Label>
                  <Select value={moraType} onValueChange={(v: "anual" | "diario") => setMoraType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anual">% Anual (convertir a diario)</SelectItem>
                      <SelectItem value="diario">% Por día</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compound"
                    checked={moraCompound}
                    onCheckedChange={(checked) => setMoraCompound(checked as boolean)}
                  />
                  <label htmlFor="compound" className="text-sm cursor-pointer">
                    Usar interés compuesto por días
                  </label>
                </div>

                <Button 
                  onClick={handleCalculateMora}
                  className="w-full bg-destructive hover:bg-destructive/90 text-white"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Mora
                </Button>

                {moraResults && (
                  <Alert className="border-destructive/50 bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-foreground">Resultados de la Simulación:</div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saldo original:</span>
                          <span className="font-medium">${formatCurrency(moraResults.originalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interés por mora:</span>
                          <span className="font-bold text-destructive">+${formatCurrency(moraResults.moraAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t border-destructive/20 pt-2">
                          <span className="font-semibold">Total a pagar ahora:</span>
                          <span className="font-bold text-destructive">${formatCurrency(moraResults.newTotal)}</span>
                        </div>
                        <div className="mt-4 p-3 bg-background rounded border border-border">
                          <p className="text-xs text-muted-foreground">
                            <strong>Recomendación:</strong> Si te demoras {lateDays} días pagarás ${formatCurrency(moraResults.moraAmount)} adicionales por mora. 
                            Recomendamos pagar antes: ${formatCurrency(getDebtData(selectedDebt).monthlyPayment)} mensuales para liquidar en {getDebtData(selectedDebt).remainingMonths} meses.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  variant="outline"
                  onClick={() => setIsMoraSimulatorOpen(false)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog: Premium */}
        <Dialog open={isPremiumDialogOpen} onOpenChange={setIsPremiumDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                Función Premium
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Esta función está disponible en Klimba Premium.
              </p>
            </div>
            <Button 
              onClick={() => setIsPremiumDialogOpen(false)}
              className="w-full"
              variant="outline"
            >
              Entendido
            </Button>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default DebtDetails;
