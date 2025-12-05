# 📱 Expo Go Setup Guide - Smart Unit Converter

## 🎯 **Quick Start (Recommended)**

### **Method 1: Simple Start**

```bash

# Navigate to your project

cd /Users/java/Downloads/smart_unit_converter-main

# Start Expo (this will run in foreground)

./start_expo.sh

```text
### **Method 2: Background Service**

```bash

# Start Expo in background (keeps running even if you close terminal)

nohup ./start_expo.sh > expo_logs.txt 2>&1 &

# Check if it's running

ps aux | grep expo

# View logs

tail -f expo_logs.txt

```text
---

## 📱 **Mobile Setup**

### **Step 1: Install Expo Go App**

- **Android**: [Google Play Store]([https://play.google.com/store/apps/details?id=host.exp.exponent]([https://play.google.com/store/apps/details?id=host.exp.exponent](https://play.google.com/store/apps/details?id=host.exp.exponent)))

- **iOS**: [App Store]([https://apps.apple.com/app/expo-go/id982107779]([https://apps.apple.com/app/expo-go/id982107779](https://apps.apple.com/app/expo-go/id982107779)))

### **Step 2: Connect to Your App**

1. **Start the Expo server** (using Method 1 or 2 above)

2. **Scan the QR code** that appears in your terminal

3. **Or manually enter the URL** shown in the terminal

---

## 🌐 **Web Preview**

### **Access Web Version**

1. **Start Expo server**

2. **Press 'w'** in the terminal to open web version

3. **Or open the web URL** shown in the terminal

---

## 🔧 **Advanced Management**

### **Check Status**

```bash

# See if Expo is running

ps aux | grep expo

# View logs

tail -f expo_logs.txt

```text
### **Stop Expo**

```bash

# Find and kill Expo process

pkill -f "expo start"

# Or if running in background

kill $(ps aux | grep "expo start" | grep -v grep | awk '{print $2}')

```text
### **Restart Expo**

```bash

# Stop and start again

pkill -f "expo start"

./start_expo.sh

```text
---

## 🚀 **Continuous Development Setup**

### **Option 1: Background Service (Recommended)**

```bash

# Start in background

nohup ./start_expo.sh > expo_logs.txt 2>&1 &

# Check status anytime

ps aux | grep expo

# View logs anytime

tail -f expo_logs.txt

# Stop when needed

pkill -f "expo start"

```text
### **Option 2: Screen Session (Advanced)**

```bash

# Install screen if not available

brew install screen

# Start Expo in screen session

screen -S expo_server ./start_expo.sh

# Detach from screen (Ctrl+A, then D)

# Reattach anytime with: screen -r expo_server

```text
---

## 📱 **Mobile Testing Workflow**

### **Daily Development**

1. **Start Expo server** in background

2. **Open Expo Go** on your phone

3. **Scan QR code** or enter URL

4. **Test your app** on real device

5. **Make changes** in code

6. **See updates** automatically on phone

### **Sharing with Others**

1. **Start Expo with tunnel** (already configured)

2. **Share the QR code** or URL

3. **Others can scan** and test your app

4. **No need for them to install anything** (just Expo Go app)

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Expo not found"**

```bash

# Install Expo CLI globally

npm install -g @expo/cli

# Or use npx (already in script)

npx expo start

```text
#### **"Port already in use"**

```bash

# Kill existing Expo processes

pkill -f "expo start"

# Or use different port

npx expo start --port 8081

```text
#### **"Cannot connect to Expo"**

```bash

# Check if tunnel is working

npx expo start --tunnel --verbose

# Or try without tunnel

npx expo start --localhost

```text
#### **"QR code not showing"**

```bash

# Clear cache and restart

npx expo start --clear --tunnel

```text
---

## 📊 **Monitoring Your App**

### **View Logs**

```bash

# Real-time logs

tail -f expo_logs.txt

# Last 50 lines

tail -n 50 expo_logs.txt

# Search for errors

grep -i error expo_logs.txt

```text
### **Check Performance**

- **Expo Go app** shows performance metrics

- **Web version** shows browser dev tools

- **Terminal logs** show server status

---

## 🎯 **Pro Tips**

### **1. Keep Expo Running**

- Use background service method

- Check status regularly

- Restart if needed

### **2. Test on Multiple Devices**

- Android phone

- iOS phone

- Web browser

- Different screen sizes

### **3. Share with Team**

- Send QR code image

- Share tunnel URL

- Use Expo Go for testing

### **4. Development Workflow**

- Make code changes

- Save files

- See updates instantly on phone

- Test on real device

---

## 🎉 **You're Ready!**

Your Smart Unit Converter is now set up for continuous development with Expo Go!

**Next Steps:**

1. **Start Expo server** using the simple method

2. **Install Expo Go** on your phone

3. **Scan QR code** to test your app

4. **Keep developing** with instant updates!

**Happy coding!** 🚀📱







