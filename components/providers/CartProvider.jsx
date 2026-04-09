"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import {
  buildCartItemPayload,
  getProductAvailableInventory
} from "@/lib/productSelection";

const STORAGE_KEY = "maison-meridian-cart";
const CartContext = createContext(null);
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function buildLineId(productId, variantId = "") {
  return `${productId}:${variantId || "base"}`;
}

function isValidObjectId(value) {
  return OBJECT_ID_PATTERN.test(String(value || "").trim());
}

function normalizeStoredItem(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return null;
  }

  const productId = String(item.id || "").trim();
  const variantId = String(item.variantId || "").trim();
  const quantity = Math.max(1, Number(item.quantity || 1));
  const price = Number(item.price || 0);
  const compareAtPrice = Number(item.compareAtPrice || 0);
  const availableInventory = Math.max(Number(item.availableInventory || 0), 0);

  if (!isValidObjectId(productId)) {
    return null;
  }

  if (variantId && !isValidObjectId(variantId)) {
    return null;
  }

  if (!Number.isFinite(quantity) || !Number.isFinite(price)) {
    return null;
  }

  return {
    lineId: String(item.lineId || buildLineId(productId, variantId)),
    id: productId,
    name: String(item.name || "").trim(),
    slug: String(item.slug || "").trim(),
    price,
    compareAtPrice: Number.isFinite(compareAtPrice) ? compareAtPrice : 0,
    image: String(item.image || DEFAULT_PRODUCT_IMAGE).trim() || DEFAULT_PRODUCT_IMAGE,
    quantity,
    categoryName: String(item.categoryName || "").trim(),
    variantId,
    variantLabel: String(item.variantLabel || "").trim(),
    sizeLabel: String(item.sizeLabel || "").trim(),
    sku: String(item.sku || "").trim(),
    availableInventory
  };
}

function normalizeProduct(product, quantity = 1, selection = {}) {
  const selectionPayload = buildCartItemPayload(product, selection.variant || null);
  const productId = product._id || product.id;
  const lineId = buildLineId(productId, selectionPayload.variantId);

  return {
    lineId,
    id: productId,
    name: product.name,
    slug: product.slug || "",
    price: Number(selectionPayload.price || product.price || 0),
    compareAtPrice: Number(
      selectionPayload.compareAtPrice || product.compareAtPrice || 0
    ),
    image:
      selectionPayload.image ||
      product.images?.[0] ||
      product.image ||
      DEFAULT_PRODUCT_IMAGE,
    quantity: Number(quantity || 1),
    categoryName: product.category?.name || product.categoryName || "",
    variantId: selectionPayload.variantId || "",
    variantLabel: selectionPayload.variantLabel || "",
    sizeLabel: selectionPayload.sizeLabel || "",
    sku: selectionPayload.sku || "",
    availableInventory: Math.max(
      Number(getProductAvailableInventory(product, selection.variant || null) || 0),
      0
    )
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const didLoadRef = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(normalizeStoredItem).filter(Boolean));
        }
      }
    } catch (error) {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      didLoadRef.current = true;
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!didLoadRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1, selection = {}) {
    const nextItem = normalizeProduct(product, quantity, selection);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.lineId === nextItem.lineId
      );

      if (!existingItem) {
        return [...currentItems, nextItem];
      }

      return currentItems.map((item) =>
        item.lineId === nextItem.lineId
          ? {
              ...item,
              quantity:
                item.availableInventory > 0
                  ? Math.min(
                      item.quantity + nextItem.quantity,
                      item.availableInventory
                    )
                  : item.quantity + nextItem.quantity
            }
          : item
      );
    });
  }

  function updateQuantity(lineId, quantity) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.lineId === lineId
          ? {
              ...item,
              quantity:
                item.availableInventory > 0
                  ? Math.min(
                      Math.max(1, Number(quantity || 1)),
                      item.availableInventory
                    )
                  : Math.max(1, Number(quantity || 1))
            }
          : item
      )
    );
  }

  function removeItem(lineId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.lineId !== lineId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        hasHydrated
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
}
