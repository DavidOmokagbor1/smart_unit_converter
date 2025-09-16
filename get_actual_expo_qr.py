#!/usr/bin/env python3
"""
Get actual IP address and create Expo QR code
"""

import socket
import qrcode
from PIL import Image, ImageDraw, ImageFont
import subprocess
import re

def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to a remote server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "192.168.1.100"  # Fallback

def get_expo_url():
    """Get the actual Expo URL"""
    local_ip = get_local_ip()
    expo_url = f"exp://{local_ip}:8081"
    
    print(f"🌐 Your local IP address: {local_ip}")
    print(f"🔗 Expo URL: {expo_url}")
    
    return expo_url

def create_expo_qr_with_real_url():
    """Create QR code with actual IP address"""
    
    expo_url = get_expo_url()
    
    print("\n📱 Creating Expo Go QR code with real IP...")
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=15,
        border=6,
    )
    qr.add_data(expo_url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(
        fill_color="#000000",
        back_color="white"
    )
    
    # Resize
    img = img.resize((400, 400), Image.Resampling.LANCZOS)
    
    # Create final image with instructions
    final_width = 450
    final_height = 650
    final_img = Image.new('RGB', (final_width, final_height), 'white')
    draw = ImageDraw.Draw(final_img)
    
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Draw title
    draw.text((20, 20), "📱 Expo Go QR Code", fill="#000000", font=title_font)
    
    # Draw URL
    draw.text((20, 50), f"URL: {expo_url}", fill="#667eea", font=subtitle_font)
    
    # Draw instructions
    instructions = [
        "📋 How to use:",
        "1. Install 'Expo Go' app",
        "2. Open Expo Go",
        "3. Scan QR code below",
        "4. App loads automatically!",
        "",
        "✨ Your app features:",
        "• Glassmorphism design",
        "• 15+ conversion categories",
        "• 120+ units",
        "• Real-time crypto rates",
        "• Floating particle animations",
        "",
        "🔧 Troubleshooting:",
        "• Make sure Expo is running",
        "• Check same WiFi network",
        "• Try expo start --tunnel if needed"
    ]
    
    y_pos = 80
    for instruction in instructions:
        if instruction.startswith("📋") or instruction.startswith("✨") or instruction.startswith("🔧"):
            draw.text((20, y_pos), instruction, fill="#667eea", font=subtitle_font)
        elif instruction.startswith("•"):
            draw.text((30, y_pos), instruction, fill="#666666", font=small_font)
        else:
            draw.text((20, y_pos), instruction, fill="#333333", font=subtitle_font)
        y_pos += 20
    
    # Paste QR code
    qr_x = (final_width - 400) // 2
    qr_y = 400
    final_img.paste(img, (qr_x, qr_y))
    
    # Save the image
    filename = "expo_real_ip_qr.png"
    final_img.save(filename, "PNG", quality=95)
    
    print(f"✅ QR code saved: {filename}")
    print(f"🔗 URL: {expo_url}")
    print("\n🎯 Next steps:")
    print("1. Install 'Expo Go' app on your phone")
    print("2. Open Expo Go app")
    print("3. Scan the QR code")
    print("4. Your glassmorphism app will load!")
    print("\n💡 Make sure Expo is running: cd SmartUnitConverterExpo && expo start")

if __name__ == "__main__":
    create_expo_qr_with_real_url()
