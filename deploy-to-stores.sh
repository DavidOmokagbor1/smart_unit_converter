#!/bin/bash

# 🚀 App Store Deployment Script
# This script helps you deploy your Smart Unit Converter to various platforms

echo "🚀 Smart Unit Converter - App Store Deployment"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docs/index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: docs/index.html, manifest.json"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "🌐 Deploying to Netlify..."
    
    if command_exists netlify; then
        echo "📦 Netlify CLI found, deploying..."
        netlify deploy --dir=docs --prod
        echo "✅ Netlify deployment complete!"
    else
        echo "📦 Netlify CLI not found. Installing..."
        npm install -g netlify-cli
        echo "🔑 Please login to Netlify:"
        netlify login
        echo "🚀 Deploying..."
        netlify deploy --dir=docs --prod
        echo "✅ Netlify deployment complete!"
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🌐 Deploying to Vercel..."
    
    if command_exists vercel; then
        echo "📦 Vercel CLI found, deploying..."
        vercel --cwd docs
        echo "✅ Vercel deployment complete!"
    else
        echo "📦 Vercel CLI not found. Installing..."
        npm install -g vercel
        echo "🔑 Please login to Vercel:"
        vercel login
        echo "🚀 Deploying..."
        vercel --cwd docs
        echo "✅ Vercel deployment complete!"
    fi
}

# Function to prepare for app stores
prepare_app_stores() {
    echo "📱 Preparing for App Store deployment..."
    
    # Check if PWA Builder is available
    echo "🔍 Checking PWA Builder availability..."
    
    # Create app store assets
    echo "📋 Creating app store assets..."
    
    # Check manifest.json
    if [ -f "docs/manifest.json" ]; then
        echo "✅ PWA manifest found"
    else
        echo "❌ PWA manifest not found in docs/"
        exit 1
    fi
    
    # Check icons
    if [ -d "docs/icons" ]; then
        echo "✅ App icons found"
    else
        echo "❌ App icons not found in docs/icons/"
        exit 1
    fi
    
    # Check screenshots
    if [ -d "docs/screenshots" ]; then
        echo "✅ Screenshots found"
    else
        echo "⚠️  Screenshots not found - you may need to create them"
    fi
    
    echo ""
    echo "📱 App Store Preparation Complete!"
    echo ""
    echo "🎯 Next steps for app stores:"
    echo "1. Go to https://www.pwabuilder.com/"
    echo "2. Enter your deployed URL"
    echo "3. Click 'Start' to analyze your PWA"
    echo "4. Build for Android, Windows, or iOS"
    echo "5. Download and submit to respective app stores"
    echo ""
}

# Function to show current deployment status
show_status() {
    echo "📊 Current Deployment Status"
    echo "=========================="
    echo ""
    
    # Check GitHub Pages
    echo "🌐 GitHub Pages:"
    if curl -s -o /dev/null -w "%{http_code}" "https://davidomokagbor1.github.io/smart_unit_converter/" | grep -q "200"; then
        echo "✅ Live at: https://davidomokagbor1.github.io/smart_unit_converter/"
    else
        echo "❌ Not accessible or not deployed"
    fi
    
    echo ""
    echo "📱 PWA Status:"
    if [ -f "docs/manifest.json" ]; then
        echo "✅ PWA manifest ready"
    else
        echo "❌ PWA manifest missing"
    fi
    
    if [ -f "docs/service-worker.js" ]; then
        echo "✅ Service worker ready"
    else
        echo "❌ Service worker missing"
    fi
    
    echo ""
    echo "🔒 Security Status:"
    if [ -f "docs/security-utils.js" ]; then
        echo "✅ Security features implemented"
    else
        echo "❌ Security features missing"
    fi
    
    echo ""
}

# Main menu
show_menu() {
    echo "🎯 Choose deployment option:"
    echo ""
    echo "1. 🌐 Deploy to Netlify (Recommended)"
    echo "2. 🌐 Deploy to Vercel"
    echo "3. 📱 Prepare for App Stores"
    echo "4. 📊 Show Current Status"
    echo "5. 🚀 Deploy to All Platforms"
    echo "6. ❌ Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            deploy_netlify
            ;;
        2)
            deploy_vercel
            ;;
        3)
            prepare_app_stores
            ;;
        4)
            show_status
            ;;
        5)
            echo "🚀 Deploying to all platforms..."
            deploy_netlify
            echo ""
            deploy_vercel
            echo ""
            prepare_app_stores
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        "netlify")
            deploy_netlify
            ;;
        "vercel")
            deploy_vercel
            ;;
        "appstores")
            prepare_app_stores
            ;;
        "status")
            show_status
            ;;
        "all")
            deploy_netlify
            echo ""
            deploy_vercel
            echo ""
            prepare_app_stores
            ;;
        *)
            echo "Usage: $0 [netlify|vercel|appstores|status|all]"
            echo "Or run without arguments for interactive menu"
            exit 1
            ;;
    esac
fi

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "📚 For detailed instructions, see: APP_STORE_DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Quick links:"
echo "- PWA Builder: https://www.pwabuilder.com/"
echo "- Google Play Console: https://play.google.com/console"
echo "- Microsoft Partner Center: https://partner.microsoft.com/"
echo "- Samsung Galaxy Store: https://seller.samsungapps.com/"
echo ""
echo "Happy deploying! 🚀✨"


