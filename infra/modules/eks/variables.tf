variable "project_name" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "eks_node_instance_type" {
  type = string
}

variable "eks_desired_size" {
  type = number
}

variable "eks_min_size" {
  type = number
}

variable "eks_max_size" {
  type = number
}

