
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RecentTransactions: React.FC = () => {
  const { expenses, users, currentGroup } = useExpenseContext();

  // Filter expenses for the current group and sort by date (newest first)
  const recentExpenses = expenses
    .filter(expense => expense.groupId === currentGroup?.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Get the 5 most recent expenses

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent group expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => {
            const paidBy = getUserById(expense.paidBy);
            return (
              <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={paidBy?.avatar} alt={paidBy?.name} />
                    <AvatarFallback>{paidBy?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{expense.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Paid by {paidBy?.name}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{expense.category}</Badge>
                  <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
          {recentExpenses.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
