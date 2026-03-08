import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Smartphone, Copy, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { clearCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UPI_ID = "babysilk@upi";

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

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=BabySilk&am=${total}&tn=${orderId}`;

  const handlePaymentApp = (app: string) => {
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = upiLink;
    }
    setPaymentStep("confirm");
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = async () => {
    if (!utrId.trim()) {
      toast({ title: "Please enter UTR / Transaction ID", variant: "destructive" });
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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayLater = async () => {
    clearCart();
    navigate(`/order-success?orderId=${orderId}&payLater=true`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8" data-testid="page-payment">
      <h1 className="font-heading text-2xl font-bold text-maroon text-center mb-2" data-testid="text-payment-title">
        Complete Your Payment
      </h1>
      <div className="text-center mb-8">
        <span className="text-3xl font-bold text-maroon" data-testid="text-payment-amount">Rs.{total.toLocaleString("en-IN")}</span>
        <p className="text-xs text-muted-foreground mt-1">Order ID: {orderId}</p>
      </div>

      {paymentStep === "choose" && (
        <div className="space-y-3" data-testid="payment-methods">
          {[
            { name: "Google Pay", color: "bg-white border", icon: "G" },
            { name: "PhonePe", color: "bg-purple-50 border-purple-200 border", icon: "P" },
            { name: "Paytm", color: "bg-blue-50 border-blue-200 border", icon: "T" },
            { name: "Other UPI App", color: "bg-gray-50 border", icon: "U" },
          ].map(app => (
            <button
              key={app.name}
              onClick={() => handlePaymentApp(app.name)}
              className={`w-full ${app.color} rounded-lg p-4 flex items-center gap-4 min-h-[56px] transition-colors`}
              data-testid={`button-pay-${app.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-maroon">{app.icon}</span>
              </div>
              <span className="font-medium text-foreground">{app.name}</span>
              <Smartphone size={18} className="ml-auto text-muted-foreground" />
            </button>
          ))}

          <div className="bg-cream rounded-lg p-4 mt-6 border border-gold/10" data-testid="upi-manual-section">
            <p className="text-sm font-semibold mb-2">Or pay using UPI ID:</p>
            <div className="flex items-center gap-2 bg-white rounded-md p-3 border border-gold/20">
              <span className="font-mono text-sm flex-1">{UPI_ID}</span>
              <button
                onClick={handleCopyUPI}
                className="text-teal p-1"
                data-testid="button-copy-upi"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Open any UPI app, enter UPI ID, pay Rs.{total.toLocaleString("en-IN")}, then come back and submit payment proof.
            </p>
            <Button
              onClick={() => setPaymentStep("proof")}
              className="w-full mt-3 bg-maroon text-cream-DEFAULT"
              data-testid="button-already-paid"
            >
              I've Already Paid
            </Button>
          </div>
        </div>
      )}

      {paymentStep === "confirm" && (
        <div className="text-center space-y-4" data-testid="payment-confirm">
          <p className="text-lg font-semibold">Did you complete the payment?</p>
          <div className="flex gap-3">
            <Button
              onClick={() => setPaymentStep("proof")}
              className="flex-1 bg-green-600 text-white font-semibold"
              data-testid="button-yes-paid"
            >
              Yes, I Paid
            </Button>
            <Button
              onClick={handlePayLater}
              variant="outline"
              className="flex-1"
              data-testid="button-pay-later"
            >
              Pay Later
            </Button>
          </div>
        </div>
      )}

      {paymentStep === "proof" && (
        <div className="space-y-4" data-testid="payment-proof">
          <div className="bg-white rounded-lg p-5 border border-gold/10">
            <h3 className="font-heading text-base font-semibold mb-4">Submit Payment Proof</h3>
            <div>
              <Label htmlFor="utr" className="text-sm">UTR / Transaction ID *</Label>
              <Input
                id="utr"
                value={utrId}
                onChange={(e) => setUtrId(e.target.value)}
                className="mt-1 text-base"
                placeholder="Enter UTR or transaction reference"
                data-testid="input-utr"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmitProof}
            className="w-full bg-maroon text-gold font-semibold py-5"
            size="lg"
            disabled={submitting}
            data-testid="button-submit-proof"
          >
            {submitting ? "Submitting..." : "Submit Payment Proof"}
          </Button>

          <button
            onClick={handlePayLater}
            className="w-full text-sm text-muted-foreground text-center py-2"
            data-testid="button-pay-later-link"
          >
            Pay Later via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
