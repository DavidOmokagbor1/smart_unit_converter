#!/bin/bash

# Start Expo for preview with Expo Go app
echo "🚀 Starting Expo for Preview..."
echo "================================"

# Kill any existing Expo processes
pkill -f "expo start" 2>/dev/null
pkill -f "metro" 2>/dev/null
sleep 2

# Navigate to Expo directory
cd "$(dirname "$0")/SmartUnitConverterExpo" || exit 1

echo "📱 Starting Expo development server..."
echo ""
echo "📲 To preview on your phone:"
echo "   1. Install 'Expo Go' app from App Store or Google Play"
echo "   2. Open Expo Go app"
echo "   3. Scan the QR code that appears below"
echo ""
echo "🌐 To preview in web browser: Press 'w' in terminal"
echo "================================"
echo ""

# Start Expo with LAN mode
npx expo start --lan --clear
