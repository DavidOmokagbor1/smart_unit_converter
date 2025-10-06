#!/bin/bash

# Smart Unit Converter - Expo Manager
# Easy commands to manage your Expo development server

PROJECT_DIR="/Users/java/Downloads/smart_unit_converter-main/SmartUnitConverterExpo"
EXPO_PID_FILE="/tmp/expo_smart_converter.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🎯 $1${NC}"
    echo "=================================================="
}

# Function to check if Expo is running
is_expo_running() {
    if [ -f "$EXPO_PID_FILE" ]; then
        local pid=$(cat "$EXPO_PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$EXPO_PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to start Expo
start_expo() {
    print_header "Starting Smart Unit Converter Expo Server"
    
    if is_expo_running; then
        print_warning "Expo is already running!"
        print_info "Use './expo_manager.sh status' to check status"
        return 1
    fi
    
    cd "$PROJECT_DIR" || {
        print_error "Cannot access project directory: $PROJECT_DIR"
        exit 1
    }
    
    print_info "Installing dependencies..."
    npm install --silent
    
    print_info "Starting Expo development server..."
    print_info "This will start in the background and keep running"
    
    # Start Expo in background with tunnel
    nohup npx expo start --tunnel --clear > /tmp/expo_smart_converter.log 2>&1 &
    local expo_pid=$!
    
    # Save PID
    echo "$expo_pid" > "$EXPO_PID_FILE"
    
    print_status "Expo server started with PID: $expo_pid"
    print_info "Logs are being written to: /tmp/expo_smart_converter.log"
    print_info "Use './expo_manager.sh logs' to view logs"
    print_info "Use './expo_manager.sh stop' to stop the server"
    
    # Wait a moment and show initial output
    sleep 3
    print_info "Initial server output:"
    tail -n 10 /tmp/expo_smart_converter.log
}

# Function to stop Expo
stop_expo() {
    print_header "Stopping Smart Unit Converter Expo Server"
    
    if ! is_expo_running; then
        print_warning "Expo is not running!"
        return 1
    fi
    
    local pid=$(cat "$EXPO_PID_FILE")
    print_info "Stopping Expo server (PID: $pid)..."
    
    kill "$pid" 2>/dev/null
    
    # Wait for graceful shutdown
    sleep 2
    
    if ps -p "$pid" > /dev/null 2>&1; then
        print_warning "Graceful shutdown failed, forcing stop..."
        kill -9 "$pid" 2>/dev/null
    fi
    
    rm -f "$EXPO_PID_FILE"
    print_status "Expo server stopped"
}

# Function to show status
show_status() {
    print_header "Smart Unit Converter Expo Server Status"
    
    if is_expo_running; then
        local pid=$(cat "$EXPO_PID_FILE")
        print_status "Expo server is RUNNING (PID: $pid)"
        print_info "Log file: /tmp/expo_smart_converter.log"
        print_info "Use './expo_manager.sh logs' to view recent logs"
        print_info "Use './expo_manager.sh stop' to stop the server"
    else
        print_warning "Expo server is NOT running"
        print_info "Use './expo_manager.sh start' to start the server"
    fi
}

# Function to show logs
show_logs() {
    print_header "Smart Unit Converter Expo Server Logs"
    
    if [ ! -f "/tmp/expo_smart_converter.log" ]; then
        print_warning "No log file found. Start the server first."
        return 1
    fi
    
    print_info "Showing last 20 lines of logs:"
    echo "=================================================="
    tail -n 20 /tmp/expo_smart_converter.log
    echo "=================================================="
    print_info "Use 'tail -f /tmp/expo_smart_converter.log' to follow logs in real-time"
}

# Function to restart Expo
restart_expo() {
    print_header "Restarting Smart Unit Converter Expo Server"
    
    if is_expo_running; then
        stop_expo
        sleep 2
    fi
    
    start_expo
}

# Function to show QR code
show_qr() {
    print_header "Smart Unit Converter QR Code"
    
    if ! is_expo_running; then
        print_warning "Expo server is not running!"
        print_info "Start the server first with './expo_manager.sh start'"
        return 1
    fi
    
    print_info "Looking for QR code in logs..."
    
    # Extract QR code from logs
    local qr_line=$(grep -i "qr\|exp://" /tmp/expo_smart_converter.log | tail -1)
    
    if [ -n "$qr_line" ]; then
        print_info "QR Code found:"
        echo "$qr_line"
    else
        print_warning "QR code not found in logs yet"
        print_info "Wait a moment and try again, or check logs with './expo_manager.sh logs'"
    fi
}

# Function to open in browser
open_browser() {
    print_header "Opening Smart Unit Converter in Browser"
    
    if ! is_expo_running; then
        print_warning "Expo server is not running!"
        print_info "Start the server first with './expo_manager.sh start'"
        return 1
    fi
    
    # Look for web URL in logs
    local web_url=$(grep -i "web.*http" /tmp/expo_smart_converter.log | tail -1 | grep -o 'http[^[:space:]]*')
    
    if [ -n "$web_url" ]; then
        print_info "Opening: $web_url"
        open "$web_url"
    else
        print_warning "Web URL not found in logs yet"
        print_info "Wait a moment and try again"
    fi
}

# Function to show help
show_help() {
    print_header "Smart Unit Converter Expo Manager"
    echo "Available commands:"
    echo ""
    echo "  start     - Start Expo development server"
    echo "  stop      - Stop Expo development server"
    echo "  restart   - Restart Expo development server"
    echo "  status    - Show server status"
    echo "  logs      - Show recent logs"
    echo "  qr        - Show QR code for mobile scanning"
    echo "  browser   - Open in web browser"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./expo_manager.sh start"
    echo "  ./expo_manager.sh status"
    echo "  ./expo_manager.sh logs"
    echo "  ./expo_manager.sh qr"
}

# Main script logic
case "$1" in
    start)
        start_expo
        ;;
    stop)
        stop_expo
        ;;
    restart)
        restart_expo
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    qr)
        show_qr
        ;;
    browser)
        open_browser
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac



