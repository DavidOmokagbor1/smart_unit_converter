#!/bin/bash

echo "🚀 Starting Persistent Expo Server (LAN Mode)..."
echo "================================================"

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

# Wait a moment for processes to stop
sleep 2

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "🌐 Local IP: $LOCAL_IP"

# Start Expo in LAN mode (works on local network)
echo "🌐 Starting Expo server in LAN mode..."
echo "📱 This will work even when Cursor is closed!"
echo "📱 Make sure your phone is on the same WiFi network"
echo ""

# Start Expo and keep it running
nohup npx expo start --lan --clear > ../expo_persistent.log 2>&1 &

# Get the process ID
EXPO_PID=$!
echo "✅ Expo server started with PID: $EXPO_PID"
echo "📝 Logs are being written to: expo_persistent.log"
echo ""

# Wait a moment for Expo to start
sleep 8

# Try to get the QR code URL
echo "🔍 Getting QR code URL..."
QR_URL=$(grep -o "exp://[^[:space:]]*" ../expo_persistent.log | tail -1)

if [ ! -z "$QR_URL" ]; then
    echo "📱 QR Code URL: $QR_URL"
    echo "📱 Scan this QR code with Expo Go app on your phone"
    
    # Generate QR code image
    echo "🖼️  Generating QR code image..."
    python3 -c "
import qrcode
import sys
try:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data('$QR_URL')
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')
    img.save('../expo_lan_qr.png')
    print('✅ QR code saved as: expo_lan_qr.png')
except Exception as e:
    print(f'⚠️  Could not generate QR image: {e}')
" 2>/dev/null || echo "⚠️  Python QR generation failed, but URL is available above"
else
    echo "⚠️  QR code not found in logs yet. Check expo_persistent.log for details"
    echo "📱 You can also manually enter this URL in Expo Go:"
    echo "   exp://$LOCAL_IP:8081"
fi

echo ""
echo "🎯 Expo server is now running in the background!"
echo "📱 Your phone will stay connected even when Cursor is closed"
echo "🌐 Make sure your phone is on the same WiFi network as this computer"
echo "🛑 To stop the server, run: pkill -f 'expo start'"
echo "📊 To view logs, run: tail -f expo_persistent.log"
echo ""
echo "✅ Server is persistent and independent of Cursor!"



