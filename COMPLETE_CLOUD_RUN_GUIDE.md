# 🚀 Complete Google Cloud Run Deployment Guide
## Smart Unit Converter - Step-by-Step Process

### 📋 Prerequisites Checklist
- [ ] Google Cloud account with billing enabled
- [ ] GitHub account with your Smart Unit Converter repository
- [ ] Cloud Run API enabled in Google Cloud
- [ ] Dockerfile added to your GitHub repository

---

## 🎯 Phase 1: Prepare Your Repository

### Step 1.1: Add Dockerfile to GitHub
1. **Go to your GitHub repository**: `https://github.com/DavidOmokagbor1/smart_unit_converter`
2. **Click "Add file" → "Create new file"**
3. **Name the file**: `Dockerfile`
4. **Copy and paste this content**:

```dockerfile
# Use the official nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the main application files
COPY index.html ./
COPY manifest.json ./
COPY service-worker.js ./
COPY icon-192x192.png ./
COPY icon-512x512.png ./

# Copy the docs directory (main app files)
COPY docs/ ./

# Copy any additional static assets
COPY *.png ./
COPY *.html ./

# Create nginx configuration for Cloud Run
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    add_header Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com; style-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com; connect-src \'self\' https://api.trusted.com; img-src \'self\' data: https:; font-src \'self\' https://cdnjs.cloudflare.com;" always; \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Handle service worker \
    location /service-worker.js { \
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \
        add_header Pragma "no-cache"; \
        add_header Expires "0"; \
    } \
    \
    # Handle manifest.json \
    location /manifest.json { \
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \
        add_header Pragma "no-cache"; \
        add_header Expires "0"; \
    } \
    \
    # SPA routing - serve index.html for all routes \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Health check endpoint \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

5. **Commit the file** with message: "Add Dockerfile for Cloud Run deployment"

### Step 1.2: Verify Repository Structure
Your repository should now have:
- ✅ `Dockerfile` (root directory)
- ✅ `index.html` (root directory)
- ✅ `manifest.json` (root directory)
- ✅ `docs/` directory with app files
- ✅ `service-worker.js` (root directory)

---

## 🎯 Phase 2: Google Cloud Setup

### Step 2.1: Enable Required APIs
1. **Go to Google Cloud Console**: `https://console.cloud.google.com`
2. **Select your project** (or create one)
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ Cloud Run API
     - ✅ Cloud Build API
     - ✅ Artifact Registry API
     - ✅ Container Analysis API

### Step 2.2: Set Up Billing
1. **Go to "Billing"** in Google Cloud Console
2. **Link a billing account** to your project
3. **Verify billing is enabled**

---

## 🎯 Phase 3: Deploy to Cloud Run

### Step 3.1: Create Cloud Run Service
1. **Go to Cloud Run**: `https://console.cloud.google.com/run`
2. **Click "Create Service"**
3. **Select "Continuously deploy from a repository"**
4. **Click "Set up with Cloud Build"** (blue button)

### Step 3.2: Configure Source Repository
1. **Repository Provider**: Select "GitHub"
2. **Click "Authenticate"** if not already connected
3. **Authorize Google Cloud** to access your repositories
4. **Repository**: Select `DavidOmokagbor1/smart_unit_converter`
5. **Click "Next"**

### Step 3.3: Configure Build Settings
**Basic Settings:**
- **Dockerfile path**: `./Dockerfile`
- **Build context**: `.` (root directory)
- **Port**: `8080`

**Advanced Settings:**
- **Memory**: 512 MiB
- **CPU**: 1 vCPU
- **Concurrency**: 1000
- **Timeout**: 300 seconds

### Step 3.4: Configure Service Settings
**Basic Settings:**
- **Service name**: `smart-unit-converter`
- **Region**: `europe-west1` (or your preferred region)
- **Authentication**: ✅ **Allow public access**

**Scaling:**
- **Min instances**: 0
- **Max instances**: 10
- **CPU allocation**: Request-based

