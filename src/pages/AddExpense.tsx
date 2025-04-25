
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExpenseForm from "@/components/ExpenseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExpenseProvider } from "@/context/ExpenseContext";

const AddExpense = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillData = location.state?.prefillData;
  const receiptImage = location.state?.receiptImage;

  return (
    <ExpenseProvider>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Add New Expense</h1>
          </header>
          
          <main className="max-w-2xl mx-auto w-full">
            {receiptImage && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Scanned Receipt</h2>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={receiptImage} 
                    alt="Scanned receipt" 
                    className="w-full max-h-48 object-contain"
                  />
                </div>
              </div>
            )}
            
            <ExpenseForm initialData={prefillData} />
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default AddExpense;
