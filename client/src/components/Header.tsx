import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
    { href: "/track-order", label: "Track Order" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-gold/20" data-testid="header">
      <div className="bg-maroon text-cream-DEFAULT text-center py-1.5 px-4">
        <p className="text-xs sm:text-sm font-medium tracking-wide" data-testid="text-promo-banner">
          Buy Any 3 Dresses for just Rs.1550 | Free All India Delivery
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-16">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-maroon"
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" data-testid="link-logo">
            <div className="flex flex-col items-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-maroon tracking-wider">
                BabySilk
              </span>
              <span className="text-[10px] text-gold-dark tracking-[0.2em] -mt-1 font-medium">
                PREMIUM KIDS WEAR
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" data-testid="nav-desktop">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-maroon font-semibold"
                      : "text-foreground/70"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/cart" data-testid="link-cart">
              <div className="relative p-2">
                <ShoppingCart size={22} className="text-maroon" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-gold text-maroon text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    data-testid="text-cart-count"
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-cream border-t border-gold/20 animate-fade-in" data-testid="nav-mobile">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <div
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 px-4 rounded-md text-sm font-medium ${
                    location === link.href
                      ? "bg-maroon/10 text-maroon"
                      : "text-foreground/70"
                  }`}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
