import {
  DEFAULT_CATEGORY_IMAGE,
  DEFAULT_PRODUCT_IMAGE,
  STORE_NAME
} from "@/lib/constants";

const fallbackStoreSettings = {
  storeName: STORE_NAME,
  whatsappNumber: "923084770660",
  isFallback: true
};

const fallbackCategories = [
  {
    _id: "100000000000000000000001",
    name: "Men's Clothing",
    slug: "mens-clothing",
    image: "https://picsum.photos/seed/category-mens-clothing/1200/900",
    description: "Modern menswear for daily wear, layered looks, and polished casual outfits.",
    productCount: 2
  },
  {
    _id: "100000000000000000000002",
    name: "Women's Clothing",
    slug: "womens-clothing",
    image: "https://picsum.photos/seed/category-womens-clothing/1200/900",
    description: "Elevated clothing, occasion pieces, and versatile everyday wardrobe edits.",
    productCount: 2
  },
  {
    _id: "100000000000000000000003",
    name: "Footwear",
    slug: "footwear",
    image: "https://picsum.photos/seed/category-footwear/1200/900",
    description: "Comfort-first shoes and statement pairs built for daily movement.",
    productCount: 2
  },
  {
    _id: "100000000000000000000004",
    name: "Bags & Travel",
    slug: "bags-travel",
    image: "https://picsum.photos/seed/category-bags-travel/1200/900",
    description: "Travel-ready bags, daily carry essentials, and refined accessories.",
    productCount: 1
  },
  {
    _id: "100000000000000000000005",
    name: "Watches",
    slug: "watches",
    image: "https://picsum.photos/seed/category-watches/1200/900",
    description: "Smart and classic watch styles for sharp office looks and gifting.",
    productCount: 1
  },
  {
    _id: "100000000000000000000006",
    name: "Beauty",
    slug: "beauty",
    image: "https://picsum.photos/seed/category-beauty/1200/900",
    description: "Beauty staples and curated makeup picks for routine-ready carts.",
    productCount: 1
  },
  {
    _id: "100000000000000000000007",
    name: "Home Decor",
    slug: "home-decor",
    image: "https://picsum.photos/seed/category-home-decor/1200/900",
    description: "Decor accents and styled shelf pieces for living spaces with character.",
    productCount: 1
  },
  {
    _id: "100000000000000000000008",
    name: "Electronics",
    slug: "electronics",
    image: "https://picsum.photos/seed/category-electronics/1200/900",
    description: "Portable devices and smart desk essentials for hybrid work setups.",
    productCount: 2
  }
];

