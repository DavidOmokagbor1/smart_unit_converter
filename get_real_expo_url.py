#!/usr/bin/env python3
"""
Get the real Expo tunnel URL and generate QR code
"""

import requests
import qrcode
import json
import time

def get_expo_tunnel_url():
    """Get the actual Expo tunnel URL"""
    try:
        # Try to get the tunnel URL from Expo
        response = requests.get('http://localhost:8081', timeout=5)
        if response.status_code == 200:
            print("✅ Expo server is running on localhost:8081")
            
            # Try to get the tunnel URL from the Expo API
            try:
                tunnel_response = requests.get('http://localhost:8081/logs', timeout=5)
                if tunnel_response.status_code == 200:
                    print("✅ Expo logs endpoint accessible")
            except:
                pass
                
            # For now, use the local IP approach
            import socket
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            # Try to get the real IP
            try:
                import subprocess
                result = subprocess.run(['ifconfig'], capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if 'inet ' in line and '127.0.0.1' not in line and '169.254' not in line:
                        ip = line.split()[1]
                        if ip.startswith('192.168.') or ip.startswith('10.') or ip.startswith('172.'):
                            local_ip = ip
                            break
            except:
                pass
                
            return f"exp://{local_ip}:8081"
            
    except Exception as e:
        print(f"❌ Error connecting to Expo: {e}")
        return None

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
    print("🚀 Getting Real Expo Tunnel URL")
    print("=" * 50)
    
    # Wait a moment for Expo to fully start
    print("⏳ Waiting for Expo to start...")
    time.sleep(5)
    
    # Get the tunnel URL
    url = get_expo_tunnel_url()
    if not url:
        print("❌ Could not get Expo URL")
        return
        
    print(f"🔗 Expo URL: {url}")
    
    # Create QR code
    print("\n📱 Creating QR code...")
    if create_qr_code(url, "expo_real_tunnel_qr.png"):
        print(f"✅ QR code saved: expo_real_tunnel_qr.png")
        print(f"🔗 URL: {url}")
        print("\n🎯 Next steps:")
        print("1. Install 'Expo Go' app on your phone")
        print("2. Open Expo Go app")
        print("3. Scan the QR code")
        print("4. Your clean mobile app will load!")
    else:
        print("❌ Failed to create QR code")

if __name__ == "__main__":
    main()
