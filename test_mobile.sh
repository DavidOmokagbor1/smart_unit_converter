#!/bin/bash

# Mobile Testing Script for Smart Unit Converter PWA
echo "📱 Mobile Testing Setup for Smart Unit Converter"
echo "================================================"

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo ""
echo "🚀 OPTION 1: Local Network Testing (Easiest)"
echo "--------------------------------------------"
echo "1. Make sure your iPhone and computer are on the same WiFi"
echo "2. Open Safari on your iPhone"
echo "3. Go to: http://$LOCAL_IP:8000/docs/"
echo "4. Look for 'Add to Home Screen' option"
echo "5. Install the app!"
echo ""

echo "🌐 OPTION 2: Public URL Testing (ngrok)"
echo "---------------------------------------"
echo "1. I'll start ngrok to create a public URL"
echo "2. You can access it from anywhere"
echo "3. Perfect for testing on any device"
echo ""

read -p "Choose option (1 for local, 2 for ngrok): " choice

if [ "$choice" = "2" ]; then
    echo ""
    echo "🌐 Starting ngrok tunnel..."
    echo "This will create a public URL you can access from your iPhone"
    echo ""
    echo "Once ngrok starts, you'll see a URL like:"
    echo "https://abc123.ngrok.io"
    echo ""
    echo "Use that URL on your iPhone to test the PWA!"
    echo ""
    echo "Press Ctrl+C to stop ngrok when done testing"
    echo ""
    ngrok http 8000
else
    echo ""
    echo "📱 Local Testing Instructions:"
    echo "=============================="
    echo "1. Your local server is running on: http://$LOCAL_IP:8000"
    echo "2. Open Safari on your iPhone"
    echo "3. Navigate to: http://$LOCAL_IP:8000/docs/"
    echo "4. Test the PWA features"
    echo "5. Look for 'Add to Home Screen' option"
    echo ""
    echo "📋 Test URLs:"
    echo "- Main App: http://$LOCAL_IP:8000/docs/index.html"
    echo "- PWA Test: http://$LOCAL_IP:8000/test_pwa.html"
    echo "- Manifest: http://$LOCAL_IP:8000/docs/manifest.json"
    echo ""
    echo "Press Ctrl+C to stop the server when done"
    echo ""
    echo "Starting local server..."
    python3 -m http.server 8000
fi
