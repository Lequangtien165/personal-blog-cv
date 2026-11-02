import Link from "next/link";
import { site } from "@/lib/site";

export type NavKey = "work" | "about" | "resume" | "journal" | "contact";

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: "work", label: "Projects", href: "/#work" },
  { key: "about", label: "About", href: "/#about" },
  { key: "resume", label: "Resume", href: "/cv" },
  { key: "journal", label: "Journal", href: "/blog" },
  { key: "contact", label: "Contacts", href: "/#contact" },
];

export function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-name">{site.nameUpper}</span>
        <span className="brand-role">{site.role}</span>
      </Link>
      <nav aria-label="Main navigation" className="site-nav">
        {NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={item.key === active ? "is-active" : undefined}
            aria-current={item.key === active ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
