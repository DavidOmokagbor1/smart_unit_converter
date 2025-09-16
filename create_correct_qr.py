#!/usr/bin/env python3
"""
Create QR code with correct port (8081)
"""

import qrcode
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

def create_qr_code(url, filename):
    """Create QR code for the URL"""
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=30,
            border=6,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename, "PNG")
        
        file_size = os.path.getsize(filename)
        print(f"✅ QR code saved: {filename} ({file_size} bytes)")
        return True
    except Exception as e:
        print(f"❌ Error creating QR code: {e}")
        return False

def main():
    print("🚀 Creating QR Code with Correct Port (8081)")
    print("=" * 50)
    
    local_ip = get_local_ip()
    print(f"🌐 Local IP: {local_ip}")
    
    # Use port 8081 (where Expo is actually running)
    tunnel_url = f"exp://{local_ip}:8081"
    print(f"🔗 Expo URL: {tunnel_url}")
    
    print("\n📱 Creating QR code...")
    if create_qr_code(tunnel_url, "expo_correct_qr.png"):
        print(f"✅ Correct QR code saved: expo_correct_qr.png")
        print(f"🔗 URL: {tunnel_url}")
        print("\n🎯 This should work with Expo Go!")
        print("1. Install 'Expo Go' app on your phone")
        print("2. Open Expo Go app")
        print("3. Scan the QR code")
        print("4. Your mobile app will load!")
        
        # Also create a web display
        web_html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Expo QR Code - Correct Port</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }}
        .container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
        }}
        h1 {{ color: white; margin-bottom: 20px; }}
        .qr-container {{
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }}
        .qr-code {{ max-width: 100%; height: auto; border-radius: 10px; }}
        .url {{
            color: white;
            font-size: 16px;
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            word-break: break-all;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Expo Go QR Code - CORRECT PORT</h1>
        <div class="qr-container">
            <img src="expo_correct_qr.png" alt="Expo QR Code" class="qr-code">
        </div>
        <div class="url">
            <strong>URL:</strong> {tunnel_url}
        </div>
        <p style="color: white; margin-top: 20px;">
            This QR code uses the correct port (8081) where Expo is actually running!
        </p>
    </div>
</body>
</html>"""
        
        with open("expo_correct_display.html", "w") as f:
            f.write(web_html)
        print("✅ Web display created: expo_correct_display.html")
    else:
        print("❌ Failed to create QR code")

if __name__ == "__main__":
    main()


