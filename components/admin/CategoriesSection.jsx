import { useMemo, useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  Badge,
  EmptyState,
  Field,
  SearchInput,
  SectionCard,
  TextArea,
  TextInput,
  ToggleInput
} from "@/components/admin/AdminShared";

export default function CategoriesSection({
  token,
  categories,
  categoryForm,
  setCategoryForm,
  submitting,
  onSubmit,
  onEdit,
  onDelete,
  onReset
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategories = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.name,
        category.description,
        category.image,
        String(category.sortOrder || 0),
        String(category.productCount || 0),
        category.isActive ? "active" : "inactive"
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [categories, searchQuery]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard
        title={categoryForm.id ? "Edit category" : "New category"}
        copy="Categories control the collection structure customers browse from the storefront."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name">
            <TextInput
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
              placeholder="Summer Edit"
            />
          </Field>

          <Field label="Image URL">
            <TextInput
              value={categoryForm.image}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  image: event.target.value
                }))
              }
              placeholder="https://..."
            />
          </Field>

          <ImageUploadField
            token={token}
            label="Upload category image"
            onUploaded={(urls) =>
              setCategoryForm((current) => ({
                ...current,
                image: urls[0] || current.image
              }))
            }
          />

          {categoryForm.image ? (
            <div className="overflow-hidden rounded-[24px] border border-brand-border bg-brand-background">
              <img
                src={categoryForm.image}
                alt="Category preview"
                className="h-48 w-full object-cover"
              />
            </div>
          ) : null}

          <Field label="Description">
            <TextArea
              rows={4}
              value={categoryForm.description}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Sort order">
            <TextInput
              type="number"
              value={categoryForm.sortOrder}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  sortOrder: event.target.value
                }))
              }
            />
          </Field>

          <ToggleInput
            label="Active category"
            checked={categoryForm.isActive}
            onChange={(event) =>
              setCategoryForm((current) => ({
                ...current,
                isActive: event.target.checked
              }))
            }
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting === "category"}
              className="button-primary gap-2"
            >
              <Save size={16} />
              {submitting === "category" ? "Saving..." : "Save Category"}
            </button>
            {categoryForm.id ? (
              <button type="button" onClick={onReset} className="button-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Existing categories"
        copy="Inactive categories stay out of the public storefront but remain available in admin."
      >
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search categories by name, description, status, or product count"
          />
        </div>
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category._id} className="rounded-[24px] bg-brand-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-brand-primary">
                      {category.name}
                    </p>
                    <Badge tone={category.isActive ? "success" : "warning"}>
                      {category.isActive ? "active" : "inactive"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-brand-muted">
                    {category.description || "No description set."}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                    Sort {category.sortOrder || 0} · {category.productCount || 0} products
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="button-secondary gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category._id)}
                    disabled={submitting === `delete-category-${category._id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!categories.length ? (
            <EmptyState
              title="No categories yet"
              copy="Create your first category to start structuring the storefront."
            />
          ) : null}

          {categories.length && !filteredCategories.length ? (
            <EmptyState
              title="No matching categories"
              copy="Try a different category name, status, description, or product count."
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
