import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="container">
      <header className="hero">
        <div className="hero-main">
          <div className="hero-avatar">QT</div>
          <div className="hero-content">
            <span className="eyebrow">Portfolio • Blog • CV</span>
            <h1>Quang Tiến</h1>
            <p className="subtitle">Computer Networks & Communications Student</p>
            <p>
              Nơi lưu trữ các bài viết, dự án, và hồ sơ của mình. Tôi học về cloud
              infrastructure, DevOps, AI agents, và tất cả những thứ thú vị khác.
            </p>
            <div className="hero-actions">
              <Link href="/cv" className="btn btn-primary">
                Xem CV
              </Link>
              <a href="#posts" className="btn btn-secondary">
                Bài viết
              </a>
            </div>
            <div className="chip-row">
              <span className="chip">Cloud</span>
              <span className="chip">DevOps</span>
              <span className="chip">AI</span>
              <span className="chip">Infrastructure</span>
            </div>
          </div>
        </div>

        <div className="hero-aside">
          <div className="mini-panel">
            <span className="mini-label">Currently</span>
            <strong>Building systems for a smarter workflow.</strong>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <span className="metric-value">02+</span>
              <span className="metric-label">Years exploring</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">10+</span>
              <span className="metric-label">Side projects</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">∞</span>
              <span className="metric-label">Ideas in motion</span>
            </div>
          </div>
        </div>
      </header>

      <section className="intro-panel">
        <div>
          <p className="panel-eyebrow">About</p>
          <h3>Tôi tập trung vào cloud, automation, và trải nghiệm kỹ thuật rõ ràng.</h3>
        </div>
        <p>
          Mỗi dự án tôi làm đều cố gắng kết hợp giữa góc nhìn kỹ thuật, khả năng giải quyết vấn đề và sự rõ ràng trong thiết kế.
        </p>
      </section>

      <section id="posts" className="posts-section">
        <div className="section-heading">
          <h2 className="section-title">Bài viết gần đây</h2>
          <Link href="/" className="section-link">
            Xem tất cả
          </Link>
        </div>

        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <time className="post-meta">{post.date}</time>
                </div>
                <p>{post.summary}</p>
                <span className="post-tag">Bài viết</span>
              </Link>
            ))
          ) : (
            <p className="empty-state">Chưa có bài viết nào. Quay lại sau!</p>
          )}
        </div>
      </section>

      <footer className="footer">© 2026 Quang Tiến. All rights reserved.</footer>
    </main>
  );
}