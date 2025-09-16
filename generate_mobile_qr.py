#!/usr/bin/env python3
"""
Mobile App QR Code Generator
Creates QR codes for testing mobile apps
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont

def create_mobile_qr():
    """Create QR codes for mobile app testing"""
    
    # Expo app testing URL (when running locally)
    expo_url = "exp://192.168.1.100:8081"  # Replace with your actual IP
    web_url = "https://davidomokagbor1.github.io/smart_unit_converter/"
    
    print("📱 Generating Mobile App QR Codes...")
    print("=" * 50)
    
    # 1. Web App QR Code
    qr_web = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=15, border=6)
    qr_web.add_data(web_url)
    qr_web.make(fit=True)
    web_img = qr_web.make_image(fill_color="#667eea", back_color="white")
    web_img = web_img.resize((400, 400), Image.Resampling.LANCZOS)
    web_img.save("qr_web_app.png", "PNG", quality=95)
    print("✅ Web App QR: qr_web_app.png")
    print(f"   URL: {web_url}")
    
    # 2. Instructions QR Code
    instructions = """
    📱 Smart Unit Converter Mobile Apps
    
    🌐 Web App (PWA):
    • Scan qr_web_app.png
    • Works on any device
    • Install as PWA
    
    📲 Mobile Apps:
    • Expo: Use Expo Go app
    • React Native: Build locally
    
    ✨ Features:
    • Glassmorphism design
    • 15+ categories
    • 120+ units
    • Real-time rates
    """
    
    # Create instructions image
    img_width = 400
    img_height = 600
    img = Image.new('RGB', (img_width, img_height), 'white')
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw title
    draw.text((20, 20), "📱 Smart Unit Converter", fill="#667eea", font=font_large)
    
    # Draw instructions
    y_pos = 60
    for line in instructions.strip().split('\n'):
        if line.strip():
            color = "#333333" if line.startswith('•') else "#667eea" if line.startswith('📱') or line.startswith('🌐') or line.startswith('✨') else "#666666"
            draw.text((20, y_pos), line.strip(), fill=color, font=font_medium if not line.startswith('•') else font_small)
            y_pos += 25 if not line.startswith('•') else 20
    
    img.save("qr_mobile_instructions.png", "PNG", quality=95)
    print("✅ Instructions QR: qr_mobile_instructions.png")
    
    print("=" * 50)
    print("🎯 QR Code Usage:")
    print("• qr_web_app.png - For web app access")
    print("• qr_mobile_instructions.png - For mobile app instructions")
    print("• Use with any QR code scanner")
    print("• Perfect for testing and sharing!")

if __name__ == "__main__":
    create_mobile_qr()
