import { Link } from "wouter";
import { ShoppingCart, Truck, Tag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function StickyCartBar() {
  const { totalItems, pricing } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-maroon border-t border-gold/30 shadow-2xl">

      <Link href="/cart">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between cursor-pointer">

          {/* LEFT SIDE */}

          <div className="flex flex-col">

            <div className="flex items-center gap-2">

              <ShoppingCart size={20} className="text-gold" />

              <span className="text-cream font-semibold text-sm">
                View Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>

            </div>

            {/* SHIPPING + SAVINGS */}

            <div className="flex items-center gap-3 text-xs mt-1">

              <span className="flex items-center gap-1 text-gold">
                <Truck size={12}/>
                Free Delivery
              </span>

              {pricing.savings > 0 && (
                <span className="flex items-center gap-1 text-green-300">
                  <Tag size={12}/>
                  You saved ₹{pricing.savings.toLocaleString("en-IN")}
                </span>
              )}

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            <span className="text-gold font-bold text-lg">
              ₹{pricing.total.toLocaleString("en-IN")}
            </span>

            <span className="text-cream font-medium text-sm">
              Checkout →
            </span>

          </div>

        </div>
      </Link>

    </div>
  );
}