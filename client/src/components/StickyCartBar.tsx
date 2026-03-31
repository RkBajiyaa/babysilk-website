import { Link, useLocation } from "wouter";
import { ShoppingCart, Truck, Tag, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function StickyCartBar() {
  const { totalItems, pricing } = useCart();
  const [location] = useLocation();

  // 1. Hide if cart is empty
  if (totalItems === 0) return null;

  // 2. Hide on specific pages where it's distracting or redundant
  const hiddenRoutes = ["/checkout", "/payment", "/order-success", "/admin", "/track-order"];
  if (hiddenRoutes.includes(location)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] bg-maroon border-t border-gold/30 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-300">
      
      <Link href="/cart">
        <a className="block max-w-7xl mx-auto px-4 py-3 sm:py-4 transition-colors hover:bg-maroon-dark cursor-pointer">
          <div className="flex items-center justify-between">

            {/* LEFT SIDE: Cart Info & Savings */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart size={18} className="text-gold" />
                <span className="text-cream font-bold text-sm sm:text-base tracking-wide">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1 text-gold/90 font-medium">
                  <Truck size={12} />
                  Free Delivery
                </span>

                {pricing.savings > 0 && (
                  <span className="flex items-center gap-1 text-green-400 font-bold tracking-wider">
                    <Tag size={12} />
                    Saved ₹{pricing.savings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Price & Call to Action */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/5">
              <div className="flex flex-col text-right">
                <span className="text-gold font-bold text-base sm:text-lg leading-none">
                  ₹{pricing.total.toLocaleString("en-IN")}
                </span>
                <span className="text-cream/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Checkout
                </span>
              </div>
              <ChevronRight size={20} className="text-gold" />
            </div>

          </div>
        </a>
      </Link>
    </div>
  );
}