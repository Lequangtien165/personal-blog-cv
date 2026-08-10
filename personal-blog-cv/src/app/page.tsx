import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-avatar">QT</div>
        <div className="hero-content">
          <h1>Quang Tiến</h1>
          <p className="subtitle">Computer Networks & Communications Student</p>
          <p>Nơi lưu trữ các bài viết, dự án, và hồ sơ của mình. Tôi học về cloud infrastructure, DevOps, AI agents, và tất cả những thứ thú vị khác.</p>
          <div className="hero-actions">
            <Link href="/cv" className="btn">
              Xem CV
            </Link>
            <a href="#posts" className="btn">
              Bài viết
            </a>
          </div>
        </div>
      </header>

      {/* Posts Section */}
      <section id="posts">
        <h2 className="section-title">Bài viết gần đây</h2>
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="post-card"
              >
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <time className="post-meta">{post.date}</time>
                </div>
                <p>{post.summary}</p>
                <span className="post-tag">Bài viết</span>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              Chưa có bài viết nào. Quay lại sau!
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2026 Quang Tiến. All rights reserved.
      </footer>
    </main>
  );
}