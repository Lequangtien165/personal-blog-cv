# Blog CV Low-Cost CI/CD Infrastructure

This Terraform stack deploys a low-cost production-like CI/CD lab on AWS:

- VPC, internet gateway, public subnets, route table
- Security group restricted to your public IP
- Jenkins EC2 with Java 21, Docker, Node.js 22, Trivy, Semgrep, AWS CLI, and kubectl
- ECR repository for the app Docker image
- EKS cluster and managed node group
- Optional SonarQube, Nexus, and monitoring EC2 instances are disabled by default

## Cost Notes

This is not guaranteed to be free. EKS control plane, EC2, EBS, LoadBalancer, IPv4, and data transfer can all cost money. Keep optional services disabled unless you need them.

Recommended low-cost defaults:

```hcl
enable_nexus      = false
enable_sonarqube  = false
enable_monitoring = false

jenkins_instance_type = "t3.small"
jenkins_volume_size   = 30

eks_node_instance_type = "t3.small"
eks_desired_size       = 1
eks_min_size           = 1
eks_max_size           = 2
```

If AWS blocks non-Free-Tier instances, check what your account can create:

```bash
aws ec2 describe-instance-types \
  --region ap-southeast-1 \
  --filters "Name=free-tier-eligible,Values=true" \
  --query "InstanceTypes[].InstanceType" \
  --output table
```

## Prerequisites

Install locally:

- AWS CLI
- Terraform
- kubectl
- SSH client

Authenticate AWS:

```bash
aws configure
aws sts get-caller-identity
```

Create SSH key if needed:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/aws-hybrid
```

## Configure Terraform

```bash
cd infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit:

```hcl
my_ip_cidr      = "YOUR_PUBLIC_IP/32"
public_key_path = "~/.ssh/aws-hybrid.pub"
```

On Windows, use a normal slash path:

```hcl
public_key_path = "C:/Users/Qtienle/.ssh/aws-hybrid.pub"
```

Get your public IP:

```bash
curl ifconfig.me
```

## Deploy Infrastructure

```bash
cd infra/environments/dev
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Important outputs:

- `jenkins_url`
- `ecr_repository_url`
- `eks_cluster_name`
- `eks_update_kubeconfig_command`

Connect kubectl locally:

```bash
aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster
kubectl get nodes
```

## Jenkins Setup

Open `jenkins_url` from Terraform output.

Get the initial password:

```bash
ssh -i ~/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Install Jenkins plugins

During the first Jenkins setup wizard, choose **Install suggested plugins**. After Jenkins finishes the initial setup, install the extra plugins used by this project.

#### Option 1: Install from Jenkins UI

1. Open Jenkins from the Terraform output:

   ```bash
   terraform output jenkins_url
   ```

2. Log in with the admin user created during the first setup.
3. Go to **Manage Jenkins**.
4. Open **Plugins**.
5. Select **Available plugins**.
6. Search for and install these plugins:

   - Pipeline
   - Git
   - GitHub
   - Docker
   - Docker Pipeline
   - Credentials Binding
   - SSH Agent
   - AWS Credentials
   - Pipeline: Stage View
   - Blue Ocean

7. Click **Install without restart**.
8. If Jenkins asks for a restart, select **Restart Jenkins when installation is complete and no jobs are running**.
9. After Jenkins restarts, go to **Manage Jenkins > Plugins > Installed plugins** and confirm the plugins are installed.

#### Option 2: Install from Jenkins CLI

Download the Jenkins CLI jar from your Jenkins server:

```bash
wget http://<jenkins_public_ip>:8080/jnlpJars/jenkins-cli.jar
```

Create an API token:

1. In Jenkins, click your username in the top-right corner.
2. Select **Security**.
3. Under **API Token**, click **Add new Token**.
4. Copy the generated token.

Install the plugins:

```bash
java -jar jenkins-cli.jar \
  -s http://<jenkins_public_ip>:8080/ \
  -auth <jenkins_user>:<api_token> \
  install-plugin \
  workflow-aggregator \
  git \
  github \
  docker-plugin \
  docker-workflow \
  credentials-binding \
  ssh-agent \
  aws-credentials \
  pipeline-stage-view \
  blueocean
```

Restart Jenkins safely:

```bash
java -jar jenkins-cli.jar \
  -s http://<jenkins_public_ip>:8080/ \
  -auth <jenkins_user>:<api_token> \
  safe-restart
```

List installed plugins:

```bash
java -jar jenkins-cli.jar \
  -s http://<jenkins_public_ip>:8080/ \
  -auth <jenkins_user>:<api_token> \
  list-plugins
```

#### Option 3: Install from the Jenkins EC2 instance

SSH into Jenkins:

```bash
ssh -i ~/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
```

Download the Jenkins plugin manager:

```bash
curl -fsSL \
  -o /tmp/jenkins-plugin-manager.jar \
  https://github.com/jenkinsci/plugin-installation-manager-tool/releases/latest/download/jenkins-plugin-manager.jar
```

Create a plugin list:

```bash
cat >/tmp/plugins.txt <<'EOF'
workflow-aggregator
git
github
docker-plugin
docker-workflow
credentials-binding
ssh-agent
aws-credentials
pipeline-stage-view
blueocean
EOF
```

Install plugins into the Jenkins home directory:

```bash
sudo java -jar /tmp/jenkins-plugin-manager.jar \
  --war /usr/share/java/jenkins.war \
  --plugin-file /tmp/plugins.txt \
  --plugin-download-directory /var/lib/jenkins/plugins
```

Fix plugin ownership and restart Jenkins:

```bash
sudo chown -R jenkins:jenkins /var/lib/jenkins/plugins
sudo systemctl restart jenkins
```

Check Jenkins status:

```bash
sudo systemctl status jenkins --no-pager
```

### Required plugins summary

Ensure these plugins exist before creating the pipeline job:

- Pipeline
- Git
- GitHub
- Docker
- Docker Pipeline
- Credentials Binding
- SSH Agent
- AWS Credentials
- Pipeline: Stage View
- Blue Ocean

The Jenkins EC2 already has Docker, Node.js 22, Trivy, Semgrep, AWS CLI, and kubectl from user data.

## ECR Access

Terraform creates an ECR repository named `blog-cv-app`. The Jenkinsfile resolves the full ECR URL automatically from the Jenkins EC2 IAM role, so there is no DockerHub credential or ECR URL placeholder to configure.

## Jenkins Pipeline

Create a Jenkins Pipeline job:

- Definition: Pipeline script from SCM
- SCM: Git
- Repository URL: your GitHub repository URL
- Branch: `main`
- Script Path: `personal-blog-cv/Jenkinsfile`

Pipeline stages:

1. Checkout code
2. `npm ci`
3. ESLint
4. TypeScript typecheck
5. Next.js production build
6. Semgrep scan
7. Trivy filesystem scan
8. Docker image build
9. Trivy image scan
10. Push image to ECR
11. Deploy image to EKS
12. Verify rollout

## Access The App

After the pipeline deploys:

```bash
kubectl get svc -n webapps
```

Open the external LoadBalancer hostname for `blog-cv-service`.

## Destroy

Destroy everything when done:

```bash
cd infra/environments/dev
terraform destroy
```
