
import React from "react";
import { toast } from "sonner";
import { useExpenseContext } from "@/context/ExpenseContext";

const ExpenseNotification: React.FC = () => {
  const { expenses } = useExpenseContext();
  
  // Track the previous expense count to detect changes
  const prevExpenseCountRef = React.useRef(expenses.length);
  
  React.useEffect(() => {
    // If there's a new expense (the count increased)
    if (expenses.length > prevExpenseCountRef.current) {
      const newExpense = expenses[expenses.length - 1];
      
      // Show a notification about the new expense
      toast.success(`New expense added: ${newExpense.title} - $${newExpense.amount.toFixed(2)}`);
      
      // Check if there are any unpaid splits in this expense
      const unpaidSplits = newExpense.splits.filter(split => !split.isPaid);
      if (unpaidSplits.length > 0) {
        // Notify about payments that need to be made
        setTimeout(() => {
          toast.info(`${unpaidSplits.length} payment(s) pending for this expense`, {
            description: "Check your balances to settle up"
          });
        }, 2000); // Show this notification after a delay
      }
    }
    
    // Update the reference for next check
    prevExpenseCountRef.current = expenses.length;
  }, [expenses]);
  
  // This component doesn't render anything
  return null;
};

export default ExpenseNotification;
