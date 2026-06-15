variable "region" {
  type        = string
  description = "AWS region."
}

variable "project_name" {
  type        = string
  description = "Project name prefix for resources."
}

variable "my_ip_cidr" {
  type        = string
  description = "Your public IP in CIDR form, for example 1.2.3.4/32."
}

variable "public_key_path" {
  type        = string
  description = "/mnt/c/Users/Qtienle/.ssh/aws-hybrid.pub"
}

variable "enable_nexus" {
  type        = bool
  description = "Create Nexus EC2 server."
  default     = false
}

variable "enable_sonarqube" {
  type        = bool
  description = "Create SonarQube EC2 server. Disabled by default for low-cost Jenkins + Trivy + Semgrep deployments."
  default     = false
}

variable "enable_monitoring" {
  type        = bool
  description = "Create optional monitoring EC2 server."
  default     = false
}

variable "jenkins_instance_type" {
  type        = string
  description = "Jenkins EC2 instance type."
}

variable "sonarqube_instance_type" {
  type        = string
  description = "SonarQube EC2 instance type."
}

variable "nexus_instance_type" {
  type        = string
  description = "Nexus EC2 instance type."
}

variable "monitoring_instance_type" {
  type        = string
  description = "Monitoring EC2 instance type."
}

variable "jenkins_volume_size" {
  type        = number
  description = "Jenkins root volume size in GB."
}

variable "sonarqube_volume_size" {
  type        = number
  description = "SonarQube root volume size in GB."
}

variable "nexus_volume_size" {
  type        = number
  description = "Nexus root volume size in GB."
}

variable "monitoring_volume_size" {
  type        = number
  description = "Monitoring root volume size in GB."
}

variable "eks_node_instance_type" {
  type        = string
  description = "EKS managed node group instance type."
}

variable "eks_desired_size" {
  type        = number
  description = "EKS node desired size."
}

variable "eks_min_size" {
  type        = number
  description = "EKS node min size."
}

variable "eks_max_size" {
  type        = number
  description = "EKS node max size."
}
