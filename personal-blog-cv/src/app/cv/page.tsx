import { getCvHtml } from "@/lib/content";
import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV của Lê Quang Tiến — System Engineer, IT operations, Linux, Windows Server và VMware ESXi",
};

export default async function CvPage() {
  const html = await getCvHtml();

  return (
    <PageShell active="resume">
      <div className="page-head">
        <h1 className="display">
          Resume<span className="dot-accent">.</span>
        </h1>
        <div className="detail-actions">
          <a href={`mailto:${site.email}`} className="btn btn-solid">
            {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            GitHub ↗
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>

      <article
        className="prose prose-cv"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageShell>
  );
}
