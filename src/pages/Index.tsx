
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import ExpenseForm from "@/components/ExpenseForm";
import Balances from "@/components/Balances";
import { ExpenseProvider } from "@/context/ExpenseContext";
import GroupSelector from "@/components/GroupSelector";
import { Users } from "lucide-react";
import GroupMemberList from "@/components/GroupMemberList";

const Index = () => {
  return (
    <ExpenseProvider>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-expense-purple-light to-expense-purple-dark bg-clip-text text-transparent">
                ExpenseEase
              </h1>
              <p className="text-muted-foreground">Track, split, and settle up with ease</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <GroupSelector />
            </div>
          </header>
          
          <main>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="expenses">Add Expense</TabsTrigger>
                <TabsTrigger value="balances">Balances</TabsTrigger>
                <TabsTrigger value="group">Group</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="animate-fade-in">
                <Dashboard />
              </TabsContent>
              
              <TabsContent value="expenses" className="animate-fade-in">
                <div className="max-w-2xl mx-auto">
                  <ExpenseForm />
                </div>
              </TabsContent>
              
              <TabsContent value="balances" className="animate-fade-in">
                <div className="max-w-2xl mx-auto">
                  <Balances />
                </div>
              </TabsContent>
              
              <TabsContent value="group" className="animate-fade-in">
                <div className="max-w-2xl mx-auto">
                  <GroupMemberList />
                </div>
              </TabsContent>
            </Tabs>
          </main>
          
          <footer className="mt-auto pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              ExpenseEase - Simplify shared expense tracking
            </p>
          </footer>
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default Index;
