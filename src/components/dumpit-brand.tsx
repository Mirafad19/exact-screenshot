import { Link } from "@tanstack/react-router";

export function DumpitBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={`dumpit-brand ${compact ? "dumpit-brand-compact" : ""}`} aria-label="Dumpit home">
      <span className="brand-mark" aria-hidden="true"><span /><i /><b /></span>
      <span>DUMPIT<span className="brand-period">.</span></span>
    </Link>
  );
}