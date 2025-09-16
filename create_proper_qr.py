#!/usr/bin/env python3
"""
Create a proper QR code for Expo Go
"""

import qrcode
import subprocess
import socket
import os

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

def create_proper_qr_code(url, filename):
    """Create a proper QR code for the URL"""
    try:
        # Create QR code with proper settings
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=20,  # Larger box size for better visibility
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # Create image with high contrast
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save with proper size
        img.save(filename, "PNG")
        
        # Check file size
        file_size = os.path.getsize(filename)
        print(f"✅ QR code saved: {filename} ({file_size} bytes)")
        
        return True
    except Exception as e:
        print(f"❌ Error creating QR code: {e}")
        return False

def main():
    print("🚀 Creating Proper QR Code for Expo Go")
    print("=" * 50)
    
    # Get the local IP
    local_ip = get_local_ip()
    print(f"🌐 Local IP: {local_ip}")
    
    # Create the tunnel URL for port 8083
    tunnel_url = f"exp://{local_ip}:8083"
    print(f"🔗 Expo URL: {tunnel_url}")
    
    # Create proper QR code
    print("\n📱 Creating proper QR code...")
    if create_proper_qr_code(tunnel_url, "expo_proper_qr.png"):
        print(f"✅ Proper QR code saved: expo_proper_qr.png")
        print(f"🔗 URL: {tunnel_url}")
        print("\n🎯 This QR code should display properly!")
        print("1. Install 'Expo Go' app on your phone")
        print("2. Open Expo Go app")
        print("3. Scan the QR code")
        print("4. Your mobile app will load!")
        
        # Also create a web version
        web_url = f"http://{local_ip}:8083"
        if create_proper_qr_code(web_url, "expo_web_qr.png"):
            print(f"✅ Web QR code saved: expo_web_qr.png")
            print(f"🌐 Web URL: {web_url}")
    else:
        print("❌ Failed to create QR code")

if __name__ == "__main__":
    main()


