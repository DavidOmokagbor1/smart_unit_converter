# 🚀 Google Cloud Run Deployment Guide

## Prerequisites
- Google Cloud account with billing enabled
- GitHub repository with your Smart Unit Converter code
- Cloud Run API enabled

## Step-by-Step Deployment

### 1. GitHub Authentication
1. In Cloud Run "Create service" page
2. Click **"Authenticate"** next to GitHub warning
3. Authorize Google Cloud to access your repositories
4. Return to Cloud Run page

### 2. Repository Selection
1. Select your **Smart Unit Converter repository** from dropdown
2. Verify the repository is connected successfully

### 3. Build Configuration
**Basic Settings:**
- **Dockerfile path**: `./Dockerfile`
- **Build context**: `.` (root directory)
- **Port**: `8080`

**Advanced Settings:**
- **Memory**: 512 MiB
- **CPU**: 1 vCPU
- **Concurrency**: 1000
- **Timeout**: 300 seconds

### 4. Service Configuration
**Basic Settings:**
- **Service name**: `smart-unit-converter`
- **Region**: `europe-west1` (or your preferred region)
- **Authentication**: ✅ **Allow public access**

**Scaling:**
- **Min instances**: 0
- **Max instances**: 10
- **CPU allocation**: Request-based

### 5. Deploy
1. Click **"Create"** to start deployment
2. Wait for build to complete (5-10 minutes)
3. Note the service URL (e.g., `https://smart-unit-converter-xxxxx.run.app`)

## Post-Deployment

### Test Your App
1. Visit the service URL
2. Test PWA installation on mobile
3. Verify all features work correctly

### Custom Domain (Optional)
1. Go to Cloud Run service settings
2. Add custom domain
3. Configure DNS records

### Monitoring
1. Check Cloud Run logs for any issues
2. Monitor performance metrics
3. Set up alerts if needed

## Troubleshooting

### Common Issues
- **Build fails**: Check Dockerfile syntax
- **App not loading**: Verify all files are copied correctly
- **PWA not working**: Check manifest.json and service worker

### Useful Commands
```bash
# Test locally with Docker
docker build -t smart-unit-converter .
docker run -p 8080:8080 smart-unit-converter

# Check logs
gcloud run services logs read smart-unit-converter --region=europe-west1
```

## Cost Optimization
- **Min instances**: 0 (only pay when requests come in)
- **Memory**: 512 MiB (sufficient for static site)
- **CPU**: 1 vCPU (adequate for most traffic)

## Security Features Included
- Security headers (CSP, XSS protection, etc.)
- HTTPS by default
- No authentication required (public app)
- Rate limiting via Cloud Run

## Support
- Check Cloud Run documentation
- Review build logs for errors
- Test locally before deploying
