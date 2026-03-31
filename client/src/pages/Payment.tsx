import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Smartphone, Copy, Check, Loader2, Upload, ShieldCheck, Truck, RefreshCw, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { clearCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_CONFIG } from "@/config/siteConfig"; 

// Helper function to convert the image file into text (Base64) for the database
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Payment() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("orderId") || "";
  const total = parseInt(params.get("total") || "0");
  const phone = params.get("phone") || ""; 

  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [paymentStep, setPaymentStep] = useState<"choose" | "confirm" | "proof">("choose");
  const [utrId, setUtrId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const upiLink = `upi://pay?pa=${SITE_CONFIG.UPI_ID}&pn=BabySilk&am=${total}&tn=${orderId}`;

  const handlePaymentApp = () => {
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
    navigator.clipboard.writeText(SITE_CONFIG.UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = async () => {
    setSubmitting(true);

    try {
      let base64Image = null;
      
      if (screenshot) {
        base64Image = await fileToBase64(screenshot);
      }

      await apiRequest("PATCH", `/api/orders/${orderId}/payment`, {
        upiTransactionId: utrId,
        paymentScreenshot: base64Image,
        paymentStatus: "payment_submitted", 
      });

      // SAVE ORDER to localStorage for the Track Order page!
      localStorage.setItem("last_order", JSON.stringify({
        orderId,
        phone
      }));

      clearCart();
      navigate(`/order-success?orderId=${orderId}`);

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit payment details.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayLater = () => {
    localStorage.setItem("last_order", JSON.stringify({
        orderId,
        phone
    }));
    
    clearCart();
    navigate(`/order-success?orderId=${orderId}&payLater=true`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-maroon mb-2 flex items-center justify-center gap-2">
          Complete Payment <ShieldCheck size={24} className="text-green-600" />
        </h1>
        <div className="bg-white inline-block px-6 py-4 rounded-2xl border-2 border-gold/20 shadow-sm mt-2">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
          <span className="text-4xl font-bold text-maroon leading-none">
            ₹{total.toLocaleString("en-IN")}
          </span>
          <p className="text-xs font-bold text-muted-foreground mt-2 bg-cream py-1 rounded border border-gold/10">
            Order ID: <span className="text-foreground">{orderId}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs font-bold text-maroon-dark bg-cream border-2 border-gold/30 shadow-sm rounded-xl p-3 mb-8">
        <div className="flex flex-col items-center gap-1"><ShieldCheck size={18} className="text-maroon"/> Secure UPI</div>
        <div className="flex flex-col items-center gap-1 border-x-2 border-gold/20"><Truck size={18} className="text-maroon"/> Free Delivery</div>
        <div className="flex flex-col items-center gap-1"><RefreshCw size={18} className="text-maroon"/> 7 Day Return</div>
      </div>

      {/* STEP 1: CHOOSE PAYMENT METHOD */}
      {paymentStep === "choose" && (
        <div className="space-y-4 relative">
          
          {countdown === null ? (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="space-y-3">
                {["Google Pay", "PhonePe", "Paytm", "Other UPI App"].map(app => (
                  <button
                    key={app}
                    onClick={handlePaymentApp}
                    className="w-full bg-white border-2 border-gold/20 hover:border-maroon rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-cream border border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold text-maroon">
                        {app[0]}
                      </span>
                    </div>
                    <span className="font-bold text-lg text-foreground">
                      {app}
                    </span>
                    <Smartphone size={20} className="ml-auto text-muted-foreground group-hover:text-maroon transition-colors"/>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 mt-6 border-2 border-gold/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-maroon/20"></div>
                <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-maroon"/> Or pay directly to UPI ID:
                </p>
                
                <div className="flex items-center gap-2 bg-cream/50 rounded-lg p-3 border border-gold/30">
                  <span className="font-mono text-base font-bold flex-1 text-maroon tracking-wide">
                    {SITE_CONFIG.UPI_ID}
                  </span>
                  <button
                    onClick={handleCopyUPI}
                    className="bg-white border border-gold/30 text-maroon hover:bg-maroon hover:text-white p-2.5 rounded-md transition-colors shadow-sm"
                    aria-label="Copy UPI ID"
                  >
                    {copied ? <Check size={20} className="text-green-600"/> : <Copy size={20}/>}
                  </button>
                </div>
                
                <p className="text-xs font-semibold text-muted-foreground mt-4 text-center">
                  Open any app → send ₹{total.toLocaleString("en-IN")} → submit proof
                </p>

                <Button
                  onClick={() => setPaymentStep("proof")}
                  className="w-full mt-5 bg-maroon hover:bg-maroon-dark text-gold font-bold py-6 text-base shadow-md transition-transform hover:scale-[1.02]"
                >
                  I've Already Paid
                </Button>
              </div>
            </div>
          ) : (
            /* COUNTDOWN STATE */
            <div className="text-center py-16 px-4 space-y-6 bg-white border-2 border-gold/20 rounded-2xl shadow-lg animate-in zoom-in-95 fade-in duration-300">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-cream rounded-full"></div>
                <div className="absolute inset-0 border-4 border-maroon rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-maroon font-mono">
                  {countdown}
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground mb-2">
                  Opening UPI App...
                </p>
                <p className="text-sm font-medium text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                  Please complete the payment securely in your app. Do not press back.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CONFIRMATION PROMPT */}
      {paymentStep === "confirm" && (
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl border-2 border-gold/20 shadow-lg animate-in slide-in-from-bottom-8 fade-in duration-400">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
            <Check size={40} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-maroon mb-2">
              Payment Complete?
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              Did your transaction of ₹{total.toLocaleString("en-IN")} go through successfully?
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => setPaymentStep("proof")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-md transition-transform hover:scale-[1.02]"
            >
              Yes, I Paid
            </Button>
            <Button
              onClick={handlePayLater}
              variant="outline"
              className="w-full border-2 border-maroon text-maroon hover:bg-cream font-bold py-6 text-base"
            >
              No, Pay Later
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SCREENSHOT & UTR UPLOAD */}
      {paymentStep === "proof" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-400">
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gold/20 shadow-lg space-y-6">
            <h3 className="font-heading text-xl font-bold text-maroon pb-4 border-b border-cream">
              Submit Payment Proof
            </h3>
            
            <div className="space-y-2">
              <Label className="font-bold text-foreground flex items-center gap-2">
                <Upload size={18} className="text-maroon"/> Upload Screenshot
              </Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  className="cursor-pointer file:bg-maroon file:text-gold file:font-bold file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-maroon-dark bg-cream/30 border-gold/30 h-14 pt-2.5"
                />
                {screenshot && (
                  <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                    <Check size={14} /> Image selected
                  </p>
                )}
              </div>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-2 border-cream"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold text-muted-foreground bg-white px-2 rounded-full border border-cream uppercase tracking-widest">AND / OR</span>
              <div className="flex-grow border-t-2 border-cream"></div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-foreground">UTR / Transaction ID</Label>
              <Input
                value={utrId}
                onChange={(e) => setUtrId(e.target.value)}
                className="border-gold/30 focus-visible:ring-maroon bg-cream/30 h-12 text-base font-mono"
                placeholder="e.g. 312456789012"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmitProof}
            className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold py-7 text-lg shadow-xl transition-all hover:scale-[1.02]"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin text-gold"/> Submitting Verification...
              </span>
            ) : "Submit Payment Proof"}
          </Button>

          <button
            onClick={handlePayLater}
            className="w-full text-sm font-bold text-muted-foreground hover:text-maroon text-center py-2 transition-colors underline underline-offset-4"
          >
            Having trouble? Skip and pay via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}