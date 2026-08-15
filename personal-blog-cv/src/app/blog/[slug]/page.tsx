import Link from "next/link";
import { getAllPosts, getPost } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ScrollProgress } from "@/components/scroll-progress";

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
    <>
      <ScrollProgress />
      <main className="container" style={{ paddingTop: "40px", paddingBottom: "64px" }}>
        {/* Glass card = post-page, prose content = inner div */}
        <article className="post-page">
          <Link href="/blog" className="back-link">
            Quay lại blog
          </Link>
          <h1>{post.meta.title}</h1>
          <div className="post-meta-line">
            <time>{post.meta.formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span>{post.meta.readingTime}</span>
            {post.meta.tags.length > 0 && (
              <div className="post-tags">
                {post.meta.tags.map((tag) => (
                  <span key={tag} className="post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Prose content in its own div so .prose styles are scoped correctly */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
    </>
  );
}
