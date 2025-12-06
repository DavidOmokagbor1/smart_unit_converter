#!/bin/bash

# Start React Native on port 8082
# This script kills any existing Metro processes and starts fresh

echo "🚀 Starting React Native..."
echo "================================"

# Kill any existing Metro/React Native processes
echo "🧹 Cleaning up existing processes..."
pkill -f "metro" 2>/dev/null
pkill -f "react-native start" 2>/dev/null
sleep 2

# Check if ports are free
if lsof -ti:8082 > /dev/null 2>&1; then
    echo "⚠️  Port 8082 is still in use. Killing process..."
    lsof -ti:8082 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Navigate to React Native directory
cd "$(dirname "$0")/SmartUnitConverterRN" || exit 1

echo "📱 Starting Metro bundler on port 8082..."
echo "================================"
npm start
