import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function Cart() {
  const { items, totalItems, pricing, updateQuantity, removeFromCart } = useCart();

  // 1. EMPTY CART STATE
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-maroon/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag size={48} className="text-maroon/40" />
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-maroon mb-4">
          Your Cart is Empty
        </h1>

        <p className="text-muted-foreground mb-10 text-lg max-w-md">
          Looks like you haven't added any beautiful dresses yet. Let's find something special!
        </p>

        {/* Fixed DOM nesting: using styled <a> instead of <Button> inside <Link> */}
        <Link href="/shop">
          <a className="inline-block bg-maroon text-gold hover:bg-maroon-dark hover:scale-105 transition-all font-bold px-10 py-4 rounded-full text-lg shadow-lg">
            Explore Collection
          </a>
        </Link>
      </div>
    );
  }

  // 2. BUNDLE UPSELL LOGIC
  const eligibleCount = items
    .filter(i => i.bundleEligible)
    .reduce((s, i) => s + i.quantity, 0);

  const remainder = eligibleCount % 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">

      <h1 className="font-heading text-2xl md:text-3xl font-bold text-maroon mb-6 flex items-center gap-2">
        Shopping Cart 
        <span className="text-muted-foreground text-lg md:text-xl font-medium">
          ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
      </h1>

      {/* DYNAMIC BUNDLE NUDGE */}
      <div className="bg-gold/90 text-maroon-dark font-bold p-4 md:p-5 rounded-xl text-center mb-8 shadow-sm border border-maroon/20 text-sm md:text-base transition-all">
        {eligibleCount === 0 && (
          <span>✨ Add 3 dresses to unlock the ₹1550 bundle deal!</span>
        )}
        {remainder === 1 && (
          <span>✨ Add 2 more dresses → unlock the ₹1550 bundle & save big!</span>
        )}
        {remainder === 2 && (
          <span>🔥 Just 1 more dress → get all 3 for ₹1550!</span>
        )}
        {eligibleCount > 0 && remainder === 0 && (
          <span className="flex items-center justify-center gap-2 text-base md:text-lg text-green-800">
            🎉 Bundle Savings Applied! You're getting the best deal.
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* CART ITEMS LIST */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.size}`}
              className="bg-white rounded-xl p-4 md:p-5 border border-gold/30 flex gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <Link href={`/product/${item.slug}`}>
                <a className="shrink-0 cursor-pointer block overflow-hidden rounded-lg border border-black/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 md:w-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </a>
              </Link>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <Link href={`/product/${item.slug}`}>
                      <a className="text-base md:text-lg font-bold text-foreground line-clamp-2 leading-tight hover:text-maroon transition-colors pr-6 cursor-pointer">
                        {item.name}
                      </a>
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 bg-cream inline-block px-2 py-1 rounded border border-gold/20">
                    Size: <span className="font-bold text-maroon">{item.size}</span>
                  </p>
                </div>

                <div className="flex items-end justify-between mt-4">
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center bg-white border border-gold/40 rounded-lg shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gold/20 rounded-l-lg transition-colors"
                    >
                      <Minus size={16} className="text-maroon font-bold" />
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center text-sm font-bold border-x border-gold/40 text-maroon bg-cream/50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gold/20 rounded-r-lg transition-colors"
                    >
                      <Plus size={16} className="text-maroon font-bold" />
                    </button>
                  </div>

                  {/* ITEM PRICE */}
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold text-maroon">
                      ₹{(item.discountPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground line-through font-medium">
                      ₹{(item.mrpPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gold/30 shadow-lg sticky top-24">
            <h3 className="font-heading text-xl font-bold text-maroon mb-6 pb-4 border-b-2 border-cream">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm md:text-base mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-foreground">₹{pricing.subtotal.toLocaleString("en-IN")}</span>
              </div>

              {pricing.bundleDiscount > 0 && (
                <div className="flex justify-between items-center text-green-700 bg-green-50 p-2 rounded-md border border-green-100">
                  <span className="font-bold flex items-center gap-1">✨ Bundle Discount</span>
                  <span className="font-bold">-₹{pricing.bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Delivery</span>
                <span className="text-green-700 font-bold uppercase tracking-wide text-xs bg-green-100 px-2 py-1 rounded">Free</span>
              </div>
            </div>

            <div className="border-t-2 border-cream pt-4 mb-6 flex items-end justify-between">
              <span className="font-bold text-lg text-foreground">Total Amount</span>
              <span className="font-bold text-3xl text-maroon">
                ₹{pricing.total.toLocaleString("en-IN")}
              </span>
            </div>

            {/* UPGRADED SAVINGS HIGHLIGHT */}
            {pricing.savings > 0 && (
              <div className="bg-green-100/80 border border-green-300 rounded-lg p-3 text-center mb-6 shadow-sm">
                <p className="text-sm md:text-base text-green-800 font-bold tracking-wide">
                  🎉 You are saving ₹{pricing.savings.toLocaleString("en-IN")}!
                </p>
              </div>
            )}

            {/* Semantic Link to avoid <button> inside <a> errors */}
            <Link href="/checkout">
              <a className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-gold font-bold py-5 rounded-xl text-lg shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
                Proceed to Checkout
                <ChevronRight size={22} />
              </a>
            </Link>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] md:text-xs font-bold text-muted-foreground mt-8 pt-6 border-t border-gold/20">
              <div className="flex flex-col items-center gap-1"><span className="text-lg">🚚</span> Free Delivery</div>
              <div className="flex flex-col items-center gap-1"><span className="text-lg">🔄</span> Easy Returns</div>
              <div className="flex flex-col items-center gap-1"><span className="text-lg">🔒</span> Secure UPI</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}