data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_iam_role" "jenkins" {
  name = "${var.project_name}-jenkins-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = {
    Name = "${var.project_name}-jenkins-role"
  }
}

resource "aws_iam_role_policy" "jenkins" {
  name = "${var.project_name}-jenkins-policy"
  role = aws_iam_role.jenkins.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "jenkins" {
  name = "${var.project_name}-jenkins-profile"
  role = aws_iam_role.jenkins.name
}

resource "aws_instance" "jenkins" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.jenkins_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name
  iam_instance_profile   = aws_iam_instance_profile.jenkins.name
  user_data              = file("${path.module}/user_data/jenkins.sh")

  root_block_device {
    volume_size = var.jenkins_volume_size
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-jenkins"
  }
}

resource "aws_instance" "sonarqube" {
  count                  = var.enable_sonarqube ? 1 : 0
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.sonarqube_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name
  user_data              = file("${path.module}/user_data/sonarqube.sh")

  root_block_device {
    volume_size = var.sonarqube_volume_size
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-sonarqube"
  }
}

resource "aws_instance" "nexus" {
  count                  = var.enable_nexus ? 1 : 0
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.nexus_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name
  user_data              = file("${path.module}/user_data/nexus.sh")

  root_block_device {
    volume_size = var.nexus_volume_size
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-nexus"
  }
}

resource "aws_instance" "monitoring" {
  count                  = var.enable_monitoring ? 1 : 0
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.monitoring_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name
  user_data              = file("${path.module}/user_data/monitoring.sh")

  root_block_device {
    volume_size = var.monitoring_volume_size
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-monitoring"
  }
}
