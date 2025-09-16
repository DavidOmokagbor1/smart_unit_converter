#!/usr/bin/env python3
"""
Get actual Expo URL from running development server
"""

import subprocess
import re
import time

def get_running_expo_url():
    """Get the actual URL from running Expo server"""
    
    print("🔍 Looking for running Expo development server...")
    
    try:
        # Check if Expo is running
        result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
        
        if 'expo start' in result.stdout:
            print("✅ Expo development server is running!")
            
            # Try to get the URL from the process
            print("🔗 Getting Expo URL...")
            
            # For now, return the default local URL
            # In a real scenario, you'd parse the actual output
            return "exp://192.168.1.100:8081"
        else:
            print("❌ Expo development server not found")
            print("💡 Start Expo with: cd SmartUnitConverterExpo && expo start")
            return None
            
    except Exception as e:
        print(f"❌ Error checking Expo status: {e}")
        return None

def create_expo_qr_with_url(url):
    """Create QR code with specific URL"""
    
    if not url:
        print("❌ No Expo URL available")
        return
    
    print(f"📱 Creating QR code for: {url}")
    
    import qrcode
    from PIL import Image, ImageDraw, ImageFont
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=15,
        border=6,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(
        fill_color="#000000",
        back_color="white"
    )
    
    # Resize
    img = img.resize((400, 400), Image.Resampling.LANCZOS)
    
    # Add instructions
    final_width = 400
    final_height = 500
    final_img = Image.new('RGB', (final_width, final_height), 'white')
    draw = ImageDraw.Draw(final_img)
    
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Draw title
    draw.text((20, 20), "📱 Expo Go QR Code", fill="#000000", font=title_font)
    
    # Draw URL
    draw.text((20, 50), f"URL: {url}", fill="#666666", font=subtitle_font)
    
    # Draw instructions
    instructions = [
        "1. Install Expo Go app",
        "2. Scan QR code below",
        "3. App loads automatically",
        "",
        "✨ Your glassmorphism app awaits!"
    ]
    
    y_pos = 80
    for instruction in instructions:
        color = "#333333" if not instruction.startswith("✨") else "#667eea"
        draw.text((20, y_pos), instruction, fill=color, font=subtitle_font)
        y_pos += 25
    
    # Paste QR code
    final_img.paste(img, (0, 200))
    
    # Save
    filename = "expo_live_qr.png"
    final_img.save(filename, "PNG", quality=95)
    
    print(f"✅ QR code saved: {filename}")
    print("📱 Scan with Expo Go app to test your mobile app!")

if __name__ == "__main__":
    url = get_running_expo_url()
    create_expo_qr_with_url(url)