**Requests:**
- **Request timeout**: 300 seconds
- **Max concurrent requests**: 1000

**Execution environment:**
- **Default** (recommended)

**Revision scaling:**
- **Min instances**: 0
- **Max instances**: 10
- **Startup CPU boost**: ✅ Enabled

### Step 3.5: Deploy
1. **Review all settings**
2. **Click "Create"**
3. **Wait for deployment** (5-10 minutes)

---

## 🎯 Phase 4: Post-Deployment

### Step 4.1: Get Your App URL
After successful deployment, you'll get a URL like:
`https://smart-unit-converter-xxxxx.run.app`

### Step 4.2: Test Your Application
1. **Open the URL** in your browser
2. **Test PWA installation** on mobile:
   - Open in Safari/Chrome
   - Tap "Add to Home Screen"
   - Verify it works as a mobile app
3. **Test all features**:
   - Unit conversions
   - Currency rates
   - Offline functionality

### Step 4.3: Monitor Performance
1. **Go to Cloud Run** → Your service
2. **Check logs** for any errors
3. **Monitor metrics**:
   - Request count
   - Response time
   - Error rate
   - Memory usage

---

## 🎯 Phase 5: Optimization & Customization

### Step 5.1: Custom Domain (Optional)
1. **Go to Cloud Run** → Your service
2. **Click "Manage Custom Domains"**
3. **Add your domain**
4. **Configure DNS records**

### Step 5.2: Environment Variables (If Needed)
1. **Go to Cloud Run** → Your service
2. **Click "Edit & Deploy New Revision"**
3. **Add environment variables** if required

### Step 5.3: Monitoring & Alerts
1. **Set up monitoring** in Google Cloud Console
2. **Create alerts** for errors or high usage
3. **Set up logging** for debugging

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: Build Fails - "Dockerfile not found"
**Solution:**
- Ensure Dockerfile is in the root directory of your GitHub repository
- Check the Dockerfile path in Cloud Build settings

#### Issue 2: App Not Loading
**Solution:**
- Check Cloud Run logs for errors
- Verify all files are copied correctly in Dockerfile
- Test locally with Docker

#### Issue 3: PWA Not Working
**Solution:**
- Check manifest.json is accessible
- Verify service worker is registered
- Test in different browsers

#### Issue 4: High Costs
**Solution:**
- Set min instances to 0
- Use request-based billing
- Monitor usage patterns

### Debug Commands
```bash
# Test locally with Docker
docker build -t smart-unit-converter .
docker run -p 8080:8080 smart-unit-converter

# Check Cloud Run logs
gcloud run services logs read smart-unit-converter --region=europe-west1
```

---

## 📊 Cost Estimation

### Expected Monthly Costs (Low Traffic)
- **Cloud Run**: $0-5 (free tier: 2M requests/month)
- **Cloud Build**: $0-2 (free tier: 120 build minutes/month)
- **Artifact Registry**: $0-1 (free tier: 0.5GB storage)

### Expected Monthly Costs (High Traffic)
- **Cloud Run**: $10-50 (depending on usage)
- **Cloud Build**: $5-20 (for frequent deployments)
- **Artifact Registry**: $2-10 (for image storage)

---

## 🎉 Success Checklist

- [ ] Dockerfile added to GitHub
- [ ] Cloud Run service created
- [ ] Build completed successfully
- [ ] App accessible via URL
- [ ] PWA installs on mobile
- [ ] All features working
- [ ] Performance monitoring set up
- [ ] Custom domain configured (optional)

---

## 🚀 Next Steps

1. **Share your app** with the Cloud Run URL
2. **Set up monitoring** and alerts
3. **Configure custom domain** if needed
4. **Set up CI/CD** for automatic deployments
5. **Optimize performance** based on usage

---

## 📞 Support

If you encounter any issues:
1. **Check Cloud Run logs** first
2. **Review this guide** for common solutions
3. **Test locally** with Docker
4. **Contact support** if needed

**Your Smart Unit Converter is now live on Google Cloud Run! 🎉**
