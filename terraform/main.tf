provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "campus_compass_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "campus-compass-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.campus_compass_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "campus-compass-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.campus_compass_vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "campus-compass-private-subnet-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.campus_compass_vpc.id

  tags = {
    Name = "campus-compass-igw"
  }
}

# Route Tables for Public Subnets (removed NAT Gateway to save costs)
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.campus_compass_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "campus-compass-public-route-table"
  }
}

# Route Table Associations for Public Subnets
resource "aws_route_table_association" "public_subnet_association" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

# Security Groups
resource "aws_security_group" "alb_sg" {
  name        = "campus-compass-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.campus_compass_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "campus-compass-alb-sg"
  }
}

resource "aws_security_group" "ec2_sg" {
  name        = "campus-compass-ec2-sg"
  description = "Security group for EC2 instances"
  vpc_id      = aws_vpc.campus_compass_vpc.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # SSH access for debugging (optional)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "campus-compass-ec2-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "campus_compass_alb" {
  name               = "campus-compass-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [for subnet in aws_subnet.public_subnets : subnet.id]

  enable_deletion_protection = false

  tags = {
    Name = "campus-compass-alb"
  }
}

resource "aws_lb_target_group" "frontend_tg" {
  name     = "campus-compass-frontend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.campus_compass_vpc.id

  health_check {
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  tags = {
    Name = "campus-compass-frontend-tg"
  }
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "campus-compass-backend-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.campus_compass_vpc.id

  health_check {
    path                = "/api/health"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  tags = {
    Name = "campus-compass-backend-tg"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.campus_compass_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.http_listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Launch Template
resource "aws_launch_template" "campus_compass_lt" {
  name_prefix   = "campus-compass-lt-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  user_data = base64encode(templatefile("${path.module}/scripts/user_data.sh", {
    frontend_image = var.frontend_image
    backend_image  = var.backend_image
    mongo_uri      = "mongodb://localhost:27017/campus_compass"
  }))

  block_device_mappings {
    device_name = "/dev/sda1"
    ebs {
      volume_size           = 8  # Reduced to minimum
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "campus-compass-instance"
    }
  }
}

# Single EC2 Instance (instead of Auto Scaling Group)
resource "aws_instance" "campus_compass_instance" {
  launch_template {
    id      = aws_launch_template.campus_compass_lt.id
    version = "$Latest"
  }

  subnet_id = aws_subnet.public_subnets[0].id

  tags = {
    Name = "campus-compass-instance"
  }
}

# Target Group Attachments
resource "aws_lb_target_group_attachment" "frontend_attachment" {
  target_group_arn = aws_lb_target_group.frontend_tg.arn
  target_id        = aws_instance.campus_compass_instance.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "backend_attachment" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = aws_instance.campus_compass_instance.id
  port             = 5000
}

# IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "campus-compass-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_policy_attachment" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "campus-compass-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# S3 Bucket for Static Assets
resource "aws_s3_bucket" "static_assets" {
  bucket = var.s3_bucket_name

  tags = {
    Name = "campus-compass-static-assets"
  }
}

resource "aws_s3_bucket_public_access_block" "static_assets_public_access" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "static_assets_policy" {
  bucket = aws_s3_bucket.static_assets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_assets.arn}/*"
      }
    ]
  })
}