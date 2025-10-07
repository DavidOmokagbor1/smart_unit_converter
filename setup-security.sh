#!/bin/bash

# 🔒 Security Setup Script
# This script sets up security for any new web project

echo "🔒 Setting up security for your web project..."

# Create project directory if it doesn't exist
if [ ! -d "$1" ]; then
    echo "Creating project directory: $1"
    mkdir -p "$1"
fi

PROJECT_DIR="$1"
SECURITY_TEMPLATES_DIR="security-templates"

echo "📁 Project directory: $PROJECT_DIR"

# Copy security utilities
echo "📋 Copying security utilities..."
cp "$SECURITY_TEMPLATES_DIR/security-utils.js" "$PROJECT_DIR/"

# Copy appropriate template based on project type
if [ "$2" = "react" ]; then
    echo "⚛️ Setting up React security..."
    mkdir -p "$PROJECT_DIR/src/security"
    mkdir -p "$PROJECT_DIR/src/utils"
    cp "$SECURITY_TEMPLATES_DIR/react-security.js" "$PROJECT_DIR/src/security/"
    cp "$SECURITY_TEMPLATES_DIR/security-utils.js" "$PROJECT_DIR/src/utils/"
    echo "✅ React security setup complete!"
    
elif [ "$2" = "vue" ]; then
    echo "💚 Setting up Vue.js security..."
    mkdir -p "$PROJECT_DIR/src/security"
    mkdir -p "$PROJECT_DIR/src/utils"
    cp "$SECURITY_TEMPLATES_DIR/vue-security.js" "$PROJECT_DIR/src/security/"
    cp "$SECURITY_TEMPLATES_DIR/security-utils.js" "$PROJECT_DIR/src/utils/"
    echo "✅ Vue.js security setup complete!"
    
elif [ "$2" = "nodejs" ]; then
    echo "🟢 Setting up Node.js security..."
    mkdir -p "$PROJECT_DIR/middleware"
    mkdir -p "$PROJECT_DIR/utils"
    cp "$SECURITY_TEMPLATES_DIR/nodejs-security.js" "$PROJECT_DIR/middleware/"
    cp "$SECURITY_TEMPLATES_DIR/security-utils.js" "$PROJECT_DIR/utils/"
    echo "✅ Node.js security setup complete!"
    
else
    echo "🌐 Setting up static site security..."
    cp "$SECURITY_TEMPLATES_DIR/static-site-security.html" "$PROJECT_DIR/index.html"
    echo "✅ Static site security setup complete!"
fi

# Copy documentation templates
echo "📚 Copying documentation templates..."
cp "SECURITY_GUIDE.md" "$PROJECT_DIR/"
cp "API_DOCUMENTATION.md" "$PROJECT_DIR/"
cp "TROUBLESHOOTING_GUIDE.md" "$PROJECT_DIR/"
cp "security-templates/project-security-checklist.md" "$PROJECT_DIR/"

# Copy Cursor rules
echo "⚙️ Setting up Cursor IDE rules..."
cp ".cursorrules" "$PROJECT_DIR/"

# Create security configuration file
echo "🔧 Creating security configuration..."
cat > "$PROJECT_DIR/security-config.js" << 'EOF'
// 🔒 Security Configuration
// Customize these settings for your project

export const securityConfig = {
    // Rate limiting settings
    rateLimit: {
        windowMs: 60000, // 1 minute
        max: 60, // requests per window
        message: 'Too many requests, please try again later.'
    },
    
    // CSP settings
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        connectSrc: ["'self'", "https://api.trusted.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    },
    
    // API settings
    api: {
        timeout: 10000, // 10 seconds
        retries: 3,
        validateResponse: true
    },
    
    // Security headers
    headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
};
EOF

# Create package.json for Node.js projects
if [ "$2" = "nodejs" ]; then
    echo "📦 Creating package.json for Node.js project..."
    cat > "$PROJECT_DIR/package.json" << 'EOF'
{
  "name": "secure-web-app",
  "version": "1.0.0",
  "description": "A secure web application with built-in security features",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "security-test": "npm audit && npm run test"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  },
  "keywords": ["security", "web", "express", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}
EOF
fi

# Create README for the project
echo "📖 Creating project README..."
cat > "$PROJECT_DIR/README.md" << 'EOF'
# 🔒 Secure Web Application

This project includes comprehensive security features and follows security best practices.

## 🛡️ Security Features

- ✅ Content Security Policy (CSP)
- ✅ Input Sanitization & Validation
- ✅ Rate Limiting
- ✅ XSS Protection
- ✅ Security Headers
- ✅ Error Handling
- ✅ Security Logging

## 🚀 Quick Start

1. **Install dependencies** (if applicable):
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm start
   # or
   open index.html
   ```

3. **Verify security features**:
   - Check browser console for security status
   - Test input validation
   - Verify rate limiting

## 📚 Security Documentation

- [Security Guide](SECURITY_GUIDE.md) - Comprehensive security documentation
- [API Documentation](API_DOCUMENTATION.md) - API security guide
- [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md) - Common issues and solutions
- [Security Checklist](project-security-checklist.md) - Security checklist

## 🔧 Configuration

Edit `security-config.js` to customize security settings for your project.

## 🎯 Security Checklist

Before deploying, ensure all items in `project-security-checklist.md` are completed.

## 📞 Support

For security issues or questions, refer to the documentation or contact the security team.

---

**Remember**: Security is mandatory for every project! 🔒
EOF

echo ""
echo "🎉 Security setup complete for $PROJECT_DIR!"
echo ""
echo "📋 Next steps:"
echo "1. Review the security configuration in security-config.js"
echo "2. Customize the CSP policy for your specific needs"
echo "3. Test the security features"
echo "4. Follow the security checklist before deployment"
echo ""
echo "🔒 Your project is now secure by default!"
echo ""
echo "📚 Documentation available:"
echo "- SECURITY_GUIDE.md"
echo "- API_DOCUMENTATION.md"
echo "- TROUBLESHOOTING_GUIDE.md"
echo "- project-security-checklist.md"
echo ""
echo "Happy coding! 🚀"







