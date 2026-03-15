import type { Review } from "@shared/schema";

const reviewers = [
  { name: "Priya S.", location: "Chennai" },
  { name: "Meena R.", location: "Bangalore" },
  { name: "Divya K.", location: "Hyderabad" },
  { name: "Lakshmi T.", location: "Coimbatore" },
  { name: "Anitha M.", location: "Madurai" },
  { name: "Kavitha N.", location: "Kochi" },
  { name: "Sujatha P.", location: "Trichy" },
  { name: "Rekha V.", location: "Vijayawada" },
];

const reviewTexts = [
  "Absolutely beautiful dress! The fabric quality is amazing and my daughter looked like a princess. Delivery was fast too. Highly recommend!",
  "Perfect for the festival season. The silk quality is outstanding and the embroidery work is exquisite. Got so many compliments!",
  "Ordered for my daughter's birthday and it was perfect! The color is exactly as shown in the pictures. Very happy with the purchase.",
  "Such premium quality at this price point! The stitching is perfect and the fabric is soft on my baby's skin. Will definitely order again.",
  "My little one looked adorable in this outfit. The traditional design is so elegant. Great value for money!",
  "Received the dress on time and it exceeded my expectations. The detailing is beautiful. Already ordered two more!",
  "Wonderful ethnic wear for kids. The material is comfortable and the design is gorgeous. My daughter loves wearing it!",
  "Best kids ethnic wear I've found online. The quality is comparable to designer boutiques at a fraction of the price.",
];

function getReviews(productIndex: number): Review[] {
  const count = 3 + (productIndex % 2);
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    const rIdx = (productIndex + i) % reviewers.length;
    const tIdx = (productIndex + i) % reviewTexts.length;

    reviews.push({
      name: reviewers[rIdx].name,
      location: reviewers[rIdx].location,
      rating: 4 + (i % 2),
      date: `${(i + 1) * 2} weeks ago`,
      text: reviewTexts[tIdx],
      verified: true,
    });
  }

  return reviews;
}

const allSizes = [
  "0-3 Months","3-6 Months","6-9 Months","9-12 Months",
  "1-2 Years","2-3 Years","3-4 Years","4-5 Years",
  "5-6 Years","6-7 Years","7-8 Years","8-10 Years",
];

function getSizes(idx: number): string[] {
  const start = idx % 4;
  return allSizes.slice(start, start + 5 + (idx % 3));
}

function getImages(idx: number): string[] {
  const base = (idx % 20) + 1;
  const img2 = ((idx + 5) % 20) + 1;
  const img3 = ((idx + 10) % 20) + 1;

  return [
    `https://picsum.photos/seed/baby${base}/400/500`,
    `https://picsum.photos/seed/baby${img2}/400/500`,
    `https://picsum.photos/seed/baby${img3}/400/500`,
  ];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  mrpPrice: number;
  discountPrice: number;
  images: string[];
  sizes: string[];
  reviews: Review[];
  bundleEligible: boolean;
}

const productDefinitions = [
  { name: "Kanjivaram Silk Pattu Dress", category: "Pattu Dresses", mrp: 1299, discount: 849, desc: "Exquisite Kanjivaram silk pattu dress with gold zari border. Perfect for temple visits and traditional ceremonies." },
  { name: "Royal Red Pattu Pavadai", category: "Pattu Dresses", mrp: 1199, discount: 799, desc: "Classic red pattu pavadai with intricate gold embroidery. A timeless piece for your little one." },
  { name: "Pink Silk Pattu Frock", category: "Pattu Dresses", mrp: 999, discount: 699, desc: "Beautiful pink silk pattu frock with contrast border. Lightweight and comfortable for all-day wear." },
  { name: "Magenta Zari Pattu Dress", category: "Pattu Dresses", mrp: 1249, discount: 829, desc: "Stunning magenta pattu dress with rich zari work. Makes your child the star of every celebration." },
  { name: "Golden Pattu Silk Frock", category: "Pattu Dresses", mrp: 1149, discount: 779, desc: "Elegant golden pattu silk frock with traditional motifs. Comfortable and stylish for festive occasions." },
  { name: "Emerald Green Pattu Dress", category: "Pattu Dresses", mrp: 1099, discount: 749, desc: "Rich emerald green pattu dress with gold border. Perfect blend of tradition and modern style." },
];

export const ALL_PRODUCTS: ProductData[] = productDefinitions.map((p, idx) => {

  let images = getImages(idx);

  // Custom images for Kanjivaram Silk Pattu Dress
  if (p.name === "Kanjivaram Silk Pattu Dress") {
    images = [
      "/client/public/1.1.png",
      "/client/public/1.2.png",
      "/client/public/1.3.png",
      "/client/public/1.4.png",
      "/client/public/1.5.png"
    ];
  }

  return {
    id: idx + 1,
    name: p.name,
    slug: slugify(p.name),
    category: p.category,
    description: p.desc,
    mrpPrice: p.mrp,
    discountPrice: p.discount,
    images,
    sizes: getSizes(idx),
    reviews: getReviews(idx),
    bundleEligible: true,
  };

});

export function getProductBySlug(slug: string): ProductData | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): ProductData[] {
  if (category === "All") return ALL_PRODUCTS;
  return ALL_PRODUCTS.filter(p => p.category === category);
}

export function getTrendingProducts(): ProductData[] {
  return ALL_PRODUCTS.slice(0, 8);
}

export function getCategoryImage(category: string): string {
  const catProducts = ALL_PRODUCTS.filter(p => p.category === category);
  return catProducts.length > 0 ? catProducts[0].images[0] : "";
}
