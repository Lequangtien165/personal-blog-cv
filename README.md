# Personal Blog CV CI/CD Lab

This repository contains a Next.js personal blog/CV app and a low-cost AWS CI/CD lab.

Target deployment flow:

```text
GitHub -> Jenkins -> ESLint/TypeScript/Semgrep/Trivy -> Docker -> ECR -> EKS
```

The current recommended stack intentionally removes self-hosted SonarQube and Nexus from the default path. They are useful tools, but they need more memory than a low-cost Free-Tier-constrained lab usually provides.

## Repository Layout

```text
personal-blog-cv/   Next.js app, Dockerfile, Jenkinsfile
infra/              Terraform AWS infrastructure
k8s/                Kubernetes Deployment and Service
```

## What Each Tool Does

- Jenkins runs the CI/CD pipeline.
- ESLint and TypeScript catch code and type issues.
- Semgrep scans application source code for security patterns.
- Trivy scans dependencies, files, Docker image, and known CVEs.
- ECR stores the production Docker image.
- EKS runs the application container on Kubernetes.

## Local App Commands

```bash
cd personal-blog-cv
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deploy Infrastructure

Configure Terraform:

```bash
cd infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
my_ip_cidr      = "YOUR_PUBLIC_IP/32"
public_key_path = "C:/Users/Qtienle/.ssh/aws-hybrid.pub"
```

Apply:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Save these outputs:

```text
jenkins_url
ecr_repository_url
eks_update_kubeconfig_command
```

## Configure Jenkins Pipeline

Open Jenkins using `jenkins_url`.

Get the initial admin password:

```bash
ssh -i C:/Users/Qtienle/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Install suggested plugins.

The Jenkinsfile automatically resolves the ECR URL from the Jenkins EC2 IAM role and the repository name `blog-cv-app`.

Create a Jenkins Pipeline job:

```text
Definition: Pipeline script from SCM
SCM: Git
Branch: main
Script Path: personal-blog-cv/Jenkinsfile
```

Run the pipeline.

## Verify EKS Deployment

Connect kubectl:

```bash
aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster
kubectl get nodes
```

Check app resources:

```bash
kubectl get pods,svc -n webapps
kubectl rollout status deployment/blog-cv -n webapps
```

Open the external LoadBalancer hostname from:

```bash
kubectl get svc blog-cv-service -n webapps
```

## Optional Services

Nexus, SonarQube, and monitoring EC2 instances are disabled by default:

```hcl
enable_nexus      = false
enable_sonarqube  = false
enable_monitoring = false
```

Enable them only if you can afford larger instances. SonarQube small-scale needs about 4GB RAM. Nexus is also memory-heavy and is not needed for this Next.js app unless you manage private package repositories.

## Destroy

```bash
cd infra/environments/dev
terraform destroy
```
