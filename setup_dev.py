#!/usr/bin/env python3
"""
Smart Unit Converter - Development Setup Script
This script helps you set up the development environment and test all interfaces.
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def print_header():
    print("=" * 60)
    print("🚀 Smart Unit Converter - Development Setup")
    print("=" * 60)

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("❌ Python 3.7+ is required. Current version:", sys.version)
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
    return True

def check_tkinter():
    """Check if tkinter is available"""
    try:
        import tkinter
        print("✅ Tkinter is available")
        return True
    except ImportError:
        print("❌ Tkinter not available. GUI features will not work.")
        return False

def test_python_apps():
    """Test Python applications"""
    print("\n🧪 Testing Python Applications...")
    
    # Test CLI converter
    try:
        result = subprocess.run([sys.executable, "smart_unit_converter/cli_converter.py"], 
                              capture_output=True, text=True, timeout=5)
        print("✅ CLI Converter - Working")
    except Exception as e:
        print(f"❌ CLI Converter - Error: {e}")
    
    # Test main GUI (just import check)
    try:
        sys.path.append("smart_unit_converter")
        import main
        print("✅ Main GUI - Import successful")
    except Exception as e:
        print(f"❌ Main GUI - Import error: {e}")

def list_available_interfaces():
    """List all available interfaces"""
    print("\n📱 Available Interfaces:")
    
    interfaces = [
        ("Python GUI", "smart_unit_converter/main.py", "python3 smart_unit_converter/main.py"),
        ("Command Line", "smart_unit_converter/cli_converter.py", "python3 smart_unit_converter/cli_converter.py"),
        ("Web Basic", "web_converter.html", "Open in browser"),
        ("Web Advanced", "stunning_converter.html", "Open in browser"),
        ("Web Index", "smart_unit_converter/index.html", "Open in browser")
    ]
    
    for name, file_path, command in interfaces:
        if os.path.exists(file_path):
            print(f"  ✅ {name}: {command}")
        else:
            print(f"  ❌ {name}: File not found")

def open_web_interfaces():
    """Open web interfaces in browser"""
    web_files = [
        "web_converter.html",
        "stunning_converter.html", 
        "smart_unit_converter/index.html"
    ]
    
    print("\n🌐 Opening web interfaces...")
    for file_path in web_files:
        if os.path.exists(file_path):
            try:
                webbrowser.open(f"file://{os.path.abspath(file_path)}")
                print(f"  ✅ Opened: {file_path}")
            except Exception as e:
                print(f"  ❌ Failed to open {file_path}: {e}")

def show_development_tips():
    """Show development tips"""
    print("\n💡 Development Tips:")
    print("  • Main GUI: python3 smart_unit_converter/main.py")
    print("  • CLI: python3 smart_unit_converter/cli_converter.py")
    print("  • Web files can be opened directly in browser")
    print("  • All conversion logic is in main.py")
    print("  • Add new units in the categories dictionary")
    print("  • Web interfaces use JavaScript for real-time conversion")

def main():
    print_header()
    
    # Check requirements
    if not check_python_version():
        return
    
    check_tkinter()
    
    # Test applications
    test_python_apps()
    
    # List interfaces
    list_available_interfaces()
    
    # Ask if user wants to open web interfaces
    response = input("\n🌐 Open web interfaces in browser? (y/n): ").lower()
    if response in ['y', 'yes']:
        open_web_interfaces()
    
    # Show development tips
    show_development_tips()
    
    print("\n🎉 Setup complete! You're ready to continue building!")

if __name__ == "__main__":
    main() 