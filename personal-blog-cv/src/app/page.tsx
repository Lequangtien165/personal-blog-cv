import Link from "next/link";
import { getAllPosts } from "@/lib/content";

const featuredProjects = [
  {
    title: "AIOps-Intelligent-Agent-System",
    description:
      "Hệ thống AI agent tự động phát hiện, phân tích và đề xuất hướng xử lý sự cố trong hạ tầng CNTT, kết hợp monitoring, xử lý bất đồng bộ và AI.",
    tags: ["Python", "AI", "Monitoring", "FastAPI"],
    href: "https://github.com/Lequangtien165/AIOps-Intelligent-Agent-System",
  },
  {
    title: "eks-platform-infra",
    description:
      "Xây dựng platform trên AWS để deploy và vận hành ứng dụng mẫu bằng Terraform, EKS, Helm, ArgoCD, Prometheus/Grafana và baseline bảo mật.",
    tags: ["Terraform", "AWS", "EKS", "Kubernetes"],
    href: "https://github.com/Lequangtien165/eks-platform-infra",
  },
  {
    title: "Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
    description:
      "Pipeline CI/CD end-to-end từ Docker Compose đến Jenkins và AWS để triển khai có thể mở rộng theo mô hình production.",
    tags: ["Jenkins", "Docker", "AWS", "CI/CD"],
    href: "https://github.com/Lequangtien165/Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
  },
  {
    title: "personal-blog-cv",
    description:
      "Blog cá nhân và CV được xây dựng với Next.js, tối ưu nội dung, trải nghiệm người dùng và workflow triển khai hiện đại.",
    tags: ["Next.js", "TypeScript", "Portfolio", "Blog"],
    href: "https://github.com/Lequangtien165/personal-blog-cv",
  },
  {
    title: "Static-Server-Based-Load-Balancing",
    description:
      "Project nghiên cứu về Load Balancing trên SDN, mô phỏng topology và phân phối lưu lượng trong môi trường mạng lớn hơn.",
    tags: ["Python", "Networking", "SDN", "Load Balancing"],
    href: "https://github.com/Lequangtien165/Static-Server-Based-Load-Balancing",
  },
  {
    title: "simple-blog",
    description:
      "Một blog đơn giản để học và làm quen với tạo nội dung, giao diện web và việc quản lý bài đăng trên nền tảng frontend.",
    tags: ["HTML", "Blog", "Frontend"],
    href: "https://github.com/Lequangtien165/simple-blog",
  },
];

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
            <p className="subtitle">DevOps & Cloud Infrastructure Intern</p>
            <p>
              Tôi là sinh viên chuyên ngành Mạng máy tính, tập trung vào Cloud,
              DevOps, AI-driven operations và tự động hóa hạ tầng. Mục tiêu của tôi
              là xây dựng các hệ thống ổn định, an toàn và dễ triển khai.
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
              <span className="chip">AWS</span>
              <span className="chip">Terraform</span>
              <span className="chip">Docker</span>
              <span className="chip">Kubernetes</span>
              <span className="chip">Python</span>
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

      <section className="intro-panel">
        <div>
          <p className="panel-eyebrow">About</p>
          <h3>Tôi xây dựng hệ thống cloud và automation với sự rõ ràng về kiến trúc và mục tiêu.</h3>
        </div>
        <p>
          Tôi quan tâm đến việc thiết kế hạ tầng có thể mở rộng, cấu hình triển khai tự động,
          giám sát liên tục và tích hợp AI vào quy trình vận hành. Mỗi dự án tôi làm đều cố gắng
          kết hợp kỹ thuật, hiệu quả và khả năng truyền tải rõ ràng.
        </p>
      </section>

      <section className="projects-section">
        <div className="section-heading">
          <h2 className="section-title">Featured projects</h2>
          <a
            href="https://github.com/Lequangtien165?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="section-link"
          >
            Xem GitHub
          </a>
        </div>

        <div className="project-grid">
          {featuredProjects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="project-card"
            >
              <div className="project-top">
                <span className="project-type">GitHub repo</span>
                <span className="project-link">↗</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
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