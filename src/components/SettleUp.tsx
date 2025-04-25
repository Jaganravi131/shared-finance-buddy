
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseContext } from "@/context/ExpenseContext";
import { ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const SettleUp: React.FC = () => {
  const { balances, users, currentUser, currentGroup, settleUp } = useExpenseContext();
  
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  // Filter to only show users that the current user owes money to
  const usersToPay = users.filter(user => {
    // Only include users from the current group
    if (!currentGroup?.members.some(member => member.id === user.id)) {
      return false;
    }
    
    // Don't include the current user
    if (user.id === currentUser?.id) {
      return false;
    }
    
    // Only include users the current user owes money to
    const currentUserBalance = balances[currentUser?.id || ""] || 0;
    const otherUserBalance = balances[user.id] || 0;
    
    return currentUserBalance < 0 && otherUserBalance > 0;
  });

  // Calculate the suggested amount to pay (what you owe to the selected user)
  const calculateSuggestedAmount = (userId: string): number => {
    const currentUserBalance = Math.abs(balances[currentUser?.id || ""] || 0);
    const otherUserBalance = balances[userId] || 0;
    return Math.min(currentUserBalance, otherUserBalance);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setAmount(calculateSuggestedAmount(userId).toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !amount || isNaN(parseFloat(amount))) {
      toast.error("Please select a user and enter a valid amount");
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    
    // Call the settleUp function from context
    settleUp(
      currentUser?.id || "", 
      selectedUserId, 
      parseFloat(amount)
    );
    
    // Reset form
    setSelectedUserId("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Up</CardTitle>
        <CardDescription>Pay what you owe to other members</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="user">Pay To</Label>
              <Select value={selectedUserId} onValueChange={handleUserChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a person to pay" />
                </SelectTrigger>
                <SelectContent>
                  {usersToPay.length > 0 ? (
                    usersToPay.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      You don't owe anyone money
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0.01"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedUserId && (
            <div className="bg-muted rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
                <Avatar>
                  <AvatarImage src={users.find(u => u.id === selectedUserId)?.avatar} />
                  <AvatarFallback>{users.find(u => u.id === selectedUserId)?.name.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-right">
                <p className="font-medium">${amount}</p>
                <p className="text-sm text-muted-foreground">via {paymentMethod}</p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit} disabled={!selectedUserId || !amount}>
          Complete Payment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettleUp;
