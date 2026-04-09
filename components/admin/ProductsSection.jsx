import { useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  Badge,
  EmptyState,
  Field,
  SearchInput,
  SectionCard,
  SelectInput,
  TextArea,
  TextInput,
  ToggleInput
} from "@/components/admin/AdminShared";
import { formatCurrency } from "@/lib/fetcher";

export default function ProductsSection({
  token,
  categories,
  products,
  productForm,
  setProductForm,
  submitting,
  onSubmit,
  onEdit,
  onDelete,
  onReset
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.shortDescription,
        product.description,
        product.category?.name,
        product.sku,
        product.productUrl,
        ...(product.tags || [])
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [products, searchQuery]);

  function updateVariant(index, key, value) {
    setProductForm((current) => ({
      ...current,
      variants: (current.variants || []).map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant
      )
    }));
  }

  function addVariant() {
    setProductForm((current) => ({
      ...current,
      variants: [
        ...(current.variants || []),
        {
          id: "",
          variation: "",
          size: "",
          sku: "",
          price: "",
          compareAtPrice: "",
          images: "",
          inventoryCount: 0,
          isActive: true
        }
      ]
    }));
  }

  function removeVariant(index) {
    setProductForm((current) => ({
      ...current,
      variants: (current.variants || []).filter(
        (_, variantIndex) => variantIndex !== index
      )
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard
        title={productForm.id ? "Edit product" : "New product"}
        copy="Products are fully dynamic and immediately available to the storefront."
      >
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput
              value={productForm.name}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Category">
            <SelectInput
              value={productForm.category}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  category: event.target.value
                }))
              }
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Short description">
            <TextInput
              value={productForm.shortDescription}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  shortDescription: event.target.value
                }))
              }
            />
          </Field>

          <Field label="SKU">
            <TextInput
              value={productForm.sku}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  sku: event.target.value
                }))
              }
            />
          </Field>

          <Field
            label="Product URL"
            hint="Internal-only reference link. This is hidden from customers."
          >
            <TextInput
              type="url"
              value={productForm.productUrl}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  productUrl: event.target.value
                }))
              }
              placeholder="https://example.com/product-reference"
            />
          </Field>

          <Field label="Variation label" hint="Example: Color, Style, Material">
            <TextInput
              value={productForm.variantLabel}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  variantLabel: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Size label" hint="Example: Size, Capacity, Length">
            <TextInput
              value={productForm.sizeLabel}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  sizeLabel: event.target.value
                }))
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description">
              <TextArea
                rows={5}
                value={productForm.description}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Price">
            <TextInput
              type="number"
              value={productForm.price}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  price: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Compare-at price">
            <TextInput
              type="number"
              value={productForm.compareAtPrice}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  compareAtPrice: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Images" hint="Comma-separated image URLs.">
            <TextInput
              value={productForm.images}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  images: event.target.value
                }))
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <ImageUploadField
              token={token}
              multiple
              label="Upload product images"
              hint="Uploaded images are appended to the image URL list automatically."
              onUploaded={(urls) =>
                setProductForm((current) => {
                  const existing = String(current.images || "")
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
                  const nextUrls = [...existing, ...urls];

                  return {
                    ...current,
                    images: nextUrls.join(", ")
                  };
                })
              }
            />
          </div>

          <Field label="Tags" hint="Comma-separated tags.">
            <TextInput
              value={productForm.tags}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  tags: event.target.value
                }))
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="What's in the box"
              hint="Use one item per line or comma-separated values."
            >
              <TextArea
                rows={4}
                value={productForm.whatsInTheBox}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    whatsInTheBox: event.target.value
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Warranty days">
            <TextInput
              type="number"
              value={productForm.warrantyDays}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  warrantyDays: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Return policy days">
            <TextInput
              type="number"
              value={productForm.returnPolicyDays}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  returnPolicyDays: event.target.value
                }))
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Warranty description">
              <TextArea
                rows={3}
                value={productForm.warrantyDescription}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    warrantyDescription: event.target.value
                  }))
                }
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Return policy description">
              <TextArea
                rows={3}
                value={productForm.returnPolicyDescription}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    returnPolicyDescription: event.target.value
                  }))
                }
              />
            </Field>
          </div>

          <Field
            label="Available quantity"
            hint="When this reaches 0, the product will automatically show as out of stock."
          >
            <TextInput
              type="number"
              value={productForm.inventoryCount}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  inventoryCount: event.target.value
                }))
              }
            />
          </Field>

          <div className="sm:col-span-2 rounded-[24px] border border-brand-border bg-brand-background/60 p-5">
            <div className="flex flex-col gap-3 border-b border-brand-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                  Variations
                </p>
                <p className="mt-2 text-sm leading-7 text-brand-muted">
                  Add option rows with their own price, images, size, and inventory. Customers will choose from these on the product page.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="button-secondary gap-2"
              >
                <Plus size={16} />
                Add variation
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {(productForm.variants || []).map((variant, index) => (
                <div
                  key={variant.id || `variant-${index}`}
                  className="rounded-[22px] border border-brand-border bg-white p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={productForm.variantLabel || "Variation"}>
                      <TextInput
                        value={variant.variation}
                        onChange={(event) =>
                          updateVariant(index, "variation", event.target.value)
                        }
                        placeholder="Black"
                      />
                    </Field>

                    <Field label={productForm.sizeLabel || "Size"}>
                      <TextInput
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(index, "size", event.target.value)
                        }
                        placeholder="Large"
                      />
                    </Field>

                    <Field label="Variant SKU">
                      <TextInput
                        value={variant.sku}
                        onChange={(event) =>
                          updateVariant(index, "sku", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Variant inventory">
                      <TextInput
                        type="number"
                        value={variant.inventoryCount}
                        onChange={(event) =>
                          updateVariant(index, "inventoryCount", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Variant price">
                      <TextInput
                        type="number"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(index, "price", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Variant compare-at price">
                      <TextInput
                        type="number"
                        value={variant.compareAtPrice}
                        onChange={(event) =>
                          updateVariant(index, "compareAtPrice", event.target.value)
                        }
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Variant image URLs" hint="Comma-separated image URLs for this specific option.">
                        <TextArea
                          rows={3}
                          value={variant.images}
                          onChange={(event) =>
                            updateVariant(index, "images", event.target.value)
                          }
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <ImageUploadField
                        token={token}
                        multiple
                        label="Upload variation images"
                        hint="Uploaded files are appended to this variation's image list."
                        onUploaded={(urls) => {
                          const existing = String(variant.images || "")
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean);
                          updateVariant(
                            index,
                            "images",
                            [...existing, ...urls].join(", ")
                          );
                        }}
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                      <ToggleInput
                        label="Active variation"
                        checked={variant.isActive !== false}
                        onChange={(event) =>
                          updateVariant(index, "isActive", event.target.checked)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Remove variation
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!productForm.variants?.length ? (
                <EmptyState
                  title="No product variations yet"
                  copy="Leave this empty for a simple product, or add option rows for different prices, images, and size combinations."
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <ToggleInput
              label="Featured product"
              checked={productForm.isFeatured}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  isFeatured: event.target.checked
                }))
              }
            />
            <ToggleInput
              label="In stock"
              hint="You can manually hide a product even if quantity remains."
              checked={productForm.inStock}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  inStock: event.target.checked
                }))
              }
            />
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting === "product"}
              className="button-primary gap-2"
            >
              <Save size={16} />
              {submitting === "product" ? "Saving..." : "Save Product"}
            </button>
            {productForm.id ? (
              <button type="button" onClick={onReset} className="button-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>

          {productForm.images ? (
            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
              {String(productForm.images)
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((image) => (
                  <div
                    key={image}
                    className="overflow-hidden rounded-[20px] border border-brand-border bg-brand-background"
                  >
                    <img
                      src={image}
                      alt="Product preview"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
            </div>
          ) : null}
        </form>
      </SectionCard>

      <SectionCard
        title="Catalog products"
        copy="Edit featured status, pricing, and stock directly from this list."
      >
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products, SKU, tags, category, or internal URL"
          />
        </div>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="rounded-[24px] bg-brand-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-brand-primary">
                      {product.name}
                    </p>
                    {product.isFeatured ? <Badge>featured</Badge> : null}
                    <Badge tone={product.inStock ? "success" : "warning"}>
                      {product.inStock ? "in stock" : "out of stock"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-brand-muted">
                    {product.shortDescription || product.description}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-primary">
                    {formatCurrency(product.price)} · {product.category?.name || "No category"}
                  </p>
                  <p className="mt-2 text-sm text-brand-muted">
                    Quantity remaining: {Number(product.inventoryCount || 0)}
                  </p>
                  {(product.variants || []).length ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                      {(product.variants || []).length} variations configured
                    </p>
                  ) : null}
                  {product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm font-semibold text-brand-secondary hover:text-brand-primary"
                    >
                      Open product URL
                    </a>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="button-secondary gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product._id)}
                    disabled={submitting === `delete-product-${product._id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!products.length ? (
            <EmptyState
              title="No products yet"
              copy="Create your first product to populate the storefront."
            />
          ) : null}

          {products.length && !filteredProducts.length ? (
            <EmptyState
              title="No matching products"
              copy="Try a different product name, SKU, tag, category, or internal URL."
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
