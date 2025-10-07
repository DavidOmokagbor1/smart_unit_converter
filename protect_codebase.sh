#!/bin/bash

echo "🛡️  Smart Unit Converter - Codebase Protection System"
echo "=================================================="

# Create backup directory
BACKUP_DIR="codebase_backups"
mkdir -p "$BACKUP_DIR"

# Create timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="backup_$TIMESTAMP"

echo "📦 Creating backup: $BACKUP_NAME"
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
    --exclude="node_modules" \
    --exclude=".expo" \
    --exclude="codebase_backups" \
    --exclude="*.log" \
    .

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"

# Create protection script
cat > protect_expo.sh << 'EOF'
#!/bin/bash

echo "🔒 Protecting Expo Configuration..."

# Lock critical files
chmod 444 SmartUnitConverterExpo/app.json
chmod 444 SmartUnitConverterExpo/package.json
chmod 444 manifest.json

echo "✅ Critical files locked (read-only)"

# Create restore script
cat > restore_permissions.sh << 'RESTORE'
#!/bin/bash
echo "🔓 Restoring file permissions..."
chmod 644 SmartUnitConverterExpo/app.json
chmod 644 SmartUnitConverterExpo/package.json
chmod 644 manifest.json
echo "✅ Permissions restored"
RESTORE

chmod +x restore_permissions.sh
echo "✅ Restore script created: restore_permissions.sh"
EOF

chmod +x protect_expo.sh
./protect_expo.sh

# Create maintenance script
cat > maintain_codebase.sh << 'EOF'
#!/bin/bash

echo "🔧 Codebase Maintenance Routine"
echo "==============================="

# Check for common issues
echo "🔍 Checking for issues..."

# Check if Expo is running
if pgrep -f "expo start" > /dev/null; then
    echo "✅ Expo is running"
else
    echo "⚠️  Expo is not running"
fi

# Check package versions
echo "📦 Checking package versions..."
cd SmartUnitConverterExpo
npx expo install --check 2>/dev/null || echo "⚠️  Package version check failed"

# Check for linting errors
echo "🔍 Checking for linting errors..."
cd ..
if command -v npx &> /dev/null; then
    npx markdownlint "*.md" 2>/dev/null | head -5 || echo "✅ No critical markdown errors"
else
    echo "⚠️  Linting tools not available"
fi

echo "✅ Maintenance check completed"
EOF

chmod +x maintain_codebase.sh

# Create startup script
cat > start_expo_safe.sh << 'EOF'
#!/bin/bash

echo "🚀 Safe Expo Startup"
echo "==================="

# Check if already running
if pgrep -f "expo start" > /dev/null; then
    echo "⚠️  Expo is already running"
    echo "To restart, run: pkill -f expo && ./start_expo_safe.sh"
    exit 1
fi

# Navigate to Expo directory
cd SmartUnitConverterExpo

# Clear cache
echo "🧹 Clearing cache..."
npx expo r -c 2>/dev/null || true

# Start Expo
echo "🚀 Starting Expo..."
npx expo start --lan --clear

EOF

chmod +x start_expo_safe.sh

# Create monitoring script
cat > monitor_codebase.sh << 'EOF'
#!/bin/bash

echo "👁️  Codebase Monitor"
echo "==================="

while true; do
    echo "$(date): Monitoring codebase..."
    
    # Check if Expo is still running
    if ! pgrep -f "expo start" > /dev/null; then
        echo "⚠️  Expo stopped unexpectedly at $(date)"
        echo "Run ./start_expo_safe.sh to restart"
    fi
    
    # Check for file changes
    if [ -f ".last_check" ]; then
        if find . -name "*.js" -o -name "*.json" -o -name "*.html" -newer .last_check | grep -q .; then
            echo "📝 Files changed, consider running maintenance"
        fi
    fi
    
    touch .last_check
    sleep 30
done
EOF

chmod +x monitor_codebase.sh

echo ""
echo "🛡️  Protection System Installed!"
echo "================================"
echo ""
echo "📁 Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "🔒 Files locked: app.json, package.json, manifest.json"
echo "🔧 Maintenance script: ./maintain_codebase.sh"
echo "🚀 Safe startup: ./start_expo_safe.sh"
echo "👁️  Monitor: ./monitor_codebase.sh"
echo ""
echo "To restore permissions: ./restore_permissions.sh"
echo "To create new backup: ./protect_codebase.sh"
echo ""
echo "✅ Your codebase is now protected!"

