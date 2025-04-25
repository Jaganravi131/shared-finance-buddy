
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Camera, UploadCloud, File, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Simulated OCR API response
interface OCRResult {
  merchant: string;
  date: string;
  total: string;
  items?: Array<{
    name: string;
    price: number;
  }>;
}

const ReceiptScanner: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<OCRResult | null>(null);
  
  const navigate = useNavigate();
  const { addExpense, currentGroup } = useExpenseContext();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setScanResult(null); // Reset scan results when a new file is selected
    }
  };
  
  // Simulate OCR scanning functionality
  const scanReceipt = async () => {
    if (!image) {
      toast.error("Please select an image to scan");
      return;
    }
    
    setLoading(true);
    
    try {
      // This is a placeholder for real OCR API integration
      // In a real app, you would:
      // 1. Upload the image to your server or directly to OCR service
      // 2. Call an OCR API (Google Vision, etc.)
      // 3. Process the response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate OCR results
      const simulatedResult: OCRResult = {
        merchant: "Local Grocery Store",
        date: new Date().toISOString().split('T')[0],
        total: (Math.random() * 100 + 10).toFixed(2),
        items: [
          { name: "Milk", price: 3.99 },
          { name: "Bread", price: 2.49 },
          { name: "Eggs", price: 4.29 }
        ]
      };
      
      setScanResult(simulatedResult);
      toast.success("Receipt scanned successfully");
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Failed to scan receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const createExpenseFromReceipt = () => {
    if (!scanResult) return;
    
    // Create a new expense from the scan result
    const expense = {
      title: `Receipt from ${scanResult.merchant}`,
      amount: parseFloat(scanResult.total),
      date: new Date(),
      paidBy: "", // Will be set to current user's ID
      category: "Food", // Default category, can be changed in the expense form
      groupId: currentGroup?.id || "",
      splits: [] // Will be populated in the expense form
    };
    
    // Navigate to expense form with prefilled data
    navigate("/add-expense", { 
      state: { 
        prefillData: expense,
        receiptImage: preview
      } 
    });
  };
  
  const takePhoto = () => {
    // Placeholder for camera functionality
    toast.info("📸 Camera access would be requested here");
    
    // In a real app, you would:
    // 1. Request camera access
    // 2. Open a camera interface
    // 3. Capture and process the image
    
    // For now, we'll just simulate it with the file input
    document.getElementById("receipt-upload")?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Scanner</CardTitle>
        <CardDescription>
          Scan receipts to automatically create expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            {preview ? (
              <div className="relative w-full">
                <img 
                  src={preview} 
                  alt="Receipt preview" 
                  className="mx-auto max-h-64 object-contain rounded-md"
                />
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setScanResult(null);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground mb-4">
                  <Label htmlFor="receipt-upload">Upload a receipt image</Label> or take a photo
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" onClick={() => document.getElementById("receipt-upload")?.click()}>
                    <File className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <Button variant="outline" onClick={takePhoto}>
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          
          {image && !scanResult && (
            <Button 
              className="w-full" 
              onClick={scanReceipt} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Scan Receipt"
              )}
            </Button>
          )}
          
          {scanResult && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">Scan Results:</h3>
                <p><span className="text-muted-foreground">Merchant:</span> {scanResult.merchant}</p>
                <p><span className="text-muted-foreground">Date:</span> {scanResult.date}</p>
                <p><span className="text-muted-foreground">Total:</span> ${scanResult.total}</p>
                
                {scanResult.items && (
                  <div className="mt-2">
                    <p className="font-semibold text-sm">Items:</p>
                    <ul className="text-sm">
                      {scanResult.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Button className="w-full" onClick={createExpenseFromReceipt}>
                Create Expense from Receipt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptScanner;
