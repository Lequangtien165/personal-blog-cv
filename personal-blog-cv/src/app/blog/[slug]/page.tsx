import { getAllPosts, getPost } from "@/lib/content";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getAllPosts().find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const exists = getAllPosts().some((post) => post.slug === slug);

  if (!exists) notFound();

  const post = await getPost(slug);

  return (
    <main className="container">
      <article className="prose">
        <h1>{post.meta.title}</h1>
        <time>{post.meta.date}</time>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}