"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  FolderClosed,
  LayoutDashboard,
  LogOut,
  Package,
  RefreshCcw,
  Settings2,
  ShoppingBag,
  UserCog
} from "lucide-react";
import AdminLoginView from "@/components/admin/AdminLoginView";
import CategoriesSection from "@/components/admin/CategoriesSection";
import OrdersSection from "@/components/admin/OrdersSection";
import OverviewSection from "@/components/admin/OverviewSection";
import PaymentsSection from "@/components/admin/PaymentsSection";
import ProductsSection from "@/components/admin/ProductsSection";
import SettingsSection from "@/components/admin/SettingsSection";
import UsersSection from "@/components/admin/UsersSection";
import { StatusBanner, TabButton } from "@/components/admin/AdminShared";
import {
  adminRequest,
  getAdminSession,
  logoutAdminSession
} from "@/lib/admin";
import { apiFetch } from "@/lib/fetcher";
import { DEFAULT_SITE_CONTENT, resolveSiteContent } from "@/lib/siteContent";

const tabConfig = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["super_admin", "manager", "catalog", "support"]
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings2,
    roles: ["super_admin", "manager"]
  },
  {
    id: "categories",
    label: "Categories",
    icon: FolderClosed,
    roles: ["super_admin", "manager", "catalog"]
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    roles: ["super_admin", "manager", "catalog"]
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["super_admin", "manager"]
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
    roles: ["super_admin", "manager", "catalog", "support"]
  },
  {
    id: "users",
    label: "Users",
    icon: UserCog,
    roles: ["super_admin"]
  }
];

const initialLoginForm = {
  username: "",
  password: ""
};

const initialSettingsForm = {
  storeName: "",
  whatsappNumber: "",
  content: DEFAULT_SITE_CONTENT
};

const initialCategoryForm = {
  id: "",
  name: "",
  image: "",
  description: "",
  sortOrder: 0,
  isActive: true
};

const initialProductForm = {
  id: "",
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  images: "",
  category: "",
  sku: "",
  productUrl: "",
  variantLabel: "Variation",
  sizeLabel: "Size",
  variants: [],
  whatsInTheBox: "",
  warrantyDays: "",
  warrantyDescription: "",
  returnPolicyDays: "",
  returnPolicyDescription: "",
  tags: "",
  isFeatured: false,
  inStock: true,
  inventoryCount: 0
};

const initialPaymentForm = {
  id: "",
  name: "",
  type: "wallet",
  accountTitle: "",
  accountNumber: "",
  instructions: "",
  sortOrder: 0,
  isEnabled: true
};

const initialUserForm = {
  id: "",
  name: "",
  username: "",
  password: "",
  role: "manager",
  isActive: true
};

function normalizeLoginUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function formatCooldownMessage(seconds) {
  const totalSeconds = Math.max(Number(seconds || 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes > 0) {
    return `Too many login attempts. Try again in ${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}. Repeated failures lock the account after 50 total failed attempts.`;
  }

  return `Too many login attempts. Try again in ${remainingSeconds}s. Repeated failures lock the account after 50 total failed attempts.`;
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitFlexibleList(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isAuthError(message) {
  return /auth|credential|token|jwt|401|403/i.test(String(message || ""));
}

function canAccess(role, tabId) {
  return tabConfig.some((tab) => tab.id === tabId && tab.roles.includes(role));
}

export default function AdminPanel() {
  const [token, setToken] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loginCooldown, setLoginCooldown] = useState({
    username: "",
    seconds: 0
  });
  const [lockedUsername, setLockedUsername] = useState("");

  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [settingsForm, setSettingsForm] = useState(initialSettingsForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [userForm, setUserForm] = useState(initialUserForm);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const role = currentUser?.role || "";
  const normalizedLoginUsername = normalizeLoginUsername(loginForm.username);
  const loginCooldownActive =
    loginCooldown.username === normalizedLoginUsername &&
    Number(loginCooldown.seconds || 0) > 0;
  const lockedForCurrentUsername =
    Boolean(lockedUsername) && lockedUsername === normalizedLoginUsername;
  const visibleTabs = useMemo(
    () => tabConfig.filter((tab) => tab.roles.includes(role)),
    [role]
  );

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    if (visibleTabs.length && !visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [activeTab, visibleTabs]);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    setProductForm((current) =>
      current.category ? current : { ...current, category: categories[0]._id }
    );
  }, [categories]);

  useEffect(() => {
    if (!message && !error) {
      return undefined;
    }

    if (loginCooldownActive || lockedForCurrentUsername) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [message, error, loginCooldownActive, lockedForCurrentUsername]);

  useEffect(() => {
    if (
      loginCooldown.username &&
      normalizedLoginUsername !== loginCooldown.username &&
      /^Too many login attempts/i.test(error)
    ) {
      setError("");
    }

    if (
      lockedUsername &&
      normalizedLoginUsername !== lockedUsername &&
      /account is locked/i.test(error)
    ) {
      setError("");
    }
  }, [
    error,
    lockedUsername,
    loginCooldown.username,
    normalizedLoginUsername
  ]);

  useEffect(() => {
    if (Number(loginCooldown.seconds || 0) <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setLoginCooldown((current) => {
        if (Number(current.seconds || 0) <= 1) {
          return {
            username: current.username,
            seconds: 0
          };
        }

        return {
          ...current,
          seconds: Number(current.seconds || 0) - 1
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loginCooldown.seconds]);

  async function initializeSession() {
    setLoading(true);
    setError("");

    try {
      const user = await getAdminSession();

      if (!user) {
        setToken("");
        setCurrentUser(null);
        return;
      }

      setToken("cookie");
      setCurrentUser(user);
      await loadDashboard("cookie", user.role);
    } catch (requestError) {
      setToken("");
      setCurrentUser(null);
      if (Number(requestError?.status || 0) >= 500) {
        setError(requestError.message || "Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(authToken = token, userRole = role) {
    setLoading(true);
    setError("");

    try {
      const requests = [];

      if (canAccess(userRole, "categories")) {
        requests.push(
          adminRequest("/api/categories", {
            token: authToken,
            query: { includeInactive: true }
          }).then((payload) => setCategories(payload?.data || []))
        );
      } else {
        setCategories([]);
      }

      if (canAccess(userRole, "products")) {
        requests.push(
          adminRequest("/api/products", { token: authToken }).then((payload) =>
            setProducts(payload?.data || [])
          )
        );
      } else {
        setProducts([]);
      }

      if (canAccess(userRole, "payments")) {
        requests.push(
          adminRequest("/api/payments", {
            token: authToken,
            query: { includeDisabled: true }
          }).then((payload) => setPayments(payload?.data || []))
        );
      } else {
        setPayments([]);
      }

      if (canAccess(userRole, "orders")) {
        requests.push(
          adminRequest("/api/orders", { token: authToken }).then((payload) =>
            setOrders(payload?.data || [])
          )
        );
      } else {
        setOrders([]);
      }

      if (canAccess(userRole, "settings")) {
        requests.push(
          adminRequest("/api/settings/whatsapp", { token: authToken }).then(
            (payload) =>
              setSettingsForm({
                storeName: payload?.data?.storeName || "",
                whatsappNumber: payload?.data?.whatsappNumber || "",
                content: resolveSiteContent(payload?.data)
              })
          )
        );
      } else {
        setSettingsForm(initialSettingsForm);
      }

      if (canAccess(userRole, "users")) {
        requests.push(
          adminRequest("/api/users", { token: authToken }).then((payload) =>
            setUsers(payload?.data || [])
          )
        );
      } else {
        setUsers([]);
      }

      await Promise.all(requests);
    } catch (requestError) {
      if (isAuthError(requestError.message)) {
        handleLogout("Your session expired. Please log in again.");
        return;
      }

      setError(requestError.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout(nextMessage = "") {
    setToken("");
    setCurrentUser(null);
    setCategories([]);
    setProducts([]);
    setPayments([]);
    setOrders([]);
    setUsers([]);
    setCategoryForm(initialCategoryForm);
    setProductForm(initialProductForm);
    setPaymentForm(initialPaymentForm);
    setUserForm(initialUserForm);
    setSettingsForm(initialSettingsForm);
    setActiveTab("overview");
    setMessage("");
    setError(nextMessage);
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (loginCooldownActive || lockedForCurrentUsername) {
      return;
    }

    setSubmitting("login");
    setError("");

    try {
      const payload = await apiFetch("/api/auth/login", {
        method: "POST",
        timeoutMs: 20000,
        credentials: "include",
        data: loginForm
      });
      const nextUser = payload?.data?.admin || null;

      if (!nextUser) {
        throw new Error("Login succeeded but no admin session was returned.");
      }

      setToken("cookie");
      setCurrentUser(nextUser);
      setLockedUsername("");
      setLoginCooldown({
        username: "",
        seconds: 0
      });
      setActiveTab("overview");
      if (nextUser?.role) {
        await loadDashboard("cookie", nextUser.role);
      }
      setMessage("Admin session started.");
    } catch (requestError) {
      if (requestError.status === 429) {
        const retryAfterSeconds = Math.max(
          Number(requestError.retryAfterSeconds || 0),
          1
        );
        setLoginCooldown({
          username: normalizedLoginUsername,
          seconds: retryAfterSeconds
        });
        setLockedUsername("");
        setError(formatCooldownMessage(retryAfterSeconds));
      } else if (requestError.status === 423) {
        setLockedUsername(normalizedLoginUsername);
        setLoginCooldown({
          username: normalizedLoginUsername,
          seconds: 0
        });
        setError(
          requestError.message ||
            "This account is locked. Contact a super admin to restore access."
        );
      } else {
        setError(requestError.message || "Login failed.");
      }
    } finally {
      setSubmitting("");
    }
  }

  async function mutate(run, successMessage, reset) {
    setError("");

    try {
      await run();
      if (typeof reset === "function") {
        reset();
      }
      if (successMessage) {
        setMessage(successMessage);
      }
      await loadDashboard(token, role);
    } catch (requestError) {
      const nextMessage = requestError.message || "Action failed.";

      if (isAuthError(nextMessage)) {
        handleLogout("Your session expired. Please log in again.");
        return;
      }

      setError(nextMessage);
    } finally {
      setSubmitting("");
    }
  }

  if (token === "loading") {
    return (
      <div className="page-shell section-shell">
        <div className="surface-card p-10 text-center text-brand-muted">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <AdminLoginView
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        error={error}
        cooldownSeconds={loginCooldownActive ? loginCooldown.seconds : 0}
        isLocked={lockedForCurrentUsername}
        isSubmitDisabled={
          submitting === "login" || loginCooldownActive || lockedForCurrentUsername
        }
        submitting={submitting}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="page-shell section-shell">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:sticky lg:top-28 lg:max-w-xs">
          <div className="surface-card p-5">
            <div className="rounded-[24px] bg-brand-primary px-5 py-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                Admin Panel
              </p>
              <h1 className="mt-3 font-display text-4xl leading-none">
                {settingsForm.storeName || "Store Control"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Signed in as {currentUser?.name || currentUser?.username} ·{" "}
                {role.replace(/_/g, " ")}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {visibleTabs.map((tab) => {
                const count =
                  tab.id === "categories"
                    ? categories.length
                    : tab.id === "products"
                      ? products.length
                      : tab.id === "payments"
                        ? payments.length
                        : tab.id === "orders"
                          ? orders.length
                          : tab.id === "users"
                            ? users.length
                            : undefined;

                return (
                  <TabButton
                    key={tab.id}
                    icon={tab.icon}
                    label={tab.label}
                    count={count}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => loadDashboard(token, role)}
                className="button-secondary justify-center gap-2"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  logoutAdminSession().finally(() => {
                    handleLogout("");
                  });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <StatusBanner message={message} tone="success" />
          <StatusBanner message={error} />

          {loading ? (
            <div className="surface-card p-10 text-center text-brand-muted">
              Loading admin data...
            </div>
          ) : null}

          {activeTab === "overview" ? (
            <OverviewSection
              categories={categories}
              products={products}
              payments={payments}
              orders={orders}
            />
          ) : null}

          {activeTab === "settings" && canAccess(role, "settings") ? (
            <SettingsSection
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              submitting={submitting}
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting("settings");
                await mutate(
                  () =>
                    adminRequest("/api/settings/whatsapp", {
                      token,
                      method: "PUT",
                      data: settingsForm
                    }),
                  "Store settings updated."
                );
              }}
            />
          ) : null}

          {activeTab === "categories" && canAccess(role, "categories") ? (
            <CategoriesSection
              token={token}
              categories={categories}
              categoryForm={categoryForm}
              setCategoryForm={setCategoryForm}
              submitting={submitting}
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting("category");
                const isEditing = Boolean(categoryForm.id);
                await mutate(
                  () =>
                    adminRequest(
                      isEditing
                        ? `/api/categories/${categoryForm.id}`
                        : "/api/categories",
                      {
                        token,
                        method: isEditing ? "PUT" : "POST",
                        data: {
                          name: categoryForm.name,
                          image: categoryForm.image,
                          description: categoryForm.description,
                          sortOrder: Number(categoryForm.sortOrder || 0),
                          isActive: categoryForm.isActive
                        }
                      }
                    ),
                  isEditing ? "Category updated." : "Category created.",
                  () => setCategoryForm(initialCategoryForm)
                );
              }}
              onEdit={(category) =>
                setCategoryForm({
                  id: category._id,
                  name: category.name || "",
                  image: category.image || "",
                  description: category.description || "",
                  sortOrder: Number(category.sortOrder || 0),
                  isActive: Boolean(category.isActive)
                })
              }
              onDelete={async (id) => {
                if (!window.confirm("Delete this category?")) {
                  return;
                }

                setSubmitting(`delete-category-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/categories/${id}`, {
                      token,
                      method: "DELETE"
                    }),
                  "Category deleted.",
                  () => {
                    if (categoryForm.id === id) {
                      setCategoryForm(initialCategoryForm);
                    }
                  }
                );
              }}
              onReset={() => setCategoryForm(initialCategoryForm)}
            />
          ) : null}

          {activeTab === "products" && canAccess(role, "products") ? (
            <ProductsSection
              token={token}
              categories={categories}
              products={products}
              productForm={productForm}
              setProductForm={setProductForm}
              submitting={submitting}
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting("product");
                const isEditing = Boolean(productForm.id);
                await mutate(
                  () =>
                    adminRequest(
                      isEditing
                        ? `/api/products/${productForm.id}`
                        : "/api/products",
                      {
                        token,
                        method: isEditing ? "PUT" : "POST",
                        data: {
                          name: productForm.name,
                          shortDescription: productForm.shortDescription,
                          description: productForm.description,
                          price: Number(productForm.price || 0),
                          compareAtPrice: Number(productForm.compareAtPrice || 0),
                          images: splitList(productForm.images),
                          category: productForm.category,
                          sku: productForm.sku,
                          productUrl: productForm.productUrl,
                          variantLabel: productForm.variantLabel,
                          sizeLabel: productForm.sizeLabel,
                          variants: (productForm.variants || []).map((variant) => ({
                            variation: variant.variation,
                            size: variant.size,
                            sku: variant.sku,
                            price: Number(variant.price || 0),
                            compareAtPrice: Number(variant.compareAtPrice || 0),
                            images: splitList(variant.images),
                            inventoryCount: Number(variant.inventoryCount || 0),
                            isActive: variant.isActive !== false
                          })),
                          whatsInTheBox: splitFlexibleList(productForm.whatsInTheBox),
                          warrantyDays: Number(productForm.warrantyDays || 0),
                          warrantyDescription: productForm.warrantyDescription,
                          returnPolicyDays: Number(productForm.returnPolicyDays || 0),
                          returnPolicyDescription: productForm.returnPolicyDescription,
                          tags: splitList(productForm.tags),
                          isFeatured: productForm.isFeatured,
                          inStock: productForm.inStock,
                          inventoryCount: Number(productForm.inventoryCount || 0)
                        }
                      }
                    ),
                  isEditing ? "Product updated." : "Product created.",
                  () =>
                    setProductForm({
                      ...initialProductForm,
                      category: productForm.category || categories[0]?._id || ""
                    })
                );
              }}
              onEdit={(product) =>
                setProductForm({
                  id: product._id,
                  name: product.name || "",
                  shortDescription: product.shortDescription || "",
                  description: product.description || "",
                  price: String(product.price ?? ""),
                  compareAtPrice: String(product.compareAtPrice ?? ""),
                  images: (product.images || []).join(", "),
                  category: product.category?._id || "",
                  sku: product.sku || "",
                  productUrl: product.productUrl || "",
                  variantLabel: product.variantLabel || "Variation",
                  sizeLabel: product.sizeLabel || "Size",
                  variants: (product.variants || []).map((variant) => ({
                    id: variant._id || "",
                    variation: variant.variation || "",
                    size: variant.size || "",
                    sku: variant.sku || "",
                    price: String(variant.price ?? ""),
                    compareAtPrice: String(variant.compareAtPrice ?? ""),
                    images: (variant.images || []).join(", "),
                    inventoryCount: Number(variant.inventoryCount || 0),
                    isActive: variant.isActive !== false
                  })),
                  whatsInTheBox: (product.whatsInTheBox || []).join("\n"),
                  warrantyDays: String(product.warranty?.days ?? ""),
                  warrantyDescription: product.warranty?.description || "",
                  returnPolicyDays: String(product.returnPolicy?.days ?? ""),
                  returnPolicyDescription:
                    product.returnPolicy?.description || "",
                  tags: (product.tags || []).join(", "),
                  isFeatured: Boolean(product.isFeatured),
                  inStock: product.inStock !== false,
                  inventoryCount: Number(product.inventoryCount || 0)
                })
              }
              onDelete={async (id) => {
                if (!window.confirm("Delete this product?")) {
                  return;
                }

                setSubmitting(`delete-product-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/products/${id}`, {
                      token,
                      method: "DELETE"
                    }),
                  "Product deleted.",
                  () => {
                    if (productForm.id === id) {
                      setProductForm({
                        ...initialProductForm,
                        category: categories[0]?._id || ""
                      });
                    }
                  }
                );
              }}
              onReset={() =>
                setProductForm({
                  ...initialProductForm,
                  category: categories[0]?._id || ""
                })
              }
            />
          ) : null}

          {activeTab === "payments" && canAccess(role, "payments") ? (
            <PaymentsSection
              payments={payments}
              paymentForm={paymentForm}
              setPaymentForm={setPaymentForm}
              submitting={submitting}
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting("payment");
                const isEditing = Boolean(paymentForm.id);
                await mutate(
                  () =>
                    adminRequest(
                      isEditing
                        ? `/api/payments/${paymentForm.id}`
                        : "/api/payments",
                      {
                        token,
                        method: isEditing ? "PUT" : "POST",
                        data: {
                          name: paymentForm.name,
                          type: paymentForm.type,
                          accountTitle: paymentForm.accountTitle,
                          accountNumber: paymentForm.accountNumber,
                          instructions: paymentForm.instructions,
                          sortOrder: Number(paymentForm.sortOrder || 0),
                          isEnabled: paymentForm.isEnabled
                        }
                      }
                    ),
                  isEditing ? "Payment method updated." : "Payment method created.",
                  () => setPaymentForm(initialPaymentForm)
                );
              }}
              onEdit={(payment) =>
                setPaymentForm({
                  id: payment._id,
                  name: payment.name || "",
                  type: payment.type || "wallet",
                  accountTitle: payment.accountTitle || "",
                  accountNumber: payment.accountNumber || "",
                  instructions: payment.instructions || "",
                  sortOrder: Number(payment.sortOrder || 0),
                  isEnabled: payment.isEnabled !== false
                })
              }
              onToggle={async (id) => {
                setSubmitting(`toggle-payment-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/payments/toggle/${id}`, {
                      token,
                      method: "PATCH"
                    }),
                  "Payment method status updated."
                );
              }}
              onDelete={async (id) => {
                if (!window.confirm("Delete this payment method?")) {
                  return;
                }

                setSubmitting(`delete-payment-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/payments/${id}`, {
                      token,
                      method: "DELETE"
                    }),
                  "Payment method deleted.",
                  () => {
                    if (paymentForm.id === id) {
                      setPaymentForm(initialPaymentForm);
                    }
                  }
                );
              }}
              onReset={() => setPaymentForm(initialPaymentForm)}
            />
          ) : null}

          {activeTab === "orders" && canAccess(role, "orders") ? (
            <OrdersSection
              orders={orders}
              currentUserRole={role}
              submitting={submitting}
              onUpdateStatus={async (id, status, tracking = {}) => {
                setSubmitting(`order-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/orders/${id}`, {
                      token,
                      method: "PATCH",
                      data: {
                        status,
                        courierName: tracking?.courierName || "",
                        trackingNumber: tracking?.trackingNumber || ""
                      }
                    }),
                  "Order status updated."
                );
              }}
              onUpdateReturnStatus={async (
                id,
                returnRequestId,
                status,
                resolutionNote
              ) => {
                setSubmitting(`return-${id}-${returnRequestId}`);
                await mutate(
                  () =>
                    adminRequest(`/api/orders/${id}/return-requests/${returnRequestId}`, {
                      token,
                      method: "PATCH",
                      data: { status, resolutionNote }
                    }),
                  "Return request updated."
                );
              }}
            />
          ) : null}

          {activeTab === "users" && canAccess(role, "users") ? (
            <UsersSection
              users={users}
              userForm={userForm}
              setUserForm={setUserForm}
              submitting={submitting}
              currentUserId={currentUser?.id}
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting("user");
                const isEditing = Boolean(userForm.id);
                await mutate(
                  () =>
                    adminRequest(
                      isEditing ? `/api/users/${userForm.id}` : "/api/users",
                      {
                        token,
                        method: isEditing ? "PUT" : "POST",
                        data: {
                          name: userForm.name,
                          username: userForm.username,
                          password: userForm.password,
                          role: userForm.role,
                          isActive: userForm.isActive
                        }
                      }
                    ),
                  isEditing ? "User updated." : "User created.",
                  () => setUserForm(initialUserForm)
                );
              }}
              onEdit={(user) =>
                setUserForm({
                  id: user.id,
                  name: user.name || "",
                  username: user.username || "",
                  password: "",
                  role: user.role || "manager",
                  isActive: user.isActive !== false
                })
              }
              onDelete={async (id) => {
                if (!window.confirm("Delete this user?")) {
                  return;
                }

                setSubmitting(`delete-user-${id}`);
                await mutate(
                  () =>
                    adminRequest(`/api/users/${id}`, {
                      token,
                      method: "DELETE"
                    }),
                  "User deleted.",
                  () => {
                    if (userForm.id === id) {
                      setUserForm(initialUserForm);
                    }
                  }
                );
              }}
              onReset={() => setUserForm(initialUserForm)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
