#!/usr/bin/env python3
"""
Create a large, visible QR code for Expo Go
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont
import subprocess
import socket
import os

def get_local_ip():
    """Get the local IP address"""
    try:
        result = subprocess.run(['ifconfig'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if 'inet ' in line and '127.0.0.1' not in line and '169.254' not in line:
                ip = line.split()[1]
                if ip.startswith('192.168.') or ip.startswith('10.') or ip.startswith('172.'):
                    return ip
    except:
        pass
    
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except:
        return '192.168.1.160'

def create_large_qr_code(url, filename):
    """Create a large, visible QR code"""
    try:
        # Create QR code with larger settings
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=30,  # Much larger box size
            border=6,     # Larger border
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Resize to make it even larger
        width, height = img.size
        new_size = (width * 2, height * 2)
        img = img.resize(new_size, Image.Resampling.NEAREST)
        
        # Save
        img.save(filename, "PNG", quality=100)
        
        file_size = os.path.getsize(filename)
        print(f"✅ Large QR code saved: {filename} ({file_size} bytes)")
        print(f"📏 Image size: {img.size}")
        
        return True
    except Exception as e:
        print(f"❌ Error creating QR code: {e}")
        return False

def create_simple_qr_code(url, filename):
    """Create a simple QR code using basic method"""
    try:
        # Very simple QR code
        qr = qrcode.QRCode(version=1, box_size=50, border=10)
        qr.add_data(url)
        qr.make()
        
        img = qr.make_image()
        img.save(filename)
        
        file_size = os.path.getsize(filename)
        print(f"✅ Simple QR code saved: {filename} ({file_size} bytes)")
        return True
    except Exception as e:
        print(f"❌ Error creating simple QR code: {e}")
        return False

def main():
    print("🚀 Creating Large QR Code for Expo Go")
    print("=" * 50)
    
    local_ip = get_local_ip()
    print(f"🌐 Local IP: {local_ip}")
    
    tunnel_url = f"exp://{local_ip}:8083"
    print(f"🔗 Expo URL: {tunnel_url}")
    
    print("\n📱 Creating large QR code...")
    
    # Try large QR code
    if create_large_qr_code(tunnel_url, "expo_large_qr.png"):
        print("✅ Large QR code created successfully!")
    
    # Try simple QR code
    if create_simple_qr_code(tunnel_url, "expo_simple_qr.png"):
        print("✅ Simple QR code created successfully!")
    
    print("\n🎯 QR codes created:")
    print("   - expo_large_qr.png (large version)")
    print("   - expo_simple_qr.png (simple version)")
    print(f"   - URL: {tunnel_url}")
    
    print("\n📱 To test:")
    print("1. Install 'Expo Go' app on your phone")
    print("2. Open Expo Go app")
    print("3. Scan either QR code")
    print("4. Your mobile app will load!")

if __name__ == "__main__":
    main()
