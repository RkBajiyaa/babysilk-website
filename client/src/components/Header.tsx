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
    { href: "/track-order", label: "Track Order" },
    { href: "/contact", label: "Contact" },
    { href: "/About", label: "About" },
  ];

  return (

    <header className="sticky top-0 z-50 bg-cream shadow-sm">

      {/* PROMO BAR */}

      <div className="bg-maroon text-white text-center py-1.5 px-4">

        <p className="text-xs sm:text-sm font-medium tracking-wide">
          Buy Any 3 Dresses for ₹1550 • Free All India Delivery
        </p>

      </div>


      {/* MAIN HEADER */}

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">


          {/* MOBILE MENU */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-maroon"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>


          {/* LOGO */}

          <Link href="/">

            <div className="flex flex-col items-center cursor-pointer">

              <span className="font-heading text-xl sm:text-2xl font-bold text-maroon tracking-wider">
                BabySilk
              </span>

              <span className="text-[10px] text-gold-dark tracking-[0.2em] -mt-1 font-medium">
                PREMIUM KIDS WEAR
              </span>

            </div>

          </Link>


          {/* DESKTOP NAV */}

          <nav className="hidden lg:flex items-center gap-10">

            {navLinks.map(link => {

              const active = location === link.href;

              return (

                <Link key={link.href} href={link.href}>

                  <span
                    className={`relative text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? "text-maroon"
                        : "text-foreground/70 hover:text-maroon"
                    }`}
                  >

                    {link.label}

                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-maroon transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />

                  </span>

                </Link>

              );

            })}

          </nav>


          {/* CART */}

          <div className="flex items-center">

            <Link href="/cart">

              <div className="relative p-2 transition-transform hover:scale-110 cursor-pointer">

                <ShoppingCart
                  size={22}
                  className="text-maroon"
                />

                {totalItems > 0 && (

                  <span className="absolute -top-1 -right-1 bg-gold text-maroon text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">

                    {totalItems}

                  </span>

                )}

              </div>

            </Link>

          </div>

        </div>

      </div>


      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="lg:hidden bg-cream border-t border-gold/20 animate-fade-in">

          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">

            {navLinks.map(link => {

              const active = location === link.href;

              return (

                <Link key={link.href} href={link.href}>

                  <div
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-maroon/10 text-maroon"
                        : "text-foreground/70 hover:bg-maroon/5"
                    }`}
                  >

                    {link.label}

                  </div>

                </Link>

              );

            })}

          </nav>

        </div>

      )}

    </header>

  );
}