#!/bin/bash
set -e

# Update system packages
yum update -y

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /app

# Create docker-compose.yml
cat > /app/docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: ${backend_image}
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${mongo_uri}
      - JWT_SECRET=${jwt_secret}
    restart: always

  frontend:
    image: ${frontend_image}
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
EOF

# Pull and run Docker containers
cd /app
docker-compose pull
docker-compose up -d

# Set up CloudWatch agent for monitoring
yum install -y amazon-cloudwatch-agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
  "metrics": {
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ],
        "metrics_collection_interval": 60,
        "totalcpu": false
      },
      "disk": {
        "measurement": [
          "used_percent",
          "inodes_free"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "/"
        ]
      },
      "diskio": {
        "measurement": [
          "io_time"
        ],
        "metrics_collection_interval": 60
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 60
      },
      "swap": {
        "measurement": [
          "swap_used_percent"
        ],
        "metrics_collection_interval": 60
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/messages",
            "log_group_name": "campus-compass-system-logs",
            "log_stream_name": "{instance_id}-system"
          },
          {
            "file_path": "/var/log/docker",
            "log_group_name": "campus-compass-docker-logs",
            "log_stream_name": "{instance_id}-docker"
          }
        ]
      }
    }
  }
}
EOF

# Start CloudWatch agent
systemctl start amazon-cloudwatch-agent
systemctl enable amazon-cloudwatch-agent