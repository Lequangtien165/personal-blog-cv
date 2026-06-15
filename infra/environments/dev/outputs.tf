output "jenkins_public_ip" {
  value = module.ec2.jenkins_public_ip
}

output "jenkins_url" {
  value = "http://${module.ec2.jenkins_public_ip}:8080"
}

output "sonarqube_public_ip" {
  value = module.ec2.sonarqube_public_ip
}

output "sonarqube_url" {
  value = module.ec2.sonarqube_public_ip == null ? null : "http://${module.ec2.sonarqube_public_ip}:9000"
}

output "nexus_public_ip" {
  value = module.ec2.nexus_public_ip
}

output "nexus_url" {
  value = module.ec2.nexus_public_ip == null ? null : "http://${module.ec2.nexus_public_ip}:8081"
}

output "monitoring_public_ip" {
  value = module.ec2.monitoring_public_ip
}

output "monitoring_url" {
  value = module.ec2.monitoring_public_ip == null ? null : "http://${module.ec2.monitoring_public_ip}:3000"
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_update_kubeconfig_command" {
  value = "aws eks --region ${var.region} update-kubeconfig --name ${module.eks.cluster_name}"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}
