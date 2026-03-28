import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Smartphone, Copy, Check, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { clearCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UPI_ID = "gpay-12192151965@okbizaxis";

export default function Payment() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("orderId") || "";
  const total = parseInt(params.get("total") || "0");

  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [paymentStep, setPaymentStep] = useState<"choose" | "confirm" | "proof">("choose");
  const [utrId, setUtrId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // NEW: Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=BabySilk&am=${total}&tn=${orderId}`;

  const handlePaymentApp = () => {
    // Safety check: Don't trigger if already counting down
    if (countdown !== null) return;

    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = upiLink;
    }

    setCountdown(5);
    let timeLeft = 5;

    const timer = setInterval(() => {
      timeLeft -= 1;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        setCountdown(null);
        setPaymentStep("confirm");
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = async () => {
    if (!utrId.trim()) {
      toast({
        title: "Please enter UTR / Transaction ID",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest("PATCH", `/api/orders/${orderId}/payment`, {
        upiTransactionId: utrId,
        paymentStatus: "payment_verification_pending",
      });

      clearCart();
      navigate(`/order-success?orderId=${orderId}`);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayLater = () => {
    clearCart();
    navigate(`/order-success?orderId=${orderId}&payLater=true`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      
      <h1 className="font-heading text-2xl font-bold text-maroon text-center mb-2">
        Complete Your Payment
      </h1>

      <div className="text-center mb-6">
        <span className="text-3xl font-bold text-maroon">
          ₹{total.toLocaleString("en-IN")}
        </span>
        <p className="text-xs text-muted-foreground mt-1">
          Order ID: {orderId}
        </p>
      </div>

      {/* TRUST STRIP */}
      <div className="grid grid-cols-3 text-center text-[10px] sm:text-xs text-muted-foreground mb-6 border border-gold/20 bg-white rounded-lg py-3 shadow-sm">
        <div>🔒 Secure Payment</div>
        <div>🚚 Free Delivery</div>
        <div>🔄 7 Day Exchange</div>
      </div>

      {/* CHOOSE PAYMENT */}
      {paymentStep === "choose" && (
        <div className="space-y-3 relative">
          
          {countdown === null ? (
            <>
              {["Google Pay", "PhonePe", "Paytm", "Other UPI App"].map(app => (
                <button
                  key={app}
                  onClick={handlePaymentApp}
                  className="w-full bg-white border border-gold/20 hover:border-maroon rounded-lg p-4 flex items-center gap-4 min-h-[56px] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-maroon">
                      {app[0]}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {app}
                  </span>
                  <Smartphone size={18} className="ml-auto text-muted-foreground"/>
                </button>
              ))}

              {/* MANUAL UPI */}
              <div className="bg-cream rounded-lg p-5 mt-6 border border-gold/20 shadow-sm">
                <p className="text-sm font-bold text-maroon mb-2">
                  Or pay using UPI ID
                </p>
                <div className="flex items-center gap-2 bg-white rounded-md p-3 border border-gold/30">
                  <span className="font-mono text-sm font-semibold flex-1 text-foreground">
                    {UPI_ID}
                  </span>
                  <button
                    onClick={handleCopyUPI}
                    className="text-maroon hover:bg-maroon/10 p-2 rounded transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-600"/> : <Copy size={18}/>}
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3 font-medium">
                  Open any UPI app → send ₹{total.toLocaleString("en-IN")} → then submit payment proof
                </p>

                <Button
                  onClick={() => setPaymentStep("proof")}
                  className="w-full mt-4 bg-maroon hover:bg-maroon-dark text-gold font-bold py-5"
                >
                  I've Already Paid
                </Button>
              </div>
            </>
          ) : (
            
            /* THE NEW COUNTDOWN UI */
            <div className="text-center py-12 px-4 space-y-4 bg-white border border-gold/20 rounded-xl shadow-sm animate-in fade-in zoom-in duration-300">
              <Loader2 className="w-12 h-12 text-maroon animate-spin mx-auto mb-2" />
              <div className="text-5xl font-bold text-maroon font-mono">{countdown}</div>
              <p className="text-lg font-bold text-foreground">
                Opening your UPI app...
              </p>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                Please complete the payment there. We will ask for confirmation shortly.
              </p>
            </div>
            
          )}
        </div>
      )}

      {/* CONFIRM PAYMENT */}
      {paymentStep === "confirm" && (
        <div className="text-center space-y-5 bg-white p-6 rounded-xl border border-gold/20 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Check size={32} className="text-green-600" />
          </div>
          <p className="text-xl font-bold text-maroon">
            Did you complete the payment?
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setPaymentStep("proof")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-base"
            >
              Yes, I Paid
            </Button>
            <Button
              onClick={handlePayLater}
              variant="outline"
              className="flex-1 border-maroon text-maroon hover:bg-maroon/5 font-bold py-6 text-base"
            >
              Pay Later
            </Button>
          </div>
        </div>
      )}

      {/* PAYMENT PROOF */}
      {paymentStep === "proof" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl p-6 border border-gold/20 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-maroon mb-5">
              Submit Payment Proof
            </h3>
            <div>
              <Label className="font-semibold text-foreground">UTR / Transaction ID *</Label>
              <Input
                value={utrId}
                onChange={(e) => setUtrId(e.target.value)}
                className="mt-2 border-gold/30 focus-visible:ring-maroon"
                placeholder="e.g. 312456789012"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmitProof}
            className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold py-6 text-lg shadow-md"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin"/> Verifying...
              </span>
            ) : "Submit Payment Proof"}
          </Button>

          <button
            onClick={handlePayLater}
            className="w-full text-sm font-semibold text-muted-foreground hover:text-maroon text-center py-2 transition-colors"
          >
            Having trouble? Pay Later via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}