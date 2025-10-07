#!/usr/bin/env python3
"""
Smart Unit Converter - Continuous Expo Development Server
This script starts Expo Go and keeps it running in the background
"""

import subprocess
import time
import os
import sys
import signal
import qrcode
from PIL import Image
import webbrowser
import threading

class ExpoContinuousServer:
    def __init__(self):
        self.expo_process = None
        self.running = True
        self.project_dir = "/Users/java/Downloads/smart_unit_converter-main/SmartUnitConverterExpo"
        
    def start_expo(self):
        """Start Expo development server"""
        print("🚀 Starting Smart Unit Converter Expo Server...")
        print("=" * 60)
        
        # Change to project directory
        os.chdir(self.project_dir)
        
        try:
            # Start Expo with tunnel for external access
            self.expo_process = subprocess.Popen(
                ["npx", "expo", "start", "--tunnel", "--clear"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            print("✅ Expo server started successfully!")
            print("📱 Scan the QR code with Expo Go app")
            print("🌐 Or open the web URL in your browser")
            print("⏹️  Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Monitor output for QR code and URL
            self.monitor_output()
            
        except FileNotFoundError:
            print("❌ Error: Expo CLI not found!")
            print("💡 Install it with: npm install -g @expo/cli")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error starting Expo: {e}")
            sys.exit(1)
    
    def monitor_output(self):
        """Monitor Expo output for QR codes and URLs"""
        qr_detected = False
        url_detected = None
        
        while self.running and self.expo_process.poll() is None:
            try:
                line = self.expo_process.stdout.readline()
                if line:
                    print(line.strip())
                    
                    # Look for QR code in output
                    if "QR code" in line and not qr_detected:
                        qr_detected = True
                        print("\n🎯 QR Code detected! Generating visual QR...")
                        self.generate_qr_visual()
                    
                    # Look for web URL
                    if "Web" in line and "http" in line:
                        url_detected = line.strip()
                        print(f"\n🌐 Web URL: {url_detected}")
                        self.open_web_browser(url_detected)
                    
                    # Look for Expo Go URL
                    if "exp://" in line:
                        expo_url = line.strip()
                        print(f"\n📱 Expo Go URL: {expo_url}")
                        self.generate_expo_qr(expo_url)
                
                time.sleep(0.1)
                
            except KeyboardInterrupt:
                print("\n⏹️  Stopping Expo server...")
                self.stop_expo()
                break
            except Exception as e:
                print(f"❌ Error monitoring output: {e}")
                break
    
    def generate_qr_visual(self):
        """Generate a visual QR code for easy scanning"""
        try:
            # This will be updated with the actual URL when detected
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data("https://expo.dev/@davidomokagbor1/smart-unit-converter")
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save("expo_qr_visual.png")
            print("📱 QR Code saved as 'expo_qr_visual.png'")
            
        except Exception as e:
            print(f"❌ Error generating QR code: {e}")
    
    def generate_expo_qr(self, expo_url):
        """Generate QR code for specific Expo URL"""
        try:
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(expo_url)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save("expo_go_qr.png")
            print("📱 Expo Go QR Code saved as 'expo_go_qr.png'")
            
        except Exception as e:
            print(f"❌ Error generating Expo QR: {e}")
    
    def open_web_browser(self, url):
        """Open web browser with the Expo web URL"""
        try:
            webbrowser.open(url)
            print("🌐 Opened in web browser!")
        except Exception as e:
            print(f"❌ Error opening browser: {e}")
    
    def stop_expo(self):
        """Stop the Expo server"""
        self.running = False
        if self.expo_process:
            self.expo_process.terminate()
            try:
                self.expo_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.expo_process.kill()
            print("✅ Expo server stopped")
    
    def signal_handler(self, signum, frame):
        """Handle Ctrl+C gracefully"""
        print("\n⏹️  Received stop signal...")
        self.stop_expo()
        sys.exit(0)

def main():
    """Main function"""
    print("🎯 Smart Unit Converter - Continuous Expo Development")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists("SmartUnitConverterExpo"):
        print("❌ Error: SmartUnitConverterExpo directory not found!")
        print("💡 Make sure you're in the project root directory")
        sys.exit(1)
    
    # Create server instance
    server = ExpoContinuousServer()
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, server.signal_handler)
    
    # Start the server
    server.start_expo()

if __name__ == "__main__":
    main()




