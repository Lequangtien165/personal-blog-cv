output "jenkins_public_ip" {
  value = aws_instance.jenkins.public_ip
}

output "sonarqube_public_ip" {
  value = var.enable_sonarqube ? aws_instance.sonarqube[0].public_ip : null
}

output "nexus_public_ip" {
  value = var.enable_nexus ? aws_instance.nexus[0].public_ip : null
}

output "monitoring_public_ip" {
  value = var.enable_monitoring ? aws_instance.monitoring[0].public_ip : null
}

output "jenkins_role_arn" {
  value = aws_iam_role.jenkins.arn
}
