# Huong Dan Deploy Blog CV Len AWS Bang Terraform, Jenkins, ECR Va EKS

README nay huong dan chay tu dau den cuoi:

1. Tao ha tang AWS bang Terraform.
2. Mo va cau hinh Jenkins.
3. Cho Jenkins lay code tu GitHub.
4. Build Docker image, push len ECR.
5. Deploy webapp len EKS.
6. Lay URL de mo webapp.
7. Xoa ha tang khi khong dung nua.

Kien truc duoc tao:

- VPC, internet gateway, public subnets, route table.
- Security group chi cho IP cua ban truy cap.
- Jenkins EC2 cai san Java 21, Docker, Node.js 22, Trivy, Semgrep, AWS CLI va kubectl.
- ECR repository `blog-cv-app`.
- EKS cluster va managed node group.
- SonarQube, Nexus va monitoring la tuy chon, mac dinh dang tat.

## Luu Y Ve Chi Phi

Ha tang nay khong chac chan mien phi. EKS control plane, EC2, EBS, LoadBalancer, IPv4 public va data transfer deu co the tinh tien.

Khuyen nghi de tiet kiem chi phi trong `infra/environments/dev/terraform.tfvars`:

```hcl
enable_nexus      = false
enable_sonarqube  = false
enable_monitoring = false

jenkins_instance_type = "t3.small"
jenkins_volume_size   = 30

eks_node_instance_type = "t3.small"
eks_desired_size       = 1
eks_min_size           = 1
eks_max_size           = 1
```

Chi dung `terraform destroy` khi muon xoa toan bo lab AWS. Khong dung lenh nay de chay lai Jenkins pipeline.

## Buoc 1: Cai Cong Cu Tren May Local

Can co:

- AWS CLI
- Terraform
- kubectl
- SSH client
- Git

Kiem tra AWS CLI:

```bash
aws configure
aws sts get-caller-identity
```

Neu lenh `aws sts get-caller-identity` tra ve account AWS cua ban la OK.

Tao SSH key neu chua co:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/aws-hybrid
```

Tren Windows PowerShell, key thuong nam o:

```text
C:/Users/<your-user>/.ssh/aws-hybrid.pub
```

## Buoc 2: Cau Hinh Terraform

Di vao thu muc Terraform environment:

```bash
cd infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Lay public IP cua ban:

```bash
curl ifconfig.me
```

Mo `terraform.tfvars` va sua:

```hcl
region       = "ap-southeast-1"
project_name = "blog-cv"

my_ip_cidr = "YOUR_PUBLIC_IP/32"
```

Vi du:

```hcl
my_ip_cidr = "171.250.165.211/32"
```

Sua SSH public key path:

```hcl
public_key_path = "~/.ssh/aws-hybrid.pub"
```

Tren Windows nen dung slash path:

```hcl
public_key_path = "C:/Users/Qtienle/.ssh/aws-hybrid.pub"
```

Giu cac dich vu tuy chon o trang thai tat neu muon tiet kiem chi phi:

```hcl
enable_nexus      = false
enable_sonarqube  = false
enable_monitoring = false
```

## Buoc 3: Tao Ha Tang AWS

Chay:

```bash
cd infra/environments/dev
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Khi Terraform hoi xac nhan, go:

```text
yes
```

Sau khi tao xong, xem output:

```bash
terraform output
```

Can ghi lai:

```text
jenkins_public_ip
jenkins_url
ecr_repository_url
eks_cluster_name
eks_update_kubeconfig_command
```

## Buoc 4: Kiem Tra EKS Tu May Local

Cap nhat kubeconfig:

```bash
aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster
```

Kiem tra node:

```bash
kubectl get nodes
```

Neu thay node `Ready` la EKS da hoat dong.

## Buoc 5: Mo Jenkins Lan Dau

Mo Jenkins URL:

```text
http://<jenkins_public_ip>:8080
```

Lay mat khau admin ban dau:

```bash
ssh -i ~/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Dan password vao Jenkins UI.

Trong wizard ban dau:

```text
Install suggested plugins
```

Sau do tao admin user theo UI.

## Buoc 6: Cai Jenkins Plugins Can Thiet

Vao:

```text
Manage Jenkins > Plugins
```

Kiem tra tab:

```text
Installed plugins
```

Plugin da cai roi se khong hien o `Available plugins`, nen hay search trong `Installed plugins` truoc.

Can co cac plugin nay:

```text
Pipeline
Git
GitHub
Docker Pipeline
Credentials Binding
Pipeline: Stage View
SonarQube Scanner
```

Tuy chon, khong bat buoc:

```text
Blue Ocean
```

Khong can cho project nay:

```text
Git server
Kubernetes Credentials
AWS Credentials
```

Project nay dung IAM Role gan vao Jenkins EC2 de truy cap AWS, khong dung AWS access key trong Jenkins.

