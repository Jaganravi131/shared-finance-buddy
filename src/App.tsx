
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddExpense from "./pages/AddExpense";
import ScanReceipt from "./pages/ScanReceipt";
import Profile from "./pages/Profile";
import { ExpenseProvider } from "@/context/ExpenseContext";
import ExpenseNotification from "@/components/ExpenseNotification";
import PaymentReminder from "@/components/PaymentReminder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <ExpenseProvider>
        <ExpenseNotification />
        <PaymentReminder />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/scan-receipt" element={<ScanReceipt />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ExpenseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
