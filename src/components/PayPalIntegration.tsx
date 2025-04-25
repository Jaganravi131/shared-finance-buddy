
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenseContext } from "@/context/ExpenseContext";
import { toast } from "sonner";

interface PayPalIntegrationProps {
  amount: number;
  toUserId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// PayPal Configuration
const PAYPAL_CLIENT_ID = "AdKtZ7oLKH-B-Thovri71pBpdfJqxKNwTwBkZeEB2SGON4gAlk5fjelUpDilge5QUgouVzl4revhrbyk";

const PayPalIntegration: React.FC<PayPalIntegrationProps> = ({ 
  amount, 
  toUserId, 
  onSuccess, 
  onCancel 
}) => {
  const { users, settleUp, currentUser, currentGroup } = useExpenseContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get recipient user data
  const recipient = users.find(u => u.id === toUserId);

  // Initialize PayPal Smart Buttons
  React.useEffect(() => {
    // Load the PayPal SDK script
    const loadPayPalScript = async () => {
      try {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        
        script.onload = () => {
          console.log("PayPal SDK loaded successfully");
          setIsInitialized(true);
        };
        
        script.onerror = () => {
          console.error("Failed to load PayPal SDK");
          toast.error("Failed to initialize payment system");
        };
        
        document.body.appendChild(script);
        
        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error("PayPal initialization error:", error);
        toast.error("Failed to initialize payment system");
      }
    };
    
    loadPayPalScript();
  }, []);

  // Process payment through PayPal
  const handlePayment = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // In a production environment, you would use the PayPal SDK:
      /*
      //@ts-ignore
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
                currency_code: "USD"
              },
              description: `Payment to ${recipient?.name}`
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(() => {
            settleUp(currentUser.id, toUserId, amount);
            toast.success(`Payment of $${amount.toFixed(2)} to ${recipient?.name} completed successfully`);
            onSuccess();
          });
        },
        onError: (err) => {
          console.error("Payment error:", err);
          toast.error("Payment failed. Please try again.");
          setIsLoading(false);
        }
      }).render("#paypal-button-container");
      */
      
      // Simulate payment processing for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record the settlement in our app
      settleUp(currentUser.id, toUserId, amount);
      
      toast.success(`Payment of $${amount.toFixed(2)} to ${recipient?.name} completed successfully`);
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-pulse text-center">
          <p>Initializing payment system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Payment Details</h3>
        <p className="text-sm mb-2">
          You are sending <span className="font-bold">${amount.toFixed(2)}</span> to {recipient?.name}
        </p>
        <div className="text-xs text-muted-foreground">
          <p>This transaction is secured by PayPal. ExpenseEase does not store your payment details.</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="note">Add a note (optional)</Label>
        <Input 
          id="note" 
          placeholder="e.g. Settling apartment expenses for June" 
        />
      </div>
      
      <div id="paypal-button-container" className="mt-4">
        {/* PayPal buttons will render here in production */}
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? "Processing..." : "Pay with PayPal"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-center text-muted-foreground">
        By proceeding, you agree to PayPal's terms and conditions.
      </div>
    </div>
  );
};

export default PayPalIntegration;
