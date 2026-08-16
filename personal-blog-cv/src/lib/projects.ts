export interface ProjectItem {
  id: string;
  number: string;
  fileName: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  role: string;
  year: string;
  status: string;
  size: string;
  tools: string;
  skills: string;
  concept: string;
  liveLink: string;
  features: string[];
  mediaSrc: string;
  mediaType: "video" | "image";
}

export const projects: ProjectItem[] = [
  {
    id: "ai-agent",
    number: "01",
    fileName: "AI_AGENT_INCIDENT_DETECTION.sys",
    title: "Cloud-Based AI Agent Network Incident Detection",
    subtitle: "Real-time Telemetry & Intelligent Remediation",
    description:
      "Hệ thống AI Agent tự động phát hiện, phân loại và cảnh báo sự cố mạng trên môi trường Cloud trong thời gian thực. Tích hợp OpenAI GPT-4 API và LangChain để phân tích logs, dự đoán sự cố trước khi hệ thống ngưng hoạt động.",
    type: "AI & Cloud Ops Automation",
    role: "DevOps / AI Engineer",
    year: "2026",
    status: "SHIPPED",
    size: "24.6kb",
    tools: "Python, FastAPI, OpenAI, LangChain, Prometheus",
    skills: "LLM Agents, Real-time Telemetry, Log Parsing, Incident Response",
    concept: "Autonomous Cloud Ops",
    liveLink:
      "https://github.com/Benjaminnhnn/Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
    features: [
      "Thu thập và chuẩn hóa logs mạng thời gian thực từ Cloud gateway",
      "Phân tích hành vi bất thường bằng LLM Agents và thuật toán anomaly detection",
      "Tự động gửi cảnh báo qua Telegram / Slack kèm đề xuất phương án khắc phục",
      "Giảm thời gian MTTR (Mean Time to Resolution) lên đến 60%",
      "Dashboard trực quan hóa metrics và thống kê sự cố tự động",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
  {
    id: "eks-infra",
    number: "02",
    fileName: "EKS_GITOPS_PLATFORM.cloud",
    title: "Production-ready EKS Platform Infrastructure",
    subtitle: "GitOps Infrastructure as Code on AWS",
    description:
      "Nền tảng hạ tầng Kubernetes hoàn chỉnh trên AWS sử dụng Terraform + EKS + Helm + ArgoCD GitOps + Prometheus/Grafana + Loki & Security Baseline. Đảm bảo chuẩn Enterprise-ready.",
    type: "Cloud Infrastructure as Code",
    role: "Cloud Platform Engineer",
    year: "2026",
    status: "ACTIVE",
    size: "38.2kb",
    tools: "Terraform, AWS EKS, ArgoCD, Helm, Prometheus",
    skills: "Kubernetes Orchestration, GitOps, AWS IAM, Monitoring",
    concept: "Immutable Cloud Platform",
    liveLink: "https://github.com/Lequangtien165/eks-platform-infra",
    features: [
      "Quản lý 100% tài nguyên hạ tầng (VPC, EKS, NodeGroups, IAM) bằng Terraform",
      "Quy trình GitOps tự động đồng bộ ứng dụng với ArgoCD qua Repository",
      "Hệ thống Observability toàn diện với Prometheus metrics & Grafana dashboards",
      "Tập hợp bảo mật RBAC, Network Policies và Secret encryption bằng AWS KMS",
      "Tự động co giãn cụm (Cluster Autoscaler & Horizontal Pod Autoscaler)",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
  {
    id: "sdn-lb",
    number: "03",
    fileName: "SDN_LOAD_BALANCING.net",
    title: "Static-Server-Based Load Balancing on SDN",
    subtitle: "Software-Defined Networking Optimization",
    description:
      "Mô hình cân bằng tải máy chủ tĩnh trên môi trường mạng điều khiển bằng phần mềm SDN (Software-Defined Networking). Tối ưu hóa phân phối lưu lượng và cải thiện throughput.",
    type: "Network Engineering",
    role: "SDN Network Engineer",
    year: "2025",
    status: "SHIPPED",
    size: "12.4kb",
    tools: "Python, Ryu SDN Controller, Mininet, OpenFlow",
    skills: "SDN Architecture, Traffic Engineering, OpenFlow Protocol",
    concept: "Programmable Networks",
    liveLink:
      "https://github.com/Lequangtien165/Static-Server-Based-Load-Balancing",
    features: [
      "Xây dựng thuật toán phân phối lưu lượng thông minh trên SDN Controller",
      "Định tuyến động dựa trên trạng thái tải thực tế của các backend server",
      "Mô phỏng topo mạng phức tạp với Mininet và kiểm thử stress-test",
      "Phòng chống nghẽn mạng và giảm thiểu độ trễ kết nối cho client",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
  {
    id: "jenkins-cicd",
    number: "04",
    fileName: "JENKINS_CICD_PIPELINE.ci",
    title: "End-to-End CI/CD Pipeline on AWS with Jenkins & Docker",
    subtitle: "Automated Build, Test & Deployment Workflow",
    description:
      "Quy trình tự động hóa triển khai khép kín kết hợp Docker Compose, Jenkins server và AWS EC2 cho quy trình release nhanh chóng, an toàn.",
    type: "CI/CD Automation",
    role: "DevOps Engineer",
    year: "2025",
    status: "SHIPPED",
    size: "18.9kb",
    tools: "Jenkins, Docker Compose, AWS EC2, GitHub Webhooks, Bash",
    skills: "Pipeline as Code, Containerization, Release Automation",
    concept: "Continuous Delivery",
    liveLink:
      "https://github.com/Lequangtien165/Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
    features: [
      "Kích hoạt pipeline tự động khi có commit / pull request vào main branch",
      "Tự động build Docker images và đẩy lên Docker Hub registry",
      "Triển khai không gián đoạn (Zero-downtime) lên AWS EC2 qua SSH",
      "Thông báo kết quả build tự động qua email và Slack webhook",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
];

export function getProjectById(id: string): ProjectItem | undefined {
  return projects.find((p) => p.id === id);
}
