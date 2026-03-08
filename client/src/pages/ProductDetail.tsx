import { useParams, Link } from "wouter";
import { useState } from "react";
import { Star, Truck, RefreshCw, ChevronLeft, Minus, Plus, Check, ThumbsUp } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { SIZE_CHART } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { toast } = useToast();

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
        <Link href="/shop">
          <Button className="mt-4 bg-maroon text-cream-DEFAULT">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const avgRating = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  const discount = Math.round(((product.mrpPrice - product.discountPrice) / product.mrpPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    setSizeError(false);
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size: selectedSize,
      mrpPrice: product.mrpPrice,
      discountPrice: product.discountPrice,
      bundleEligible: product.bundleEligible,
    }, quantity);
    toast({ title: "Added to cart!", description: `${product.name} - ${selectedSize} x ${quantity}` });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any)._touchStartX = touch.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = (e.currentTarget as any)._touchStartX;
    if (!startX) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImage < product.images.length - 1) {
        setCurrentImage(currentImage + 1);
      } else if (diff < 0 && currentImage > 0) {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto" data-testid="page-product-detail">
      <div className="px-4 py-3">
        <Link href="/shop">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground" data-testid="link-back-shop">
            <ChevronLeft size={16} /> Back to Shop
          </span>
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:px-4">
        <div className="relative" data-testid="product-gallery">
          <div
            className="relative aspect-[3/4] overflow-hidden lg:rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              data-testid="img-product-main"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-maroon text-cream-DEFAULT text-xs font-bold px-3 py-1.5 rounded-md">
                {discount}% OFF
              </span>
            )}
          </div>
          <div className="flex justify-center gap-2 py-3" data-testid="product-gallery-dots">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  currentImage === idx ? "border-maroon" : "border-transparent"
                }`}
                data-testid={`button-gallery-thumb-${idx}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-0 pb-8">
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2" data-testid="text-product-title">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3" data-testid="product-rating">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} className={i <= Math.round(avgRating) ? "fill-gold text-gold" : "text-gold/30"} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-3" data-testid="product-price">
            <span className="text-2xl sm:text-3xl font-bold text-maroon">
              Rs.{product.discountPrice}
            </span>
            <span className="text-base text-muted-foreground line-through">
              Rs.{product.mrpPrice}
            </span>
            <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
              Save Rs.{product.mrpPrice - product.discountPrice}
            </span>
          </div>

          <div className="inline-block bg-gold/20 border border-gold/30 rounded-md px-3 py-1.5 mb-4">
            <span className="text-xs font-semibold text-gold-dark">Limited Time Offer</span>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Truck size={16} className="text-teal" />
              <span>Delivers in 7-9 Days | All India Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <RefreshCw size={16} className="text-teal" />
              <span>7 Day Easy Exchange</span>
            </div>
          </div>

          <div className="mb-6" data-testid="size-selector">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Select Size</h3>
              <button
                onClick={() => setSizeChartOpen(!sizeChartOpen)}
                className="text-xs font-medium text-teal underline"
                data-testid="button-size-chart-toggle"
              >
                Size Chart
              </button>
            </div>
            {sizeError && (
              <p className="text-xs text-red-600 mb-2" data-testid="text-size-error">Please select a size</p>
            )}
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium border transition-colors ${
                    selectedSize === size
                      ? "bg-maroon text-cream-DEFAULT border-maroon"
                      : "bg-white text-foreground border-gold/20"
                  }`}
                  data-testid={`button-size-${size.replace(/\s/g, '-')}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {sizeChartOpen && (
            <div className="mb-6 bg-cream rounded-lg p-4 border border-gold/10 animate-fade-in" data-testid="size-chart-table">
              <h4 className="font-heading text-sm font-semibold mb-3">Size Chart</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2 px-3 font-semibold text-foreground/80">Size</th>
                      <th className="py-2 px-3 font-semibold text-foreground/80">Age</th>
                      <th className="py-2 px-3 font-semibold text-foreground/80">Chest (cm)</th>
                      <th className="py-2 px-3 font-semibold text-foreground/80">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART.map((row, idx) => (
                      <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-cream"}>
                        <td className="py-2 px-3 font-medium">{row.label}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.age}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.chest}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Size up if your child is between sizes.</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6" data-testid="quantity-selector">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center border border-gold/20 rounded-md overflow-visible">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground/60"
                data-testid="button-qty-minus"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold border-x border-gold/20" data-testid="text-quantity">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground/60"
                data-testid="button-qty-plus"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-maroon text-gold font-semibold text-base py-6"
            size="lg"
            data-testid="button-add-to-cart"
          >
            Add to Cart
          </Button>

          <div className="mt-8" data-testid="product-tabs">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 bg-cream">
                <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
                <TabsTrigger value="sizechart" data-testid="tab-sizechart">Size Chart</TabsTrigger>
                <TabsTrigger value="returns" data-testid="tab-returns">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="sizechart" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gold/10">
                        <th className="py-2 px-3 font-semibold">Size</th>
                        <th className="py-2 px-3 font-semibold">Age</th>
                        <th className="py-2 px-3 font-semibold">Chest (cm)</th>
                        <th className="py-2 px-3 font-semibold">Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((row, idx) => (
                        <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-cream"}>
                          <td className="py-2 px-3 font-medium">{row.label}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.age}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.chest}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Size up if your child is between sizes.</p>
              </TabsContent>
              <TabsContent value="returns" className="mt-4">
                <div className="text-sm text-foreground/80 space-y-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <p>We offer 7-day easy exchange on all products.</p>
                  <p>Item must be unused and in original packaging.</p>
                  <p>Contact us on WhatsApp to initiate exchange.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-10" data-testid="product-reviews">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Customer Reviews ({product.reviews.length})
            </h3>
            <div className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gold/10" data-testid={`card-review-${idx}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                            <Check size={10} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.location}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} className={i <= review.rating ? "fill-gold text-gold" : "text-gold/20"} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {review.text}
                  </p>
                  <button className="mt-2 text-xs text-muted-foreground flex items-center gap-1" data-testid={`button-helpful-${idx}`}>
                    <ThumbsUp size={12} /> Helpful?
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
