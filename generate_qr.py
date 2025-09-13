#!/usr/bin/env python3
"""
QR Code Generator for Smart Unit Converter
Generates a QR code that links to the mobile-optimized version
"""

import qrcode
import os
from PIL import Image

def generate_qr_code():
    # URL to the mobile version
    url = "https://your-domain.com/smart_unit_converter/stunning_converter.html"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save QR code
    qr_path = "smart_unit_converter_qr.png"
    img.save(qr_path)
    
    print(f"QR Code generated: {qr_path}")
    print(f"URL: {url}")
    
    return qr_path

if __name__ == "__main__":
    generate_qr_code()
