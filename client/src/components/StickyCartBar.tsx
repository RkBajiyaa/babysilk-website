import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function StickyCartBar() {
  const { totalItems, pricing } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-maroon shadow-lg" data-testid="sticky-cart-bar">
      <Link href="/cart">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-gold" />
            <span className="text-cream-DEFAULT font-medium text-sm" data-testid="text-sticky-cart-items">
              View Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold text-base" data-testid="text-sticky-cart-total">
              Rs.{pricing.total.toLocaleString("en-IN")}
            </span>
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
