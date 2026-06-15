terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "network" {
  source       = "../../modules/network"
  project_name = var.project_name
  region       = var.region
}

module "security" {
  source       = "../../modules/security"
  project_name = var.project_name
  vpc_id       = module.network.vpc_id
  my_ip_cidr   = var.my_ip_cidr
}

module "key_pair" {
  source          = "../../modules/key_pair"
  project_name    = var.project_name
  public_key_path = var.public_key_path
}

resource "aws_ecr_repository" "app" {
  name                 = "${var.project_name}-app"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-app"
  }
}

module "ec2" {
  source                 = "../../modules/ec2"
  project_name           = var.project_name
  subnet_id              = module.network.public_subnet_ids[0]
  security_group_id      = module.security.cicd_sg_id
  key_name               = module.key_pair.key_name
  enable_nexus           = var.enable_nexus
  enable_sonarqube       = var.enable_sonarqube
  enable_monitoring      = var.enable_monitoring
  jenkins_type           = var.jenkins_instance_type
  sonarqube_type         = var.sonarqube_instance_type
  nexus_type             = var.nexus_instance_type
  monitoring_type        = var.monitoring_instance_type
  jenkins_volume_size    = var.jenkins_volume_size
  sonarqube_volume_size  = var.sonarqube_volume_size
  nexus_volume_size      = var.nexus_volume_size
  monitoring_volume_size = var.monitoring_volume_size
}

module "eks" {
  source                 = "../../modules/eks"
  project_name           = var.project_name
  subnet_ids             = module.network.public_subnet_ids
  eks_node_instance_type = var.eks_node_instance_type
  eks_desired_size       = var.eks_desired_size
  eks_min_size           = var.eks_min_size
  eks_max_size           = var.eks_max_size
}

resource "aws_eks_access_entry" "jenkins" {
  cluster_name  = module.eks.cluster_name
  principal_arn = module.ec2.jenkins_role_arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "jenkins_admin" {
  cluster_name  = module.eks.cluster_name
  principal_arn = module.ec2.jenkins_role_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

  access_scope {
    type = "cluster"
  }

  depends_on = [aws_eks_access_entry.jenkins]
}
