export const STORE_NAME =
  process.env.NEXT_PUBLIC_STORE_NAME || "Maison Meridian";

export const STORE_TAGLINE =
  process.env.NEXT_PUBLIC_STORE_TAGLINE ||
  "Modern essentials, curated with restraint.";

export const STORE_CURRENCY =
  process.env.NEXT_PUBLIC_STORE_CURRENCY || "PKR";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" }
];

export const HERO_STATS = [
  { value: "48h", label: "Fast dispatch on stocked items" },
  { value: "100%", label: "Admin-managed catalog and payments" },
  { value: "24/7", label: "WhatsApp-ready customer support" }
];

export const TRUST_PILLARS = [
  {
    title: "Curated Selection",
    copy: "Every collection is presented with fewer distractions and stronger product storytelling."
  },
  {
    title: "Clear Payments",
    copy: "Payment methods are managed centrally so your checkout stays current without frontend edits."
  },
  {
    title: "Order Confidence",
    copy: "Customers receive an order ID instantly, then continue the conversation on WhatsApp."
  }
];

export const SERVICE_PROMISES = [
  {
    title: "Elevated Presentation",
    copy: "A luxury-inspired storefront without overdesigned clutter."
  },
  {
    title: "Dynamic Catalog",
    copy: "Categories and products update from the backend automatically."
  },
  {
    title: "Trust-Centered Checkout",
    copy: "Payment guidance and order confirmation are clear on mobile and desktop."
  }
];

export const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80";

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80";

export const ORDER_STATUS_LABELS = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed"
};

