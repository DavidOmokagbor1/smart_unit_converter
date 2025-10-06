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