Neu thieu plugin:

```text
Manage Jenkins > Plugins > Available plugins
```

Search ten plugin, tick, roi bam:

```text
Install
```

Neu Jenkins yeu cau restart, chon:

```text
Restart Jenkins when installation is complete and no jobs are running
```

## Buoc 7: Cau Hinh Sonar Scanner Tool Neu Co Dung

Neu Jenkinsfile co dung `sonar-scanner`, can cau hinh tool dung ten.

Vao:

```text
Manage Jenkins > Tools
```

Tim:

```text
SonarQube Scanner installations
```

Bam:

```text
Add SonarQube Scanner
```

Dien:

```text
Name: sonar-scanner
Install automatically: checked
```

Save.

Neu khong thay muc `SonarQube Scanner installations`, quay lai cai plugin:

```text
SonarQube Scanner
```

## Buoc 8: Kiem Tra Jenkins EC2 Co Du Quyen Va Tool

SSH vao Jenkins EC2:

```bash
ssh -i ~/.ssh/aws-hybrid ubuntu@<jenkins_public_ip>
```

Pipeline chay bang Linux user `jenkins`, nen kiem tra bang user nay:

```bash
sudo -u jenkins aws sts get-caller-identity
sudo -u jenkins aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster
sudo -u jenkins kubectl get nodes
sudo -u jenkins docker ps
```

Kiem tra tool:

```bash
node -v
npm -v
trivy --version
semgrep --version
docker version
aws --version
kubectl version --client
```

Ket qua mong muon:

- `aws sts get-caller-identity` tra ve role `blog-cv-jenkins-role`.
- `kubectl get nodes` thay EKS nodes `Ready`.
- `docker ps` chay duoc, khong bao permission denied.

Neu Docker bao permission denied:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Neu lenh nay bi loi:

```bash
aws ecr describe-repositories --region ap-southeast-1
```

voi loi `ecr:DescribeRepositories is not authorized` thi chua can sua ngay. Jenkinsfile hien tai khong can action do de push image.

## Buoc 9: Tao GitHub Token Cho Jenkins

Neu GitHub repo la private, Jenkins can Personal Access Token. Khong dung mat khau GitHub.

Vao GitHub:

```text
Settings > Developer settings > Personal access tokens > Tokens (classic)
```

Tao token moi voi scope:

```text
repo
```

Copy token lai. Sau khi roi khoi trang GitHub, ban se khong xem lai token duoc nua.

## Buoc 10: Them GitHub Credential Vao Jenkins

Vao Jenkins:

```text
Manage Jenkins > Credentials > System > Global credentials > Add Credentials
```

Dien:

```text
Kind: Username with password
Scope: Global
Username: <GitHub username>
Password: <GitHub Personal Access Token>
ID: jenkins
Description: GitHub token for personal-blog-cv
```

Vi du:

```text
Username: Lequangtien165
Password: <token vua tao>
ID: jenkins
Description: GitHub token for personal-blog-cv
```

Khong tick:

```text
Treat username as secret
```

## Buoc 11: Tao Jenkins Pipeline Job

Vao Jenkins home:

```text
New Item
```

Nhap ten:

```text
blog-cv-deploy
```

Chon:

```text
Pipeline
```

Bam:

```text
OK
```

### General

Dien:

```text
Description: Deploy personal-blog-cv to AWS EKS via Docker image pushed to ECR
```

Nen bat:

```text
Discard old builds: checked
Days to keep builds: 7
Max # of builds to keep: 10
```

Tuy chon:

```text
GitHub project: checked
Project url: https://github.com/Lequangtien165/personal-blog-cv/
```

Khong can bat:

```text
This project is parameterized
Execute concurrent builds if necessary
```

### Pipeline

Chon:

```text
Definition: Pipeline script from SCM
SCM: Git
```

Dien:

```text
Repository URL: https://github.com/Lequangtien165/personal-blog-cv.git
Credentials: jenkins
Branches to build: */main
Script Path: personal-blog-cv/Jenkinsfile
```

Neu repo cua ban public, co the de:

```text
Credentials: none
```

Neu repo private, bat buoc chon credential vua tao.

Bam:

```text
Save
```

## Buoc 12: Chay Pipeline

Trong job `blog-cv-deploy`, bam:

```text
Build Now
```

Mo build moi nhat:

```text
Console Output
```

Pipeline se chay:

1. Jenkins checkout code tu GitHub.
2. `npm ci`.
3. Lay AWS account ID va tao ECR URL.
4. Lint.
5. Typecheck.
6. Build Next.js.
7. Semgrep scan.
8. Trivy filesystem scan.
9. Docker build.
10. Trivy image scan.
11. Login ECR va push image.
12. Deploy len EKS.
13. Verify rollout.

