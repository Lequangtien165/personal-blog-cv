import { SiteHeader, type NavKey } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

interface PageShellProps {
  active?: NavKey;
  children: React.ReactNode;
}

/** Shared chrome for secondary pages (journal, post, CV, 404). */
export function PageShell({ active, children }: PageShellProps) {
  return (
    <>
      <SiteHeader active={active} />
      <main id="main-content" className="shell page-main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
