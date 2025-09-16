#!/usr/bin/env python3
"""
Enhanced QR Code Generator for Smart Unit Converter
Creates multiple QR codes for different purposes and platforms
"""

import qrcode
import os
from PIL import Image, ImageDraw, ImageFont
import textwrap

def create_qr_with_logo(url, filename, title="Smart Unit Converter", subtitle="15+ Categories • 120+ Units"):
    """Create a QR code with app branding and text"""
    
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
    qr_img = qr.make_image(
        fill_color="#667eea",  # Primary blue
        back_color="white"
    )
    
    # Resize QR code
    qr_size = 300
    qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    
    # Create final image with text
    padding = 40
    text_height = 120
    final_width = qr_size + (padding * 2)
    final_height = qr_size + text_height + (padding * 2)
    
    # Create canvas
    img = Image.new('RGB', (final_width, final_height), 'white')
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Draw title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (final_width - title_width) // 2
    draw.text((title_x, padding), title, fill="#667eea", font=title_font)
    
    # Draw subtitle
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (final_width - subtitle_width) // 2
    draw.text((subtitle_x, padding + 35), subtitle, fill="#666666", font=subtitle_font)
    
    # Paste QR code
    qr_x = (final_width - qr_size) // 2
    qr_y = padding + text_height
    img.paste(qr_img, (qr_x, qr_y))
    
    # Draw URL at bottom
    url_text = "Scan to access"
    url_bbox = draw.textbbox((0, 0), url_text, font=subtitle_font)
    url_width = url_bbox[2] - url_bbox[0]
    url_x = (final_width - url_width) // 2
    draw.text((url_x, qr_y + qr_size + 10), url_text, fill="#999999", font=subtitle_font)
    
    # Save image
    img.save(filename, "PNG", quality=95)
    return filename

def generate_all_qr_codes():
    """Generate all QR code variants"""
    
    base_url = "https://davidomokagbor1.github.io/smart_unit_converter/"
    
    print("🎯 Generating QR codes for Smart Unit Converter...")
    print("=" * 50)
    
    # 1. Basic QR code
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=15, border=6)
    qr.add_data(base_url)
    qr.make(fit=True)
    basic_img = qr.make_image(fill_color="#667eea", back_color="white")
    basic_img = basic_img.resize((400, 400), Image.Resampling.LANCZOS)
    basic_img.save("qr_basic.png", "PNG", quality=95)
    print("✅ Basic QR code: qr_basic.png")
    
    # 2. QR code with branding
    branded_file = create_qr_with_logo(
        base_url, 
        "qr_branded.png",
        "Smart Unit Converter",
        "15+ Categories • 120+ Units • Real-time Rates"
    )
    print("✅ Branded QR code: qr_branded.png")
    
    # 3. Mobile-specific QR code
    mobile_file = create_qr_with_logo(
        base_url,
        "qr_mobile.png",
        "📱 Mobile App",
        "Glassmorphism Design • PWA Ready"
    )
    print("✅ Mobile QR code: qr_mobile.png")
    
    # 4. High-resolution QR code for printing
    qr_large = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=20, border=8)
    qr_large.add_data(base_url)
    qr_large.make(fit=True)
    large_img = qr_large.make_image(fill_color="#667eea", back_color="white")
    large_img = large_img.resize((600, 600), Image.Resampling.LANCZOS)
    large_img.save("qr_print.png", "PNG", quality=100)
    print("✅ Print QR code: qr_print.png")
    
    print("=" * 50)
    print(f"🌐 URL: {base_url}")
    print("📱 All QR codes point to your deployed app!")
    print("✨ Features: Glassmorphism design, real-time crypto rates, PWA support")
    print("🎯 Use different QR codes for different purposes:")
    print("   • qr_basic.png - Simple, clean design")
    print("   • qr_branded.png - With app title and features")
    print("   • qr_mobile.png - Mobile-focused messaging")
    print("   • qr_print.png - High-res for printing/marketing")

if __name__ == "__main__":
    generate_all_qr_codes()
