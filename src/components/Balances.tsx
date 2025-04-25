
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Balances: React.FC = () => {
  const { balances, users, currentUser, currentGroup } = useExpenseContext();

  const groupMembers = currentGroup?.members || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupMembers.map((member) => {
            if (member.id === currentUser?.id) return null;
            
            const memberBalance = balances[member.id] || 0;
            const yourBalance = balances[currentUser?.id || ""] || 0;
            
            let relationBalance = 0;
            let statusText = "";
            let statusClass = "";
            
            // Calculate the balance between current user and this member
            if (memberBalance < 0 && yourBalance > 0) {
              // They owe you
              relationBalance = Math.min(Math.abs(memberBalance), yourBalance);
              statusText = `owes you`;
              statusClass = "text-green-600";
            } else if (memberBalance > 0 && yourBalance < 0) {
              // You owe them
              relationBalance = Math.min(memberBalance, Math.abs(yourBalance));
              statusText = `you owe`;
              statusClass = "text-red-600";
            } else {
              // No direct relationship or balanced
              return null;
            }
            
            return (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{statusText}</span>
                  <span className={`font-semibold ${statusClass}`}>${relationBalance.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
          
          {groupMembers.length <= 1 && (
            <div className="text-center py-4 text-muted-foreground">
              No balances to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Balances;
