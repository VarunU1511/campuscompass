# Campus Compass

A full-stack web application for campus accommodation and services.

<<<<<<< HEAD
## Project Goals
=======
For Preview:
**https://youtu.be/TVPIA4Zi9_4**

## Features
>>>>>>> origin/main

Campus Compass is designed to help students find and book accommodations, mess facilities, and restaurants near their campus. The platform connects students with service providers, streamlining the process of finding and securing essential services during their academic journey.

## Technologies Used

### Frontend
- React.js
- Styled Components
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose ODM

### DevOps & Infrastructure
- Docker and Docker Compose for containerization
- AWS for cloud infrastructure
- Terraform for Infrastructure as Code
- GitHub Actions for CI/CD pipeline

## Infrastructure Architecture

The application is deployed on AWS with the following components:

1. **Networking**:
   - Custom VPC with public and private subnets
   - Internet Gateway for public internet access
   - NAT Gateway for private subnet internet access
   - Security Groups for access control

2. **Compute**:
   - EC2 instances in an Auto Scaling Group
   - Application Load Balancer for traffic distribution
   - Docker containers for application deployment

3. **Database**:
   - Amazon DocumentDB (MongoDB compatible) for data storage
   - Private subnet deployment for security

4. **Storage**:
   - S3 bucket for static assets and uploads

5. **CI/CD Pipeline**:
   - GitHub Actions for automated deployment
   - Docker Hub for container registry

## Running Locally

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for development)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yashkankhareyk/campus-compass.git
   cd campus-compass
   ```

2. Set up environment variables:
   ```bash
   # Create .env file in the backend directory
   cp campuscompass/back/.env.example campuscompass/back/.env
   
   # Create .env file in the frontend directory
   cp campuscompass/front/.env.example campuscompass/front/.env
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5001

5. For development without Docker:
   ```bash
   # Start backend
   cd campuscompass/back
   npm install
   npm run dev
   
   # Start frontend in a new terminal
   cd campuscompass/front
   npm install
   npm start
   ```

## Deploying to AWS

### Prerequisites
- AWS CLI configured with appropriate permissions
- Terraform installed
- Docker Hub account (for storing container images)

### Steps

1. Build and push Docker images:
   ```bash
   # Login to Docker Hub
   docker login
   
   # Build and push backend image
   cd campuscompass/back
   docker build -t yourusername/campus-compass-backend:latest .
   docker push yourusername/campus-compass-backend:latest
   
   # Build and push frontend image
   cd ../front
   docker build -t yourusername/campus-compass-frontend:latest .
   docker push yourusername/campus-compass-frontend:latest
   ```

2. Update Terraform variables:
   ```bash
   cd ../terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your configuration
   ```

3. Initialize and apply Terraform configuration:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. After deployment, Terraform will output the application URL:
   ```bash
   terraform output alb_dns_name
   ```

## Tearing Down AWS Infrastructure

To remove all AWS resources created by Terraform:

1. Navigate to the Terraform directory:
   ```bash
   cd campuscompass/terraform
   ```

2. Run Terraform destroy command:
   ```bash
   terraform destroy
   ```

3. Confirm the destruction when prompted.

        