const fallbackProducts = [
  {
    _id: "200000000000000000000001",
    name: "Edge Wool Polo Mode 0554-14",
    slug: "edge-wool-polo-mode-0554-14",
    shortDescription: "A refined polo with breathable structure and smart-casual balance.",
    description: "A smart-casual menswear piece designed for daily wear, clean layering, and dependable comfort.",
    price: 3950,
    compareAtPrice: 4700,
    images: ["https://picsum.photos/seed/men-0554-main/900/900"],
    category: {
      _id: "100000000000000000000001",
      name: "Men's Clothing",
      slug: "mens-clothing"
    },
    categoryName: "Men's Clothing",
    sku: "MEN-00554",
    productUrl: "",
    tags: ["premium", "staff pick"],
    whatsInTheBox: ["1 polo shirt"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 7, description: "Unused items can be returned within 7 days." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 18,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000002",
    name: "Lightweight Leather Kurti Select 0585-48",
    slug: "lightweight-leather-kurti-select-0585-48",
    shortDescription: "A polished wardrobe pick with cleaner drape and premium finish.",
    description: "A womenswear listing built to test product browsing, search, and premium presentation on mobile and desktop.",
    price: 4450,
    compareAtPrice: 5200,
    images: ["https://picsum.photos/seed/women-0585-main/900/900"],
    category: {
      _id: "100000000000000000000002",
      name: "Women's Clothing",
      slug: "womens-clothing"
    },
    categoryName: "Women's Clothing",
    sku: "WOM-00585",
    productUrl: "",
    tags: ["new arrival", "premium"],
    whatsInTheBox: ["1 kurti"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 7, description: "Unused items can be returned within 7 days." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 14,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000003",
    name: "Comfort Velvet Smart Watch Studio 0549-72",
    slug: "comfort-velvet-smart-watch-studio-0549-72",
    shortDescription: "A sleek smart watch with a cleaner profile and gift-ready feel.",
    description: "A watch listing built for quick scanning, strong product presentation, and clean card layouts.",
    price: 6900,
    compareAtPrice: 7800,
    images: ["https://picsum.photos/seed/watch-0549-main/900/900"],
    category: {
      _id: "100000000000000000000005",
      name: "Watches",
      slug: "watches"
    },
    categoryName: "Watches",
    sku: "WAT-00549",
    productUrl: "",
    tags: ["best seller", "gift idea"],
    whatsInTheBox: ["1 smart watch", "1 charging cable", "1 user guide"],
    warranty: { days: 180, description: "Backed by a 6 month service warranty." },
    returnPolicy: { days: 7, description: "Eligible for return within 7 days if unused." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 9,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000004",
    name: "Travel Velvet Outlet Pairing Select 0049-94",
    slug: "travel-velvet-outlet-pairing-select-0049-94",
    shortDescription: "A value-focused footwear listing for quicker scanning and better mobile layout.",
    description: "A comfortable footwear option designed for category browsing, card density, and checkout testing.",
    price: 2850,
    compareAtPrice: 3350,
    images: ["https://picsum.photos/seed/footwear-0049-main/900/900"],
    category: {
      _id: "100000000000000000000003",
      name: "Footwear",
      slug: "footwear"
    },
    categoryName: "Footwear",
    sku: "FOO-00049",
    productUrl: "",
    tags: ["value choice"],
    whatsInTheBox: ["1 pair of footwear"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 5, description: "Size-related exchange or return within 5 days." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 22,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000005",
    name: "Classic Alloy Wall Frame Select 0531-32",
    slug: "classic-alloy-wall-frame-select-0531-32",
    shortDescription: "A styled decor piece for shelves, galleries, and living room corners.",
    description: "A decor product tuned for premium presentation and category browsing.",
    price: 3150,
    compareAtPrice: 3900,
    images: ["https://picsum.photos/seed/decor-0531-main/900/900"],
    category: {
      _id: "100000000000000000000007",
      name: "Home Decor",
      slug: "home-decor"
    },
    categoryName: "Home Decor",
    sku: "HOM-00531",
    productUrl: "",
    tags: ["gift idea"],
    whatsInTheBox: ["1 wall frame"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 3, description: "Returns accepted for transit damage within 3 days." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 8,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000006",
    name: "Premium Glass Portable SSD Drop 0484-42",
    slug: "premium-glass-portable-ssd-drop-0484-42",
    shortDescription: "A portable SSD listing tuned for tech shoppers and fast visual scanning.",
    description: "A portable device with clean product framing and a layout-friendly thumbnail profile.",
    price: 11900,
    compareAtPrice: 13800,
    images: ["https://picsum.photos/seed/electronics-0484-main/900/900"],
    category: {
      _id: "100000000000000000000008",
      name: "Electronics",
      slug: "electronics"
    },
    categoryName: "Electronics",
    sku: "ELE-00484",
    productUrl: "",
    tags: ["premium", "smart pick"],
    whatsInTheBox: ["1 portable SSD", "1 USB cable"],
    warranty: { days: 365, description: "Covered by a 1 year replacement warranty." },
    returnPolicy: { days: 7, description: "Return within 7 days if seal is intact." },
    isFeatured: true,
    inStock: true,
    inventoryCount: 6,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000007",
    name: "Essential Bamboo Ring Studio 0803-82",
    slug: "essential-bamboo-ring-studio-0803-82",
    shortDescription: "A compact jewelry pick designed for gift carts and elegant mobile cards.",
    description: "A jewelry item focused on visual polish, compact product cards, and a premium feel.",
    price: 1750,
    compareAtPrice: 2250,
    images: ["https://picsum.photos/seed/jewelry-0803-main/900/900"],
    category: {
      _id: "100000000000000000000006",
      name: "Beauty",
      slug: "beauty"
    },
    categoryName: "Beauty",
    sku: "JEW-00803",
    productUrl: "",
    tags: ["gift idea"],
    whatsInTheBox: ["1 ring"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 3, description: "Return within 3 days if unused." },
    isFeatured: false,
    inStock: true,
    inventoryCount: 11,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000008",
    name: "Premium Alloy Layered Set Core 0002-63",
    slug: "premium-alloy-layered-set-core-0002-63",
    shortDescription: "A layered fashion set built for smaller cards and clearer mobile spacing.",
    description: "A compact fashion listing with strong visual hierarchy and quick mobile scanning.",
    price: 2550,
    compareAtPrice: 3050,
    images: ["https://picsum.photos/seed/fashion-0002-main/900/900"],
    category: {
      _id: "100000000000000000000002",
      name: "Women's Clothing",
      slug: "womens-clothing"
    },
    categoryName: "Women's Clothing",
    sku: "FAS-00002",
    productUrl: "",
    tags: ["new arrival"],
    whatsInTheBox: ["1 layered set"],
    warranty: { days: 0, description: "" },
    returnPolicy: { days: 5, description: "Returns accepted within 5 days for unused items." },
    isFeatured: false,
    inStock: true,
    inventoryCount: 19,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000009",
    name: "Urban Canvas Backpack Core 0201-61",
    slug: "urban-canvas-backpack-core-0201-61",
    shortDescription: "A travel-ready backpack with clean pockets and light everyday structure.",
    description: "A daily carry essential built for category browsing, faster loading, and smoother product grids.",
    price: 4250,
    compareAtPrice: 4900,
    images: ["https://picsum.photos/seed/bag-0201-main/900/900"],
    category: {
      _id: "100000000000000000000004",
      name: "Bags & Travel",
      slug: "bags-travel"
    },
    categoryName: "Bags & Travel",
    sku: "BAG-0201",
    productUrl: "",
    tags: ["staff pick"],
    whatsInTheBox: ["1 backpack"],
    warranty: { days: 30, description: "Covers stitching and zip defects for 30 days." },
    returnPolicy: { days: 7, description: "Return eligible within 7 days if unused." },
    isFeatured: false,
    inStock: true,
    inventoryCount: 13,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  },
  {
    _id: "200000000000000000000010",
    name: "Compact Wireless Keyboard Range 0134-25",
    slug: "compact-wireless-keyboard-range-0134-25",
    shortDescription: "A neat desk keyboard with compact layout and cleaner mobile previews.",
    description: "A work-friendly keyboard listing designed to keep the storefront responsive while backend services warm up.",
    price: 3650,
    compareAtPrice: 4300,
    images: ["https://picsum.photos/seed/keyboard-0134-main/900/900"],
    category: {
      _id: "100000000000000000000008",
      name: "Electronics",
      slug: "electronics"
    },
    categoryName: "Electronics",
    sku: "ELE-0134",
    productUrl: "",
    tags: ["smart pick"],
    whatsInTheBox: ["1 keyboard", "1 USB receiver"],
    warranty: { days: 180, description: "6 month replacement warranty for hardware faults." },
    returnPolicy: { days: 7, description: "Return within 7 days if unused." },
    isFeatured: false,
    inStock: true,
    inventoryCount: 10,
    variants: [],
    reviewSummary: { totalReviews: 0, averageRating: 0, items: [] }
  }
];

const fallbackPaymentMethods = [
  { _id: "300000000000000000000001", name: "JazzCash", type: "wallet", accountTitle: "Khizr Traders", accountNumber: "03001234567", instructions: "Share payment screenshot on WhatsApp after transfer." },
  { _id: "300000000000000000000002", name: "EasyPaisa", type: "wallet", accountTitle: "Khizr Traders", accountNumber: "03111234567", instructions: "Send payment and keep your order ID ready." },
  { _id: "300000000000000000000003", name: "Bank Transfer", type: "bank", accountTitle: "Khizr Traders", accountNumber: "PK48DEMO00012345678901", instructions: "Transfer the amount and send proof on WhatsApp." },
  { _id: "300000000000000000000004", name: "Cash on Delivery", type: "cash", accountTitle: "", accountNumber: "", instructions: "Pay at the time of delivery." }
];

function matchesSearch(product, query) {
  const needle = String(query || "").trim().toLowerCase();

  if (!needle) {
    return true;
  }

  const haystacks = [
    product.name,
    product.shortDescription,
    product.description,
    ...(product.tags || []),
    ...(product.whatsInTheBox || [])
  ];

  return haystacks.some((value) =>
    String(value || "").toLowerCase().includes(needle)
  );
}

function sortProducts(products, sort) {
  const items = [...products];

  switch (sort) {
    case "price-asc":
      return items.sort((left, right) => left.price - right.price);
    case "price-desc":
      return items.sort((left, right) => right.price - left.price);
    default:
      return items;
  }
}

export function getFallbackStoreSettings() {
  return { ...fallbackStoreSettings };
}

export function getFallbackCategories() {
  return fallbackCategories.map((category) => ({
    ...category,
    image: category.image || DEFAULT_CATEGORY_IMAGE
  }));
}

export function getFallbackProducts(query = {}) {
  let products = fallbackProducts;

  if (query.category) {
    products = products.filter(
      (product) => String(product.category?._id) === String(query.category)
    );
  }

  if (query.categorySlug) {
    products = products.filter(
      (product) => product.category?.slug === String(query.categorySlug)
    );
  }

  if (query.featured === true || query.featured === "true") {
    products = products.filter((product) => product.isFeatured);
  }

  if (query.search) {
    products = products.filter((product) => matchesSearch(product, query.search));
  }

  products = sortProducts(products, query.sort);

  const limit = Math.max(Number(query.limit || 0), 0);

  if (limit > 0) {
    products = products.slice(0, limit);
  }

  return products.map((product) => ({
    ...product,
    images: product.images?.length ? product.images : [DEFAULT_PRODUCT_IMAGE]
  }));
}

export function getFallbackProduct(id) {
  const product = fallbackProducts.find(
    (entry) => String(entry._id) === String(id || "").trim()
  );

  return product
    ? {
        ...product,
        images: product.images?.length ? product.images : [DEFAULT_PRODUCT_IMAGE]
      }
    : null;
}

export function getFallbackPaymentMethods() {
  return fallbackPaymentMethods.map((payment) => ({ ...payment }));
}
