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

const techStackIcons =
  "aws,docker,kubernetes,terraform,ansible,prometheus,grafana,python,fastapi,jenkins,linux,git";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="container">
      <header className="hero">
        <div className="hero-main">
          <div className="hero-avatar">QT</div>
          <div className="hero-content">
            <span className="eyebrow">Portfolio • Blog </span>
            <h1>Quang Tien</h1>
            <p className="subtitle">DevOps/Cloud enthusiast</p>
            <div className="hero-actions">
              <Link href="/cv" className="btn btn-primary">
                Xem CV
              </Link>
              <a href="#posts" className="btn btn-secondary">
                Bài viết
              </a>
            </div>
            <div className="techstack-row">
              <img
                src={`https://skillicons.dev/icons?i=${techStackIcons}`}
                alt="Tech stack: AWS, Docker, Kubernetes, Terraform, Ansible, Prometheus, Grafana, Python, FastAPI, Jenkins, Linux, Git"
                className="techstack-img"
              />
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