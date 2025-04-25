
import React from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReceiptScanner from "@/components/ReceiptScanner";
import { toast } from "sonner";

const ScanReceipt = () => {
  const navigate = useNavigate();

  // Show onboarding information about receipt scanning
  React.useEffect(() => {
    const hasSeenScanIntro = localStorage.getItem('hasSeenScanIntro');
    if (!hasSeenScanIntro) {
      toast.info(
        "Receipt scanning uses OCR technology to extract expense details. For best results, ensure good lighting and a flat surface.",
        { duration: 5000 }
      );
      localStorage.setItem('hasSeenScanIntro', 'true');
    }
  }, []);

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
            
            <div className="mt-6 bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">About Receipt Scanning</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This feature uses OCR technology to extract information from your receipts automatically.
              </p>
              <ul className="text-sm list-disc list-inside text-muted-foreground space-y-1">
                <li>Take a clear photo in good lighting</li>
                <li>Make sure the receipt is flat and all text is visible</li>
                <li>Review the extracted data before saving</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default ScanReceipt;
