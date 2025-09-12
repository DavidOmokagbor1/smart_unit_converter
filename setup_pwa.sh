#!/bin/bash

# PWA Setup Script for Smart Unit Converter
# This script sets up the Progressive Web App features

echo "🚀 Setting up PWA for Smart Unit Converter..."

# Create icons directory
mkdir -p docs/icons
mkdir -p docs/screenshots

echo "📁 Created icons and screenshots directories"

# Create placeholder icons (you'll need to replace these with actual icons)
echo "🎨 Creating placeholder icons..."

# Create a simple SVG icon that can be converted to PNG
cat > docs/icons/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#grad1)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">UC</text>
  <circle cx="256" cy="180" r="30" fill="white" opacity="0.8"/>
  <rect x="200" y="160" width="112" height="40" rx="20" fill="white" opacity="0.6"/>
</svg>
EOF

echo "✅ Created SVG icon template"

# Create a simple HTML file to generate PNG icons
cat > docs/generate_icons.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
</head>
<body>
    <canvas id="canvas" width="512" height="512"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        // Draw background
        ctx.fillStyle = gradient;
        ctx.roundRect(0, 0, 512, 512, 80);
        ctx.fill();
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 200px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('UC', 256, 320);
        
        // Draw accent circle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(256, 180, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw accent rectangle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.roundRect(200, 160, 112, 40, 20);
        ctx.fill();
        
        // Add roundRect polyfill
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
        
        // Download function
        function downloadIcon(size) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0, size, size);
            
            const link = document.createElement('a');
            link.download = `icon-${size}x${size}.png`;
            link.href = tempCanvas.toDataURL();
            link.click();
        }
        
        // Generate all required sizes
        setTimeout(() => {
            [72, 96, 128, 144, 152, 192, 384, 512].forEach(size => {
                downloadIcon(size);
            });
        }, 1000);
    </script>
</body>
</html>
EOF

echo "✅ Created icon generator HTML"

# Create a simple splash screen
cat > docs/screenshots/splash-640x1136.png << 'EOF'
# This is a placeholder - you'll need to create actual PNG files
# For now, we'll create a simple text file as a reminder
EOF

echo "📱 PWA setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Open docs/generate_icons.html in your browser"
echo "2. Download the generated icons to docs/icons/"
echo "3. Create actual screenshots and place them in docs/screenshots/"
echo "4. Test the PWA by visiting your deployed site"
echo "5. Try installing it on mobile devices"
echo ""
echo "📋 PWA Features Added:"
echo "✅ Manifest file (docs/manifest.json)"
echo "✅ Enhanced service worker (docs/service-worker-enhanced.js)"
echo "✅ PWA meta tags in HTML"
echo "✅ Background sync for rates"
echo "✅ Push notification support"
echo "✅ Offline caching"
echo "✅ App installation prompts"
echo ""
echo "🚀 Your app is now PWA-ready!"
echo "Visit your deployed site and look for the 'Install App' option!"
