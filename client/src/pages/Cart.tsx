import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart, updateQuantity, removeFromCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, totalItems, pricing } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center" data-testid="page-cart-empty">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Add some beautiful dresses to get started!
        </p>
        <Link href="/shop">
          <Button className="bg-maroon text-cream-DEFAULT" data-testid="button-continue-shopping">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const eligibleCount = items.filter(i => i.bundleEligible).reduce((s, i) => s + i.quantity, 0);
  const itemsNeeded = eligibleCount < 3 ? 3 - eligibleCount : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" data-testid="page-cart">
      <h1 className="font-heading text-2xl font-bold text-maroon mb-6" data-testid="text-cart-title">
        Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>

      {pricing.bundlesApplied > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fade-in" data-testid="banner-bundle-applied">
          <p className="text-sm font-semibold text-green-800">
            Bundle Offer Applied! Any 3 dresses = Rs.1550
          </p>
          <p className="text-xs text-green-700 mt-0.5">
            You saved Rs.{pricing.bundleDiscount.toLocaleString("en-IN")} with bundle pricing!
          </p>
        </div>
      )}

      {itemsNeeded > 0 && (
        <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-4" data-testid="banner-bundle-nudge">
          <p className="text-sm font-medium text-gold-dark">
            Add {itemsNeeded} more dress{itemsNeeded > 1 ? "es" : ""} to unlock Rs.1550 bundle deal!
          </p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div
            key={`${item.productId}-${item.size}`}
            className="bg-white rounded-lg p-4 border border-gold/10 flex gap-4"
            data-testid={`cart-item-${item.productId}-${item.size}`}
          >
            <Link href={`/product/${item.slug}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-24 object-cover rounded-md shrink-0"
                data-testid={`img-cart-item-${item.productId}`}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.slug}`}>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1" data-testid={`text-cart-item-name-${item.productId}`}>
                  {item.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground mb-2">Size: {item.size}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gold/20 rounded-md overflow-visible">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center"
                    data-testid={`button-cart-minus-${item.productId}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-gold/20">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center"
                    data-testid={`button-cart-plus-${item.productId}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-maroon">Rs.{(item.discountPrice * item.quantity).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground line-through">Rs.{(item.mrpPrice * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-muted-foreground p-1"
                    data-testid={`button-cart-remove-${item.productId}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-5 border border-gold/10" data-testid="cart-summary">
        <h3 className="font-heading text-base font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span>Rs.{pricing.subtotal.toLocaleString("en-IN")}</span>
          </div>
          {pricing.bundleDiscount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Bundle Discount</span>
              <span>-Rs.{pricing.bundleDiscount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-green-700 font-medium">FREE</span>
          </div>
          <div className="border-t border-gold/10 pt-2 flex justify-between">
            <span className="font-bold text-base">Total</span>
            <span className="font-bold text-lg text-maroon" data-testid="text-cart-total">
              Rs.{pricing.total.toLocaleString("en-IN")}
            </span>
          </div>
          {pricing.savings > 0 && (
            <p className="text-xs text-green-700 text-right" data-testid="text-total-savings">
              You save Rs.{pricing.savings.toLocaleString("en-IN")} on this order!
            </p>
          )}
        </div>
        <Link href="/checkout">
          <Button className="w-full mt-4 bg-maroon text-gold font-semibold py-5" size="lg" data-testid="button-proceed-checkout">
            Proceed to Checkout
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
