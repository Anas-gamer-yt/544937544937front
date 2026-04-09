import { useMemo, useState } from "react";
import {
  Field,
  SearchInput,
  SectionCard,
  TextArea,
  TextInput
} from "@/components/admin/AdminShared";
import { Save } from "lucide-react";
import {
  DEFAULT_SITE_CONTENT,
  SITE_CONTENT_GROUPS
} from "@/lib/siteContent";

export default function SettingsSection({
  settingsForm,
  setSettingsForm,
  submitting,
  onSubmit
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredGroups = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return SITE_CONTENT_GROUPS;
    }

    return SITE_CONTENT_GROUPS.map((group) => ({
      ...group,
      fields: group.fields.filter((field) =>
        [group.title, field.label, settingsForm.content?.[field.key]]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          )
      )
    })).filter((group) => group.fields.length);
  }, [searchQuery, settingsForm.content]);

  function setContentValue(key, value) {
    setSettingsForm((current) => ({
      ...current,
      content: {
        ...DEFAULT_SITE_CONTENT,
        ...(current.content || {}),
        [key]: value
      }
    }));
  }

  return (
    <SectionCard
      title="Store settings"
      copy="These settings control branding, storefront copy, checkout messaging, and the WhatsApp handoff."
    >
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Store name">
            <TextInput
              value={settingsForm.storeName}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  storeName: event.target.value
                }))
              }
              placeholder="Maison Meridian"
            />
          </Field>

          <Field label="WhatsApp number" hint="Include country code if needed.">
            <TextInput
              value={settingsForm.whatsappNumber}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  whatsappNumber: event.target.value
                }))
              }
              placeholder="923001234567"
            />
          </Field>
        </div>

        <div className="grid gap-6">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search storefront text fields"
          />

          {filteredGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-[24px] border border-brand-border bg-brand-background/70 p-5 sm:p-6"
            >
              <div className="border-b border-brand-border pb-4">
                <h3 className="text-lg font-semibold text-brand-primary">
                  {group.title}
                </h3>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {group.fields.map((field) => (
                  <Field
                    key={field.key}
                    label={field.label}
                    hint={field.hint}
                  >
                    {field.multiline ? (
                      <TextArea
                        rows={3}
                        value={settingsForm.content?.[field.key] || ""}
                        onChange={(event) =>
                          setContentValue(field.key, event.target.value)
                        }
                      />
                    ) : (
                      <TextInput
                        value={settingsForm.content?.[field.key] || ""}
                        onChange={(event) =>
                          setContentValue(field.key, event.target.value)
                        }
                      />
                    )}
                  </Field>
                ))}
              </div>
            </section>
          ))}

          {searchQuery && !filteredGroups.length ? (
            <section className="rounded-[24px] border border-dashed border-brand-border bg-brand-background px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-brand-primary">
                No matching settings fields
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-brand-muted">
                Try a different keyword from the storefront copy you want to edit.
              </p>
            </section>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting === "settings"}
            className="button-primary gap-2"
          >
            <Save size={16} />
            {submitting === "settings" ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
