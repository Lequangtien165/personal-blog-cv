# Personal Blog CV CI/CD Lab

Một dự án **full-stack DevOps lab** bao gồm ứng dụng web Next.js (personal blog + CV) và hạ tầng AWS CI/CD hoàn chỉnh được triển khai bằng Infrastructure as Code.

---

## Mục lục

- [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
- [Cấu trúc repository](#cấu-trúc-repository)
- [Luồng CI/CD](#luồng-cicd)
- [1. Ứng dụng — Personal Blog CV](#1-ứng-dụng--personal-blog-cv)
- [2. Hạ tầng AWS — Terraform](#2-hạ-tầng-aws--terraform)
- [3. CI/CD Pipeline — Jenkinsfile](#3-cicd-pipeline--jenkinsfile)
- [4. Kubernetes — EKS](#4-kubernetes--eks)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Destroy](#destroy)
- [Chi phí](#chi-phí)
- [Các lỗi thường gặp](#các-lỗi-thường-gặp)

---

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GITHUB                                         │
│                  github.com/.../personal-blog-cv                        │
└──────────────────────┬──────────────────────────────────────────────────┘
                       │ git push
                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   JENKINS (EC2 t3.small)                                │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │
│  │   CI     │  │   CI     │  │   CI     │  │  CD    │  │    CD     │  │
│  │ Lint +   │→│ Build +  │→│ Security │→│ Docker │→│ K8s       │  │
│  │ Typecheck│  │ Next.js  │  │ Semgrep  │  │ Build  │  │ Deploy    │  │
│  │          │  │          │  │ + Trivy  │  │+ Push  │  │ kubectl   │  │
│  └──────────┘  └──────────┘  └──────────┘  │  ECR   │  │ apply     │  │
│                                              └───┬────┘  └─────┬─────┘  │
└──────────────────────────────────────────────────┼──────────────┼───────┘
                                                   │              │
                                                   ▼              ▼
                                        ┌──────────────┐  ┌──────────────┐
                                        │     ECR      │  │     EKS      │
                                        │ Docker Image │  │ Kubernetes   │
                                        │ Repository   │──│ Cluster      │
                                        │ blog-cv-app  │  │ blog-cv      │
                                        └──────────────┘  │ namespace:   │
                                                           │ webapps      │
                                                           │              │
                                                           │ Service:     │
                                                           │ LoadBalancer │
                                                           │ :80 → :3000  │
                                                           └──────┬───────┘
                                                                  │
                                                                  ▼
                                                        User truy cập web
                                                        qua URL LoadBalancer
```

---

## Cấu trúc repository

```
├── personal-blog-cv/          # Ứng dụng Next.js (blog + CV)
│   ├── src/                   # Mã nguồn React/TypeScript
│   │   ├── app/               # Next.js App Router
│   │   │   ├── page.tsx       # Trang chủ — danh sách bài viết
│   │   │   ├── layout.tsx     # Root layout (navbar + global styles)
│   │   │   ├── blog/[slug]/   # Trang chi tiết bài viết
│   │   │   └── cv/            # Trang CV
│   │   └── lib/content.ts     # Đọc Markdown, parse gray-matter, render HTML
│   ├── content/               # Nội dung dạng Markdown
│   │   ├── posts/             # Bài viết blog
│   │   └── cv.md              # Nội dung CV
│   ├── Dockerfile             # Multi-stage build cho production
│   ├── Jenkinsfile            # Pipeline CI/CD (Jenkins)
│   ├── next.config.ts         # Next.js config (output: standalone)
│   ├── package.json           # Dependencies: next, react, gray-matter, remark
│   ├── tsconfig.json          # TypeScript config
│   └── eslint.config.mjs      # ESLint config
│
├── infra/                     # Hạ tầng AWS (Terraform)
│   ├── environments/dev/      # Environment dev (main.tf, variables, tfvars)
│   └── modules/               # Module tái sử dụng
│       ├── network/           # VPC, subnet, IGW, route table
│       ├── security/          # Security group (SSH + Jenkins UI)
│       ├── key_pair/          # SSH key pair import
│       ├── ec2/               # Jenkins EC2 + optional SonarQube/Nexus/Monitoring
│       └── eks/               # EKS cluster + node group
│
├── k8s/                       # Kubernetes manifests
│   └── deployment-service.yml # Deployment (2 replicas) + Service (LoadBalancer)
│
└── README.md                  # Bạn đang đọc đây
```

---

## Luồng CI/CD

Pipeline trong `personal-blog-cv/Jenkinsfile` chia làm 2 phần:

### CI (Continuous Integration)

| Stage | Công cụ | Mục đích |
|---|---|---|
| 1. Install Dependencies | `npm ci` | Cài đặt exact dependencies từ lockfile |
| 2. Resolve AWS Targets | `aws sts get-caller-identity` | Lấy Account ID, xây dựng ECR URL |
| 3. Lint | ESLint (`next/core-web-vitals`, `typescript`) | Kiểm tra code style |
| 4. Typecheck | TypeScript (`tsc --noEmit`) | Kiểm tra kiểu tĩnh |
| 5. Build App | `next build` | Build Next.js (output standalone) |
| 6. Semgrep Scan | Semgrep (`--config auto`) | Scan source code cho security patterns |
| 7. Trivy FS Scan | Trivy | Scan filesystem + dependencies (HIGH, CRITICAL) |

### CD (Continuous Deployment)

| Stage | Công cụ | Mục đích |
|---|---|---|
| 8. Docker Build | Docker multi-stage build | Build image từ Dockerfile |
| 9. Trivy Image Scan | Trivy | Scan Docker image (HIGH, CRITICAL) |
| 10. Push Image To ECR | `docker push` | Push image lên ECR với tag `BUILD_NUMBER` + `latest` |
| 11. K8s Deploy | `kubectl apply` | Thay placeholder bằng image URL, deploy lên EKS |
| 12. K8s Verify | `kubectl rollout status` | Đợi deployment hoàn tất, show pods + services |

---

## 1. Ứng dụng — Personal Blog CV

**Công nghệ**: Next.js 16 + React 19 + TypeScript + Tailwind CSS

**Chức năng**:
- **Trang chủ** (`/`): Hiển thị danh sách bài viết blog, đọc từ file Markdown trong `content/posts/`
- **Chi tiết bài viết** (`/blog/[slug]`): Render Markdown → HTML bằng `remark` + `remark-html`
- **Trang CV** (`/cv`): Render file `content/cv.md`
- **Static Generation**: `generateStaticParams()` cho bài viết — build time rendering

**Cấu trúc nội dung**:

```markdown
---
title: "Bài viết đầu tiên"
date: "2026-06-13"
summary: "Ghi chú đầu tiên trên blog cá nhân."
---

# Nội dung bài viết
```

**Docker build**: Multi-stage (deps → builder → runner), output `standalone`, chạy với user `nextjs` non-root, port 3000.

---

## 2. Hạ tầng AWS — Terraform

**Region**: `ap-southeast-1` (Singapore)

### Tài nguyên được tạo

| Module | Tài nguyên | Chi tiết |
|---|---|---|
| `network` | VPC `10.0.0.0/16`, Internet Gateway, 2 public subnets (`10.0.1.0/24`, `10.0.2.0/24`), route table | Hạ tầng mạng cơ bản |
| `security` | Security group | Cho phép SSH (22) + Jenkins UI (8080) từ IP của bạn |
| `key_pair` | AWS key pair | Import từ public key local |
| `ec2` | Jenkins EC2 (`t3.small`, 30GB gp3) + user_data script | Tự động cài: Java 21, Docker, Node.js 22, Trivy, Semgrep, AWS CLI, kubectl |
| `ec2` (optional) | SonarQube EC2, Nexus EC2, Monitoring EC2 | Mặc định `false` để tiết kiệm |
| `eks` | EKS cluster (`blog-cv-cluster`) + managed node group (`t3.small`, 1 node) | IAM roles: cluster role + node role (ECR read-only, worker, CNI) |
| `aws_ecr_repository` | ECR repository `blog-cv-app` | Scan on push, mutable tags |

### IAM & Quyền

- **Jenkins EC2 instance profile** (`blog-cv-jenkins-role`): ECR push/pull + EKS describe
- **EKS node role** (`blog-cv-eks-node-role`): AmazonEKSWorkerNodePolicy, EKS_CNI_Policy, EC2ContainerRegistryReadOnly
- **Jenkins → EKS access**: `aws_eks_access_entry` + `AmazonEKSClusterAdminPolicy` — cho phép Jenkins thực hiện `kubectl apply` lên EKS

---

## 3. CI/CD Pipeline — Jenkinsfile

### Cách Jenkins hoạt động

1. **SCM Polling/Webhook**: Jenkins phát hiện thay đổi trên GitHub branch `main`
2. **Pipeline from SCM**: Jenkins đọc `personal-blog-cv/Jenkinsfile` từ repo
3. **Cơ chế xác thực AWS**: Jenkins EC2 có IAM role — **không cần AWS access key trong Jenkins credentials**

### Chi tiết các bước CD quan trọng

**Docker Build** (stage 8):
```groovy
docker build -t $ECR_REPOSITORY_URL:$IMAGE_TAG -t $ECR_REPOSITORY_URL:latest .
```
- Tag image với URL đầy đủ của ECR
- Dùng multi-stage Dockerfile để tối ưu kích thước

**Push lên ECR** (stage 10):
```groovy
# IAM role tự động xác thực, không cần docker login với access key
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
docker push $ECR_REPOSITORY_URL:$IMAGE_TAG
docker push $ECR_REPOSITORY_URL:latest
```

**Deploy lên EKS** (stage 11):
```groovy
# Thay IMAGE_PLACEHOLDER bằng URL image thật, apply manifest vào EKS
sed "s|IMAGE_PLACEHOLDER|$ECR_REPOSITORY_URL:$IMAGE_TAG|g" k8s/deployment-service.yml | kubectl apply -f -
```

**Cơ chế ECR → EKS pull image**:
- EKS node group có IAM role được gắn policy `AmazonEC2ContainerRegistryReadOnly`
- Khi kubernetes nhận Deployment với image URL từ ECR, kubelet tự động kéo image — **không cần docker login hay imagePullSecrets**

---

## 4. Kubernetes — EKS

File `k8s/deployment-service.yml` định nghĩa:

### Deployment
- **2 replicas** — chạy container từ image ECR
- **Container port**: 3000
- **Readiness probe** (HTTP GET /, delay 10s, period 10s)
- **Liveness probe** (HTTP GET /, delay 30s, period 20s)
- Namespace: `webapps`

### Service
- **Type**: LoadBalancer — tạo AWS Classic Load Balancer
- **Port mapping**: 80 → 3000 (internet → container)
- **Selector**: `app: blog-cv`

---

## Hướng dẫn sử dụng

### Yêu cầu local

- AWS CLI đã cấu hình (`aws configure`)
- Terraform ≥ 1.6
- kubectl
- SSH client
- Git

### 1. Chạy local app

```bash
cd personal-blog-cv
npm ci
npm run dev
# Mở http://localhost:3000
```

```bash
# Hoặc chạy bằng Docker
docker build -t blog-cv:local .
docker run --rm -p 3000:3000 blog-cv:local
```

### 2. Deploy hạ tầng AWS

```bash
cd infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Sửa file `terraform.tfvars`:
```hcl
region       = "ap-southeast-1"
project_name = "blog-cv"
my_ip_cidr   = "YOUR_PUBLIC_IP/32"   # curl ifconfig.me
public_key_path = "~/.ssh/aws-hybrid.pub"
```

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Ghi lại các output:
```text
jenkins_url
ecr_repository_url
eks_cluster_name
eks_update_kubeconfig_command
```

### 3. Cấu hình Jenkins

1. Mở `http://<jenkins_public_ip>:8080`
2. Lấy mật khẩu admin:
   ```bash
   ssh -i ~/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Cài **suggested plugins**
4. Thêm plugin: **Pipeline**, **Git**, **GitHub**, **Docker Pipeline**
5. (Nếu repo private) Thêm GitHub Personal Access Token vào Jenkins Credentials
6. Tạo **Pipeline job**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git` — URL repo, credentials, branch `main`
   - Script Path: `personal-blog-cv/Jenkinsfile`

### 4. Chạy pipeline

Vào job → **Build Now** → theo dõi **Console Output**.

Pipeline tự động:
- Checkout code → npm ci → lint → typecheck → build Next.js
- Semgrep + Trivy scan
- Docker build + push lên ECR
- Deploy lên EKS
- Verify rollout

### 5. Kiểm tra kết quả

```bash
# Kết nối kubectl
aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster

# Kiểm tra pods và service
kubectl get pods,svc -n webapps

# Lấy URL LoadBalancer
kubectl get svc blog-cv-service -n webapps
```
Mở `http://<EXTERNAL-IP>` trên trình duyệt.

---

## Destroy

> **Lưu ý**: Xóa pipeline Jenkins không làm mất tài nguyên AWS. Chỉ `terraform destroy` mới xóa hết.

```bash
cd infra/environments/dev
terraform destroy
```

Nếu gặp lỗi `DependencyViolation` (VPC/subnet bị block):
1. Xóa Load Balancer còn sót từ EKS:
   ```bash
   aws elb describe-load-balancers --region ap-southeast-1
   aws elb delete-load-balancer --region ap-southeast-1 --load-balancer-name <NAME>
   ```
2. Xóa security group còn sót:
   ```bash
   aws ec2 describe-security-groups --region ap-southeast-1 --filters "Name=vpc-id,Values=<VPC_ID>"
   aws ec2 delete-security-group --region ap-southeast-1 --group-id <SG_ID>
   ```
3. Chạy lại `terraform destroy`

---

## Chi phí

Dự án này **không hoàn toàn miễn phí**. Các tài nguyên có thể phát sinh chi phí:

| Tài nguyên | Config mặc định | Chi phí ước tính |
|---|---|---|
| EKS control plane | 1 cluster | ~$0.10/giờ (tùy region) |
| Jenkins EC2 | t3.small (30GB gp3) | ~$0.0208/giờ |
| EKS node | t3.small (1 node) | ~$0.0208/giờ |
| LoadBalancer | 1 Classic LB | ~$0.025/giờ |
| ECR storage | 1 image (~200MB) | Rất thấp |
| Data transfer | Outbound internet | Tùy usage |

**Khuyến nghị tiết kiệm**:
- Giữ `enable_nexus`, `enable_sonarqube`, `enable_monitoring = false`
- Dùng `t3.small` hoặc `t3.micro` (nếu có thể) cho EC2 và EKS node
- Chạy `terraform destroy` ngay khi không dùng lab nữa

---

## Các lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|---|---|---|
| `DependencyViolation` khi destroy | ELB/SG từ EKS còn sót | Xóa ELB + SG thủ công, chạy lại `terraform destroy` |
| `npm ci` fail | Thiếu `package-lock.json` | Kiểm tra lockfile trong `personal-blog-cv/` |
| Docker permission denied (Jenkins) | User jenkins chưa trong group docker | SSH vào EC2: `sudo usermod -aG docker jenkins; sudo systemctl restart jenkins` |
| `kubectl` unauthorized | Jenkins role chưa được cấp quyền EKS | Chạy lại `terraform apply` |
| LoadBalancer không có hostname | Chưa tạo xong | Đợi 1-3 phút, kiểm tra lại `kubectl get svc -n webapps` |
| GitHub không checkout được | Private repo thiếu token | Thêm GitHub PAT vào Jenkins Credentials |


