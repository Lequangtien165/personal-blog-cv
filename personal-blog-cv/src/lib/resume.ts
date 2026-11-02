/**
 * Structured resume data — single source for /cv and the home Resume section.
 * Edit this file to update the CV.
 */

export interface ResumeEntry {
  dates: string;
  title: string;
  org: string;
  role?: string;
  link?: string;
  stack?: string[];
  bullets: string[];
}

export const profile =
  "Final-year Computer Networks student targeting System Engineer intern or junior roles. Supported IT infrastructure operations in a VMware ESXi environment, administering Linux and Windows servers and assisting with monitoring, backup and recovery, and system and network troubleshooting. Complementary projects cover AWS, Terraform, Ansible, Docker, Kubernetes, and infrastructure monitoring.";

export const phone = "+84 946 110 165";

export const experience: ResumeEntry[] = [
  {
    dates: "Jul 2026 — Sep 2026",
    title: "System Administrator Intern",
    org: "DTP Education Solutions",
    bullets: [
      "Supported daily IT infrastructure operations in a VMware ESXi environment, including Linux and Windows server administration, virtual machine provisioning, resource allocation, snapshots, backup, and recovery procedures.",
      "Assisted in diagnosing system and network issues through connectivity tests, DNS checks, service status verification, system logs, firewall rules, and network device inspection.",
      "Practiced infrastructure monitoring using Grafana, Windows Exporter, Linux Exporter, and Node Exporter to track system health, resource utilization, and service availability.",
      "Used Bash scripts to automate routine operational checks and documented troubleshooting procedures, monitoring results, and recovery steps to support infrastructure maintenance.",
    ],
  },
];

export const education: ResumeEntry[] = [
  {
    dates: "Expected Jul 2027",
    title: "B.Eng. Computer Network and Data Communication",
    org: "University of Information Technology (UIT), VNU-HCM",
    bullets: ["GPA 8.5/10 · IELTS Academic 6.5 · Ho Chi Minh City, Vietnam"],
  },
];

export const resumeProjects: ResumeEntry[] = [
  {
    dates: "Jan 2026 — Jun 2026",
    title: "Cloud-Based AI Agent System for Network Incident Detection & Alerting",
    org: "Team project",
    role: "DevOps / Cloud Engineer / AI Engineer",
    link: "https://github.com/Benjaminnhnn/Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
    stack: [
      "AWS",
      "Terraform",
      "Ansible",
      "Docker",
      "Prometheus",
      "Alertmanager",
      "Grafana",
      "FastAPI",
      "Celery",
      "Redis",
      "GitHub Actions",
    ],
    bullets: [
      "Provisioned and administered AWS infrastructure with Terraform, including VPC networking, security groups, and EC2 instances for application and monitoring services.",
      "Automated server bootstrap and service configuration with Ansible, installing Docker, Docker Compose, Node Exporter, Prometheus, Alertmanager, Grafana, and host-level firewall rules.",
      "Implemented monitoring and alerting with Prometheus, Grafana, Blackbox Exporter, and Alertmanager to detect service failures and notify operators through Telegram.",
      "Developed an asynchronous incident analysis service using FastAPI, Google Gemini, RAG, Celery, and Redis to generate contextual troubleshooting insights from alerts.",
      "Implemented a GitHub Actions release pipeline to build Docker images, publish versioned artifacts to GHCR, deploy to EC2 over SSH, run health checks, and roll back failed releases.",
    ],
  },
  {
    dates: "Jul 2026 — Present",
    title: "EKS GitOps Platform on AWS",
    org: "Personal project",
    role: "DevOps / Cloud Engineer",
    link: "https://github.com/Lequangtien165/eks-platform-infra",
    stack: [
      "AWS EKS",
      "Terraform",
      "Kubernetes",
      "Helm",
      "Argo CD",
      "GitHub Actions",
      "Trivy",
      "Amazon ECR",
      "Ansible",
      "ingress-nginx",
    ],
    bullets: [
      "Provisioned an AWS EKS platform with Terraform, including VPC, subnets, NAT Gateway, IAM roles, ECR, and managed node groups.",
      "Built a GitOps deployment workflow with Argo CD and Helm to manage separate development and production Kubernetes environments.",
      "Implemented GitHub Actions workflows for application tests, container image builds, Trivy scans, and publishing to Amazon ECR.",
      "Automated platform bootstrap with Ansible and configured ingress using ingress-nginx and AWS Load Balancer Controller.",
    ],
  },
];

export const certificates = [
  {
    dates: "Jul 2026 — Jul 2029",
    title: "AWS Certified Cloud Practitioner (CLF-C02)",
    org: "Amazon Web Services · Credly badge",
  },
  {
    dates: "Sep 2026",
    title: "System Administration and IT Infrastructure Services",
    org: "Google Career Certificates · Coursera",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "System Administration",
    items: [
      "Linux (Ubuntu)",
      "Windows Server",
      "VMware ESXi",
      "VM provisioning",
      "Server maintenance",
      "Backup & recovery",
    ],
  },
  {
    group: "IT Operations",
    items: [
      "Service checks",
      "System logs",
      "Connectivity testing",
      "DNS",
      "DHCP",
      "Firewall rules",
      "Documentation",
    ],
  },
  {
    group: "Monitoring",
    items: [
      "Grafana",
      "Prometheus",
      "Alertmanager",
      "Node Exporter",
      "Windows Exporter",
      "Blackbox Exporter",
    ],
  },
  {
    group: "Automation",
    items: ["Bash", "Python", "Ansible", "Terraform", "Git"],
  },
  {
    group: "Cloud",
    items: ["AWS EC2", "EKS", "ECR", "IAM", "VPC", "Security groups", "NAT Gateway"],
  },
  {
    group: "Containers & Delivery",
    items: [
      "Docker",
      "Docker Compose",
      "Kubernetes",
      "Helm",
      "Argo CD",
      "GitHub Actions",
      "Jenkins",
    ],
  },
  {
    group: "AI-assisted Ops",
    items: ["FastAPI", "Celery", "Redis", "RAG", "Gemini API", "Webhooks"],
  },
];
