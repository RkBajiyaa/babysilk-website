import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import ProductCard from "@/components/ProductCard";
import { ALL_PRODUCTS } from "@/lib/products";
// import { CATEGORIES } from "@shared/schema"; // Commented out for now
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("category") || "All";

  // We keep the state but we won't use it for filtering right now
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    // CURRENT LOGIC: Show everything regardless of category
    let products = [...ALL_PRODUCTS];

    /* // FUTURE LOGIC: Uncomment this to enable category filtering again
    products = selectedCategory === "All"
        ? [...ALL_PRODUCTS]
        : ALL_PRODUCTS.filter(p => p.category === selectedCategory);
    */

    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price-high":
        products.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "newest":
        products.sort((a, b) => b.id - a.id);
        break;
    }

    return products;
  }, [selectedCategory, sortBy]);

  // const categories = ["All", ...CATEGORIES]; // Commented out for now

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* BUNDLE OFFER BANNER */}
<div className="w-full bg-maroon text-gold py-3 px-4 text-center rounded-lg mb-6 shadow-md border border-maroon-dark">
  <p className="text-sm sm:text-base font-bold tracking-wide">
    🎉 Bundle Deal: Any 3 Dresses = ₹1550 | Save up to ₹1350
  </p>
</div>

      {/* HEADER + TRUST BAR */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon mb-1">
            Our Collection
          </h1>
          
          {/* IMPORTANT TRUST MESSAGES (Replaced product count) */}
          <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold text-teal uppercase tracking-tight mt-1">
            <span className="flex items-center gap-1 bg-teal/5 px-2 py-1 rounded"><Truck size={14}/> Free India Delivery</span>
            <span className="flex items-center gap-1 bg-teal/5 px-2 py-1 rounded"><ShieldCheck size={14}/> Premium Quality</span>
            <span className="flex items-center gap-1 bg-teal/5 px-2 py-1 rounded"><RefreshCw size={14}/> 7-Day Exchange</span>
          </div>
        </div>

        {/* SORT */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-white border-gold/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CATEGORY FILTER (Commented out for now) */}
      {/* <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-2 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-maroon text-white"
                  : "bg-white text-foreground/70 border border-gold/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div> 
      */}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            New products arriving soon!
          </p>
        </div>
      )}
    </div>
  );
}