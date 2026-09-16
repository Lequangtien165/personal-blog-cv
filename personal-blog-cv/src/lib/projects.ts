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
    subtitle: "AWS Monitoring, Alert Routing & AI-Assisted Analysis",
    description:
      "Cloud operations project that provisions AWS infrastructure with Terraform, configures Linux services with Ansible, detects failures with Prometheus/Blackbox Exporter, and routes alerts to an AI-assisted incident analysis service.",
    type: "AI & Cloud Ops Automation",
    role: "DevOps / Cloud Engineer / AI Engineer",
    year: "2026",
    status: "SHIPPED",
    size: "24.6kb",
    tools: "AWS, Terraform, Ansible, Docker, Prometheus, Alertmanager, FastAPI",
    skills: "Infrastructure Automation, Monitoring, Webhooks, Incident Response",
    concept: "AI-Assisted Cloud Ops",
    liveLink:
      "https://github.com/Benjaminnhnn/Cloud-Based-AI-Agent-System-for-Network-Incident-Detection-Alerting",
    features: [
      "Provisioned AWS VPC, subnets, route tables, security groups, Elastic IPs, and EC2 services with Terraform",
      "Automated Docker, Prometheus, Alertmanager, Grafana, Node Exporter, and firewall setup with Ansible",
      "Connected Prometheus and Blackbox Exporter alerts to Alertmanager webhooks and Telegram notifications",
      "Built asynchronous incident analysis with FastAPI, Google Gemini, RAG, Celery, and Redis",
      "Added GitHub Actions release automation with image publishing, SSH deployment, health checks, and rollback",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
  {
    id: "eks-infra",
    number: "02",
    fileName: "EKS_GITOPS_PLATFORM.cloud",
    title: "EKS GitOps Platform on AWS",
    subtitle: "Terraform, Helm, Argo CD & Container Delivery",
    description:
      "AWS EKS platform project focused on infrastructure as code, GitOps deployment, container image delivery, security scanning, and Kubernetes ingress automation.",
    type: "Cloud Infrastructure as Code",
    role: "DevOps / Cloud Engineer",
    year: "2026",
    status: "ACTIVE",
    size: "38.2kb",
    tools: "AWS EKS, Terraform, Kubernetes, Helm, Argo CD, GitHub Actions",
    skills: "IaC, GitOps, Kubernetes Environments, Image Scanning",
    concept: "GitOps Cloud Platform",
    liveLink: "https://github.com/Lequangtien165/eks-platform-infra",
    features: [
      "Provisioned VPC, subnets, NAT Gateway, IAM roles, ECR, EKS, and managed node groups with Terraform",
      "Built Argo CD and Helm workflow for separate development and production Kubernetes environments",
      "Configured GitHub Actions to test applications, build images, run Trivy scans, and publish to Amazon ECR",
      "Automated platform bootstrap with Ansible",
      "Configured application ingress with ingress-nginx and AWS Load Balancer Controller",
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
    subtitle: "Ryu, Mininet & OpenFlow 1.3",
    description:
      "Course project that implements static round-robin load balancing for two HTTP servers behind a virtual IP in a Mininet topology controlled by Ryu.",
    type: "Network Engineering",
    role: "Network Engineering Project",
    year: "2026",
    status: "SHIPPED",
    size: "12.4kb",
    tools: "Python, Ryu, Mininet, Open vSwitch, OpenFlow 1.3",
    skills: "Virtual IP, Round-Robin Load Balancing, DNAT/SNAT Flow Rules",
    concept: "Programmable Network Forwarding",
    liveLink:
      "https://github.com/Lequangtien165/Static-Server-Based-Load-Balancing",
    features: [
      "Built a Mininet topology with one client, two HTTP servers, three switches, and virtual IP 10.0.0.100",
      "Implemented alternating backend selection in a Python Ryu controller",
      "Installed OpenFlow 1.3 DNAT and reverse SNAT rules on the edge switch",
      "Verified alternating server responses with curl and inspected flows with ovs-ofctl",
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
    subtitle: "Maven Build, SSH Artifact Transfer & Docker Deployment",
    description:
      "Hands-on CI/CD lab that builds a Java web application with Maven on Jenkins, transfers the WAR artifact to a separate AWS EC2 Docker host, and runs it in Tomcat.",
    type: "CI/CD Automation",
    role: "DevOps Lab",
    year: "2026",
    status: "SHIPPED",
    size: "18.9kb",
    tools: "Jenkins, Maven, Docker, Tomcat, AWS EC2, Git",
    skills: "Build Automation, Artifact Transfer, Container Deployment",
    concept: "CI/CD Fundamentals",
    liveLink:
      "https://github.com/Lequangtien165/Deploy-code-on-Docker-Compose-using-Jenkins-on-AWS",
    features: [
      "Provisioned separate Jenkins and Docker hosts on Amazon Linux 2023 EC2 instances",
      "Configured Jenkins to poll the Git repository and build the Java WAR artifact with Maven",
      "Transferred the WAR file to the Docker host with Publish Over SSH",
      "Rebuilt and replaced a Tomcat container, then verified the deployed web application on port 8087",
    ],
    mediaSrc:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
    mediaType: "image",
  },
];

export function getProjectById(id: string): ProjectItem | undefined {
  return projects.find((p) => p.id === id);
}
