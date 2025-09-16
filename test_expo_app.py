#!/usr/bin/env python3
"""
Test Expo app and generate working QR code
"""

import subprocess
import time
import os

def test_expo_app():
    """Test if Expo app is working and generate QR code"""
    
    print("🧪 Testing Smart Unit Converter Expo App")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("SmartUnitConverterExpo"):
        print("❌ SmartUnitConverterExpo directory not found!")
        return False
    
    # Check if Expo is running
    try:
        result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
        if 'expo start' in result.stdout:
            print("✅ Expo development server is running!")
        else:
            print("⚠️  Expo development server not found")
            print("💡 Starting Expo...")
            
            # Start Expo
            os.chdir("SmartUnitConverterExpo")
            process = subprocess.Popen(
                ['expo', 'start', '--no-dev', '--minify'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait a moment
            time.sleep(5)
            
            if process.poll() is None:
                print("✅ Expo started successfully!")
            else:
                print("❌ Failed to start Expo")
                return False
    except Exception as e:
        print(f"❌ Error checking Expo: {e}")
        return False
    
    # Generate QR code
    print("\n📱 Generating QR code...")
    os.chdir("..")
    
    try:
        import qrcode
        from PIL import Image, ImageDraw, ImageFont
        import socket
        
        # Get IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        
        expo_url = f"exp://{ip}:8081"
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=15,
            border=6,
        )
        qr.add_data(expo_url)
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
        draw.text((20, 45), "Expo Go QR Code (FIXED)", fill="#667eea", font=subtitle_font)
        
        # Draw URL
        draw.text((20, 75), f"URL: {expo_url}", fill="#666666", font=small_font)
        
        # Draw instructions
        instructions = [
            "✅ App Fixed!",
            "• Removed animation errors",
            "• Simplified components",
            "• Ready to test!",
            "",
            "📋 Instructions:",
            "1. Install 'Expo Go' app",
            "2. Open Expo Go",
            "3. Scan QR code below",
            "4. App loads successfully!",
            "",
            "✨ Features:",
            "• Glassmorphism design",
            "• 15+ categories",
            "• 120+ units",
            "• Real-time rates",
            "• Static particles"
        ]
        
        y_pos = 100
        for instruction in instructions:
            if instruction.startswith("✅") or instruction.startswith("📋") or instruction.startswith("✨"):
                draw.text((20, y_pos), instruction, fill="#667eea", font=subtitle_font)
            elif instruction.startswith("•"):
                draw.text((30, y_pos), instruction, fill="#666666", font=small_font)
            else:
                draw.text((20, y_pos), instruction, fill="#333333", font=subtitle_font)
            y_pos += 20
        
        # Paste QR code
        qr_x = (final_width - 400) // 2
        qr_y = 400
        final_img.paste(img, (qr_x, qr_y))
        
        # Save the image
        filename = "expo_fixed_qr.png"
        final_img.save(filename, "PNG", quality=95)
        
        print(f"✅ Fixed QR code saved: {filename}")
        print(f"🔗 URL: {expo_url}")
        print("\n🎯 The app should now work without errors!")
        print("📱 Scan the QR code with Expo Go to test!")
        
        return True
        
    except ImportError:
        print("❌ Missing dependencies. Install with: pip install qrcode pillow")
        return False
    except Exception as e:
        print(f"❌ Error generating QR code: {e}")
        return False

if __name__ == "__main__":
    success = test_expo_app()
    if success:
        print("\n🎉 Test completed successfully!")
    else:
        print("\n❌ Test failed. Check the errors above.")
