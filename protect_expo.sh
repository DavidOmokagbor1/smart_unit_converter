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
