# BabySilk - Premium Kids Ethnic Wear

## Overview
BabySilk (babysilk.in) is a mobile-first ecommerce website for kids ethnic wear, targeting Indian mothers. It features a complete shopping experience with 50 products across 6 categories, cart with bundle pricing, UPI payment flow, order tracking, and an admin panel.

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + wouter (routing)
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL with Drizzle ORM
- **State**: TanStack React Query for server state, localStorage for cart

## Architecture
- `client/src/` - React frontend
  - `pages/` - All page components (Home, Shop, ProductDetail, Cart, Checkout, Payment, OrderSuccess, TrackOrder, Contact, Returns, PrivacyPolicy, Terms, Admin)
  - `components/` - Shared components (Header, Footer, StickyCartBar, WhatsAppButton, ProductCard)
  - `lib/` - Utilities (products.ts - 50 products data, cart.ts - cart logic with bundle pricing)
- `server/` - Express backend
  - `routes.ts` - API routes for orders, tracking, admin
  - `storage.ts` - Database operations via Drizzle
- `shared/schema.ts` - Shared types, DB schema, validation schemas

## Design System
- **Brand**: BabySilk (babysilk.in)
- **Colors**: Maroon (#7B1C1C), Gold (#C9A84C), Cream (#FDF6EC), Teal (#1A6B6B)
- **Fonts**: Cinzel (headings), Poppins (body)
- **Theme**: Premium ethnic boutique feel

## Key Features
- 50 products across 6 categories with reviews, size chart, image gallery
- Bundle pricing: 3 dresses for Rs.1550
- UPI payment flow (Google Pay, PhonePe, Paytm)
- Order tracking with status timeline
- Admin panel (password: BSKAdmin2024) at /admin
- Sticky cart bar + floating WhatsApp button
- Mobile-first responsive design

## Database Tables
- `products` - Product catalog (id serial PK)
- `orders` - Customer orders with status tracking (id serial PK)
- `order_items` - Individual items in each order (id serial PK)

## Pages (12 + admin)
1. `/` - Home
2. `/shop` - Shop with category filters and sorting
3. `/product/:slug` - Product detail with gallery, sizes, reviews
4. `/cart` - Cart with bundle pricing
5. `/checkout` - Checkout form
6. `/payment` - UPI payment flow
7. `/order-success` - Order confirmation
8. `/track-order` - Order tracking
9. `/contact` - Contact info
10. `/returns` - Returns & exchange policy
11. `/privacy-policy` - Privacy policy
12. `/terms` - Terms & conditions
13. `/admin` - Admin dashboard
