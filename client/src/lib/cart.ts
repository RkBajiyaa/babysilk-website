import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  image: string;
  size: string;
  quantity: number;
  mrpPrice: number;
  discountPrice: number;
  bundleEligible: boolean;
}

const CART_KEY = "babysilk_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function getCartItems(): CartItem[] {
  return loadCart();
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1): CartItem[] {
  const cart = loadCart();
  const existing = cart.find(c => c.productId === item.productId && c.size === item.size);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, 10);
  } else {
    cart.push({ ...item, quantity: qty });
  }
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: number, size: string, quantity: number): CartItem[] {
  const cart = loadCart();
  const item = cart.find(c => c.productId === productId && c.size === size);
  if (item) {
    if (quantity <= 0) {
      const filtered = cart.filter(c => !(c.productId === productId && c.size === size));
      saveCart(filtered);
      return filtered;
    }
    item.quantity = Math.min(quantity, 10);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number, size: string): CartItem[] {
  const cart = loadCart().filter(c => !(c.productId === productId && c.size === size));
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function calculateBundlePrice(items: CartItem[]): {
  subtotal: number;
  bundleDiscount: number;
  total: number;
  bundlesApplied: number;
  remainingItems: number;
  savings: number;
} {
  const eligible = items.filter(i => i.bundleEligible);
  const nonEligible = items.filter(i => !i.bundleEligible);

  const eligibleCount = eligible.reduce((sum, i) => sum + i.quantity, 0);
  const bundles = Math.floor(eligibleCount / 3);
  const remaining = eligibleCount % 3;

  const eligibleSorted = eligible.flatMap(i =>
    Array(i.quantity).fill(i.discountPrice)
  ).sort((a: number, b: number) => b - a);

  const bundleTotal = bundles * 1550;
  const remainingTotal = eligibleSorted.slice(bundles * 3).reduce((s: number, p: number) => s + p, 0);
  const nonEligibleTotal = nonEligible.reduce((s, i) => s + i.discountPrice * i.quantity, 0);

  const subtotal = items.reduce((s, i) => s + i.discountPrice * i.quantity, 0);
  const total = bundleTotal + remainingTotal + nonEligibleTotal;
  const bundleDiscount = subtotal - total;

  return {
    subtotal,
    bundleDiscount,
    total,
    bundlesApplied: bundles,
    remainingItems: remaining,
    savings: items.reduce((s, i) => s + (i.mrpPrice - i.discountPrice) * i.quantity, 0) + bundleDiscount,
  };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const refresh = useCallback(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [refresh]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const pricing = calculateBundlePrice(items);

  return { items, totalItems, pricing, refresh };
}
