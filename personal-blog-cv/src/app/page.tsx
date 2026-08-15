import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { HeroVisual } from "@/components/hero-visual";

const pinnedProjects = [
  {
    title: "Cloud-Based-AI-Agent-System",
    description:
      "AI Agent System phát hiện và cảnh báo sự cố mạng trên cloud. Đồ án chuyên ngành Mạng máy tính.",
    language: "Python",
    stars: 1,
    href: "https://github.com/Benjaminnhnn/Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
  },
  {
    title: "eks-platform-infra",
    description:
      "Platform thu nhỏ trên AWS: Terraform + EKS + Helm + ArgoCD + Prometheus/Grafana + Loki + security baseline.",
    language: "HCL",
    stars: 0,
    href: "https://github.com/Lequangtien165/eks-platform-infra",
  },
  {
    title: "Static-Server-Based-Load-Balancing",
    description:
      "Static Server-Based Load Balancing trên SDN (Software-Defined Networking). Đồ án môn NT541.",
    language: "Python",
    stars: 1,
    href: "https://github.com/Lequangtien165/Static-Server-Based-Load-Balancing",
  },
  {
    title: "Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
    description:
      "End-to-end CI/CD pipeline với Docker Compose, Jenkins, và AWS cho scalable deployments.",
    language: "Java",
    stars: 3,
    href: "https://github.com/Lequangtien165/Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
  },
  {
    title: "Deploying-Super-Mario-on-Kubernetes-using-Terraform",
    description: "Fun project: Deploy Super Mario lên Kubernetes cluster bằng Terraform.",
    language: "HCL",
    stars: 0,
    href: "https://github.com/Lequangtien165/Deploying-Super-Mario-on-Kubernetes-using-Terraform",
  },
];

const techStack = [
  { name: "AWS",        key: "aws"        },
  { name: "Docker",     key: "docker"     },
  { name: "Kubernetes", key: "kubernetes" },
  { name: "Terraform",  key: "terraform"  },
  { name: "Ansible",    key: "ansible"    },
  { name: "Prometheus", key: "prometheus" },
  { name: "Grafana",    key: "grafana"    },
  { name: "Python",     key: "python"     },
  { name: "FastAPI",    key: "fastapi"    },
  { name: "Jenkins",    key: "jenkins"    },
  { name: "Linux",      key: "linux"      },
  { name: "Git",        key: "git"        },
];

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            {/* Text side */}
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span className="status-dot" />
                DevOps · Cloud · Open Source
              </div>

              <h1 className="hero-name">
                <span className="name-line">Quang</span>
                <span className="name-line name-accent" data-text="Tiến">Tiến</span>
              </h1>

              <p className="hero-desc">
                Building cloud infrastructure, automating CI/CD pipelines,
                and exploring AI‑driven operations.
              </p>

              <div className="hero-actions">
                <Link href="/cv" className="btn btn-primary">
                  Xem CV
                </Link>
                <a href="#posts" className="btn btn-ghost">
                  Bài viết
                </a>
              </div>

              <div className="techstack-row">
                {techStack.map((item) => (
                  <div
                    key={item.key}
                    className="tech-item"
                    data-tooltip={item.name}
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${item.key}&size=48`}
                      alt={item.name}
                      className="tech-logo-img"
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Visual side */}
            <div className="hero-visual-wrap">
              <HeroVisual />
            </div>
          </div>

          {/* Stats row */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">06+</span>
                <span className="stat-label">Featured repos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">03</span>
                <span className="stat-label">Cloud &amp; DevOps tracks</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">∞</span>
                <span className="stat-label">Ideas in motion</span>
              </div>
              <div className="stat-item stat-focus">
                <span className="stat-value">● FOCUS</span>
                <span className="stat-label">
                  Cloud automation, observability, and AI-enhanced incident response.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────── */}
      <section className="section-wrap container">
        <div className="section-header">
          <h2 className="section-title">Pinned Projects</h2>
          <a
            href="https://github.com/Lequangtien165?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="section-link"
          >
            All repos
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
                <span className="project-icon" aria-hidden="true">▣</span>
                <span className="project-name">{project.title}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-footer">
                <span className="project-language">
                  <span
                    className={`language-dot ${project.language.toLowerCase()}`}
                    aria-hidden="true"
                  />
                  {project.language}
                </span>
                <span className="project-stars">★ {project.stars}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── POSTS ─────────────────────────────────────── */}
      <section id="posts" className="section-wrap container">
        <div className="section-header">
          <h2 className="section-title">Bài viết gần đây</h2>
          <Link href="/blog" className="section-link">
            Xem tất cả
          </Link>
        </div>

        <div className="posts-container">
          {posts.length > 0 ? (
            posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="post-card"
              >
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
            ))
          ) : (
            <p className="empty-state">Chưa có bài viết nào. Quay lại sau!</p>
          )}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="footer container">
        <div className="footer-links">
          <a
            href="https://github.com/Lequangtien165"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
            aria-label="GitHub profile"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Lequangtien165
          </a>
          <span aria-hidden="true">·</span>
          <span>© 2026 Quang Tiến</span>
          <span aria-hidden="true">·</span>
          <span>Made with <span className="footer-heart">♥</span></span>
        </div>
      </footer>
    </main>
  );
}