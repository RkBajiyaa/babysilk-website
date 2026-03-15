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
X
} from "lucide-react";

import { getProductBySlug, ALL_PRODUCTS } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

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
((product.mrpPrice - product.discountPrice) /
product.mrpPrice) *
100
);

const stockLeft = (product.id % 5) + 4;
const viewers = (product.id % 16) + 18;

/* swipe */

const handleTouchStart = (e:any)=>{
setTouchStart(e.touches[0].clientX);
};

const handleTouchEnd = (e:any)=>{
const end = e.changedTouches[0].clientX;
const diff = touchStart - end;

if(diff > 50){
setCurrentImage((prev)=> (prev+1) % product.images.length);
}

if(diff < -50){
setCurrentImage((prev)=> prev === 0 ? product.images.length-1 : prev-1);
}
};

/* suggestions */

/* first try same category */
let similarProducts = ALL_PRODUCTS
.filter(p => p.category === product.category && p.id !== product.id)
.slice(0,4);

/* fallback if empty */
if(similarProducts.length === 0){
similarProducts = ALL_PRODUCTS
.filter(p => p.id !== product.id)
.slice(0,4);
}

/* recommended */
const recommendedProducts = ALL_PRODUCTS
.filter(p => p.id !== product.id)
.slice(4,8);

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

<div className="px-4 py-3">
<Link href="/shop">
<span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
<ChevronLeft size={16}/> Back to Shop
</span>
</Link>
</div>

{/* PRODUCT */}

<div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:px-4">

{/* IMAGES */}

<div>

<div
className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-zoom-in"
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
onClick={()=>setFullscreen(true)}
>

<img
src={product.images[currentImage]}
alt={product.name}
className="w-full h-full object-cover"
/>

{discount > 0 && (
<span className="absolute top-3 left-3 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-md">
{discount}% OFF
</span>
)}

</div>

{/* dots */}

<div className="flex justify-center gap-1 mt-2">

{product.images.map((_,i)=>(
<div
key={i}
className={`w-2 h-2 rounded-full ${
i===currentImage ? "bg-maroon":"bg-gray-300"
}`}
/>
))}

</div>

{/* thumbnails */}

<div className="flex gap-2 mt-3">

{product.images.map((img, idx) => (

<button
key={idx}
onClick={() => setCurrentImage(idx)}
className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
currentImage === idx ? "border-maroon" : "border-transparent"
}`}
>

<img src={img} className="w-full h-full object-cover"/>

</button>

))}

</div>

</div>

{/* DETAILS */}

<div className="px-4 lg:px-0 pb-8">

<h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
{product.name}
</h1>

{/* rating */}

<div className="flex items-center gap-2 mb-3">

{[1,2,3,4,5].map(i => (
<Star
key={i}
size={16}
className={i <= Math.round(avgRating)
? "fill-gold text-gold"
: "text-gold/30"}
/>
))}

<span className="text-sm text-muted-foreground">
{avgRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
</span>

</div>

{/* price */}

<div className="flex items-baseline gap-3 mb-2">

<span className="text-3xl font-bold text-maroon">
₹{product.discountPrice}
</span>

<span className="text-base line-through text-muted-foreground">
₹{product.mrpPrice}
</span>

<span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">
Save ₹{product.mrpPrice - product.discountPrice}
</span>

</div>

{/* urgency */}

<div className="text-sm mb-4 space-y-1">
<p className="text-maroon font-semibold">
🔥 Only {stockLeft} left in stock
</p>
<p className="text-muted-foreground">
👀 {viewers} people are viewing this
</p>
</div>

{/* delivery */}

<div className="space-y-2 text-sm mb-6">

<div className="flex gap-2">
<Truck size={16}/> Free Delivery across India
</div>

<div className="flex gap-2">
<RefreshCw size={16}/> 7 Day Easy Exchange
</div>

<div className="flex gap-2">
<CreditCard size={16}/> Secure UPI Payment
</div>

</div>

{/* SIZE */}

<div className="mb-6">

<h3 className="text-sm font-semibold mb-2">
Select Size
</h3>

{sizeError && (
<p className="text-xs text-red-600 mb-2">
Please select a size
</p>
)}

<div className="flex gap-2 flex-wrap">

{product.sizes.map(size => (

<button
key={size}
onClick={()=>{
setSelectedSize(size);
setSizeError(false);
}}
className={`px-4 py-2 rounded-md border text-sm font-medium ${
selectedSize===size
? "bg-maroon text-white border-maroon"
: "bg-white border-gold/20"
}`}
>
{size}
</button>

))}

</div>

</div>

{/* quantity */}

<div className="flex items-center gap-4 mb-6">

<span className="text-sm font-semibold">
Quantity
</span>

<div className="flex items-center border border-gold/20 rounded-md">

<button
onClick={()=>setQuantity(Math.max(1,quantity-1))}
className="w-10 h-10 flex items-center justify-center"
>
<Minus size={16}/>
</button>

<span className="w-10 text-center font-semibold">
{quantity}
</span>

<button
onClick={()=>setQuantity(Math.min(10,quantity+1))}
className="w-10 h-10 flex items-center justify-center"
>
<Plus size={16}/>
</button>

</div>

</div>

<Button
onClick={handleAddToCart}
className="w-full bg-maroon text-gold font-semibold text-base py-6"
>
Add to Cart
</Button>

</div>

</div>

{/* REVIEWS */}

<section className="max-w-7xl mx-auto px-4 py-12">

<h2 className="font-heading text-2xl font-bold mb-6">
Customer Reviews
</h2>

<div className="space-y-4">

{(product.reviews || []).slice(0,6).map((review, idx) => (

<div
key={idx}
className="bg-white border border-gold/10 rounded-lg p-4"
>

<div className="flex items-center gap-2 mb-2">

<span className="font-semibold">
{review.name}
</span>

<span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
Verified Purchase
</span>

</div>

<div className="flex gap-1 mb-2">

{[1,2,3,4,5].map(i => (
<Star
key={i}
size={14}
className={
i <= review.rating
? "fill-gold text-gold"
: "text-gold/20"
}
/>
))}

</div>

<p className="text-sm text-muted-foreground">
{review.text}
</p>

<button className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
<ThumbsUp size={12}/> Helpful
</button>

</div>

))}

</div>

</section>

{/* SIMILAR */}

<section className="max-w-7xl mx-auto px-4 py-10">

<h2 className="font-heading text-2xl font-bold mb-6">
Similar Products
</h2>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

{similarProducts.map(p => (
<ProductCard key={p.id} product={p}/>
))}

</div>

</section>

{/* RECOMMENDED */}

<section className="max-w-7xl mx-auto px-4 py-10">

<h2 className="font-heading text-2xl font-bold mb-6">
You May Also Like
</h2>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

{recommendedProducts.map(p => (
<ProductCard key={p.id} product={p}/>
))}

</div>

</section>

{/* FULLSCREEN */}

{fullscreen && (

<div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

<button
onClick={()=>setFullscreen(false)}
className="absolute top-4 right-4 text-white"
>
<X size={30}/>
</button>

<img
src={product.images[currentImage]}
className="max-h-[90vh] max-w-[95vw] object-contain"
/>

</div>

)}

{/* STICKY CART */}

{showCartBar && (

<div className="fixed bottom-0 left-0 right-0 bg-maroon text-white p-4 flex justify-between items-center z-40">

<span>✔ Added to Cart</span>

<Link href="/cart">
<Button className="bg-gold text-maroon font-semibold">
View Cart
</Button>
</Link>

</div>

)}

</div>

);
}