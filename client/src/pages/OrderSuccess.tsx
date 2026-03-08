import { useSearch } from "wouter";
import { Link } from "wouter";
import { CheckCircle, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("orderId") || "BSK-000000";
  const payLater = params.get("payLater") === "true";

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center" data-testid="page-order-success">
      <div className="mb-6 animate-fade-in">
        <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="text-success-title">
          {payLater ? "Order Saved!" : "Thank You! Order Placed Successfully"}
        </h1>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gold/10 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <p className="text-sm text-muted-foreground mb-1">Order ID</p>
        <p className="text-2xl font-bold text-maroon font-mono" data-testid="text-order-id">{orderId}</p>
        <p className="text-sm text-muted-foreground mt-3">
          <Package size={16} className="inline mr-1" />
          Estimated Delivery: 7-9 Business Days
        </p>

        {payLater && (
          <div className="mt-4 bg-gold/10 rounded-md p-3 border border-gold/20">
            <p className="text-sm font-medium text-gold-dark">
              Complete payment within 24 hours to confirm your order.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/track-order">
          <Button className="w-full bg-maroon text-cream-DEFAULT" size="lg" data-testid="button-track-order">
            <Package size={18} className="mr-2" />
            Track My Order
          </Button>
        </Link>

        <a
          href={`https://wa.me/919999999999?text=Hi%2C+my+order+ID+is+${orderId}%2C+I+need+help.`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full border-green-500 text-green-700 mt-3" size="lg" data-testid="button-whatsapp-order">
            <MessageCircle size={18} className="mr-2" />
            Contact on WhatsApp
          </Button>
        </a>

        <Link href="/shop">
          <span className="block text-sm text-muted-foreground mt-4 underline" data-testid="link-continue-shopping">
            Continue Shopping
          </span>
        </Link>
      </div>
    </div>
  );
}
