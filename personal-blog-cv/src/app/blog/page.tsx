import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Chia sẻ về DevOps, Cloud, và những gì tôi đang học.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="container">
      <header className="page-header">
        <h1>Blog <span>/</span></h1>
        <p>Chia sẻ về DevOps, Cloud, và những gì tôi đang học.</p>
      </header>

      {posts.length > 0 ? (
        <div className="posts-container">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <time className="post-meta">{post.formattedDate}</time>
              </div>
              <p>{post.summary}</p>
              <div className="post-footer">
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="post-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <span className="post-meta">{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-state">Chưa có bài viết nào. Quay lại sau nhé!</p>
      )}
    </main>
  );
}
