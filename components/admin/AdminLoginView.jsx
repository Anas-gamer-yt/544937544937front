import { Field, StatusBanner, TextInput } from "@/components/admin/AdminShared";

export default function AdminLoginView({
  loginForm,
  setLoginForm,
  error,
  cooldownSeconds,
  isLocked,
  isSubmitDisabled,
  submitting,
  onSubmit
}) {
  const hasCooldown = Number(cooldownSeconds || 0) > 0;
  const minutes = Math.floor(Number(cooldownSeconds || 0) / 60);
  const seconds = Number(cooldownSeconds || 0) % 60;
  const cooldownLabel = minutes
    ? `${minutes}:${String(seconds).padStart(2, "0")}`
    : `${seconds}s`;

  return (
    <div className="page-shell section-shell">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card p-8 sm:p-10">
            <p className="section-kicker">Admin Access</p>
            <h1 className="mt-5 font-display text-5xl leading-none text-brand-primary">
              Sign in to manage the store
            </h1>
            <p className="mt-5 text-base leading-8 text-brand-muted">
              Use the admin credentials from your backend env file. The first
              admin account is created automatically when the API boots.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <Field label="Username">
                <TextInput
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      username: event.target.value
                    }))
                  }
                  placeholder="admin"
                />
              </Field>

              <Field label="Password">
                <TextInput
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  placeholder="Your admin password"
                />
              </Field>

              <StatusBanner message={error} />

              {hasCooldown ? (
                <p className="text-sm leading-7 text-amber-700">
                  Login is temporarily paused for this username. Try again in{" "}
                  <span className="font-semibold tabular-nums">
                    {cooldownLabel}
                  </span>
                  . Repeated failures will lock the account after 50 total
                  failed attempts.
                </p>
              ) : null}

              {isLocked ? (
                <p className="text-sm leading-7 text-red-700">
                  This account is locked. A super admin needs to restore access
                  before it can be used again.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="button-primary w-full justify-center"
              >
                {submitting === "login"
                  ? "Signing in..."
                  : hasCooldown
                    ? `Try again in ${cooldownLabel}`
                    : isLocked
                      ? "Account Locked"
                      : "Sign In"}
              </button>
            </form>
          </div>

          <div className="surface-card bg-brand-primary p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-secondary">
              Admin Capabilities
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "Change WhatsApp number and store label",
                "Create, edit, disable, and remove categories",
                "Manage products with category, pricing, tags, and stock",
                "Enable or disable payment methods instantly",
                "Review orders and update statuses"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/12 bg-white/8 px-5 py-4"
                >
                  <p className="text-sm leading-7 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
