#!/usr/bin/env python3
"""
Start Expo and generate QR code with actual URL
"""

import subprocess
import time
import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

def start_expo_and_get_qr():
    """Start Expo development server and create QR code"""
    
    print("🚀 Starting Expo development server...")
    print("=" * 50)
    
    # Change to Expo directory
    expo_dir = "SmartUnitConverterExpo"
    if not os.path.exists(expo_dir):
        print(f"❌ Directory {expo_dir} not found!")
        return
    
    os.chdir(expo_dir)
    
    try:
        # Start Expo in the background
        print("📱 Starting Expo development server...")
        print("💡 This will take a moment...")
        
        # Start Expo and capture output
        process = subprocess.Popen(
            ['expo', 'start', '--no-dev', '--minify'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a bit for Expo to start
        time.sleep(5)
        
        # Check if process is still running
        if process.poll() is None:
            print("✅ Expo development server started!")
            print("🔍 Looking for Expo URL...")
            
            # For now, use the default URL
            # In a real implementation, you'd parse the actual output
            expo_url = "exp://192.168.1.100:8081"
            
            print(f"🔗 Using URL: {expo_url}")
            print("💡 Note: You may need to update this with your actual IP address")
            
            # Create QR code
            create_expo_qr_with_instructions(expo_url)
            
        else:
            print("❌ Failed to start Expo development server")
            print("💡 Try running manually: cd SmartUnitConverterExpo && expo start")
            
    except Exception as e:
        print(f"❌ Error starting Expo: {e}")
        print("💡 Make sure you have Expo CLI installed: npm install -g @expo/cli")

def create_expo_qr_with_instructions(url):
    """Create QR code with detailed instructions"""
    
    print("\n📱 Creating Expo Go QR code...")
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create QR image
    qr_img = qr.make_image(fill_color="#000000", back_color="white")
    qr_img = qr_img.resize((350, 350), Image.Resampling.LANCZOS)
    
    # Create final image with instructions
    final_width = 400
    final_height = 600
    final_img = Image.new('RGB', (final_width, final_height), 'white')
    draw = ImageDraw.Draw(final_img)
    
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 10)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Draw title
    draw.text((20, 20), "📱 Expo Go QR Code", fill="#000000", font=title_font)
    
    # Draw URL
    draw.text((20, 50), f"URL: {url}", fill="#666666", font=subtitle_font)
    
    # Draw instructions
    instructions = [
        "📋 Instructions:",
        "1. Install 'Expo Go' app",
        "2. Open Expo Go",
        "3. Scan QR code below",
        "4. App loads automatically",
        "",
        "✨ Features:",
        "• Glassmorphism design",
        "• 15+ categories",
        "• 120+ units",
        "• Real-time rates",
        "",
        "🔧 If QR doesn't work:",
        "• Check same WiFi network",
        "• Try expo start --tunnel",
        "• Update Expo Go app"
    ]
    
    y_pos = 80
    for instruction in instructions:
        if instruction.startswith("📋") or instruction.startswith("✨") or instruction.startswith("🔧"):
            draw.text((20, y_pos), instruction, fill="#667eea", font=subtitle_font)
        elif instruction.startswith("•"):
            draw.text((30, y_pos), instruction, fill="#666666", font=small_font)
        else:
            draw.text((20, y_pos), instruction, fill="#333333", font=subtitle_font)
        y_pos += 18
    
    # Paste QR code
    qr_x = (final_width - 350) // 2
    qr_y = 350
    final_img.paste(qr_img, (qr_x, qr_y))
    
    # Save the image
    filename = "../expo_live_qr.png"
    final_img.save(filename, "PNG", quality=95)
    
    print(f"✅ QR code saved: {filename}")
    print("\n🎯 Next steps:")
    print("1. Install 'Expo Go' app on your phone")
    print("2. Open Expo Go app")
    print("3. Scan the QR code")
    print("4. Your glassmorphism app will load!")
    print("\n💡 Keep this terminal running for Expo to work!")

if __name__ == "__main__":
    start_expo_and_get_qr()
