import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell section-shell">
      <div className="surface-card mx-auto max-w-2xl p-10 text-center">
        <p className="section-kicker">404</p>
        <h1 className="mt-5 font-display text-5xl text-brand-primary">
          This page does not exist
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-brand-muted">
          The route may be missing, or the product you requested no longer
          exists.
        </p>
        <Link href="/" className="button-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
