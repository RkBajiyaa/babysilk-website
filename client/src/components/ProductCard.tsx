import { Link } from "wouter";
import { Star, ShoppingCart, Tag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    images: string[];
    mrpPrice: number;
    discountPrice: number;
    reviews: { rating: number }[];
    sizes: string[];
    bundleEligible: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const avgRating =
    product.reviews.reduce((s, r) => s + r.rating, 0) /
    product.reviews.length;

  const discount = Math.round(
    ((product.mrpPrice - product.discountPrice) / product.mrpPrice) * 100
  );

  const savings = product.mrpPrice - product.discountPrice;
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Picks the middle size as default for quick add
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size: defaultSize,
      mrpPrice: product.mrpPrice,
      discountPrice: product.discountPrice,
      bundleEligible: product.bundleEligible,
      quantity: 1, // Explicitly pass quantity
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (Size: ${defaultSize})`,
    });
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gold/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-DEFAULT shrink-0">
          
          {/* PRIMARY IMAGE */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
              hasMultipleImages ? 'group-hover:opacity-0' : 'group-hover:scale-110'
            }`}
            loading="lazy"
          />

          {/* SECONDARY IMAGE (Fades in on hover) */}
          {hasMultipleImages && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-110"
              loading="lazy"
            />
          )}

          {/* DISCOUNT BADGE */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-maroon text-gold text-xs font-bold px-2.5 py-1 rounded-md shadow-md tracking-wide z-10">
              {discount}% OFF
            </span>
          )}

          {/* QUICK ADD BUTTON */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 bg-white text-maroon hover:bg-maroon hover:text-gold p-3 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10 border border-gold/10"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          
          <div>
            {/* NAME */}
            <h3
              className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-tight mb-1.5 group-hover:text-maroon transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {product.name}
            </h3>

            {/* RATING */}
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i <= Math.round(avgRating)
                      ? "fill-gold text-gold"
                      : "text-gold/30"
                  }
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1 font-medium">
                ({product.reviews.length})
              </span>
            </div>
          </div>

          <div>
            {/* PRICE */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base sm:text-lg font-bold text-maroon">
                ₹{product.discountPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* SAVINGS */}
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium mb-1.5">
              <Tag size={12} />
              <span>Save ₹{savings.toLocaleString("en-IN")}</span>
            </div>

            {/* URGENCY & BUNDLE */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold/10">
              <p className="text-[10px] sm:text-xs text-maroon font-semibold">
                Only few left
              </p>
              
              {product.bundleEligible && (
                <span className="text-[10px] sm:text-xs font-bold bg-gold/20 text-maroon-dark px-2 py-1 rounded-md">
                  ✨ 3 for ₹1550
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}