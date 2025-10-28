#!/bin/bash

echo "🚀 Starting Persistent Expo Server..."
echo "====================================="

# Navigate to the Expo project directory
cd /Users/java/Downloads/smart_unit_converter-main/SmartUnitConverterExpo

# Check if node_modules exists, install if not
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any existing Expo processes
echo "🔄 Stopping any existing Expo processes..."
pkill -f "expo start" || true
pkill -f "expo start --tunnel" || true
pkill -f "expo start --lan" || true

# Wait a moment for processes to stop
sleep 2

# Start Expo in tunnel mode (works from anywhere)
echo "🌐 Starting Expo server in tunnel mode..."
echo "📱 This will work even when Cursor is closed!"
echo ""

# Start Expo and keep it running
nohup npx expo start --tunnel --clear > ../expo_persistent.log 2>&1 &

# Get the process ID
EXPO_PID=$!
echo "✅ Expo server started with PID: $EXPO_PID"
echo "📝 Logs are being written to: expo_persistent.log"
echo ""

# Wait a moment for Expo to start
sleep 5

# Try to get the QR code URL
echo "🔍 Getting QR code URL..."
QR_URL=$(grep -o "exp://[^[:space:]]*" ../expo_persistent.log | tail -1)

if [ ! -z "$QR_URL" ]; then
    echo "📱 QR Code URL: $QR_URL"
    echo "📱 Scan this QR code with Expo Go app on your phone"
else
    echo "⚠️  QR code not found in logs yet. Check expo_persistent.log for details"
fi

echo ""
echo "🎯 Expo server is now running in the background!"
echo "📱 Your phone will stay connected even when Cursor is closed"
echo "🛑 To stop the server, run: pkill -f 'expo start'"
echo "📊 To view logs, run: tail -f expo_persistent.log"
echo ""
echo "✅ Server is persistent and independent of Cursor!"



