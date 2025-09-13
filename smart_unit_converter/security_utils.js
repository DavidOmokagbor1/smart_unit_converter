/**
 * Security Utilities for Smart Unit Converter
 * Provides input sanitization, validation, and security functions
 */

class SecurityUtils {
    constructor() {
        this.rateLimiter = {
            requests: new Map(),
            limit: 60, // requests per minute
            window: 60000, // 1 minute in milliseconds
            cleanupInterval: 300000 // 5 minutes cleanup interval
        };
        
        // Start cleanup interval
        setInterval(() => this.cleanupRateLimiter(), this.rateLimiter.cleanupInterval);
    }

    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input to sanitize
     * @returns {string} - Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        return input
            .replace(/[<>\"'&]/g, function(match) {
                const escapeMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return escapeMap[match];
            })
            .trim();
    }

    /**
     * Validate numeric input for conversions
     * @param {string} input - Input to validate
     * @returns {object} - Validation result with isValid and value
     */
    validateNumericInput(input) {
        const sanitized = this.sanitizeInput(input);
        
        // Check if input is empty
        if (!sanitized) {
            return { isValid: false, value: null, error: 'Input cannot be empty' };
        }
        
        // Check for valid number format (including scientific notation)
        const numberRegex = /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
        if (!numberRegex.test(sanitized)) {
            return { isValid: false, value: null, error: 'Invalid number format' };
        }
        
        const numValue = parseFloat(sanitized);
        
        // Check for reasonable range
        if (Math.abs(numValue) > 1e15) {
            return { isValid: false, value: null, error: 'Number too large' };
        }
        
        if (Math.abs(numValue) < 1e-15 && numValue !== 0) {
            return { isValid: false, value: null, error: 'Number too small' };
        }
        
        // Check for NaN
        if (isNaN(numValue)) {
            return { isValid: false, value: null, error: 'Invalid number' };
        }
        
        return { isValid: true, value: numValue, error: null };
    }

    /**
     * Rate limiting to prevent abuse
     * @param {string} identifier - User identifier (IP or session)
     * @returns {boolean} - Whether request is allowed
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const userRequests = this.rateLimiter.requests.get(identifier) || [];
        
        // Remove old requests outside the window
        const validRequests = userRequests.filter(time => now - time < this.rateLimiter.window);
        
        // Check if limit exceeded
        if (validRequests.length >= this.rateLimiter.limit) {
            return false;
        }
        
        // Add current request
        validRequests.push(now);
        this.rateLimiter.requests.set(identifier, validRequests);
        
        return true;
    }

    /**
     * Clean up old rate limiting data
     */
    cleanupRateLimiter() {
        const now = Date.now();
        for (const [identifier, requests] of this.rateLimiter.requests.entries()) {
            const validRequests = requests.filter(time => now - time < this.rateLimiter.window);
            if (validRequests.length === 0) {
                this.rateLimiter.requests.delete(identifier);
            } else {
                this.rateLimiter.requests.set(identifier, validRequests);
            }
        }
    }

    /**
     * Generate a simple user identifier for rate limiting
     * @returns {string} - User identifier
     */
    generateUserIdentifier() {
        // Simple identifier based on user agent and screen resolution
        const userAgent = navigator.userAgent || 'unknown';
        const screen = `${screen.width}x${screen.height}`;
        const time = Math.floor(Date.now() / 60000); // Minute-based
        
        return btoa(`${userAgent}-${screen}-${time}`).substring(0, 16);
    }

    /**
     * Validate API response data
     * @param {object} data - API response data
     * @param {string} expectedType - Expected data type
     * @returns {boolean} - Whether data is valid
     */
    validateApiResponse(data, expectedType = 'object') {
        if (!data) return false;
        if (typeof data !== expectedType) return false;
        
        // Additional validation based on type
        if (expectedType === 'object') {
            // Check for common API response structure
            if (data.error && typeof data.error === 'string') {
                console.warn('API returned error:', data.error);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Log security events
     * @param {string} event - Event type
     * @param {object} details - Event details
     */
    logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Security Event:', logEntry);
        
        // In production, you might want to send this to a logging service
        // this.sendToLoggingService(logEntry);
    }

    /**
     * Check if the application is running in a secure context
     * @returns {boolean} - Whether running securely
     */
    isSecureContext() {
        return window.isSecureContext || location.protocol === 'https:';
    }

    /**
     * Get security status information
     * @returns {object} - Security status
     */
    getSecurityStatus() {
        return {
            isSecureContext: this.isSecureContext(),
            hasCSP: this.hasContentSecurityPolicy(),
            rateLimitStatus: this.rateLimiter.requests.size,
            userIdentifier: this.generateUserIdentifier()
        };
    }

    /**
     * Check if Content Security Policy is present
     * @returns {boolean} - Whether CSP is present
     */
    hasContentSecurityPolicy() {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return meta !== null;
    }
}

// Create global instance
window.SecurityUtils = new SecurityUtils();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
}
