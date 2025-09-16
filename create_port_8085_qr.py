#!/usr/bin/env python3
"""
Generate QR code for Expo app on port 8085
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

def create_expo_qr():
    # Expo URL for port 8085
    url = "exp://192.168.1.160:8085"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=15,
        border=6,
    )
    
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create QR code image
    qr_img = qr.make_image(fill_color="#667eea", back_color="white")
    
    # Resize for better visibility
    qr_img = qr_img.resize((600, 600), Image.Resampling.LANCZOS)
    
    # Create a larger canvas with title
    canvas_width = 800
    canvas_height = 900
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste QR code in center
    qr_x = (canvas_width - 600) // 2
    qr_y = 100
    canvas.paste(qr_img, (qr_x, qr_y))
    
    # Add title
    try:
        # Try to use a system font
        title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 32)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 18)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    draw = ImageDraw.Draw(canvas)
    
    # Title
    title_text = "Smart Unit Converter"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (canvas_width - title_width) // 2
    draw.text((title_x, 20), title_text, fill='#667eea', font=title_font)
    
    # Subtitle
    subtitle_text = "Expo Go - Port 8085"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (canvas_width - subtitle_width) // 2
    draw.text((subtitle_x, 60), subtitle_text, fill='#666666', font=subtitle_font)
    
    # Instructions
    instructions = [
        "1. Open Expo Go app",
        "2. Scan this QR code",
        "3. Enjoy your converter!",
        "",
        f"URL: {url}"
    ]
    
    y_offset = 750
    for instruction in instructions:
        if instruction:
            inst_bbox = draw.textbbox((0, 0), instruction, font=subtitle_font)
            inst_width = inst_bbox[2] - inst_bbox[0]
            inst_x = (canvas_width - inst_width) // 2
            draw.text((inst_x, y_offset), instruction, fill='#333333', font=subtitle_font)
        y_offset += 25
    
    # Save the image
    output_file = "expo_port_8085_qr.png"
    canvas.save(output_file)
    
    print(f"✅ QR code generated: {output_file}")
    print(f"📱 URL: {url}")
    print(f"🔗 Size: {canvas_width}x{canvas_height} pixels")
    
    return output_file

if __name__ == "__main__":
    create_expo_qr()

