import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="container">
      <header className="hero">
        <h1>Blog & CV</h1>
        <p>Nơi tôi ghi lại bài viết kỹ thuật và hồ sơ cá nhân.</p>
        <Link href="/cv">Xem CV</Link>
      </header>

      <section>
        <h2>Bài viết</h2>
        {posts.map((post) => (
          <article key={post.slug} className="post-card">
            <Link href={`/blog/${post.slug}`}>
              <h3>{post.title}</h3>
            </Link>
            <time>{post.date}</time>
            <p>{post.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}