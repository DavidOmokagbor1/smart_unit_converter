#!/usr/bin/env python3
"""
QR Code Generator for Smart Unit Converter
Generates a QR code that links to the mobile-optimized version
"""

import qrcode
import os
from PIL import Image

def generate_qr_code():
    # URL to the deployed mobile-optimized version
    url = "https://davidomokagbor1.github.io/smart_unit_converter/"
    
    # Create QR code with higher quality
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=15,
        border=6,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image with app branding colors
    img = qr.make_image(
        fill_color="#667eea",  # Primary blue from your app
        back_color="white"
    )
    
    # Resize for better quality
    img = img.resize((400, 400), Image.Resampling.LANCZOS)
    
    # Save QR code
    qr_path = "smart_unit_converter_qr.png"
    img.save(qr_path, "PNG", quality=95)
    
    print(f"🎯 QR Code generated: {qr_path}")
    print(f"🌐 URL: {url}")
    print(f"📱 Scan with any QR code reader to access your app!")
    print(f"✨ Features: Glassmorphism design, 15+ categories, 120+ units")
    
    return qr_path

if __name__ == "__main__":
    generate_qr_code()
