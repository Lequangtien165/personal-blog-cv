import Link from "next/link";
import { site } from "@/lib/site";

interface SubpageShellProps {
  module: string;
  children: React.ReactNode;
}

/**
 * Shared terminal chrome for secondary pages (blog, cv).
 * Server component — no client state needed.
 */
export function SubpageShell({ module, children }: SubpageShellProps) {
  return (
    <div style={{ minHeight: "100svh", background: "var(--bg)", overflow: "auto" }}>
      <div className="subpage-topbar">
        <Link
          href="/"
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          {site.systemName}
          <span style={{ color: "var(--dim)" }}>{" // "}</span>
          <span style={{ color: "var(--accent)" }}>{module}</span>
        </Link>

        <nav
          aria-label="Secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "10px",
            letterSpacing: "0.08em",
          }}
        >
          <Link
            href="/"
            style={{ color: "var(--dim)", textDecoration: "none" }}
          >
            ../HOME
          </Link>
          <Link
            href="/blog"
            style={{ color: "var(--dim)", textDecoration: "none" }}
          >
            JOURNAL
          </Link>
          <Link
            href="/cv"
            style={{ color: "var(--dim)", textDecoration: "none" }}
          >
            CV
          </Link>
        </nav>
      </div>

      <main className="subpage">{children}</main>
    </div>
  );
}