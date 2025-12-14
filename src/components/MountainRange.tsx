import { cn } from "@/lib/utils";
import MiniMountain from "./MiniMountain";

interface Debt {
  id: string;
  name: string;
  amount: number;
  paid: number;
}

interface MountainRangeProps {
  debts: Debt[];
  className?: string;
}

const MountainRange = ({ debts, className }: MountainRangeProps) => {
  // Calculate remaining percentage for each debt
  const debtMountains = debts.map(debt => ({
    ...debt,
    remainingPercent: debt.amount > 0 ? Math.round(((debt.amount - debt.paid) / debt.amount) * 100) : 0,
  }));
  
  // Sort: unpaid debts (highest % to lowest), then paid debts at the end
  const sortedMountains = [...debtMountains].sort((a, b) => {
    const aIsPaid = a.remainingPercent === 0;
    const bIsPaid = b.remainingPercent === 0;
    
    // Paid debts go to the end
    if (aIsPaid && !bIsPaid) return 1;
    if (!aIsPaid && bIsPaid) return -1;
    
    // Among unpaid: highest percentage first
    if (!aIsPaid && !bIsPaid) return b.remainingPercent - a.remainingPercent;
    
    // Among paid: maintain order
    return 0;
  });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Mini mountains cordillera */}
      {debts.length > 0 && (
        <div className="w-full">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">Cordillera de deudas</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {sortedMountains.map((debt) => (
              <MiniMountain
                key={debt.id}
                remainingPercent={debt.remainingPercent}
                name={debt.name}
                size="md"
                showLabel={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {debts.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay deudas registradas
        </p>
      )}
    </div>
  );
};

export default MountainRange;
