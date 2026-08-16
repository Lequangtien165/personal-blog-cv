import { getCvHtml } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";
import { SubpageShell } from "@/components/terminal/subpage-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description: "CV & Resume của Lê Quang Tiến — DevOps / Cloud Engineer",
};

export default async function CvPage() {
  const html = await getCvHtml();

  return (
    <SubpageShell module="CV">
      <div style={{ marginBottom: "12px" }}>
        <span style={{ color: "var(--accent)" }}>$</span> cat resume.txt
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="open-btn"
          style={{ textDecoration: "none" }}
        >
          $ open GITHUB ↗
        </a>
      </div>

      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div style={{ marginTop: "32px" }}>
        <Link
          href="/"
          className="open-btn"
          style={{ textDecoration: "none" }}
        >
          $ cd ../ [BACK HOME]
        </Link>
      </div>
    </SubpageShell>
  );
}