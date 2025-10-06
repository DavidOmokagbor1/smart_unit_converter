#!/bin/bash

echo "🚀 Starting Expo with QR Code Display..."
echo "=================================================="

# Kill any existing Expo processes
pkill -f expo 2>/dev/null
sleep 2

# Change to Expo directory
cd SmartUnitConverterExpo

# Start Expo in background
echo "📱 Starting Expo development server..."
npx expo start --lan --clear --no-dev &
EXPO_PID=$!

# Wait for Expo to start
echo "⏳ Waiting for Expo to start..."
sleep 15

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.160"  # fallback IP
fi

# Create QR code
echo "🔗 Creating QR code for: exp://$LOCAL_IP:8081"
python3 -c "
import qrcode
import sys

url = 'exp://$LOCAL_IP:8081'
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(url)
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('expo_live_qr.png')
print('✅ QR code saved: expo_live_qr.png')
print(f'🔗 URL: {url}')
"

# Create display page
cat > expo_live_display.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Expo Go QR Code</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        .qr-code { max-width: 400px; margin: 20px auto; }
        .url { background: #f0f0f0; padding: 10px; margin: 20px; border-radius: 5px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>📱 Expo Go QR Code</h1>
    <img src="expo_live_qr.png" alt="QR Code" class="qr-code">
    <div class="url" id="url">exp://LOCAL_IP:8081</div>
    <p>1. Open Expo Go app on your phone</p>
    <p>2. Scan the QR code above</p>
    <p>3. Your app will load!</p>
</body>
</html>
EOF

# Replace placeholder with actual IP
sed -i '' "s/LOCAL_IP/$LOCAL_IP/g" expo_live_display.html

echo "✅ Display page created: expo_live_display.html"
echo "🌐 Opening display page..."

# Open the display page
open expo_live_display.html

echo "=================================================="
echo "📱 Instructions:"
echo "1. Install Expo Go app on your phone"
echo "2. Open Expo Go app"
echo "3. Scan the QR code in the browser window"
echo "4. Your Smart Unit Converter app will load!"
echo "=================================================="
echo "⏹️  Press Ctrl+C to stop Expo when done"

# Keep the script running
wait $EXPO_PID


