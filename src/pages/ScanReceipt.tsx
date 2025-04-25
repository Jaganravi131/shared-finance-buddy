
import React from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReceiptScanner from "@/components/ReceiptScanner";

const ScanReceipt = () => {
  const navigate = useNavigate();

  return (
    <ExpenseProvider>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Scan Receipt</h1>
          </header>
          
          <main className="max-w-2xl mx-auto w-full">
            <ReceiptScanner />
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default ScanReceipt;
