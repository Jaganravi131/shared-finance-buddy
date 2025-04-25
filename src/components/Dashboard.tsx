
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenseContext } from "@/context/ExpenseContext";
import RecentTransactions from "@/components/RecentTransactions";
import { DollarSign, CreditCard, Users, ArrowDown, ArrowUp } from "lucide-react";

const Dashboard: React.FC = () => {
  const { expenses, balances, currentUser, currentGroup } = useExpenseContext();

  const totalOwed = Object.entries(balances).reduce((acc, [userId, amount]) => {
    if (userId === currentUser?.id && amount < 0) {
      return acc + Math.abs(amount);
    }
    return acc;
  }, 0);

  const totalOwedToYou = Object.entries(balances).reduce((acc, [userId, amount]) => {
    if (userId === currentUser?.id && amount > 0) {
      return acc + amount;
    }
    return acc;
  }, 0);

  const totalGroupExpenses = expenses
    .filter(expense => expense.groupId === currentGroup?.id)
    .reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-expense-purple-light to-expense-purple">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Total Balance</CardTitle>
            <CardDescription className="text-white/70">Your current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(balances[currentUser?.id || ""] || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">You Owe</CardTitle>
            <ArrowUp className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOwed.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">You Are Owed</CardTitle>
            <ArrowDown className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOwedToYou.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Group Total</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGroupExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <RecentTransactions />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <CreditCard className="w-6 h-6 mb-2" />
                <span>Add Expense</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <Users className="w-6 h-6 mb-2" />
                <span>Manage Group</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
