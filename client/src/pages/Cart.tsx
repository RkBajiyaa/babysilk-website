import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart, updateQuantity, removeFromCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, totalItems, pricing } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-maroon/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-maroon/40" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-maroon mb-3">
          Your Cart is Empty
        </h1>

        <p className="text-muted-foreground mb-8 text-lg max-w-sm">
          Looks like you haven't added any beautiful dresses yet!
        </p>

        <Link href="/shop">
          <Button className="bg-maroon text-gold hover:bg-maroon-dark hover:scale-105 transition-transform font-bold px-10 py-6 rounded-full text-lg shadow-md">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate eligible items for the bundle
  const eligibleCount = items
    .filter(i => i.bundleEligible)
    .reduce((s, i) => s + i.quantity, 0);

  // Use modulo (%) to keep upselling even after the first bundle (e.g., if they have 4 items, it pushes for 6)
  const remainder = eligibleCount % 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="font-heading text-2xl md:text-3xl font-bold text-maroon mb-6">
        Shopping Cart <span className="text-muted-foreground text-lg font-medium">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
      </h1>

      {/* DYNAMIC BUNDLE NUDGE */}
      <div className="bg-gold text-maroon-dark font-bold p-4 md:p-5 rounded-xl text-center mb-8 shadow-md border border-maroon/10 text-sm md:text-base">
        {eligibleCount === 0 && (
          <span>✨ Add 3 dresses to unlock the ₹1550 bundle deal!</span>
        )}
        {remainder === 1 && (
          <span>Add 2 more dresses → unlock ₹1550 bundle & save big!</span>
        )}
        {remainder === 2 && (
          <span>🔥 Just 1 more dress → get all 3 for ₹1550!</span>
        )}
        {eligibleCount > 0 && remainder === 0 && (
          <span className="flex items-center justify-center gap-2 text-base md:text-lg">
            🎉 Bundle Savings Applied! You're getting the best deal.
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* CART ITEMS LIST */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.size}`}
              className="bg-white rounded-xl p-4 border border-gold/20 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/product/${item.slug}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-28 object-cover rounded-lg shrink-0 border border-black/5"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 leading-tight hover:text-maroon transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: <span className="font-medium text-foreground">{item.size}</span>
                  </p>
                </div>

                <div className="flex items-end justify-between mt-4">
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center bg-cream border border-gold/30 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gold/20 rounded-l-lg transition-colors"
                    >
                      <Minus size={14} className="text-maroon" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold border-x border-gold/30 text-maroon">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gold/20 rounded-r-lg transition-colors"
                    >
                      <Plus size={14} className="text-maroon" />
                    </button>
                  </div>

                  {/* ITEM PRICE */}
                  <div className="text-right">
                    <p className="text-base font-bold text-maroon">
                      ₹{(item.discountPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground line-through">
                      ₹{(item.mrpPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-[340px] shrink-0">
          <div className="bg-cream rounded-xl p-6 border border-gold/30 shadow-sm sticky top-6">
            <h3 className="font-heading text-lg font-bold text-maroon mb-5 pb-4 border-b border-gold/20">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-medium">₹{pricing.subtotal.toLocaleString("en-IN")}</span>
              </div>

              {pricing.bundleDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Bundle Discount</span>
                  <span>-₹{pricing.bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-700 font-bold uppercase tracking-wide text-xs mt-0.5">Free</span>
              </div>
            </div>

            <div className="border-t border-gold/30 pt-4 mb-6 flex items-end justify-between">
              <span className="font-bold text-base text-maroon">Total Amount</span>
              <span className="font-bold text-2xl text-maroon">
                ₹{pricing.total.toLocaleString("en-IN")}
              </span>
            </div>

            {/* UPGRADED SAVINGS HIGHLIGHT */}
            {pricing.savings > 0 && (
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-3 text-center mb-6">
                <p className="text-sm text-green-800 font-bold">
                  ✨ You are saving ₹{pricing.savings.toLocaleString("en-IN")}!
                </p>
              </div>
            )}

            <Link href="/checkout">
              <Button
                className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold py-6 rounded-full text-base shadow-lg transition-transform hover:scale-105"
              >
                Proceed to Checkout
                <ChevronRight size={20} className="ml-1" />
              </Button>
            </Link>

            <div className="grid grid-cols-3 text-center text-[10px] md:text-xs font-medium text-muted-foreground mt-6 pt-5 border-t border-gold/20">
              <div>🚚 Free Delivery</div>
              <div>🔄 Easy Returns</div>
              <div>🔒 Secure UPI</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}