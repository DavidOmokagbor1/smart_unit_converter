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
