#!/usr/bin/env python3
"""
Simple icon generator for PWA
Creates basic PNG icons for the Smart Unit Converter app
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with gradient background and text"""
    # Create image with gradient-like background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect with rectangles
    colors = [
        (102, 126, 234, 255),  # #667eea
        (118, 75, 162, 255),   # #764ba2
    ]
    
    # Draw gradient background
    for i in range(size):
        ratio = i / size
        r = int(colors[0][0] * (1 - ratio) + colors[1][0] * ratio)
        g = int(colors[0][1] * (1 - ratio) + colors[1][1] * ratio)
        b = int(colors[0][2] * (1 - ratio) + colors[1][2] * ratio)
        draw.rectangle([0, i, size, i+1], fill=(r, g, b, 255))
    
    # Add rounded corners effect
    corner_radius = size // 8
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size, size], corner_radius, fill=255)
    
    # Apply mask
    img.putalpha(mask)
    
    # Add text "UC" for Unit Converter
    try:
        # Try to use a system font
        font_size = size // 3
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Calculate text position
    text = "UC"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 + size // 8  # Slightly below center
    
    # Draw text with white color
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Add a small accent circle
    circle_size = size // 8
    circle_x = size // 2 - circle_size // 2
    circle_y = size // 4 - circle_size // 2
    draw.ellipse([circle_x, circle_y, circle_x + circle_size, circle_y + circle_size], 
                 fill=(255, 255, 255, 200))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Generate all required icon sizes"""
    # Create icons directory if it doesn't exist
    os.makedirs('docs/icons', exist_ok=True)
    
    # Required icon sizes for PWA
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    print("🎨 Creating PWA icons...")
    
    for size in sizes:
        filename = f'docs/icons/icon-{size}x{size}.png'
        create_icon(size, filename)
    
    # Create shortcut icons
    create_icon(96, 'docs/icons/shortcut-convert.png')
    create_icon(96, 'docs/icons/shortcut-currency.png')
    
    # Create badge icon
    create_icon(72, 'docs/icons/badge-72x72.png')
    
    print("✅ All icons created successfully!")
    print("📱 Your PWA is now ready for mobile installation!")

if __name__ == "__main__":
    main()
