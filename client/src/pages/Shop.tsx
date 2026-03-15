import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import ProductCard from "@/components/ProductCard";
import { ALL_PRODUCTS } from "@/lib/products";
import { CATEGORIES } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    let products =
      selectedCategory === "All"
        ? [...ALL_PRODUCTS]
        : ALL_PRODUCTS.filter(p => p.category === selectedCategory);

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

  const categories = ["All", ...CATEGORIES];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* BUNDLE OFFER */}
      <div className="bg-gold/20 border border-gold/30 rounded-lg p-4 text-center mb-6">

        <p className="text-sm font-semibold text-maroon">
          🎉 Bundle Offer
        </p>

        <p className="text-lg font-bold text-maroon">
          Buy Any 3 Dresses for ₹1550
        </p>

        <p className="text-xs text-muted-foreground">
          Mix & Match from Any Category
        </p>

      </div>


      {/* HEADER */}
      <div className="mb-6">

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon mb-1">
          Our Collection
        </h1>

        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} products available
        </p>

      </div>


      {/* FILTER + SORT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        {/* CATEGORY FILTER */}
        <div className="overflow-x-auto scrollbar-hide">

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


        {/* SORT */}
        <Select value={sortBy} onValueChange={setSortBy}>

          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="default">
              Default
            </SelectItem>

            <SelectItem value="price-low">
              Price: Low to High
            </SelectItem>

            <SelectItem value="price-high">
              Price: High to Low
            </SelectItem>

            <SelectItem value="newest">
              Newest First
            </SelectItem>
          </SelectContent>

        </Select>

      </div>


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
            No products found in this category.
          </p>

        </div>

      )}

    </div>
  );
}