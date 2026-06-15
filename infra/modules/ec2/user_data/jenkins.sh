#!/bin/bash
set -eux

apt-get update
apt-get install -y openjdk-21-jdk curl ca-certificates gnupg lsb-release wget apt-transport-https unzip python3 python3-pip python3-venv

rm -f /usr/share/keyrings/jenkins-keyring.asc /usr/share/keyrings/jenkins-keyring.gpg
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | gpg --dearmor -o /usr/share/keyrings/jenkins-keyring.gpg
gpg --homedir /tmp --no-default-keyring --keyring /usr/share/keyrings/jenkins-keyring.gpg --keyserver hkps://keyserver.ubuntu.com:443 --recv-keys 7198F4B714ABFC68 || true
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.gpg] https://pkg.jenkins.io/debian-stable binary/" > /etc/apt/sources.list.d/jenkins.list

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" > /etc/apt/sources.list.d/trivy.list

apt-get update
apt-get install -y jenkins docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin nodejs trivy

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
unzip -q /tmp/awscliv2.zip -d /tmp
/tmp/aws/install
python3 -m pip install semgrep || python3 -m pip install --break-system-packages semgrep

snap install kubectl --classic

usermod -aG docker ubuntu
usermod -aG docker jenkins

systemctl enable docker
systemctl start docker
systemctl enable jenkins
systemctl restart jenkins
