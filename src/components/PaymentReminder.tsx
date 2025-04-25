
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useExpenseContext } from '@/context/ExpenseContext';
import { formatDistance } from 'date-fns';

const PaymentReminder: React.FC = () => {
  const { expenses, currentUser, users } = useExpenseContext();
  
  useEffect(() => {
    // Only proceed if we have a current user
    if (!currentUser) return;
    
    // Find expenses where the current user has unpaid splits
    const unpaidExpenses = expenses.filter(expense => 
      expense.splits.some(split => 
        split.userId === currentUser.id && !split.isPaid
      )
    );
    
    if (unpaidExpenses.length === 0) return;
    
    // Group by age of the expense
    const overdueExpenses = unpaidExpenses.filter(exp => 
      new Date(exp.date).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    const recentExpenses = unpaidExpenses.filter(exp => 
      new Date(exp.date).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    // Show reminders based on urgency
    if (overdueExpenses.length > 0) {
      const oldestExpense = overdueExpenses.reduce((oldest, current) => 
        new Date(oldest.date) < new Date(current.date) ? oldest : current
      );
      
      const paidByUser = users.find(u => u.id === oldestExpense.paidBy);
      const timeAgo = formatDistance(
        new Date(oldestExpense.date),
        new Date(),
        { addSuffix: true }
      );
      
      toast.error(`Overdue payment to ${paidByUser?.name}`, {
        description: `$${oldestExpense.splits.find(s => s.userId === currentUser.id)?.amount.toFixed(2)} from ${timeAgo}`,
        duration: 8000,
        action: {
          label: "Settle up",
          onClick: () => {
            document.getElementById('nav-balances')?.click();
          }
        }
      });
    } else if (recentExpenses.length > 0) {
      toast.info(`You have ${recentExpenses.length} pending payments`, {
        description: "Review your balances and settle up",
        duration: 5000
      });
    }
  }, [currentUser, expenses, users]);
  
  // This component doesn't render anything
  return null;
};

export default PaymentReminder;
