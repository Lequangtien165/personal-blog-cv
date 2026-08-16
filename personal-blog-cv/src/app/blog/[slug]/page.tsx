import Link from "next/link";
import { getAllPosts, getPost } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SubpageShell } from "@/components/terminal/subpage-shell";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    authors: [{ name: "Quang Tiến" }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      siteName: "Quang Tiến",
      locale: "vi_VN",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const exists = getAllPosts().some((post) => post.slug === slug);

  if (!exists) notFound();

  const post = await getPost(slug);

  return (
    <SubpageShell module={`BLOG/${post.meta.slug}`}>
      <div style={{ marginBottom: "12px" }}>
        <span style={{ color: "var(--accent)" }}>$</span> cat
        /journal/{post.meta.slug}.md
      </div>

      <Link
        href="/blog"
        className="open-btn"
        style={{ textDecoration: "none", marginBottom: "16px" }}
      >
        ← back /journal/
      </Link>

      <article style={{ marginTop: "24px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 500,
            color: "var(--fg)",
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          {post.meta.title}
        </h1>

        <div
          style={{
            marginTop: "12px",
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "var(--dim)",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "12px",
          }}
        >
          <time style={{ fontVariantNumeric: "tabular-nums" }}>
            {post.meta.date}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.meta.readingTime}</span>
          {post.meta.tags.length > 0 && (
            <span style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    border: "1px solid var(--border)",
                    padding: "2px 6px",
                    fontSize: "9px",
                    color: "var(--dim)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </SubpageShell>
  );
}