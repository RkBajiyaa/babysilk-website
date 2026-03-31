import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Check, Clock, Package, Truck, Home, MapPin, CircleDot, AlertCircle, Upload, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderData {
  orderId: string;
  customerName: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  city: string;
  state: string;
  items: { productName: string; size: string; quantity: number; price: number }[];
}

const statusSteps = [
  { key: "order_placed", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: CircleDot },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Home },
];

const statusOrder = statusSteps.map(s => s.key);

// Helper function to convert the image file into text (Base64)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function TrackOrder() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  // "I Have Paid" Form State
  const [showProofForm, setShowProofForm] = useState(false);
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submittingProof, setSubmittingProof] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { orderId: "", phone: "" },
  });

  // 🔥 AUTO-LOAD LAST ORDER FROM LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("last_order");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setValue("orderId", data.orderId);
        setValue("phone", data.phone);
        // Automatically fetch the order
        onSubmit(data);
      } catch (e) {
        console.error("Failed to parse local order", e);
      }
    }
  }, []);

  const onSubmit = async (data: { orderId: string; phone: string }) => {
    setLoading(true);
    setNotFound(false);
    setShowProofForm(false); // Reset proof form on new search
    try {
      const res = await fetch(`/api/orders/track?orderId=${data.orderId}&phone=${data.phone}`);
      if (res.ok) {
        const result = await res.json();
        setOrder(result);
        // Update local storage so it remembers the last successful track
        localStorage.setItem("last_order", JSON.stringify(data));
      } else {
        setNotFound(true);
        setOrder(null);
      }
    } catch {
      toast({ title: "Error tracking order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBMIT PAYMENT PROOF
  const submitProof = async () => {
    if (!order) return;
    setSubmittingProof(true);

    try {
      let base64Image = null;
      if (screenshot) {
        base64Image = await fileToBase64(screenshot);
      }

      await apiRequest("PATCH", `/api/orders/${order.orderId}/payment`, {
        upiTransactionId: utr,
        paymentScreenshot: base64Image,
        paymentStatus: "payment_submitted",
      });

      toast({ title: "Payment proof submitted successfully!" });
      
      // Instantly update UI state without fully refreshing
      setOrder({ ...order, paymentStatus: "payment_submitted" });
      setShowProofForm(false);

    } catch (error: any) {
      toast({
        title: "Error submitting proof",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmittingProof(false);
    }
  };

  const currentIdx = order ? statusOrder.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-lg mx-auto px-4 py-8" data-testid="page-track-order">
      <h1 className="font-heading text-2xl font-bold text-maroon text-center mb-6" data-testid="text-track-title">
        Track Your Order
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 border border-gold/20 shadow-sm mb-6 space-y-4">
        <div>
          <Label htmlFor="orderId" className="text-sm font-semibold">Order ID *</Label>
          <Input
            id="orderId"
            {...register("orderId", { required: "Order ID is required" })}
            className="mt-1 text-base border-gold/30 focus-visible:ring-maroon"
            placeholder="e.g. BSK-ABC123"
          />
          {errors.orderId && <p className="text-xs text-red-600 mt-1">{errors.orderId.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-semibold">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone", { required: "Phone is required" })}
            className="mt-1 text-base border-gold/30 focus-visible:ring-maroon"
            placeholder="10 digit mobile number"
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold py-6 text-base shadow-md" disabled={loading}>
          {loading ? <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin"/> Searching...</span> : "Track Order"}
        </Button>
      </form>

      {notFound && (
        <div className="text-center py-8 bg-white rounded-xl border border-red-200 bg-red-50 text-red-800">
          <p className="font-semibold">No order found.</p>
          <p className="text-sm mt-1">Please check your Order ID and phone number.</p>
        </div>
      )}

      {order && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 🔥 DYNAMIC PAYMENT STATUS ALERTS 🔥 */}
          
          {/* STATE 1: PENDING PAYMENT */}
          {order.paymentStatus === "pending_payment" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-red-700 font-bold text-lg">
                <AlertCircle size={22} />
                Payment Pending
              </div>
              <p className="text-sm text-red-800/80 font-medium mb-5">
                Your order is reserved, but we are waiting for payment. Please complete your payment to confirm the order.
              </p>
              
              {!showProofForm ? (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate(`/payment?orderId=${order.orderId}&total=${order.totalAmount}&phone=${order.phone}`)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                  >
                    Pay Now
                  </Button>
                  <Button 
                    onClick={() => setShowProofForm(true)}
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-100 font-bold"
                  >
                    I Have Paid
                  </Button>
                </div>
              ) : (
                /* I HAVE PAID UPLOAD FORM */
                <div className="bg-white rounded-lg p-4 border border-red-100 mt-2 space-y-4 animate-in fade-in zoom-in-95">
                  <h4 className="font-bold text-maroon text-sm border-b border-red-100 pb-2">Submit Payment Proof</h4>
                  
                  <div>
                    <Label className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-foreground">
                      <Upload size={14} className="text-maroon"/> Upload Screenshot
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      className="cursor-pointer text-xs file:bg-maroon file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-maroon-dark"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-foreground">UTR / Transaction ID</Label>
                    <Input
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="mt-1 h-9 text-sm"
                      placeholder="e.g. 312456789012"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={submitProof} 
                      disabled={submittingProof}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-9"
                    >
                      {submittingProof ? "Submitting..." : "Submit Proof"}
                    </Button>
                    <Button 
                      onClick={() => setShowProofForm(false)} 
                      variant="ghost" 
                      className="text-muted-foreground h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: PAYMENT SUBMITTED (UNDER REVIEW) */}
          {order.paymentStatus === "payment_submitted" && (
            <div className="bg-[#fff8e6] border-2 border-gold/40 rounded-xl p-5 mb-6 shadow-sm flex items-start gap-3">
              <Clock size={24} className="text-gold-dark shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-maroon-dark text-lg mb-1">Payment Under Review ⏳</p>
                <p className="text-sm font-medium text-maroon-dark/80 leading-relaxed">
                  We have received your payment proof! Our team is verifying it now. Your order status will update shortly.
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: PAYMENT CONFIRMED */}
          {(order.paymentStatus === "paid" || order.paymentStatus === "payment_received") && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 shadow-sm flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Check size={20} />
              </div>
              <p className="font-bold text-green-800">Payment Confirmed ✅</p>
            </div>
          )}


          {/* ORDER DETAILS CARD */}
          <div className="bg-white rounded-xl p-6 border border-gold/20 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order Reference</p>
                <p className="font-bold text-maroon font-mono text-xl">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total</p>
                <p className="font-bold text-maroon text-xl">₹{order.totalAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="bg-cream py-2 px-3 rounded text-sm font-medium text-maroon inline-block border border-gold/10">
              Estimated Delivery: 7-9 Business Days
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-xl p-6 border border-gold/20 mb-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-maroon mb-6">Order Status</h3>
            <div className="space-y-0">
              {statusSteps.map((step, idx) => {
                // If payment is still pending or under review, don't show timeline progression past 'Order Placed'
                const isBlockedByPayment = (order.paymentStatus === "pending_payment" || order.paymentStatus === "payment_submitted") && idx > 0;
                
                const isComplete = !isBlockedByPayment && idx <= currentIdx;
                const isCurrent = !isBlockedByPayment && idx === currentIdx;
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className={`flex gap-4 ${isBlockedByPayment ? "opacity-40 grayscale" : ""}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isComplete ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-green-100" : ""}`}>
                        {isComplete ? <Check size={18} /> : <Icon size={18} />}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div className={`w-1 h-12 my-1 rounded-full ${isComplete ? "bg-green-400" : "bg-gray-100"}`} />
                      )}
                    </div>
                    <div className="pt-2 pb-8">
                      <p className={`text-base font-bold ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm font-bold text-green-600 mt-1">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ITEMS */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gold/20 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-maroon mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-3 bg-cream/50 rounded-lg border border-gold/10">
                    <div>
                      <p className="font-bold text-foreground">{item.productName}</p>
                      <p className="text-muted-foreground mt-0.5">Size: {item.size} <span className="mx-2">•</span> Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-maroon text-base">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}