#!/bin/bash

echo "🔧 Fixing Expo Startup Issues..."
echo "=================================================="

# Kill any existing processes
pkill -f expo 2>/dev/null
pkill -f node 2>/dev/null
sleep 2

# Change to Expo directory
cd SmartUnitConverterExpo

# Clear Expo cache
echo "🧹 Clearing Expo cache..."
npx expo r -c 2>/dev/null || true

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Fix Expo configuration
echo "⚙️  Fixing Expo configuration..."
npx expo install --fix

# Start Expo in LAN mode
echo "🚀 Starting Expo in LAN mode..."
echo "📱 This will generate a QR code for Expo Go"
echo "⏹️  Press Ctrl+C to stop"
echo "=================================================="

npx expo start --lan --clear
