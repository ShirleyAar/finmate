import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Bell, CheckCircle2, Calendar } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const Payments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scheduledPayments, markPaymentAsPaid, transactions, debts } = useApp();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof scheduledPayments[0] | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedExpense, setSelectedExpense] = useState("");

  const expenseTransactions = transactions.filter(t => t.type === "expense" && t.used < t.amount);

  const handleOpenPaymentDialog = (payment: typeof scheduledPayments[0]) => {
    setSelectedPayment(payment);
    const remaining = payment.amount - payment.paidAmount;
    setPaymentAmount(remaining.toFixed(2));
    setSelectedExpense("");
    setIsPaymentDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Monto Inválido",
        description: "Por favor ingresa un monto válido",
        variant: "destructive",
      });
      return;
    }

    if (!selectedExpense) {
      toast({
        title: "Selección Requerida",
        description: "Debes vincular este pago a uno o varios gastos registrados",
        variant: "destructive",
      });
      return;
    }

    const expense = transactions.find(t => t.id === selectedExpense);
    if (!expense) {
      toast({
        title: "Error",
        description: "Gasto no encontrado",
        variant: "destructive",
      });
      return;
    }

    const availableAmount = expense.amount - expense.used;
    const paidAmount = parseFloat(paymentAmount);

    if (paidAmount > availableAmount) {
      toast({
        title: "Monto Excedido",
        description: `Este gasto solo tiene $${formatCurrency(availableAmount)} disponibles`,
        variant: "destructive",
      });
      return;
    }

    markPaymentAsPaid(selectedPayment.id, paidAmount, selectedExpense);
    
    // Check if payment is partial or full
    const debt = debts.find(d => d.id === selectedPayment.debtId);
    if (debt) {
      const isFullPayment = paidAmount >= selectedPayment.amount;
      if (isFullPayment && debt.paid + paidAmount >= debt.amount) {
        toast({
          title: "¡Felicidades! 🥳",
          description: "¡Has terminado de pagar esta deuda!",
        });
      } else if (isFullPayment) {
        toast({
          title: "Pago Completo",
          description: `Pago de $${formatCurrency(paidAmount)} registrado exitosamente`,
        });
      } else {
        toast({
          title: "¡Por fin pagaste una parte de tu deuda! 🎉",
          description: "¡Sigue así!",
        });
      }
    }
    
    setIsPaymentDialogOpen(false);
    setSelectedPayment(null);
    setPaymentAmount("");
    setSelectedExpense("");
  };

  // Filter out $0.00 payments and only show payments for debts with pending balance
  const debtIdsWithPendingBalance = debts
    .filter(d => d.amount - d.paid > 0)
    .map(d => d.id);

  // Only show payments that: are not paid, have effective amount > 0, AND belong to debts with pending balance
  const upcomingPayments = scheduledPayments
    .filter(p => {
      const effectiveAmount = p.amount - p.paidAmount;
      return !p.paid && effectiveAmount > 0.01 && debtIdsWithPendingBalance.includes(p.debtId);
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Show completed payments with actual amounts paid (exclude $0.00 payments)
  const completedPayments = scheduledPayments
    .filter(p => p.paid && p.paidAmount > 0)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

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

        <h1 className="text-3xl font-bold text-foreground mb-2">Próximos Pagos y Recordatorios</h1>
        <p className="text-muted-foreground mb-8">Gestiona tus pagos pendientes</p>

        {/* Upcoming Payments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            Pagos Pendientes
          </h2>
          
          {upcomingPayments.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-growth mx-auto mb-4" />
              <p className="text-muted-foreground">¡No tienes pagos pendientes!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <Card 
                  key={payment.id} 
                  className="p-6 border-2 border-accent/30 bg-gradient-to-r from-card to-accent/5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-full bg-accent/20">
                        <Bell className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{payment.debtName}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="h-4 w-px bg-border"></div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg">
                              ${formatCurrency(payment.amount - payment.paidAmount)}
                            </span>
                            {payment.paidAmount > 0 && (
                              <span className="text-xs text-growth">
                                Pagado: ${formatCurrency(payment.paidAmount)} de ${formatCurrency(payment.amount)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleOpenPaymentDialog(payment)}
                      className="bg-growth hover:bg-growth/90 text-white font-semibold px-6"
                    >
                      Marcar como Pagado
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Payments */}
        {completedPayments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-growth" />
              Pagos Completados
            </h2>
            
            <div className="space-y-3">
              {completedPayments.map((payment) => (
                <Card key={payment.id} className="p-4 bg-growth/5 border-growth/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-growth" />
                      <div>
                        <h4 className="font-medium text-foreground">{payment.debtName}</h4>
                        <span className="text-sm text-muted-foreground">
                          ${formatCurrency(payment.amount)} • {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-growth">Pagado ✓</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{selectedPayment.debtName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Monto del mes: ${formatCurrency(selectedPayment.amount)}
                  </p>
                  {selectedPayment.paidAmount > 0 && (
                    <p className="text-sm text-growth mt-1">
                      Ya pagado: ${formatCurrency(selectedPayment.paidAmount)} • Pendiente: ${formatCurrency(selectedPayment.amount - selectedPayment.paidAmount)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Monto Pagado</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vincular con Gasto Registrado (Obligatorio) *</Label>
                  {expenseTransactions.length === 0 ? (
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-destructive">
                        No hay gastos disponibles. Debes registrar un gasto primero en "Ingresos y Gastos".
                      </p>
                    </div>
                  ) : (
                    <Select value={selectedExpense} onValueChange={setSelectedExpense} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un gasto" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseTransactions.map((transaction) => {
                          const available = transaction.amount - transaction.used;
                          return (
                            <SelectItem key={transaction.id} value={transaction.id}>
                              {transaction.category} - ${formatCurrency(transaction.amount)} (Disponible: ${formatCurrency(available)})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-muted-foreground">
                    * Debes seleccionar de qué gasto provino el dinero para este pago. Puedes dividir un gasto entre varias deudas.
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleConfirmPayment}
                    className="flex-1 bg-growth hover:bg-growth/90 text-white"
                  >
                    Confirmar Pago
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPaymentDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;