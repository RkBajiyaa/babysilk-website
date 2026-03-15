import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#4A1212] text-cream-DEFAULT">

      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* TRUST BAR */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-sm mb-12 border-b border-white/10 pb-8">

          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🚚</span>
            <span className="text-white/80">Free Delivery</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🔄</span>
            <span className="text-white/80">7 Day Exchange</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🔒</span>
            <span className="text-white/80">Secure UPI Payments</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">✨</span>
            <span className="text-white/80">Premium Quality</span>
          </div>

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND */}

          <div>

            <h3 className="font-heading text-2xl font-bold text-gold mb-3">
              BabySilk
            </h3>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Premium kids ethnic wear for your little stars.
              Handpicked traditional dresses designed for comfort and celebration.
            </p>

            <p className="text-white/40 text-xs mt-4">
              babysilk.in
            </p>

          </div>


          {/* LINKS */}

          <div>

            <h4 className="font-heading text-sm font-semibold text-gold mb-5 tracking-wider uppercase">
              Quick Links
            </h4>

            <ul className="space-y-3">

              {[
                { href: "/shop", label: "Shop Collection" },
                { href: "/contact", label: "Contact Us" },
                { href: "/track-order", label: "Track Order" },
                { href: "/returns", label: "Returns & Exchange" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map(link => (

                <li key={link.href}>

                  <Link href={link.href}>

                    <span className="text-white/70 text-sm hover:text-gold transition-colors cursor-pointer">
                      {link.label}
                    </span>

                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* CONTACT */}

          <div>

            <h4 className="font-heading text-sm font-semibold text-gold mb-5 tracking-wider uppercase">
              Contact
            </h4>

            <div className="space-y-3 text-sm text-white/70">

              <p>
                WhatsApp: +91 99999 99999
              </p>

              <p>
                Email: hello@babysilk.in
              </p>

              <p>
                Mon - Sat, 9AM - 7PM
              </p>

            </div>

            {/* WHATSAPP BUTTON */}

            <div className="mt-6">

              <a
                href="https://wa.me/919999999999?text=Hello%2C+I+need+help+with+my+order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:scale-[1.02]"
              >
                Chat on WhatsApp
              </a>

            </div>

          </div>

        </div>


        {/* PAYMENT METHODS */}

        <div className="mt-12 text-center text-sm text-white/60 border-t border-white/10 pt-6">

          Secure Payments via UPI • Cards • Netbanking

        </div>


        {/* COPYRIGHT */}

        <div className="mt-4 text-center">

          <p className="text-white/40 text-xs">

            © {new Date().getFullYear()} BabySilk. All rights reserved.

          </p>

        </div>

      </div>

    </footer>
  );
}