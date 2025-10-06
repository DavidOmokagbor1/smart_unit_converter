#!/usr/bin/env python3
"""
Simple HTTP server to serve the Expo app
This creates a local server that can be accessed by Expo Go
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs

class ExpoHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Serve a simple HTML page that loads the React Native app
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Smart Unit Converter</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
                    .container { max-width: 400px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    h1 { text-align: center; color: #333; margin-bottom: 20px; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
                    input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
                    button { width: 100%; padding: 15px; background: #007bff; color: white; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin: 20px 0; }
                    button:hover { background: #0056b3; }
                    .result { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin-top: 20px; font-size: 24px; font-weight: bold; color: #007bff; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📱 Smart Unit Converter</h1>
                    
                    <div class="form-group">
                        <label for="value">Enter Value:</label>
                        <input type="number" id="value" placeholder="Enter a number" step="any">
                    </div>
                    
                    <div class="form-group">
                        <label for="fromUnit">From Unit:</label>
                        <select id="fromUnit">
                            <option value="">Select unit</option>
                            <option value="meter">Meter</option>
                            <option value="kilometer">Kilometer</option>
                            <option value="centimeter">Centimeter</option>
                            <option value="millimeter">Millimeter</option>
                            <option value="inch">Inch</option>
                            <option value="foot">Foot</option>
                            <option value="yard">Yard</option>
                            <option value="mile">Mile</option>
                            <option value="kilogram">Kilogram</option>
                            <option value="gram">Gram</option>
                            <option value="pound">Pound</option>
                            <option value="ounce">Ounce</option>
                            <option value="celsius">Celsius</option>
                            <option value="fahrenheit">Fahrenheit</option>
                            <option value="kelvin">Kelvin</option>
                            <option value="liter">Liter</option>
                            <option value="milliliter">Milliliter</option>
                            <option value="gallon">Gallon</option>
                            <option value="quart">Quart</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="toUnit">To Unit:</label>
                        <select id="toUnit">
                            <option value="">Select unit</option>
                            <option value="meter">Meter</option>
                            <option value="kilometer">Kilometer</option>
                            <option value="centimeter">Centimeter</option>
                            <option value="millimeter">Millimeter</option>
                            <option value="inch">Inch</option>
                            <option value="foot">Foot</option>
                            <option value="yard">Yard</option>
                            <option value="mile">Mile</option>
                            <option value="kilogram">Kilogram</option>
                            <option value="gram">Gram</option>
                            <option value="pound">Pound</option>
                            <option value="ounce">Ounce</option>
                            <option value="celsius">Celsius</option>
                            <option value="fahrenheit">Fahrenheit</option>
                            <option value="kelvin">Kelvin</option>
                            <option value="liter">Liter</option>
                            <option value="milliliter">Milliliter</option>
                            <option value="gallon">Gallon</option>
                            <option value="quart">Quart</option>
                        </select>
                    </div>
                    
                    <button onclick="convert()">🔄 Convert</button>
                    
                    <div id="result" class="result" style="display: none;">
                        <div id="resultValue">0</div>
                    </div>
                </div>
                
                <script>
                    const conversions = {
                        meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001,
                        inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.34,
                        kilogram: 1, gram: 0.001, pound: 0.453592, ounce: 0.0283495,
                        liter: 1, milliliter: 0.001, gallon: 3.78541, quart: 0.946353
                    };
                    
                    function convert() {
                        const value = parseFloat(document.getElementById('value').value);
                        const fromUnit = document.getElementById('fromUnit').value;
                        const toUnit = document.getElementById('toUnit').value;
                        const resultDiv = document.getElementById('result');
                        const resultValue = document.getElementById('resultValue');
                        
                        if (!value || isNaN(value)) {
                            alert('Please enter a valid number');
                            return;
                        }
                        
                        if (!fromUnit || !toUnit) {
                            alert('Please select both units');
                            return;
                        }
                        
                        if (fromUnit === toUnit) {
                            alert('Please select different units');
                            return;
                        }
                        
                        let result;
                        
                        if (isTemperature(fromUnit) && isTemperature(toUnit)) {
                            result = convertTemperature(value, fromUnit, toUnit);
                        } else {
                            const fromFactor = conversions[fromUnit];
                            const toFactor = conversions[toUnit];
                            
                            if (!fromFactor || !toFactor) {
                                alert('Conversion not supported between these units');
                                return;
                            }
                            
                            result = (value * fromFactor) / toFactor;
                        }
                        
                        const formattedResult = formatNumber(result);
                        resultValue.textContent = formattedResult;
                        resultDiv.style.display = 'block';
                    }
                    
                    function isTemperature(unit) {
                        return ['celsius', 'fahrenheit', 'kelvin'].includes(unit);
                    }
                    
                    function convertTemperature(value, fromUnit, toUnit) {
                        let celsius;
                        if (fromUnit === 'celsius') {
                            celsius = value;
                        } else if (fromUnit === 'fahrenheit') {
                            celsius = (value - 32) * 5/9;
                        } else if (fromUnit === 'kelvin') {
                            celsius = value - 273.15;
                        }
                        
                        if (toUnit === 'celsius') {
                            return celsius;
                        } else if (toUnit === 'fahrenheit') {
                            return (celsius * 9/5) + 32;
                        } else if (toUnit === 'kelvin') {
                            return celsius + 273.15;
                        }
                    }
                    
                    function formatNumber(num) {
                        if (Math.abs(num) < 0.001 || Math.abs(num) > 1000000) {
                            return num.toExponential(6);
                        }
                        return parseFloat(num.toFixed(6)).toString();
                    }
                </script>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
        else:
            super().do_GET()

def get_local_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '192.168.1.160'  # fallback
    finally:
        s.close()
    return ip

def main():
    PORT = 8081
    local_ip = get_local_ip()
    
    print(f"🚀 Starting Smart Unit Converter Server...")
    print(f"🌐 Local IP: {local_ip}")
    print(f"🔗 URL: http://{local_ip}:{PORT}")
    print(f"📱 Expo URL: exp://{local_ip}:{PORT}")
    print("=" * 50)
    
    with socketserver.TCPServer(("", PORT), ExpoHandler) as httpd:
        print(f"✅ Server running on http://{local_ip}:{PORT}")
        print(f"📱 Scan QR code with Expo Go: exp://{local_ip}:{PORT}")
        print("⏹️  Press Ctrl+C to stop")
        print("=" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()


