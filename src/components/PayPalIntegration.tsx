
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

const PayPalIntegration: React.FC<PayPalIntegrationProps> = ({ 
  amount, 
  toUserId, 
  onSuccess, 
  onCancel 
}) => {
  const { users, settleUp, currentUser } = useExpenseContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get recipient user data
  const recipient = users.find(u => u.id === toUserId);

  // Initialize PayPal Smart Buttons (would use actual PayPal SDK in production)
  React.useEffect(() => {
    // This is where you would load the PayPal SDK script:
    // <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
    
    // For now we're just simulating this integration
    const initializePayPal = async () => {
      try {
        // Simulate script loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitialized(true);
      } catch (error) {
        console.error("PayPal initialization error:", error);
        toast.error("Failed to initialize payment system");
      }
    };
    
    initializePayPal();
    
    // In a real implementation, you would clean up on unmount
    return () => {
      // Cleanup PayPal integration if needed
    };
  }, []);

  // Process payment through PayPal
  const handlePayment = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would create a PayPal order:
      /*
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          recipient: recipient?.email,
          description: `Settlement payment to ${recipient?.name}`
        })
      });
      const order = await response.json();
      */
      
      // Simulate payment processing
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
      
      <div className="text-xs text-center text-muted-foreground">
        By proceeding, you agree to PayPal's terms and conditions.
      </div>
    </div>
  );
};

export default PayPalIntegration;
