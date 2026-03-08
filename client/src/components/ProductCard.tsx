import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
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
  const avgRating = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  const discount = Math.round(((product.mrpPrice - product.discountPrice) / product.mrpPrice) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${defaultSize})`,
    });
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div
        className="group cursor-pointer bg-white rounded-lg overflow-visible border border-gold/10 transition-all duration-300"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            data-testid={`img-product-${product.id}`}
          />
          {discount > 0 && (
            <span
              className="absolute top-2 left-2 bg-maroon text-cream-DEFAULT text-xs font-semibold px-2 py-1 rounded-md"
              data-testid={`badge-discount-${product.id}`}
            >
              {discount}% OFF
            </span>
          )}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-2 right-2 bg-maroon text-gold p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            data-testid={`button-quick-add-${product.id}`}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        <div className="p-3">
          <h3
            className="font-medium text-sm text-foreground line-clamp-2 leading-tight mb-1.5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 mb-1.5" data-testid={`rating-product-${product.id}`}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={12}
                className={i <= Math.round(avgRating) ? "fill-gold text-gold" : "text-gold/30"}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews.length})</span>
          </div>
          <div className="flex items-center gap-2" data-testid={`price-product-${product.id}`}>
            <span className="text-base font-bold text-maroon">
              Rs.{product.discountPrice}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              Rs.{product.mrpPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
