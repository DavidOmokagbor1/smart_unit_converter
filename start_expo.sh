#!/bin/bash

# Smart Unit Converter - Simple Expo Starter
echo "🎯 Starting Smart Unit Converter Expo Server..."

# Change to Expo project directory
cd SmartUnitConverterExpo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Expo with tunnel for external access
echo "🚀 Starting Expo development server..."
echo "📱 Scan the QR code with Expo Go app"
echo "🌐 Or open the web URL in your browser"
echo "⏹️  Press Ctrl+C to stop the server"
echo "=================================================="

npx expo start --tunnel --clear