Quan trong: Jenkinsfile duoc lay tu GitHub. Neu ban sua Jenkinsfile tren may local, phai commit va push len GitHub truoc, Jenkins moi chay ban moi.

## Buoc 13: Xem Ket Qua Sau Khi Build Thanh Cong

### Xem artifacts trong Jenkins

Vao:

```text
blog-cv-deploy > build moi nhat > Artifacts
```

Co the thay:

```text
personal-blog-cv/fs.html
personal-blog-cv/semgrep.json
image.html
```

### Xem Docker image tren ECR

Vao AWS Console:

```text
ECR > Repositories > blog-cv-app > Images
```

Se thay image tags:

```text
latest
<BUILD_NUMBER>
```

### Xem webapp tren EKS

Chay:

```bash
sudo -u jenkins kubectl get pods -n webapps
sudo -u jenkins kubectl get svc -n webapps
```

Tim service:

```text
blog-cv-service
```

Lay cot `EXTERNAL-IP` hoac hostname cua LoadBalancer, mo tren browser.

Neu chay tu may local da co kubeconfig:

```bash
kubectl get pods -n webapps
kubectl get svc -n webapps
```

## Chay Lai Pipeline

Muốn deploy lai, vao Jenkins job:

```text
blog-cv-deploy > Build Now
```

Khong can Terraform lai neu ha tang van con.

Khong dung:

```bash
terraform destroy
```

de chay lai pipeline.

## Cac Loi Thuong Gap

### Khong thay plugin trong Available plugins

Kiem tra tab:

```text
Installed plugins
```

Neu plugin da cai, no khong hien trong `Available plugins`.

### GitHub bao Invalid username or token

Nguyen nhan:

- Dang dung GitHub password thay vi token.
- Token het han.
- Job chua chon credential.

Cach sua:

- Tao GitHub Personal Access Token moi.
- Scope cho repo private: `repo`.
- Add vao Jenkins Credentials.
- Chon credential trong job SCM.

### GitHub bao Write access to repository not granted

Nguyen nhan:

- Token khong co quyen voi repo do.
- Repo URL khong dung account/repo.
- Token fine-grained chua duoc gan repo.

Cach sua nhanh:

- Dung classic token voi scope `repo`.
- Kiem tra lai `Repository URL`.

### No tool named sonar-scanner found

Cach sua:

```text
Manage Jenkins > Plugins > Available plugins
```

Cai:

```text
SonarQube Scanner
```

Sau do vao:

```text
Manage Jenkins > Tools > SonarQube Scanner installations
```

Them:

```text
Name: sonar-scanner
Install automatically: checked
```

### Git checkout bi lap hoac checkout sai repo

Job da checkout code tu `Pipeline script from SCM`. Khong nen them stage `git` checkout thu hai trong Jenkinsfile.

Neu Jenkinsfile co doan nhu sau thi nen xoa:

```groovy
stage("Git Checkout") {
  steps {
    git branch: "main", url: "https://github.com/..."
  }
}
```

### Jenkins bao illegal string body character after dollar sign

Nguyen nhan: Groovy parse sai shell command co `$()` hoac `$VAR` trong chuoi double quote.

Dung single quote hoac triple single quote:

```groovy
sh '''
  ECR_REGISTRY=$(echo $ECR_REPOSITORY_URL | cut -d/ -f1)
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
'''
```

### Docker permission denied

Chay tren Jenkins EC2:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### kubectl unauthorized

Chay lai Terraform de dam bao Jenkins role da duoc cap quyen EKS:

```bash
cd infra/environments/dev
terraform apply
```

Sau do tren Jenkins EC2:

```bash
sudo -u jenkins aws eks --region ap-southeast-1 update-kubeconfig --name blog-cv-cluster
sudo -u jenkins kubectl get nodes
```

### npm ci fail

Kiem tra repo co file:

```text
personal-blog-cv/package-lock.json
```

Pipeline hien tai chay `npm ci` trong thu muc:

```text
personal-blog-cv
```

### Khong thay webapp sau khi deploy

Kiem tra pods va service:

```bash
kubectl get pods -n webapps
kubectl get svc -n webapps
kubectl describe svc blog-cv-service -n webapps
```

Neu LoadBalancer chua co hostname, doi 1-3 phut roi kiem tra lai.

## Xoa Toan Bo Ha Tang

Chi chay khi khong dung lab nua de tranh ton tien:

```bash
cd infra/environments/dev
terraform destroy
```

Khi Terraform hoi xac nhan, go:

```text
yes
```

Lenh nay se xoa:

- Jenkins EC2
- EKS cluster va node group
- ECR repository
- VPC, subnets, route table, internet gateway
- Security groups
- Cac EC2 tuy chon neu da bat

Sau khi destroy, Jenkins URL va webapp URL se khong con hoat dong.
