#!/usr/bin/env python3
"""
Create a working QR code for the Expo app on port 8083
"""

import qrcode
import subprocess
import socket

def get_local_ip():
    """Get the local IP address"""
    try:
        # Try to get the real IP address
        result = subprocess.run(['ifconfig'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if 'inet ' in line and '127.0.0.1' not in line and '169.254' not in line:
                ip = line.split()[1]
                if ip.startswith('192.168.') or ip.startswith('10.') or ip.startswith('172.'):
                    return ip
    except:
        pass
    
    # Fallback to hostname
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except:
        return '192.168.1.160'  # Default fallback

def create_qr_code(url, filename):
    """Create QR code for the URL"""
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename)
        print(f"✅ QR code saved: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error creating QR code: {e}")
        return False

def main():
    print("🚀 Creating Working QR Code for Expo Go")
    print("=" * 50)
    
    # Get the local IP
    local_ip = get_local_ip()
    print(f"🌐 Local IP: {local_ip}")
    
    # Create the tunnel URL for port 8083
    tunnel_url = f"exp://{local_ip}:8083"
    print(f"🔗 Expo URL: {tunnel_url}")
    
    # Create QR code
    print("\n📱 Creating QR code...")
    if create_qr_code(tunnel_url, "expo_working_qr.png"):
        print(f"✅ QR code saved: expo_working_qr.png")
        print(f"🔗 URL: {tunnel_url}")
        print("\n🎯 This should work with Expo Go!")
        print("1. Install 'Expo Go' app on your phone")
        print("2. Open Expo Go app")
        print("3. Scan the QR code")
        print("4. Your clean mobile app will load!")
        print("\n💡 If you still have issues:")
        print("   - Try the web version: mobile_test.html")
        print("   - Make sure you're on the same WiFi network")
        print("   - Check that port 8083 is not blocked")
    else:
        print("❌ Failed to create QR code")

if __name__ == "__main__":
    main()
