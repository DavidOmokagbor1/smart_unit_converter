#!/usr/bin/env python3
"""
Easy Expo starter with QR code generation
"""

import subprocess
import time
import os
import socket

def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "192.168.1.100"

def start_expo_easy():
    """Start Expo and generate QR code"""
    
    print("🚀 Smart Unit Converter - Expo Go Setup")
    print("=" * 50)
    
    # Get IP address
    ip = get_local_ip()
    expo_url = f"exp://{ip}:8081"
    
    print(f"🌐 Your IP address: {ip}")
    print(f"🔗 Expo URL: {expo_url}")
    
    # Check if we're in the right directory
    if not os.path.exists("SmartUnitConverterExpo"):
        print("❌ SmartUnitConverterExpo directory not found!")
        print("💡 Make sure you're in the project root directory")
        return
    
    print("\n📱 Starting Expo development server...")
    print("💡 This will take a moment...")
    
    try:
        # Change to Expo directory
        os.chdir("SmartUnitConverterExpo")
        
        # Start Expo
        print("🔄 Starting Expo...")
        process = subprocess.Popen(
            ['expo', 'start', '--no-dev', '--minify'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment
        time.sleep(3)
        
        if process.poll() is None:
            print("✅ Expo development server started!")
            print(f"🔗 Your app URL: {expo_url}")
            
            # Generate QR code
            generate_qr_code(expo_url)
            
            print("\n🎯 What to do next:")
            print("1. Install 'Expo Go' app on your phone")
            print("2. Open Expo Go app")
            print("3. Scan the QR code (expo_real_ip_qr.png)")
            print("4. Your glassmorphism app will load!")
            
            print("\n💡 Keep this terminal running for Expo to work!")
            print("🛑 Press Ctrl+C to stop Expo when done")
            
            # Keep the process running
            try:
                process.wait()
            except KeyboardInterrupt:
                print("\n🛑 Stopping Expo...")
                process.terminate()
                
        else:
            print("❌ Failed to start Expo")
            print("💡 Try running manually: cd SmartUnitConverterExpo && expo start")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure Expo CLI is installed: npm install -g @expo/cli")

def generate_qr_code(url):
    """Generate QR code for the URL"""
    
    try:
        import qrcode
        from PIL import Image, ImageDraw, ImageFont
        
        print("\n📱 Generating QR code...")
        
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
        img = qr.make_image(fill_color="#000000", back_color="white")
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
        draw.text((20, 20), "📱 Smart Unit Converter", fill="#000000", font=title_font)
        draw.text((20, 45), "Expo Go QR Code", fill="#667eea", font=subtitle_font)
        
        # Draw URL
        draw.text((20, 75), f"URL: {url}", fill="#666666", font=small_font)
        
        # Draw instructions
        instructions = [
            "📋 Instructions:",
            "1. Install 'Expo Go' app",
            "2. Open Expo Go",
            "3. Scan QR code below",
            "4. App loads automatically!",
            "",
            "✨ Features:",
            "• Glassmorphism design",
            "• 15+ categories",
            "• 120+ units",
            "• Real-time rates",
            "• Floating particles"
        ]
        
        y_pos = 100
        for instruction in instructions:
            if instruction.startswith("📋") or instruction.startswith("✨"):
                draw.text((20, y_pos), instruction, fill="#667eea", font=subtitle_font)
            elif instruction.startswith("•"):
                draw.text((30, y_pos), instruction, fill="#666666", font=small_font)
            else:
                draw.text((20, y_pos), instruction, fill="#333333", font=subtitle_font)
            y_pos += 20
        
        # Paste QR code
        qr_x = (final_width - 400) // 2
        qr_y = 350
        final_img.paste(img, (qr_x, qr_y))
        
        # Save the image
        filename = "../expo_real_ip_qr.png"
        final_img.save(filename, "PNG", quality=95)
        
        print(f"✅ QR code saved: {filename}")
        
    except ImportError:
        print("❌ Missing dependencies. Install with: pip install qrcode pillow")
    except Exception as e:
        print(f"❌ Error generating QR code: {e}")

if __name__ == "__main__":
    start_expo_easy()
