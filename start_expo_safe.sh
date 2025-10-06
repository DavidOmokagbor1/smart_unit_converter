#!/bin/bash

echo "🚀 Safe Expo Startup"
echo "==================="

# Check if already running
if pgrep -f "expo start" > /dev/null; then
    echo "⚠️  Expo is already running"
    echo "To restart, run: pkill -f expo && ./start_expo_safe.sh"
    exit 1
fi

# Navigate to Expo directory
cd SmartUnitConverterExpo

# Clear cache
echo "🧹 Clearing cache..."
npx expo r -c 2>/dev/null || true

# Start Expo
echo "🚀 Starting Expo..."
npx expo start --lan --clear

