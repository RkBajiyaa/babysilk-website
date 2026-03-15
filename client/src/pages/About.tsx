import { Link } from "wouter";
import { Sparkles, Truck, RefreshCw, ShieldCheck, Star } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14">

      {/* HERO */}

      <div className="text-center mb-14">

        <h1 className="font-heading text-4xl md:text-5xl font-bold text-maroon mb-4">
          About BabySilk
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Premium kids ethnic wear crafted with love.  
          At BabySilk we combine timeless Indian tradition with modern comfort
          so every child can shine during celebrations.
        </p>

      </div>


      {/* SOCIAL PROOF */}

      <div className="grid grid-cols-3 text-center gap-4 mb-16 border-y border-gold/10 py-6">

        <div>
          <p className="text-2xl font-bold text-maroon">5000+</p>
          <p className="text-sm text-muted-foreground">Happy Moms</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-maroon">12000+</p>
          <p className="text-sm text-muted-foreground">Dresses Sold</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-maroon flex items-center justify-center gap-1">
            4.8 <Star size={16} className="fill-gold text-gold" />
          </p>
          <p className="text-sm text-muted-foreground">Average Rating</p>
        </div>

      </div>


      {/* STORY */}

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

        <img
          src="https://picsum.photos/seed/kidsfashion/600/500"
          className="rounded-lg object-cover w-full h-full shadow-md"
          alt="Kids fashion"
        />

        <div>

          <h2 className="font-heading text-2xl font-bold text-maroon mb-4">
            Our Story
          </h2>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            BabySilk began with a simple belief — children deserve the same
            beautiful ethnic fashion as adults, but designed for comfort,
            softness, and freedom of movement.
          </p>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            Every dress in our collection is carefully curated to reflect
            India’s rich textile heritage while remaining breathable,
            lightweight, and perfect for kids.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            From festive celebrations to weddings and family gatherings,
            BabySilk outfits help create memories that last forever.
          </p>

        </div>

      </div>


      {/* WHY BABYSILK */}

      <div className="text-center mb-12">

        <h2 className="font-heading text-3xl font-bold text-maroon mb-10">
          Why Parents Love BabySilk
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white border border-gold/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">

            <Truck className="mx-auto text-maroon mb-3" size={28} />

            <h3 className="font-semibold mb-1">
              Free Delivery
            </h3>

            <p className="text-sm text-muted-foreground">
              Free shipping across India on every order.
            </p>

          </div>

          <div className="bg-white border border-gold/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">

            <RefreshCw className="mx-auto text-maroon mb-3" size={28} />

            <h3 className="font-semibold mb-1">
              7 Day Exchange
            </h3>

            <p className="text-sm text-muted-foreground">
              Easy size exchange if something doesn't fit.
            </p>

          </div>

          <div className="bg-white border border-gold/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">

            <ShieldCheck className="mx-auto text-maroon mb-3" size={28} />

            <h3 className="font-semibold mb-1">
              Secure Payments
            </h3>

            <p className="text-sm text-muted-foreground">
              Safe checkout with UPI, cards and netbanking.
            </p>

          </div>

          <div className="bg-white border border-gold/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">

            <Sparkles className="mx-auto text-maroon mb-3" size={28} />

            <h3 className="font-semibold mb-1">
              Premium Quality
            </h3>

            <p className="text-sm text-muted-foreground">
              Carefully selected fabrics and designs.
            </p>

          </div>

        </div>

      </div>


      {/* CTA */}

      <div className="text-center mt-20">

        <h2 className="font-heading text-2xl font-bold text-maroon mb-4">
          Discover Our Collection
        </h2>

        <p className="text-muted-foreground mb-6">
          Explore our range of premium kids ethnic wear.
        </p>

        <Link href="/shop">

          <button className="bg-maroon text-gold px-8 py-3 rounded-md font-semibold hover:bg-maroon-dark transition">
            Shop Now
          </button>

        </Link>

      </div>

    </div>
  );
}