import Link from "next/link";
import { getAllPosts } from "@/lib/content";

const pinnedProjects = [
  {
    title: "Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
    description: "Đồ án chuyên ngành Mạng máy tính",
    language: "Python",
    stars: 1,
    href: "https://github.com/Benjaminnhnn/Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
  },
  {
    title: "eks-platform-infra",
    description:
      "Build một platform thu nhỏ trên AWS để deploy và vận hành 1 ứng dụng mẫu bằng Terraform + EKS + Helm + ArgoCD + Prometheus/Grafana + Loki + security baseline",
    language: "HCL",
    stars: 0,
    href: "https://github.com/Lequangtien165/eks-platform-infra",
  },
  {
    title: "Static-Server-Based-Load-Balancing",
    description:
      "Static Server-Based Load Balancing trên SDN (Software-Defined Networking). Nội dung đồ án của môn học NT541",
    language: "Python",
    stars: 1,
    href: "https://github.com/Lequangtien165/Static-Server-Based-Load-Balancing",
  },
  {
    title: "Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
    description:
      "End-to-end CI/CD pipeline leveraging Docker Compose, Jenkins, and AWS for scalable deployments.",
    language: "Java",
    stars: 3,
    href: "https://github.com/Lequangtien165/Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
  },
  {
    title: "Deploying-Super-Mario-on-Kubernetes-using-Terraform",
    description: "funny project",
    language: "HCL",
    stars: 0,
    href: "https://github.com/Lequangtien165/Deploying-Super-Mario-on-Kubernetes-using-Terraform",
  },
];

const techStack = [
  { name: "AWS", key: "aws" },
  { name: "Terraform", key: "terraform" },
  { name: "Docker", key: "docker" },
  { name: "Kubernetes", key: "kubernetes" },
  { name: "Python", key: "python" },
];

function TechLogo({ type }: { type: string }) {
  if (type === "aws") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M22 21.4c0-2.3 1.9-4.2 4.2-4.2h11.5c2.3 0 4.2 1.9 4.2 4.2v1.1H22v-1.1Zm-4.4 8.2h32.8v18.2c0 2.3-1.9 4.2-4.2 4.2H21.8c-2.3 0-4.2-1.9-4.2-4.2V29.6Zm7.8 7.5c0-1.4 1.1-2.5 2.5-2.5h5.1c1.4 0 2.5 1.1 2.5 2.5v2.5c0 1.4-1.1 2.5-2.5 2.5h-5.1c-1.4 0-2.5-1.1-2.5-2.5v-2.5Zm15.9-1.9h4.5v6h-4.5v-6Zm-17.6 9.1h22.8v3.5H23.8v-3.5Z" fill="currentColor"/>
      </svg>
    );
  }

  if (type === "terraform") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M25 11.5 11 19v20.5l14-7.5V11.5Zm18 0-14 7.5v20.5l14-7.5V11.5Zm-18 24.8L11 43.8v8.7l14-7.5v-8.7Zm18-2.2v8.7l14-7.5v-8.7L43 34.1Z" fill="currentColor"/>
      </svg>
    );
  }

  if (type === "docker") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M15 27h8v8h-8v-8Zm10 0h8v8h-8v-8Zm10 0h8v8h-8v-8Zm10 0h8v8h-8v-8Zm-28 10h8v8h-8v-8Zm10 0h8v8h-8v-8Zm10 0h8v8h-8v-8Zm-24-18h42v6H23v-6Zm-8 26h52v6H15v-6Z" fill="currentColor"/>
        <path d="M16 47h34v5H16v-5Z" fill="currentColor" opacity="0.9"/>
      </svg>
    );
  }

  if (type === "kubernetes") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 16h10l12 12 12-12h10v8l-12 12 12 12v8H34l-12-12-12 12H0v-8l12-12L0 24v-8h10Zm18 8-8 8 8 8 8-8-8-8Z" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 16c-3 0-5 2-5 5v22c0 3 2 5 5 5h4v-8h-3V22h3v7h4V21c0-3-2-5-5-5Zm17 0c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h9c4.4 0 8-3.6 8-8V24c0-4.4-3.6-8-8-8h-9Zm0 8h6c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4h-6c-2.2 0-4-1.8-4-4V28c0-2.2 1.8-4 4-4Zm-15 8h10v8H20v-8Z" fill="currentColor"/>
    </svg>
  );
}

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
            <p className="subtitle">DevOps Intern</p>
            <div className="hero-actions">
              <Link href="/cv" className="btn btn-primary">
                Xem CV
              </Link>
              <a href="#posts" className="btn btn-secondary">
                Bài viết
              </a>
            </div>
            <div className="techstack-row">
              {techStack.map((item) => (
                <div key={item.name} className="tech-item">
                  <div className={`tech-logo tech-logo-${item.key}`} aria-hidden="true">
                    <TechLogo type={item.key} />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-aside">
          <div className="mini-panel">
            <span className="mini-label">Current focus</span>
            <strong>Cloud automation, observability, and AI-enhanced incident response.</strong>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <span className="metric-value">06+</span>
              <span className="metric-label">Featured repos</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">03</span>
              <span className="metric-label">Cloud & DevOps tracks</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">∞</span>
              <span className="metric-label">Ideas in motion</span>
            </div>
          </div>
        </div>
      </header>

      <section className="projects-section">
        <div className="pinned-header">
          <h2 className="section-title">Pinned</h2>
          <a
            href="https://github.com/Lequangtien165?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="section-link"
          >
            Customize your pins
          </a>
        </div>

        <div className="project-grid">
          {pinnedProjects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="project-card"
            >
              <div className="project-title-wrap">
                <span className="project-icon" aria-hidden="true">
                  ▣
                </span>
                <span className="project-name">{project.title}</span>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-footer">
                <span className="project-language">
                  <span className={`language-dot ${project.language.toLowerCase()}`} aria-hidden="true" />
                  {project.language}
                </span>
                <span className="project-stars">★ {project.stars}</span>
              </div>
            </a>
          ))}
        </div>
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