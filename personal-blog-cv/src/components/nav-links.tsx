"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Blog" },
  { href: "/cv", label: "CV" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="nav-links">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={isActive ? "nav-link active" : "nav-link"}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
