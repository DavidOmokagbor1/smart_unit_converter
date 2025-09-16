#!/usr/bin/env python3
"""
Expo Go QR Code Generator
Creates QR codes for testing with Expo Go app
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont
import subprocess
import json
import re

def get_expo_url():
    """Get the current Expo development URL"""
    try:
        # Try to get the URL from expo start output
        result = subprocess.run(['expo', 'start', '--no-dev', '--minify'], 
                              capture_output=True, text=True, timeout=10)
        
        # Look for the exp:// URL in the output
        output = result.stdout + result.stderr
        url_match = re.search(r'exp://[^\s]+', output)
        
        if url_match:
            return url_match.group(0)
        else:
            # Fallback to localhost URL
            return "exp://192.168.1.100:8081"
            
    except:
        # Default fallback URL
        return "exp://192.168.1.100:8081"

def create_expo_qr():
    """Create QR code for Expo Go"""
    
    # Get the Expo URL
    expo_url = get_expo_url()
    
    print("📱 Generating Expo Go QR Code...")
    print("=" * 50)
    print(f"🔗 Expo URL: {expo_url}")
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=4,
    )
    qr.add_data(expo_url)
    qr.make(fit=True)
    
    # Create image with Expo branding
    img = qr.make_image(
        fill_color="#000000",  # Black for better contrast
        back_color="white"
    )
    
    # Resize for better quality
    img = img.resize((400, 400), Image.Resampling.LANCZOS)
    
    # Create final image with instructions
    final_width = 400
    final_height = 500
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
    
    # Draw instructions
    instructions = [
        "1. Install Expo Go app",
        "2. Scan this QR code",
        "3. App will load automatically",
        "",
        "✨ Features:",
        "• Glassmorphism design",
        "• 15+ categories",
        "• 120+ units",
        "• Real-time rates"
    ]
    
    y_pos = 50
    for instruction in instructions:
        if instruction.startswith("•"):
            draw.text((30, y_pos), instruction, fill="#666666", font=small_font)
        elif instruction.startswith("✨"):
            draw.text((20, y_pos), instruction, fill="#667eea", font=subtitle_font)
        else:
            draw.text((20, y_pos), instruction, fill="#333333", font=subtitle_font)
        y_pos += 20
    
    # Paste QR code
    qr_y = 250
    final_img.paste(img, (0, qr_y))
    
    # Save the image
    filename = "expo_go_qr.png"
    final_img.save(filename, "PNG", quality=95)
    
    print(f"✅ Expo Go QR Code: {filename}")
    print("📱 Instructions:")
    print("1. Install 'Expo Go' app from App Store/Play Store")
    print("2. Open Expo Go app")
    print("3. Scan the QR code")
    print("4. Your app will load automatically!")
    print("=" * 50)
    
    return filename, expo_url

def create_alternative_qr():
    """Create alternative QR codes for different scenarios"""
    
    print("\n🔄 Creating alternative QR codes...")
    
    # 1. Local network QR (if you know your IP)
    local_ip = "192.168.1.100"  # Replace with your actual IP
    local_url = f"exp://{local_ip}:8081"
    
    qr_local = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=15, border=6)
    qr_local.add_data(local_url)
    qr_local.make(fit=True)
    local_img = qr_local.make_image(fill_color="#000000", back_color="white")
    local_img = local_img.resize((400, 400), Image.Resampling.LANCZOS)
    local_img.save("expo_local_qr.png", "PNG", quality=95)
    print(f"✅ Local network QR: expo_local_qr.png")
    print(f"   URL: {local_url}")
    
    # 2. Web version QR (fallback)
    web_url = "https://davidomokagbor1.github.io/smart_unit_converter/"
    qr_web = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=15, border=6)
    qr_web.add_data(web_url)
    qr_web.make(fit=True)
    web_img = qr_web.make_image(fill_color="#667eea", back_color="white")
    web_img = web_img.resize((400, 400), Image.Resampling.LANCZOS)
    web_img.save("expo_web_fallback_qr.png", "PNG", quality=95)
    print(f"✅ Web fallback QR: expo_web_fallback_qr.png")
    print(f"   URL: {web_url}")

if __name__ == "__main__":
    # Create main Expo Go QR code
    filename, expo_url = create_expo_qr()
    
    # Create alternative QR codes
    create_alternative_qr()
    
    print("\n🎯 QR Code Usage:")
    print("• expo_go_qr.png - Main QR for Expo Go")
    print("• expo_local_qr.png - Local network (if Expo is running)")
    print("• expo_web_fallback_qr.png - Web version fallback")
    print("\n💡 Tip: Make sure Expo is running with 'expo start' first!")
