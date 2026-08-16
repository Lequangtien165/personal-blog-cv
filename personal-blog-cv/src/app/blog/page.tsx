import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { SubpageShell } from "@/components/terminal/subpage-shell";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Chia sẻ chuyên sâu về DevOps, Cloud Architecture, Kubernetes và tự động hóa hệ thống — QT-OS journal.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <SubpageShell module="JOURNAL">
      <div style={{ marginBottom: "12px" }}>
        <span style={{ color: "var(--accent)" }}>$</span> ls -la /journal/
      </div>

      <h1
        style={{
          fontSize: "28px",
          fontWeight: 500,
          color: "var(--fg)",
          lineHeight: 1,
          marginBottom: "4px",
        }}
      >
        Journal
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "var(--dim)",
          marginBottom: "20px",
        }}
      >
        Notes on building reliable systems — markdown, no fluff.
      </p>

      {posts.length > 0 ? (
        <div className="file-table">
          <div className="file-row hdr">
            <span>NAME</span>
            <span>SIZE</span>
            <span>DATE</span>
            <span>SUMMARY</span>
          </div>

          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="file-row"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="file-name">{post.slug}.md</span>
              <span className="file-size">{post.readingTime}</span>
              <span className="file-date">{post.date}</span>
              <span className="dimtext">{post.summary}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "var(--dim)" }}>
          No entries found. Check back later.
        </p>
      )}

      <Link
        href="/"
        className="open-btn"
        style={{ marginTop: "16px", textDecoration: "none" }}
      >
        $ cd ../ [BACK]
      </Link>
    </SubpageShell>
  );
}