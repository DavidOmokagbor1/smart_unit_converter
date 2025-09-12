#!/bin/bash

# Deploy to GitHub Pages for HTTPS (Voice Recognition)
echo "🚀 Deploying to GitHub Pages for Voice Recognition..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit with voice recognition"
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Add voice recognition and mobile app features"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No GitHub remote found. Please create a GitHub repository first:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Create a new repository named 'smart-unit-converter'"
    echo "   3. Run this script again"
    exit 1
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo "✅ Deployed to GitHub Pages!"
echo "🌐 Your app will be available at:"
echo "   https://$(git config user.name).github.io/smart-unit-converter"
echo ""
echo "📱 Voice recognition will work on HTTPS!"
echo "🎤 Test the voice input on your mobile device"
