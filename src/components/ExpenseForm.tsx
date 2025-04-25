import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseContext, ExpenseSplit } from "@/context/ExpenseContext";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = [
  "Food", "Rent", "Utilities", "Transportation", "Entertainment", "Travel", "Shopping", "Other"
];

type ExpenseFormProps = {
  initialData?: {
    title?: string;
    amount?: number;
    date?: Date;
    category?: string;
    paidBy?: string;
    groupId?: string;
  }
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData }) => {
  const { users, currentUser, currentGroup, addExpense } = useExpenseContext();
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [amount, setAmount] = useState(initialData?.amount ? initialData.amount.toString() : "");
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [category, setCategory] = useState(initialData?.category || "Food");
  const [paidBy, setPaidBy] = useState(initialData?.paidBy || currentUser?.id || "");
  const [splitMethod, setSplitMethod] = useState("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [percentageSplits, setPercentageSplits] = useState<Record<string, number>>({});

  // Set initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.amount) setAmount(initialData.amount.toString());
      if (initialData.date) setDate(initialData.date);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.paidBy) setPaidBy(initialData.paidBy);
      else setPaidBy(currentUser?.id || "");
    }
  }, [initialData, currentUser]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDate(new Date());
    setCategory("Food");
    setPaidBy(currentUser?.id || "");
    setSplitMethod("equal");
    setCustomSplits({});
    setPercentageSplits({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !category || !paidBy) {
      toast.error("Please fill out all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Calculate splits based on selected method
    let splits: ExpenseSplit[] = [];
    const groupMembers = currentGroup?.members || [];
    
    if (splitMethod === "equal") {
      const memberCount = groupMembers.length;
      const equalShare = parsedAmount / memberCount;
      
      splits = groupMembers.map(member => ({
        userId: member.id,
        amount: parseFloat(equalShare.toFixed(2)),
        isPaid: member.id === paidBy // The person who paid has already paid their share
      }));
      
    } else if (splitMethod === "percentage") {
      // Validate that percentages add up to 100%
      const totalPercentage = Object.values(percentageSplits).reduce((sum, value) => sum + value, 0);
      if (Math.abs(totalPercentage - 100) > 0.1) {
        toast.error("Percentages must add up to 100%");
        return;
      }
      
      splits = groupMembers.map(member => ({
        userId: member.id,
        amount: parseFloat(((percentageSplits[member.id] || 0) / 100 * parsedAmount).toFixed(2)),
        isPaid: member.id === paidBy
      }));
      
    } else if (splitMethod === "custom") {
      // Validate that custom amounts add up to the total
      const totalCustom = Object.values(customSplits).reduce((sum, value) => sum + value, 0);
      if (Math.abs(totalCustom - parsedAmount) > 0.1) {
        toast.error("Custom amounts must add up to the total amount");
        return;
      }
      
      splits = groupMembers.map(member => ({
        userId: member.id,
        amount: parseFloat((customSplits[member.id] || 0).toFixed(2)),
        isPaid: member.id === paidBy
      }));
    }
    
    // Create expense object
    const newExpense = {
      title,
      amount: parsedAmount,
      date,
      paidBy,
      category,
      groupId: currentGroup?.id || "",
      splits
    };
    
    addExpense(newExpense);
    toast.success("Expense added successfully");
    resetForm();
  };

  const handleEqualSplitChange = () => {
    setSplitMethod("equal");
  };

  const handlePercentSplitChange = () => {
    setSplitMethod("percentage");
    
    // Initialize with equal percentages
    const equalPercent = 100 / (currentGroup?.members.length || 1);
    const initialPercentages: Record<string, number> = {};
    
    currentGroup?.members.forEach(member => {
      initialPercentages[member.id] = equalPercent;
    });
    
    setPercentageSplits(initialPercentages);
  };

  const handleCustomSplitChange = () => {
    setSplitMethod("custom");
    
    // Initialize with equal amounts
    const equalAmount = parseFloat(amount) / (currentGroup?.members.length || 1);
    const initialCustom: Record<string, number> = {};
    
    currentGroup?.members.forEach(member => {
      initialCustom[member.id] = parseFloat(equalAmount.toFixed(2));
    });
    
    setCustomSplits(initialCustom);
  };

  const updatePercentageSplit = (userId: string, value: string) => {
    const percent = parseFloat(value);
    if (!isNaN(percent)) {
      setPercentageSplits({
        ...percentageSplits,
        [userId]: percent
      });
    }
  };

  const updateCustomSplit = (userId: string, value: string) => {
    const customAmount = parseFloat(value);
    if (!isNaN(customAmount)) {
      setCustomSplits({
        ...customSplits,
        [userId]: customAmount
      });
    }
  };
  
  // Calculate total percentage for validation
  const totalPercentage = Object.values(percentageSplits).reduce((sum, value) => sum + value, 0);
  const totalCustomAmount = Object.values(customSplits).reduce((sum, value) => sum + value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>Enter the expense details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Expense Title</Label>
              <Input 
                id="title" 
                placeholder="Dinner, Groceries, etc." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="0.00" 
                type="number" 
                step="0.01" 
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {currentGroup?.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Split Method</Label>
              <Tabs defaultValue="equal" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="equal" onClick={handleEqualSplitChange}>Equal</TabsTrigger>
                  <TabsTrigger value="percentage" onClick={handlePercentSplitChange}>Percentage</TabsTrigger>
                  <TabsTrigger value="custom" onClick={handleCustomSplitChange}>Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="equal" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Split equally among all members: ${amount ? (parseFloat(amount) / (currentGroup?.members.length || 1)).toFixed(2) : "0.00"} each.
                  </p>
                  
                  <div className="space-y-2">
                    {currentGroup?.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>${amount ? (parseFloat(amount) / (currentGroup?.members.length || 1)).toFixed(2) : "0.00"}</span>
                          <Checkbox checked={member.id === paidBy} disabled />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="percentage" className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Assign percentages to each member</span>
                    <span className={cn("font-medium", Math.abs(totalPercentage - 100) > 0.1 ? "text-red-500" : "text-green-500")}>
                      Total: {totalPercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {currentGroup?.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            className="w-16 h-8"
                            value={percentageSplits[member.id] || ""}
                            onChange={(e) => updatePercentageSplit(member.id, e.target.value)}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span>%</span>
                          <span className="w-20 text-right">
                            ${amount ? ((percentageSplits[member.id] || 0) / 100 * parseFloat(amount)).toFixed(2) : "0.00"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Assign exact amounts to each member</span>
                    <span className={cn("font-medium", 
                      amount && Math.abs(totalCustomAmount - parseFloat(amount)) > 0.1 
                        ? "text-red-500" 
                        : "text-green-500")}>
                      Total: ${totalCustomAmount.toFixed(2)} / ${amount || "0.00"}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {currentGroup?.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>$</span>
                          <Input 
                            className="w-24 h-8"
                            value={customSplits[member.id] || ""}
                            onChange={(e) => updateCustomSplit(member.id, e.target.value)}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full">Add Expense</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
