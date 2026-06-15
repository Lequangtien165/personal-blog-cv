variable "project_name" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "key_name" {
  type = string
}

variable "enable_nexus" {
  type = bool
}

variable "enable_sonarqube" {
  type = bool
}

variable "enable_monitoring" {
  type = bool
}

variable "jenkins_type" {
  type = string
}

variable "sonarqube_type" {
  type = string
}

variable "nexus_type" {
  type = string
}

variable "monitoring_type" {
  type = string
}

variable "jenkins_volume_size" {
  type = number
}

variable "sonarqube_volume_size" {
  type = number
}

variable "nexus_volume_size" {
  type = number
}

variable "monitoring_volume_size" {
  type = number
}
