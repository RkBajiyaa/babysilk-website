import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Clock, Package, Truck, Home, MapPin, CircleDot } from "lucide-react";
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
  { key: "payment_verification_pending", label: "Payment Verification", icon: Clock },
  { key: "payment_received", label: "Payment Verified", icon: Check },
  { key: "processing", label: "Processing", icon: CircleDot },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Home },
];

const statusOrder = statusSteps.map(s => s.key);

export default function TrackOrder() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { orderId: "", phone: "" },
  });

  const onSubmit = async (data: { orderId: string; phone: string }) => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/orders/track?orderId=${data.orderId}&phone=${data.phone}`);
      if (res.ok) {
        const result = await res.json();
        setOrder(result);
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

  const currentIdx = order ? statusOrder.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-lg mx-auto px-4 py-8" data-testid="page-track-order">
      <h1 className="font-heading text-2xl font-bold text-maroon text-center mb-6" data-testid="text-track-title">
        Track Your Order
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-5 border border-gold/10 mb-6 space-y-4">
        <div>
          <Label htmlFor="orderId" className="text-sm">Order ID *</Label>
          <Input
            id="orderId"
            {...register("orderId", { required: "Order ID is required" })}
            className="mt-1 text-base"
            placeholder="e.g. BSK-ABC123"
            data-testid="input-track-order-id"
          />
          {errors.orderId && <p className="text-xs text-red-600 mt-1">{errors.orderId.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone", { required: "Phone is required" })}
            className="mt-1 text-base"
            placeholder="10 digit mobile number"
            data-testid="input-track-phone"
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-maroon text-cream-DEFAULT" disabled={loading} data-testid="button-track-submit">
          {loading ? "Searching..." : "Track Order"}
        </Button>
      </form>

      {notFound && (
        <div className="text-center py-8 bg-white rounded-lg border border-gold/10" data-testid="text-order-not-found">
          <p className="text-muted-foreground">No order found. Please check your Order ID and phone number.</p>
        </div>
      )}

      {order && (
        <div className="animate-fade-in" data-testid="order-tracking-result">
          <div className="bg-white rounded-lg p-5 border border-gold/10 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="font-bold text-maroon font-mono" data-testid="text-tracked-order-id">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-maroon">Rs.{order.totalAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-1">Estimated Delivery: 7-9 Business Days</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gold/10 mb-4" data-testid="tracking-timeline">
            <h3 className="font-heading text-sm font-semibold mb-4">Order Status</h3>
            <div className="space-y-0">
              {statusSteps.map((step, idx) => {
                const isComplete = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isComplete ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                      } ${isCurrent ? "ring-2 ring-green-200" : ""}`}>
                        {isComplete ? <Check size={14} /> : <Icon size={14} />}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${isComplete ? "bg-green-300" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-green-600 mt-0.5">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-lg p-5 border border-gold/10" data-testid="tracking-items">
              <h3 className="font-heading text-sm font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground/80">{item.productName} ({item.size}) x{item.quantity}</span>
                    <span className="font-medium">Rs.{(item.price * item.quantity).toLocaleString("en-IN")}</span>
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
