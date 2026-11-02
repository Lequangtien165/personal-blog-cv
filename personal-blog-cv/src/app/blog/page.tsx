import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Ghi chép về vận hành hệ thống, Linux, hạ tầng cloud, monitoring, troubleshooting và automation.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageShell active="journal">
      <div className="page-head">
        <h1 className="display">
          Journal<span className="dot-accent">.</span>
        </h1>
        <p className="lede">
          Notes on system operations, infrastructure, and practical
          troubleshooting.
        </p>
      </div>

      <p className="label">{posts.length} entries</p>
      {posts.length > 0 ? (
        <ul className="rows">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="row row-link">
                <span className="row-meta">{post.date}</span>
                <span className="row-main">
                  <span className="row-title">{post.title}</span>
                  <span className="row-sub">{post.summary}</span>
                </span>
                <span className="row-aside">
                  {post.readingTime}
                  <span className="row-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="lede">No entries yet. Check back later.</p>
      )}
    </PageShell>
  );
}
