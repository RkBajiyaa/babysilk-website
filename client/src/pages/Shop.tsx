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
    let products = selectedCategory === "All"
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
    <div className="max-w-7xl mx-auto px-4 py-6" data-testid="page-shop">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon mb-1" data-testid="text-shop-title">
          Our Collection
        </h1>
        <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {filteredProducts.length} products
        </p>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1 overflow-x-auto scrollbar-hide" data-testid="filter-categories">
          <div className="flex gap-2 pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-maroon text-cream-DEFAULT"
                    : "bg-white text-foreground/70 border border-gold/20"
                }`}
                data-testid={`button-filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-white" data-testid="select-sort">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" data-testid="grid-products">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16" data-testid="text-no-products">
          <p className="text-muted-foreground text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
