output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.campus_compass_alb.dns_name
}

output "db_endpoint" {
  description = "Endpoint of the DocumentDB cluster"
  value       = aws_docdb_cluster.campus_compass_db.endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = aws_s3_bucket.static_assets.bucket
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket for static assets"
  value       = aws_s3_bucket.static_assets.bucket_domain_name
}