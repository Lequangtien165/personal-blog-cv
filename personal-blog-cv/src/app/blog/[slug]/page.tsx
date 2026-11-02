import Link from "next/link";
import { getAllPosts, getPost } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";

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
    <PageShell active="journal">
      <article className="post">
        <Link href="/blog" className="arrow-link back-link">
          ← Journal
        </Link>

        <h1 className="post-title">{post.meta.title}</h1>

        <div className="post-meta">
          <time>{post.meta.date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.meta.readingTime}</span>
          {post.meta.tags.length > 0 && (
            <span className="post-tags">
              {post.meta.tags.map((tag) => (
                <span key={tag} className="tag">
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

        <div className="post-end">
          <Link href="/blog" className="btn">
            ← All entries
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
