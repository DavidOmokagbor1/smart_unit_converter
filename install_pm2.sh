#!/bin/bash

echo "🔧 Installing PM2 Process Manager..."
echo "===================================="

# Install PM2 globally
echo "📦 Installing PM2 globally..."
npm install -g pm2

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'smart-unit-converter-expo',
    script: 'npx',
    args: 'expo start --tunnel --clear',
    cwd: '/Users/java/Downloads/smart_unit_converter-main/SmartUnitConverterExpo',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    log_file: '/Users/java/Downloads/smart_unit_converter-main/expo_pm2.log',
    out_file: '/Users/java/Downloads/smart_unit_converter-main/expo_pm2.log',
    error_file: '/Users/java/Downloads/smart_unit_converter-main/expo_pm2.log'
  }]
};
EOF

echo "✅ PM2 ecosystem file created: ecosystem.config.js"
echo ""
echo "🚀 To start Expo with PM2:"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "📊 To monitor:"
echo "   pm2 status"
echo "   pm2 logs smart-unit-converter-expo"
echo ""
echo "🛑 To stop:"
echo "   pm2 stop smart-unit-converter-expo"
echo ""
echo "✅ PM2 setup complete!"
