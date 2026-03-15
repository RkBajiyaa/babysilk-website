import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">

        <h1 className="font-heading text-2xl font-bold mb-4">
          No items in cart
        </h1>

        <Link href="/shop">
          <Button className="bg-maroon text-cream-DEFAULT">
            Continue Shopping
          </Button>
        </Link>

      </div>
    );
  }

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
      const order = await res.json();

      navigate(`/payment?orderId=${order.orderId}&total=${pricing.total}`);

    } catch (error: any) {

      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive"
      });

    } finally {

      setSubmitting(false);

    }
  };

  return (

    <div className="max-w-4xl mx-auto px-4 py-6">

      <Link href="/cart">

        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">

          <ChevronLeft size={16}/> Back to Cart

        </span>

      </Link>


      <h1 className="font-heading text-2xl font-bold text-maroon mb-6">
        Checkout
      </h1>


      <div className="lg:grid lg:grid-cols-5 lg:gap-8">

        {/* FORM */}
        <div className="lg:col-span-3">

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <div className="bg-white rounded-lg p-5 border border-gold/10 space-y-4">

              <h2 className="font-heading text-base font-semibold">
                Delivery Details
              </h2>

              <div>

                <Label htmlFor="customerName">Full Name *</Label>

                <Input id="customerName" {...form.register("customerName")} />

                {form.formState.errors.customerName && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.customerName.message}
                  </p>
                )}

              </div>


              <div>

                <Label htmlFor="phone">Phone Number *</Label>

                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  {...form.register("phone")}
                  placeholder="10 digit mobile number"
                />

                {form.formState.errors.phone && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}

              </div>


              <div>

                <Label>Email (Optional)</Label>

                <Input
                  type="email"
                  {...form.register("email")}
                />

              </div>


              <div>

                <Label>Address Line 1 *</Label>

                <Input
                  {...form.register("addressLine1")}
                  placeholder="House/Flat No, Street"
                />

              </div>


              <div>

                <Label>Address Line 2</Label>

                <Input
                  {...form.register("addressLine2")}
                  placeholder="Area, Landmark"
                />

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div>

                  <Label>City *</Label>

                  <Input {...form.register("city")} />

                </div>


                <div>

                  <Label>Pincode *</Label>

                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={6}
                    {...form.register("pincode")}
                  />

                </div>

              </div>


              <div>

                <Label>State *</Label>

                <Select
                  onValueChange={(v) => form.setValue("state", v)}
                  defaultValue=""
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Select state"/>
                  </SelectTrigger>

                  <SelectContent>

                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

              </div>

            </div>


            {/* TRUST STRIP */}
            <div className="grid grid-cols-3 text-center text-xs text-muted-foreground border rounded-lg py-3">

              <div>🚚 Free Delivery</div>
              <div>🔄 7 Day Exchange</div>
              <div>🔒 Secure UPI</div>

            </div>


            {/* PAYMENT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-maroon text-gold font-semibold py-5"
              size="lg"
              disabled={submitting}
            >

              {submitting ? "Processing..." : "Proceed to Payment"}

              <ChevronRight size={18} className="ml-1"/>

            </Button>


            <p className="text-center text-xs text-muted-foreground">
              Delivery usually takes 7-9 working days
            </p>

          </form>

        </div>


        {/* ORDER SUMMARY */}
        <div className="lg:col-span-2 mt-6 lg:mt-0">

          <div className="bg-white rounded-lg p-5 border border-gold/10 sticky top-24">

            <h3 className="font-heading text-base font-semibold mb-4">
              Order Summary
            </h3>


            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">

              {items.map(item => (

                <div key={`${item.productId}-${item.size}`} className="flex gap-3 text-sm">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">

                    <p className="font-medium line-clamp-1">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.size} x {item.quantity}
                    </p>

                  </div>

                  <span className="font-semibold text-maroon shrink-0">
                    ₹{(item.discountPrice * item.quantity).toLocaleString("en-IN")}
                  </span>

                </div>

              ))}

            </div>


            <div className="border-t border-gold/10 pt-3 space-y-1.5 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{pricing.subtotal.toLocaleString("en-IN")}</span>
              </div>


              {pricing.bundleDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Bundle Discount</span>
                  <span>-₹{pricing.bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}


              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-700">FREE</span>
              </div>


              <div className="border-t border-gold/10 pt-2 flex justify-between font-bold">

                <span>Total</span>

                <span className="text-maroon">
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