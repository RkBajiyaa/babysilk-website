import { useParams, Link } from "wouter";
import { useState } from "react";
import {
  Star,
  Truck,
  RefreshCw,
  ChevronLeft,
  Minus,
  Plus,
  CreditCard,
  ThumbsUp,
  X,
  Ruler
} from "lucide-react";

import { getProductBySlug, ALL_PRODUCTS } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { SIZE_CHART } from "@shared/schema"; // Imported the size chart!

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { toast } = useToast();

  const [currentImage, setCurrentImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false); // State for our new Size Guide

  const [touchStart, setTouchStart] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const avgRating =
    (product.reviews || []).reduce((s, r) => s + r.rating, 0) /
    (product.reviews?.length || 1);

  const discount = Math.round(
    ((product.mrpPrice - product.discountPrice) / product.mrpPrice) * 100
  );

  const savings = product.mrpPrice - product.discountPrice;
  const stockLeft = (product.id % 5) + 4;
  const viewers = (product.id % 16) + 18;

  /* swipe */
  const handleTouchStart = (e: any) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: any) => {
    const end = e.changedTouches[0].clientX;
    const diff = touchStart - end;

    if (diff > 50) {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }

    if (diff < -50) {
      setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  /* suggestions */
  /* first try same category */
  let similarProducts = ALL_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  /* fallback if empty */
  if (similarProducts.length === 0) {
    similarProducts = ALL_PRODUCTS
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  }

  /* recommended */
  const recommendedProducts = ALL_PRODUCTS
    .filter(p => p.id !== product.id)
    .slice(4, 8);

  /* add to cart */
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        size: selectedSize,
        mrpPrice: product.mrpPrice,
        discountPrice: product.discountPrice,
        bundleEligible: product.bundleEligible
      },
      quantity
    );

    toast({
      title: "Added to cart",
      description: `${product.name} x${quantity}`
    });

    setShowCartBar(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-40">
      
      {/* BACK */}
      <div className="px-4 py-4">
        <Link href="/shop">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-maroon transition-colors cursor-pointer">
            <ChevronLeft size={16} /> Back to Collection
          </span>
        </Link>
      </div>

      {/* PRODUCT */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:px-4">
        
        {/* IMAGES */}
        <div className="mb-8 lg:mb-0">
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-xl cursor-zoom-in bg-cream-DEFAULT border border-gold/10 shadow-sm"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setFullscreen(true)}
          >
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-maroon text-gold text-xs font-bold px-3 py-1.5 rounded-md shadow-md tracking-wide">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* dots (mobile mostly) */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {product.images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImage ? "bg-maroon" : "bg-gold/30"
                }`}
              />
            ))}
          </div>

          {/* thumbnails (scrollable if many) */}
          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide pb-2 px-4 lg:px-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === idx ? "border-maroon opacity-100 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="px-4 lg:px-0 pb-8">
          
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-foreground leading-tight">
            {product.name}
          </h1>

          {/* rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={16}
                  className={i <= Math.round(avgRating) ? "fill-gold text-gold" : "text-gold/30"}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {avgRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          {/* price */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-bold text-maroon">
              ₹{product.discountPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-lg line-through text-muted-foreground font-medium">
              ₹{product.mrpPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2.5 py-1 rounded-md font-bold tracking-wide">
              Save ₹{savings.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Bundle Nudge Upgrade */}
          {product.bundleEligible && (
            <div className="inline-block bg-gold/20 text-maroon-dark text-sm font-bold px-3 py-1 rounded-md mb-5 border border-gold/30">
              ✨ Eligible for 3 for ₹1550 Bundle
            </div>
          )}

          {/* urgency */}
          <div className="text-sm mb-6 space-y-1.5 p-3 bg-cream rounded-lg border border-gold/20">
            <p className="text-maroon font-bold flex items-center gap-2">
              🔥 Only {stockLeft} left in stock
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              👀 {viewers} people are viewing this right now
            </p>
          </div>

          {/* SIZE SELECTION */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-foreground">Select Size</h3>
              {/* SIZE GUIDE BUTTON */}
              <button 
                onClick={() => setShowSizeGuide(!showSizeGuide)} 
                className="flex items-center gap-1 text-sm text-maroon hover:text-maroon-dark font-semibold underline underline-offset-4"
              >
                <Ruler size={14} />
                {showSizeGuide ? "Hide Size Guide" : "View Size Guide"}
              </button>
            </div>

            {sizeError && (
              <p className="text-xs font-semibold text-red-600 mb-3 bg-red-50 p-2 rounded">
                Please select a size to continue
              </p>
            )}

            <div className="flex gap-2.5 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`px-4 py-2.5 rounded-md border text-sm font-bold transition-all ${
                    selectedSize === size
                      ? "bg-maroon text-white border-maroon shadow-md scale-105"
                      : "bg-white text-foreground hover:border-maroon hover:text-maroon border-gold/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* EXPANDABLE SIZE CHART TABLE */}
          {showSizeGuide && SIZE_CHART && (
            <div className="mb-6 overflow-x-auto border border-gold/30 rounded-lg shadow-sm animate-fade-in bg-white">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-cream-DEFAULT text-maroon font-bold border-b border-gold/30">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Age Guide</th>
                    <th className="px-4 py-3 text-center">Chest (in)</th>
                    <th className="px-4 py-3 text-center">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr key={row.label} className="border-b border-gold/10 last:border-0 hover:bg-gold/5 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-foreground">{row.label}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.age}</td>
                      <td className="px-4 py-2.5 text-center font-medium">{row.chest}</td>
                      <td className="px-4 py-2.5 text-center font-medium">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-base font-bold text-foreground">Quantity</span>
            <div className="flex items-center bg-white border border-gold/30 rounded-lg shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-10 flex items-center justify-center text-maroon hover:bg-gold/10 rounded-l-lg transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-maroon text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-12 h-10 flex items-center justify-center text-maroon hover:bg-gold/10 rounded-r-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-maroon hover:bg-maroon-dark text-gold font-bold text-lg py-7 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
          >
            Add to Cart
          </Button>

               {/* THE UPDATED CUSTOM SIZE BOX */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 text-sm text-maroon mt-4 shadow-sm text-center leading-relaxed">
            📏 <strong>Custom Size Available</strong> — Please select the closest size and share your exact measurements or instructions in the <strong>Order Notes</strong> at checkout. We'll connect before completing the order, Thank you for shopping with us!
          </div>

          {/* delivery strips */}
          <div className="space-y-3 text-sm mt-8 pt-6 border-t border-gold/20 font-medium text-foreground">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gold/10">
              <Truck size={18} className="text-maroon"/> Free Delivery across India
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gold/10">
              <RefreshCw size={18} className="text-maroon"/> 7 Day Easy Exchange
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gold/10">
              <CreditCard size={18} className="text-maroon"/> Secure UPI Payment
            </div>
          </div>

        </div>
      </div>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 py-16 mt-8 bg-cream border-y border-gold/10">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center text-maroon">
          Customer Reviews
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(product.reviews || []).slice(0, 6).map((review, idx) => (
            <div key={idx} className="bg-white border border-gold/20 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-foreground">{review.name}</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded tracking-wide uppercase">
                  Verified Purchase
                </span>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={14}
                    className={i <= review.rating ? "fill-gold text-gold" : "text-gold/20"}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{review.text}"
              </p>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-4 hover:text-maroon transition-colors">
                <ThumbsUp size={14}/> Helpful
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SIMILAR */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl font-bold mb-8 text-maroon text-center">
          Similar Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {similarProducts.map(p => (
            <ProductCard key={p.id} product={p}/>
          ))}
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-12">
        <h2 className="font-heading text-3xl font-bold mb-8 text-maroon text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map(p => (
            <ProductCard key={p.id} product={p}/>
          ))}
        </div>
      </section>

      {/* FULLSCREEN IMAGE MODAL */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors bg-white/10 p-2 rounded-full"
          >
            <X size={28}/>
          </button>
          <img
            src={product.images[currentImage]}
            className="max-h-[90vh] max-w-full object-contain rounded-md"
            alt="Fullscreen view"
          />
        </div>
      )}

      {/* STICKY CART BAR */}
      {showCartBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-maroon/95 backdrop-blur-md text-gold p-4 flex justify-between items-center z-40 border-t border-gold/20 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] animate-slide-up">
          <span className="font-bold flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
            Added to Cart
          </span>
          <Link href="/cart">
            <Button className="bg-gold text-maroon-dark font-bold hover:bg-white transition-colors">
              View Cart & Checkout
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}