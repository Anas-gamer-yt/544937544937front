import { useMemo, useState } from "react";
import { Pencil, Save, Trash2, UserPlus } from "lucide-react";
import {
  Badge,
  EmptyState,
  Field,
  SearchInput,
  SectionCard,
  SelectInput,
  TextInput,
  ToggleInput
} from "@/components/admin/AdminShared";

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "manager", label: "Manager" },
  { value: "catalog", label: "Catalog" },
  { value: "support", label: "Support" }
];

export default function UsersSection({
  users,
  userForm,
  setUserForm,
  submitting,
  onSubmit,
  onEdit,
  onDelete,
  onReset,
  currentUserId
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.username,
        user.role,
        user.isActive ? "active" : "disabled"
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [users, searchQuery]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard
        title={userForm.id ? "Edit user" : "New user"}
        copy="Create multiple back-office accounts and assign only the role each person needs."
      >
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-[24px] bg-brand-background p-5 shadow-soft"
        >
          <Field label="Name">
            <TextInput
              value={userForm.name}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
              placeholder="Ayesha Khan"
            />
          </Field>

          <Field label="Username">
            <TextInput
              value={userForm.username}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  username: event.target.value
                }))
              }
              placeholder="ayesha"
            />
          </Field>

          <Field
            label={userForm.id ? "Password" : "Password"}
            hint={userForm.id ? "Leave blank to keep the current password." : ""}
          >
            <TextInput
              type="password"
              value={userForm.password}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  password: event.target.value
                }))
              }
              placeholder={userForm.id ? "Optional new password" : "Create password"}
            />
          </Field>

          <Field label="Role">
            <SelectInput
              value={userForm.role}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  role: event.target.value
                }))
              }
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </SelectInput>
          </Field>

          <ToggleInput
            label="Active account"
            checked={userForm.isActive}
            onChange={(event) =>
              setUserForm((current) => ({
                ...current,
                isActive: event.target.checked
              }))
            }
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting === "user"}
              className="button-primary gap-2"
            >
              {userForm.id ? <Save size={16} /> : <UserPlus size={16} />}
              {submitting === "user"
                ? "Saving..."
                : userForm.id
                  ? "Save User"
                  : "Create User"}
            </button>
            {userForm.id ? (
              <button type="button" onClick={onReset} className="button-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Team accounts"
        copy="Roles limit what each user can access in the admin panel and API."
      >
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search users by name, username, role, or status"
          />
        </div>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-[24px] bg-brand-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-brand-primary">
                      {user.name || user.username}
                    </p>
                    <Badge>{user.role.replace(/_/g, " ")}</Badge>
                    <Badge tone={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "active" : "disabled"}
                    </Badge>
                    {user.id === currentUserId ? <Badge>you</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">@{user.username}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="button-secondary gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  {user.id !== currentUserId ? (
                    <button
                      type="button"
                      onClick={() => onDelete(user.id)}
                      disabled={submitting === `delete-user-${user.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {!users.length ? (
            <EmptyState
              title="No team users yet"
              copy="Create extra admin accounts here and assign roles for catalog, support, or management."
            />
          ) : null}

          {users.length && !filteredUsers.length ? (
            <EmptyState
              title="No matching users"
              copy="Try a different staff name, username, role, or account status."
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
