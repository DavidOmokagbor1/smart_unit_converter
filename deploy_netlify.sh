#!/bin/bash

echo "🚀 NETLIFY DEPLOYMENT TROUBLESHOOTER"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found in current directory"
    echo "Please run this script from the smart_unit_converter directory"
    exit 1
fi

# Check if docs directory exists and has index.html
if [ ! -d "docs" ]; then
    echo "❌ Error: docs directory not found"
    exit 1
fi

if [ ! -f "docs/index.html" ]; then
    echo "❌ Error: docs/index.html not found"
    exit 1
fi

echo "✅ Found netlify.toml"
echo "✅ Found docs directory"
echo "✅ Found docs/index.html"

# Check git status
echo ""
echo "📊 GIT STATUS:"
git status --porcelain

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "⚠️  You have uncommitted changes!"
    echo "Committing changes..."
    git add .
    git commit -m "🔧 Fix Netlify deployment - Update crypto rates"
    git push origin main
    echo "✅ Changes committed and pushed"
else
    echo "✅ No uncommitted changes"
fi

echo ""
echo "🔧 NETLIFY TROUBLESHOOTING STEPS:"
echo "=================================="
echo ""
echo "1. Go to https://app.netlify.com"
echo "2. Find your site in the dashboard"
echo "3. Click on your site name"
echo "4. Go to 'Deploys' tab"
echo "5. Check if the latest commit is deployed"
echo ""
echo "If not deployed:"
echo "6. Go to 'Site settings' → 'Build & deploy'"
echo "7. Verify these settings:"
echo "   - Build command: (leave empty)"
echo "   - Publish directory: docs"
echo "   - Base directory: (leave empty)"
echo ""
echo "8. Go to 'Deploys' → 'Trigger deploy' → 'Deploy site'"
echo ""
echo "9. If still not working, try:"
echo "   - Go to 'Site settings' → 'Build & deploy' → 'Continuous Deployment'"
echo "   - Disconnect and reconnect your GitHub repository"
echo ""

echo "🌐 YOUR SITES:"
echo "=============="
echo "GitHub Pages: https://davidomokagbor1.github.io/smart_unit_converter/"
echo "Netlify: (check your Netlify dashboard for the URL)"
echo ""

echo "✅ Script completed!" 