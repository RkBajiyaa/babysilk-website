import { Link } from "wouter";
import { Star, Truck, RefreshCw, CreditCard, Sparkles, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getTrendingProducts } from "@/lib/products";
import { CATEGORIES } from "@shared/schema";
import { Button } from "@/components/ui/button";

const categoryImages: Record<string, string> = {
  "Pattu Dresses": "https://picsum.photos/seed/pattu/300/400",
  "Festive Wear": "https://picsum.photos/seed/festive/300/400",
  "Lehenga Sets": "https://picsum.photos/seed/lehenga/300/400",
  "Traditional Frocks": "https://picsum.photos/seed/frocks/300/400",
  "Party Wear": "https://picsum.photos/seed/party/300/400",
  "New Arrivals": "https://picsum.photos/seed/newarr/300/400",
};

const customerReviews = [
  { name: "Priya S.", city: "Chennai", rating: 5, text: "Absolutely beautiful dress! The fabric quality is amazing and my daughter looked like a princess. Highly recommend BabySilk!" },
  { name: "Meena R.", city: "Bangalore", rating: 5, text: "Perfect for the festival season. The silk quality is outstanding and the embroidery work is exquisite. Got so many compliments!" },
  { name: "Divya K.", city: "Hyderabad", rating: 5, text: "Ordered for my daughter's birthday and it was perfect! The color is exactly as shown. Very happy with my purchase." },
  { name: "Lakshmi T.", city: "Coimbatore", rating: 5, text: "Such premium quality at this price point! The stitching is perfect and the fabric is soft on my baby's skin." },
];

export default function Home() {
  const trending = getTrendingProducts();

  return (
    <div>
      <section
        className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center overflow-hidden"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-maroon via-maroon-dark to-maroon z-0" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('https://picsum.photos/seed/herosilk/1200/600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/60 to-maroon/80 z-[1]" />
        <div className="relative z-[2] text-center px-6 max-w-2xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-gold text-xs sm:text-sm font-semibold tracking-wide" data-testid="text-hero-badge">
              Any 3 Dresses for just Rs.1550
            </span>
          </div>
          <h1
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            data-testid="text-hero-title"
          >
            Premium Kids
            <br />
            <span className="text-gold">Ethnic Wear</span>
          </h1>
          <p className="text-cream-DEFAULT/80 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Beautiful Traditional Dresses for Little Stars
          </p>
          <Link href="/shop">
            <Button
              className="bg-gold text-maroon-dark font-semibold px-8 py-3 rounded-md text-base"
              size="lg"
              data-testid="button-shop-now"
            >
              Shop Now
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-white border-y border-gold/10 py-4" data-testid="section-trust-bar">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {[
              { icon: Truck, text: "All India Delivery" },
              { icon: RefreshCw, text: "7 Day Exchange" },
              { icon: CreditCard, text: "Easy UPI Payment" },
              { icon: Sparkles, text: "Premium Quality" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 shrink-0 px-2">
                <Icon size={18} className="text-teal" />
                <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12" data-testid="section-categories">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center text-maroon mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`}>
              <div
                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
                data-testid={`card-category-${cat.toLowerCase().replace(/\s/g, '-')}`}
              >
                <img
                  src={categoryImages[cat]}
                  alt={cat}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-maroon/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white leading-tight">
                    {cat}
                  </h3>
                  <span className="text-gold text-xs font-medium mt-0.5 inline-block">Shop Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream-dark/50 py-12" data-testid="section-trending">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-maroon">
              Trending This Season
            </h2>
            <Link href="/shop">
              <span className="text-sm font-medium text-teal flex items-center gap-1">
                View All <ChevronRight size={16} />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 overflow-hidden" data-testid="section-bundle-offer">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-maroon mb-3">
            Buy Any 3 Dresses
          </h2>
          <p className="text-maroon/80 text-lg sm:text-2xl font-bold mb-2">
            Pay Only Rs.1550
          </p>
          <p className="text-maroon/60 text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mix & Match from Any Category
          </p>
          <Link href="/shop">
            <Button className="bg-maroon text-gold font-semibold px-8" size="lg" data-testid="button-shop-bundle">
              Shop the Bundle
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12" data-testid="section-reviews">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center text-maroon mb-8">
          What Moms Are Saying
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {customerReviews.map((review, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[280px] sm:w-[300px] bg-white rounded-lg p-5 border border-gold/10"
              data-testid={`card-review-${idx}`}
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} className={i <= review.rating ? "fill-gold text-gold" : "text-gold/20"} />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-maroon/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-maroon">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
