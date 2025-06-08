variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability zones for subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "ami_id" {
  description = "AMI ID for EC2 instances (Amazon Linux 2023)"
  type        = string
  default     = "ami-0c02fb55956c7d316" # Updated Amazon Linux 2023 AMI for us-east-1
}

variable "instance_type" {
  description = "Instance type for EC2 instances (Free tier eligible)"
  type        = string
  default     = "t2.micro" # Free tier eligible
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "yourdockerhub/campus-compass-frontend:latest"
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "yourdockerhub/campus-compass-backend:latest"
}

variable "s3_bucket_name" {
  description = "Name for S3 bucket to store static assets (must be globally unique)"
  type        = string
  default     = "campus-compass-static-assets-${random_id.bucket_suffix.hex}"
}

# Random ID for S3 bucket name uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}