# 🚀 Smart Unit Converter - Deployment Guide

## Multiple Deployment Options

Since GitHub Pages is having Jekyll issues, here are alternative deployment approaches:

## 🌐 **Option 1: Netlify (Recommended)**

### Setup

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `docs`
6. Deploy!

### Benefits

- ✅ No Jekyll processing
- ✅ Fast deployment
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Drag-and-drop functionality works perfectly

## 🌐 **Option 2: Vercel**

### Vercel Setup

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect the static site
5. Deploy!

### Vercel Benefits

- ✅ Zero configuration
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments

## 🌐 **Option 3: GitHub Pages (Fixed)**

### Current Status

- ✅ `.nojekyll` file added
- ✅ Jekyll processing disabled
- ✅ Should work now

### If still having issues

1. Check GitHub Pages settings in repository
2. Ensure source is set to "Deploy from a branch"
3. Select `main` branch and `/docs` folder

## 🌐 **Option 4: Local Testing**

### Quick Test

```bash
# Run the deployment script
./deploy.sh

# Open in browser
open docs/index.html
```

## 🔧 **Troubleshooting**

### If drag-and-drop still doesn't work

1. **Check Console**: Open browser dev tools and look for errors
2. **Check Network**: Ensure all JS files are loading
3. **Check CORS**: Some features might be blocked on local files

### Common Issues

1. **Mixed Content**: Use HTTPS deployment
2. **CORS Issues**: Deploy to a proper hosting service
3. **File Paths**: Ensure all files are in the docs directory

## 📁 **File Structure**

```text
smart_unit_converter/
├── docs/
│   ├── index.html              # Main app
│   ├── draggable_categories.js # Drag-and-drop system
│   ├── service-worker.js       # Offline functionality
│   ├── .nojekyll              # Disable Jekyll
│   └── README.md              # Documentation
├── netlify.toml               # Netlify config
├── vercel.json                # Vercel config
├── deploy.sh                  # Deployment script
└── DEPLOYMENT_GUIDE.md       # This file
```

## 🎯 **Recommended Approach**

1. **Try Netlify first** - Most reliable for static sites
2. **If issues persist** - Check browser console for JavaScript errors
3. **Test locally** - Use `./deploy.sh` and open `docs/index.html`

## 🚀 **Quick Deploy Commands**

```bash
# Setup and test locally
./deploy.sh

# Push to GitHub for deployment
git add .
git commit -m "Ready for deployment"
git push
```

Then connect to your preferred hosting service!
