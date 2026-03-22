import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Smartphone, Copy, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { clearCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UPI_ID = "9187418323@axl";

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

  const handlePaymentApp = () => {

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
      <div className="grid grid-cols-3 text-center text-xs text-muted-foreground mb-6 border rounded-lg py-3">

        <div>🔒 Secure Payment</div>
        <div>🚚 Free Delivery</div>
        <div>🔄 7 Day Exchange</div>

      </div>



      {/* CHOOSE PAYMENT */}
      {paymentStep === "choose" && (

        <div className="space-y-3">

          {["Google Pay", "PhonePe", "Paytm", "Other UPI App"].map(app => (

            <button
              key={app}
              onClick={handlePaymentApp}
              className="w-full bg-white border rounded-lg p-4 flex items-center gap-4 min-h-[56px]"
            >

              <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center">
                <span className="text-sm font-bold text-maroon">
                  {app[0]}
                </span>
              </div>

              <span className="font-medium">
                {app}
              </span>

              <Smartphone size={18} className="ml-auto text-muted-foreground"/>

            </button>

          ))}



          {/* MANUAL UPI */}
          <div className="bg-cream rounded-lg p-4 mt-6 border border-gold/10">

            <p className="text-sm font-semibold mb-2">
              Or pay using UPI ID
            </p>

            <div className="flex items-center gap-2 bg-white rounded-md p-3 border border-gold/20">

              <span className="font-mono text-sm flex-1">
                {UPI_ID}
              </span>

              <button
                onClick={handleCopyUPI}
                className="text-teal p-1"
              >
                {copied ? <Check size={16}/> : <Copy size={16}/>}
              </button>

            </div>


            <p className="text-xs text-muted-foreground mt-2">
              Open any UPI app → send ₹{total.toLocaleString("en-IN")} → then submit payment proof
            </p>


            <Button
              onClick={() => setPaymentStep("proof")}
              className="w-full mt-3 bg-maroon text-cream-DEFAULT"
            >
              I've Already Paid
            </Button>

          </div>

        </div>

      )}



      {/* CONFIRM PAYMENT */}
      {paymentStep === "confirm" && (

        <div className="text-center space-y-4">

          <p className="text-lg font-semibold">
            Did you complete the payment?
          </p>

          <div className="flex gap-3">

            <Button
              onClick={() => setPaymentStep("proof")}
              className="flex-1 bg-green-600 text-white"
            >
              Yes, I Paid
            </Button>

            <Button
              onClick={handlePayLater}
              variant="outline"
              className="flex-1"
            >
              Pay Later
            </Button>

          </div>

        </div>

      )}



      {/* PAYMENT PROOF */}
      {paymentStep === "proof" && (

        <div className="space-y-4">

          <div className="bg-white rounded-lg p-5 border border-gold/10">

            <h3 className="font-heading text-base font-semibold mb-4">
              Submit Payment Proof
            </h3>

            <div>

              <Label>UTR / Transaction ID *</Label>

              <Input
                value={utrId}
                onChange={(e) => setUtrId(e.target.value)}
                className="mt-1"
                placeholder="Enter UTR or transaction reference"
              />

            </div>

          </div>


          <Button
            onClick={handleSubmitProof}
            className="w-full bg-maroon text-gold font-semibold py-5"
            size="lg"
            disabled={submitting}
          >

            {submitting ? "Submitting..." : "Submit Payment Proof"}

          </Button>


          <button
            onClick={handlePayLater}
            className="w-full text-sm text-muted-foreground text-center py-2"
          >
            Pay Later via WhatsApp
          </button>

        </div>

      )}

    </div>

  );

}