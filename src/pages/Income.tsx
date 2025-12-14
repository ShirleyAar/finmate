import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ChevronLeft, Plus, TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const Income = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useApp();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    customCategory: "",
  });

  const categories = {
    income: ["Salario", "Freelance", "Inversiones", "Otros Ingresos"],
    expense: ["Alimentación", "Transporte", "Vivienda", "Entretenimiento", "Servicios", "Otros Gastos"],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const finalCategory = (formData.category === "Otros Ingresos" || formData.category === "Otros Gastos") && formData.customCategory
      ? formData.customCategory
      : formData.category;

    if (editingId) {
      updateTransaction(editingId, {
        ...formData,
        category: finalCategory,
        amount: parseFloat(formData.amount),
      });
      toast({
        title: "Transacción Actualizada",
        description: "La transacción ha sido actualizada exitosamente",
      });
    } else {
      addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: finalCategory,
        date: formData.date,
        description: formData.description,
        used: 0,
      });
      toast({
        title: "Transacción Agregada",
        description: `${formData.type === "income" ? "Ingreso" : "Gasto"} registrado exitosamente`,
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (transaction: typeof transactions[0]) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      description: transaction.description,
      customCategory: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transacción Eliminada",
      description: "La transacción ha sido eliminada",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      type: "income",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      customCategory: "",
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Ingresos y Gastos</h1>
            <p className="text-muted-foreground">Registra y administra tus finanzas</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-growth hover:bg-growth/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Transacción
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-growth-light to-card border-growth/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-growth/20">
                <TrendingUp className="h-6 w-6 text-growth" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-growth">${formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/10 to-card border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-destructive/20">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gastos Totales</p>
                <p className="text-2xl font-bold text-destructive">${formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${balance >= 0 ? "bg-gradient-to-br from-trust-light to-card border-trust/20" : "bg-gradient-to-br from-earth-light to-card border-earth/20"}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${balance >= 0 ? "bg-trust/20" : "bg-earth/20"}`}>
                <TrendingUp className={`h-6 w-6 ${balance >= 0 ? "text-trust" : "text-earth"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-trust" : "text-destructive"}`}>
                  {balance < 0 ? "-" : ""}${formatCurrency(Math.abs(balance))}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Transacciones</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-growth/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "income" ? "bg-growth/20" : "bg-destructive/20"
                    }`}>
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-5 w-5 text-growth" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{transaction.category}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          transaction.type === "income" 
                            ? "bg-growth/20 text-growth" 
                            : "bg-destructive/20 text-destructive"
                        }`}>
                          {transaction.type === "income" ? "Ingreso" : "Gasto"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.description} • {new Date(transaction.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className={`text-xl font-bold ${
                      transaction.type === "income" ? "text-growth" : "text-destructive"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add/Edit Transaction Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Transacción" : "Agregar Transacción"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") => 
                    setFormData({ ...formData, type: value, category: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Ingreso</SelectItem>
                    <SelectItem value="expense">Gasto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value, customCategory: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.category === "Otros Ingresos" || formData.category === "Otros Gastos") && (
                <div className="space-y-2">
                  <Label>Especificar {formData.type === "income" ? "Ingreso" : "Gasto"}</Label>
                  <Input
                    placeholder={`Ej: ${formData.type === "income" ? "Venta de ropa" : "Médico"}`}
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  placeholder="Descripción breve (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-growth hover:bg-growth/90 text-white"
                >
                  {editingId ? "Actualizar" : "Guardar"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCloseDialog}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Income;