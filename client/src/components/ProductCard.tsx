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

  const handleQuickAdd = (e: React.MouseEvent) => {

    e.preventDefault();
    e.stopPropagation();

    const defaultSize =
      product.sizes[Math.floor(product.sizes.length / 2)];

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
        className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gold/10 shadow-sm hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300"
      >

        {/* IMAGE */}

        <div className="relative aspect-[4/5] overflow-hidden">

          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* DISCOUNT BADGE */}

          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-maroon text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
              {discount}% OFF
            </span>
          )}

          {/* QUICK ADD */}

          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 bg-maroon text-gold p-3 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>

        </div>


        {/* CONTENT */}

        <div className="p-3">

          {/* NAME */}

          <h3
            className="font-medium text-sm text-foreground line-clamp-2 leading-tight mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {product.name}
          </h3>


          {/* RATING */}

          <div className="flex items-center gap-0.5 mb-1.5">

            {[1,2,3,4,5].map(i => (
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

            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviews.length})
            </span>

          </div>


          {/* PRICE */}

          <div className="flex items-center gap-2">

            <span className="text-base font-bold text-maroon">
              ₹{product.discountPrice}
            </span>

            <span className="text-xs text-muted-foreground line-through">
              ₹{product.mrpPrice}
            </span>

          </div>


          {/* SAVINGS */}

          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">

            <Tag size={12} />

            <span>
              Save ₹{savings}
            </span>

          </div>


          {/* URGENCY */}

          <p className="text-xs text-maroon font-medium mt-1">
            Only few left
          </p>


          {/* BUNDLE */}

          {product.bundleEligible && (
            <span className="inline-block mt-2 text-[10px] bg-gold/20 text-gold-dark px-2 py-0.5 rounded">
              Bundle Eligible
            </span>
          )}

        </div>

      </div>

    </Link>

  );

}