#!/bin/bash

# Smart Unit Converter Deployment Script
# Supports multiple deployment platforms

echo "🚀 Starting Smart Unit Converter deployment..."

# Check if we're in the right directory
if [ ! -f "docs/index.html" ]; then
    echo "❌ Error: docs/index.html not found. Please run this from the project root."
    exit 1
fi

# Create a simple static site structure
echo "📁 Setting up static site structure..."

# Ensure all necessary files are in docs
cp -f smart_unit_converter/draggable_categories.js docs/ 2>/dev/null || echo "⚠️  draggable_categories.js already exists"
cp -f smart_unit_converter/service-worker.js docs/ 2>/dev/null || echo "⚠️  service-worker.js already exists"

# Create a simple index.html if it doesn't exist
if [ ! -f "docs/index.html" ]; then
    echo "📄 Creating index.html..."
    cp smart_unit_converter/stunning_converter.html docs/index.html
fi

# Add .nojekyll to prevent Jekyll processing
touch docs/.nojekyll

echo "✅ Static site ready for deployment!"
echo ""
echo "🌐 Deployment Options:"
echo "1. Netlify: Push to GitHub and connect to Netlify"
echo "2. GitHub Pages: Already configured with .nojekyll"
echo "3. Vercel: Push to GitHub and connect to Vercel"
echo "4. Local: Open docs/index.html in browser"
echo ""
echo "📂 Files in docs/:"
ls -la docs/ 