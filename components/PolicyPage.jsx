import { resolveSiteContent } from "@/lib/siteContent";

function splitPolicyContent(value) {
  return String(value || "")
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean);
}

export default function PolicyPage({
  siteContent,
  eyebrow,
  title,
  intro,
  body
}) {
  const content = resolveSiteContent(siteContent);
  const sections = splitPolicyContent(body);

  return (
    <div className="page-shell section-shell">
      <div className="reveal-scroll max-w-4xl">
        <p className="section-kicker">{eyebrow}</p>
        <h1 className="mt-5 section-title">{title}</h1>
        <p className="mt-5 section-copy">{intro || content.siteTagline}</p>
      </div>

      <div className="mt-12 grid gap-6">
        {sections.map((section, index) => (
          <article
            key={`${title}-${index}`}
            className={`reveal-scroll reveal-scroll-delay-${index % 4} surface-card p-6 sm:p-8`}
          >
            <p className="text-sm leading-8 text-brand-muted sm:text-base">
              {section}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
