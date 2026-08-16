export function CvSection() {
  return (
    <div id="page-resume">
      <div>
        <span className="cmd-prompt">$</span> cat resume.txt
      </div>
      <div className="cs-body section-gap">
        <div className="cs-section-title">// experience</div>

        <div className="exp-block">
          <div className="exp-company">
            Cloud-Based AI Agent Network Incident Detection
          </div>
          <div className="exp-meta">
            <span className="exp-dates">2025 -- 2026</span>
            <span className="exp-role">DevOps / AI Engineer</span>
          </div>
          <div className="exp-bullet">
            Hệ thống AI Agent tự động phát hiện, phân loại và cảnh báo sự cố
            mạng trên môi trường Cloud trong thời gian thực
          </div>
          <div className="exp-bullet">
            Tích hợp OpenAI GPT-4 API và LangChain để phân tích logs, dự đoán
            sự cố trước khi hệ thống ngưng hoạt động
          </div>
          <div className="exp-bullet">
            Giảm thời gian MTTR (Mean Time to Resolution) lên đến 60%
          </div>
        </div>

        <div className="exp-block">
          <div className="exp-company">
            Production-ready EKS Platform Infrastructure
          </div>
          <div className="exp-meta">
            <span className="exp-dates">2025 -- 2026</span>
            <span className="exp-role">Cloud Platform Engineer</span>
          </div>
          <div className="exp-bullet">
            Nền tảng hạ tầng Kubernetes hoàn chỉnh trên AWS sử dụng Terraform +
            EKS + Helm + ArgoCD GitOps
          </div>
          <div className="exp-bullet">
            Hệ thống Observability toàn diện với Prometheus metrics & Grafana
            dashboards
          </div>
          <div className="exp-bullet">
            Tự động co giãn cụm (Cluster Autoscaler & Horizontal Pod Autoscaler)
          </div>
        </div>

        <div className="exp-block">
          <div className="exp-company">
            End-to-End CI/CD Pipeline on AWS with Jenkins & Docker
          </div>
          <div className="exp-meta">
            <span className="exp-dates">2025</span>
            <span className="exp-role">DevOps Engineer</span>
          </div>
          <div className="exp-bullet">
            Quy trình tự động hóa triển khai khép kín kết hợp Docker Compose,
            Jenkins server và AWS EC2
          </div>
          <div className="exp-bullet">
            Triển khai không gián đoạn (Zero-downtime) lên AWS EC2 qua SSH
          </div>
        </div>

        <div className="cs-section-title">// education</div>
        <div className="exp-block">
          <div className="exp-company">
            University of Information Technology (UIT), VNU-HCM
          </div>
          <div className="exp-meta">
            <span className="exp-dates">2021 -- 2026</span>
            <span className="exp-role">
              B.Eng. Computer Networks & Data Communication
            </span>
          </div>
          <div className="exp-bullet">
            Certified: AWS Cloud Practitioner (CLF-C02) · IELTS 6.5
          </div>
        </div>

        <div className="cs-section-title">// skills</div>
        <div className="skills-grid">
          <span className="skill-cat">CLOUD</span>
          <span>AWS · EC2 · EKS · ECR · IAM · VPC</span>
          <span className="skill-cat">ORCH</span>
          <span>Kubernetes · Helm · Argo CD</span>
          <span className="skill-cat">AUTOMATION</span>
          <span>Terraform · Ansible · GitHub Actions · Jenkins</span>
          <span className="skill-cat">OBSERVE</span>
          <span>Prometheus · Grafana · Alertmanager</span>
          <span className="skill-cat">AI OPS</span>
          <span>FastAPI · Gemini · RAG · Celery · Redis</span>
          <span className="skill-cat">SYSTEMS</span>
          <span>Linux · Networking · Docker · Bash · Python</span>
          <span className="skill-cat">LANGUAGES</span>
          <span>Vietnamese (native) · English (IELTS 6.5)</span>
        </div>
      </div>
    </div>
  );
}