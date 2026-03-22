import type { Review } from "@shared/schema";
import { productImagesMap } from "./productImages"; 
import { categoryImagesMap } from "./categoryImages"; // 1. Added this import

// ... (keep reviewers, reviewTexts, getReviews, getSizes, getFallbackImages, slugify as they are)

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

function getFallbackImages(idx: number): string[] {
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

const productDefinitions: { name: string; category: string; mrp: number; discount: number; desc: string }[] = [
  { name: "Kanjivaram Silk Pattu Dress", category: "Pattu Dresses", mrp: 1299, discount: 849, desc: "Exquisite Kanjivaram silk pattu dress with gold zari border. Perfect for temple visits and traditional ceremonies." },
  { name: "Purple Kanchipuram Pattu-model", category: "Pattu Dresses", mrp: 1199, discount: 799, desc: "Regal purple Kanchipuram pattu with traditional motifs. Premium silk quality your child deserves." },
  { name: "Orange Brocade Pattu Dress-model", category: "Pattu Dresses", mrp: 999, discount: 679, desc: "Vibrant orange brocade pattu dress with silk finish. Bright and beautiful for poojas and events." },

  { name: "Royal Red Pattu Pavadai", category: "Pattu Dresses", mrp: 1199, discount: 799, desc: "Classic red pattu pavadai with intricate gold embroidery. A timeless piece for your little one." },
  { name: "Maroon Silk Pattu Pavadai-model", category: "Pattu Dresses", mrp: 1299, discount: 849, desc: "Deep maroon silk pavadai with golden thread work. A regal outfit for special moments." },

  { name: "Pink Silk Pattu Frock", category: "Pattu Dresses", mrp: 999, discount: 699, desc: "Beautiful pink silk pattu frock with contrast border. Lightweight and comfortable for all-day wear." },
  { name: "Kanjivaram Silk Pattu Dress-model", category: "Pattu Dresses", mrp: 1299, discount: 849, desc: "Exquisite Kanjivaram silk pattu dress with gold zari border. Perfect for temple visits and traditional ceremonies." },
  { name: "Emerald Green Pattu Dress-model", category: "Pattu Dresses", mrp: 1099, discount: 749, desc: "Rich emerald green pattu dress with gold border. Perfect blend of tradition and modern style." },

  { name: "Magenta Zari Pattu Dress", category: "Pattu Dresses", mrp: 1249, discount: 829, desc: "Stunning magenta pattu dress with rich zari work. Makes your child the star of every celebration." },
  { name: "Golden Pattu Silk Frock", category: "Pattu Dresses", mrp: 1149, discount: 779, desc: "Elegant golden pattu silk frock with traditional motifs. Comfortable and stylish for festive occasions." },
  { name: "Golden Pattu Silk Frock-model", category: "Pattu Dresses", mrp: 1149, discount: 779, desc: "Elegant golden pattu silk frock with traditional motifs. Comfortable and stylish for festive occasions." },

  { name: "Emerald Green Pattu Dress", category: "Pattu Dresses", mrp: 1099, discount: 749, desc: "Rich emerald green pattu dress with gold border. Perfect blend of tradition and modern style." },
  { name: "Maroon Silk Pattu Pavadai", category: "Pattu Dresses", mrp: 1299, discount: 849, desc: "Deep maroon silk pavadai with golden thread work. A regal outfit for special moments." },
  { name: "Orange Brocade Pattu Dress", category: "Pattu Dresses", mrp: 999, discount: 679, desc: "Vibrant orange brocade pattu dress with silk finish. Bright and beautiful for poojas and events." },
  { name: "Royal Red Pattu Pavadai-model", category: "Pattu Dresses", mrp: 1199, discount: 799, desc: "Classic red pattu pavadai with intricate gold embroidery. A timeless piece for your little one." },
  { name: "Pink Silk Pattu Frock-model", category: "Pattu Dresses", mrp: 999, discount: 699, desc: "Beautiful pink silk pattu frock with contrast border. Lightweight and comfortable for all-day wear." },
  
 
  { name: "Purple Kanchipuram Pattu", category: "Pattu Dresses", mrp: 1199, discount: 799, desc: "Regal purple Kanchipuram pattu with traditional motifs. Premium silk quality your child deserves." },
  
//same dreeses shown again 
{ name: "Magenta Zari Pattu Dress-model", category: "Pattu Dresses", mrp: 1249, discount: 829, desc: "Stunning magenta pattu dress with rich zari work. Makes your child the star of every celebration." },

  // { name: "Peacock Blue Pattu Frock", category: "Pattu Dresses", mrp: 1149, discount: 769, desc: "Mesmerizing peacock blue pattu frock with contrast border. Unique and eye-catching design." },
  // { name: "Cream & Gold Pattu Dress", category: "Pattu Dresses", mrp: 1099, discount: 729, desc: "Elegant cream and gold pattu dress with delicate zari work. Soft and graceful for celebrations." },
  // { name: "Ruby Red Silk Pattu", category: "Pattu Dresses", mrp: 1249, discount: 839, desc: "Premium ruby red silk pattu with exclusive border design. Handpicked silk for ultimate comfort." },
  // { name: "Diwali Special Gold Kurta Set", category: "Festive Wear", mrp: 1199, discount: 799, desc: "Stunning gold kurta set perfect for Diwali celebrations. Complete with matching dupatta and churidar." },
  // { name: "Navratri Green Chaniya Choli", category: "Festive Wear", mrp: 1299, discount: 849, desc: "Vibrant green chaniya choli for Navratri dandiya nights. Mirror work and embroidery detailing." },
  // { name: "Pongal Special Silk Dress", category: "Festive Wear", mrp: 999, discount: 699, desc: "Traditional silk dress designed for Pongal festivities. Bright colors and comfortable fit." },
  // { name: "Onam White & Gold Set", category: "Festive Wear", mrp: 1149, discount: 779, desc: "Classic white and gold Kerala-style set for Onam celebrations. Pure elegance for your little one." },
  // { name: "Rakhi Special Pink Anarkali", category: "Festive Wear", mrp: 1099, discount: 749, desc: "Beautiful pink anarkali for Rakhi celebrations. Flowing silhouette with delicate embroidery." },
  // { name: "Ganesh Chaturthi Yellow Dress", category: "Festive Wear", mrp: 999, discount: 679, desc: "Auspicious yellow dress for Ganesh Chaturthi. Traditional design with modern comfort." },
  // { name: "Makar Sankranti Orange Pavadai", category: "Festive Wear", mrp: 1199, discount: 799, desc: "Bright orange pavadai perfect for Sankranti celebrations. Silk fabric with gold border." },
  // { name: "Ugadi Special Purple Set", category: "Festive Wear", mrp: 1099, discount: 749, desc: "Elegant purple ethnic set for Ugadi celebrations. Premium fabric with beautiful embellishments." },
  // { name: "Holi Festive Rainbow Lehenga", category: "Festive Wear", mrp: 1249, discount: 829, desc: "Colorful rainbow lehenga perfect for Holi celebrations. Vibrant and fun for little fashionistas." },
  // { name: "Vishu Golden Kasavu Set", category: "Festive Wear", mrp: 1149, discount: 779, desc: "Traditional golden kasavu set for Vishu celebrations. Kerala-inspired design with silk finish." },
  // { name: "Royal Blue Lehenga Choli", category: "Lehenga Sets", mrp: 1299, discount: 849, desc: "Magnificent royal blue lehenga choli with gold work. Perfect for weddings and grand celebrations." },
  // { name: "Pink Floral Lehenga Set", category: "Lehenga Sets", mrp: 1199, discount: 799, desc: "Charming pink floral lehenga with matching choli and dupatta. Delicate and feminine design." },
  // { name: "Red Bridal Mini Lehenga", category: "Lehenga Sets", mrp: 1249, discount: 829, desc: "Adorable red bridal-style mini lehenga for little girls. Rich embroidery and premium fabric." },
  // { name: "Turquoise Silk Lehenga", category: "Lehenga Sets", mrp: 1149, discount: 779, desc: "Stunning turquoise silk lehenga with intricate border. A standout piece for celebrations." },
  // { name: "Lavender Net Lehenga Set", category: "Lehenga Sets", mrp: 999, discount: 699, desc: "Dreamy lavender net lehenga with sequin work. Light and airy for comfortable wearing." },
  // { name: "Mustard Yellow Lehenga", category: "Lehenga Sets", mrp: 1099, discount: 749, desc: "Beautiful mustard yellow lehenga with contrast dupatta. Vibrant and cheerful festive wear." },
  // { name: "Wine Velvet Lehenga Set", category: "Lehenga Sets", mrp: 1299, discount: 849, desc: "Luxurious wine velvet lehenga for winter celebrations. Rich texture and royal appearance." },
  // { name: "Peach Brocade Lehenga", category: "Lehenga Sets", mrp: 1149, discount: 779, desc: "Elegant peach brocade lehenga with self-design pattern. Subtle yet stunning for events." },
  // { name: "Classic Red Cotton Frock", category: "Traditional Frocks", mrp: 999, discount: 679, desc: "Classic red cotton frock with traditional print. Comfortable for everyday ethnic wear." },
  // { name: "Green Silk Traditional Frock", category: "Traditional Frocks", mrp: 1099, discount: 749, desc: "Beautiful green silk frock with traditional motifs. Perfect blend of comfort and style." },
  // { name: "Blue Printed Ethnic Frock", category: "Traditional Frocks", mrp: 949, discount: 649, desc: "Charming blue printed ethnic frock with lace trim. Easy to wear and maintain." },
  // { name: "Yellow Chanderi Frock", category: "Traditional Frocks", mrp: 1049, discount: 719, desc: "Lovely yellow chanderi frock with gold details. Lightweight fabric for all-day comfort." },
  // { name: "Coral Embroidered Frock", category: "Traditional Frocks", mrp: 999, discount: 689, desc: "Pretty coral frock with delicate embroidery work. A beautiful addition to your child's wardrobe." },
  // { name: "Mint Green Angrakha Frock", category: "Traditional Frocks", mrp: 1099, discount: 749, desc: "Trendy mint green angrakha-style frock. Fusion design that works for traditional and casual wear." },
  // { name: "Burgundy Silk Frock", category: "Traditional Frocks", mrp: 1149, discount: 769, desc: "Rich burgundy silk frock with contrast piping. Elegant and easy to pair with accessories." },
  // { name: "Teal Bandhani Print Frock", category: "Traditional Frocks", mrp: 999, discount: 679, desc: "Authentic teal bandhani print frock from Rajasthan. Vibrant traditional art on comfortable cotton." },
  // { name: "Sparkle Gold Party Dress", category: "Party Wear", mrp: 1299, discount: 849, desc: "Glamorous gold party dress with sparkle finish. Make your little one shine at every party." },
  // { name: "Silver Sequin Gown", category: "Party Wear", mrp: 1249, discount: 829, desc: "Dazzling silver sequin gown for special occasions. Princess-worthy dress for birthday parties." },
  // { name: "Rose Pink Party Frock", category: "Party Wear", mrp: 1099, discount: 749, desc: "Beautiful rose pink party frock with tulle layers. Fairy-tale dress for little princesses." },
  // { name: "Navy Blue Velvet Dress", category: "Party Wear", mrp: 1199, discount: 799, desc: "Elegant navy blue velvet dress for winter parties. Luxurious fabric with beautiful drape." },
  // { name: "Champagne Tulle Gown", category: "Party Wear", mrp: 1149, discount: 779, desc: "Ethereal champagne tulle gown with pearl details. Perfect for flower girl duties and events." },
  // { name: "Black & Gold Party Dress", category: "Party Wear", mrp: 1299, discount: 849, desc: "Sophisticated black and gold party dress. Bold and beautiful for confident little fashionistas." },
  // { name: "Spring Blossom Silk Dress", category: "New Arrivals", mrp: 1199, discount: 799, desc: "Fresh spring collection silk dress with blossom prints. New design just launched this season." },
  // { name: "Summer Breeze Cotton Set", category: "New Arrivals", mrp: 999, discount: 679, desc: "Light and airy cotton ethnic set for summer. Breathable fabric in trending pastel shades." },
  // { name: "Monsoon Magic Silk Frock", category: "New Arrivals", mrp: 1099, discount: 749, desc: "New monsoon collection silk frock with peacock motifs. Inspired by the beauty of Indian rains." },
  // { name: "Festive Fusion Crop Top Set", category: "New Arrivals", mrp: 1149, discount: 779, desc: "Trendy crop top lehenga set blending modern and traditional. Latest addition to our collection." },
  // { name: "Heritage Weave Pavadai", category: "New Arrivals", mrp: 1249, discount: 829, desc: "Newly launched heritage weave pavadai with handloom fabric. Celebrating Indian textile traditions." },
  // { name: "Blossom Garden Anarkali", category: "New Arrivals", mrp: 1199, discount: 799, desc: "Brand new floral anarkali with garden-inspired prints. Fresh design for the new season." },
];

export const ALL_PRODUCTS: ProductData[] = productDefinitions.map((p, idx) => {
  const images = productImagesMap[p.name] || getFallbackImages(idx);

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

// 2. Updated this function to check our new map first
export function getCategoryImage(category: string): string {
  // Try to get the dedicated category image first
  if (categoryImagesMap[category]) {
    return categoryImagesMap[category];
  }

  // Fallback: If no dedicated image, use the first image of the first product in that category
  const catProducts = ALL_PRODUCTS.filter(p => p.category === category);
  return catProducts.length > 0 ? catProducts[0].images[0] : "";
} 