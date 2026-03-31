import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "@/lib/cart";
import { checkoutFormSchema, type CheckoutFormData, INDIAN_STATES } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Checkout() {
  const { items, totalItems, pricing } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center flex flex-col items-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-maroon/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag size={48} className="text-maroon/40" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-maroon mb-4">
          No items in cart
        </h1>
        <p className="text-muted-foreground mb-8">Add some items before checking out.</p>
        <Link href="/shop">
          <a className="inline-block bg-maroon text-gold hover:bg-maroon-dark hover:scale-105 transition-all font-bold px-8 py-3 rounded-full shadow-md">
            Continue Shopping
          </a>
        </Link>
      </div>
    );
  }

  // THE FIXED ONSUBMIT FUNCTION
  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);

    try {
      const orderData = {
        ...data,
        items: items.map(i => ({
          productId: i.productId,
          productName: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.discountPrice,
        })),
        totalAmount: pricing.total,
      };

      const res = await apiRequest("POST", "/api/orders", orderData);
      
      if (!res.ok) {
        throw new Error("Failed to create order on the server.");
      }

      const order = await res.json();

      // Save order info instantly so Track Order works even if they drop off
      localStorage.setItem("last_order", JSON.stringify({
        orderId: order.orderId,
        phone: data.phone
      }));

      // Navigate to payment with all necessary context
      navigate(`/payment?orderId=${order.orderId}&total=${pricing.total}&phone=${data.phone}`);

    } catch (error: any) {
      toast({
        title: "Error Creating Order",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <Link href="/cart">
        <a className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground mb-6 cursor-pointer hover:text-maroon transition-colors bg-white px-3 py-1.5 rounded-full border border-gold/20 shadow-sm">
          <ChevronLeft size={16}/> Back to Cart
        </a>
      </Link>

      <h1 className="font-heading text-3xl font-bold text-maroon mb-8 flex items-center gap-3">
        Checkout <ShieldCheck className="text-green-600" size={28} />
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-gold/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-maroon/20"></div>
              
              <h2 className="font-heading text-xl font-bold text-maroon mb-6 pb-4 border-b border-cream">
                1. Delivery Details
              </h2>
              
              <div className="space-y-5">
                <div>
                  <Label htmlFor="customerName" className="font-bold text-foreground">Full Name *</Label>
                  <Input id="customerName" {...form.register("customerName")} className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30" placeholder="e.g. Priya Sharma" />
                  {form.formState.errors.customerName && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                      {form.formState.errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone" className="font-bold text-foreground">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      {...form.register("phone")}
                      placeholder="10 digit mobile number"
                      className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-bold text-foreground">Email <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="For order updates"
                      className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine1" className="font-bold text-foreground">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    {...form.register("addressLine1")}
                    placeholder="House/Flat No, Building, Street"
                    className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30"
                  />
                  {form.formState.errors.addressLine1 && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                      {form.formState.errors.addressLine1.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="addressLine2" className="font-bold text-foreground">Address Line 2 <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                  <Input
                    id="addressLine2"
                    {...form.register("addressLine2")}
                    placeholder="Area, Sector, Landmark"
                    className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city" className="font-bold text-foreground">City *</Label>
                    <Input id="city" {...form.register("city")} className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30" />
                    {form.formState.errors.city && (
                      <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode" className="font-bold text-foreground">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="tel"
                      inputMode="numeric"
                      maxLength={6}
                      {...form.register("pincode")}
                      className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30"
                    />
                    {form.formState.errors.pincode && (
                      <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                        {form.formState.errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="font-bold text-foreground">State *</Label>
                  <Select
                    onValueChange={(v) => form.setValue("state", v)}
                    defaultValue=""
                  >
                    <SelectTrigger className="mt-1.5 focus-visible:ring-maroon bg-cream/30 border-gold/30">
                      <SelectValue placeholder="Select your state"/>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {INDIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.state && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-1.5 rounded">
                      Please select a state.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* TRUST STRIP */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm font-bold text-maroon-dark bg-cream border-2 border-gold/30 shadow-sm rounded-xl p-4">
              <div className="flex flex-col items-center gap-1"><Truck size={20} className="text-maroon"/> Free Delivery</div>
              <div className="flex flex-col items-center gap-1 border-x-2 border-gold/20"><RefreshCw size={20} className="text-maroon"/> 7 Day Exchange</div>
              <div className="flex flex-col items-center gap-1"><ShieldCheck size={20} className="text-maroon"/> Secure UPI</div>
            </div>

            {/* ACTION AREA */}
            <div className="bg-white p-6 rounded-xl border-2 border-maroon/10 shadow-lg text-center">
              <p className="text-sm font-bold text-muted-foreground mb-4 bg-cream inline-block px-4 py-1.5 rounded-full border border-gold/20">
                📦 Delivery usually takes 7-9 working days
              </p>
              
              <Button
                type="submit"
                className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold py-7 rounded-xl text-lg shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02]"
                disabled={submitting}
              >
                {submitting ? "Securing Your Order..." : "Proceed to Payment"}
                {!submitting && <ChevronRight size={22} className="ml-2"/>}
              </Button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gold/30 sticky top-24 shadow-lg">
            <h3 className="font-heading text-xl font-bold text-maroon mb-6 pb-4 border-b-2 border-cream">
              Order Summary ({totalItems} Items)
            </h3>

            <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-transparent">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4 bg-cream/40 p-3 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                  <div className="shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-black/5 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <p className="font-bold text-foreground line-clamp-2 leading-tight text-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs font-bold text-muted-foreground bg-white px-2 py-1 rounded border border-gold/10">
                        Size: <span className="text-maroon">{item.size}</span>
                      </p>
                      <p className="text-xs font-bold text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end pt-1">
                    <span className="font-bold text-maroon text-base">
                      ₹{(item.discountPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-cream pt-6 space-y-3 text-sm md:text-base font-medium">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">₹{pricing.subtotal.toLocaleString("en-IN")}</span>
              </div>

              {pricing.bundleDiscount > 0 && (
                <div className="flex justify-between items-center text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                  <span className="font-bold flex items-center gap-1">✨ Bundle Discount!</span>
                  <span className="font-bold">-₹{pricing.bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-700 font-bold uppercase tracking-wider text-xs bg-green-100 px-2.5 py-1 rounded">Free</span>
              </div>

              {pricing.savings > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-green-700 font-bold text-right">
                    Total Savings: ₹{pricing.savings.toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <div className="border-t-2 border-gold/20 mt-4 pt-4 flex justify-between items-end">
                <span className="text-lg font-bold text-foreground">Total to Pay</span>
                <span className="text-3xl font-bold text-maroon leading-none">
                  ₹{pricing.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}