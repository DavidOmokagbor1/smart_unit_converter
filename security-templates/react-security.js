// 🔒 React Security Implementation
// Copy this file to your React project: src/security/security.js

import React, { useState, useEffect, useCallback } from 'react';

// Security Utils (copy security-utils.js to your project)
import { SecurityUtils } from '../utils/security-utils';

// 🔒 React Security Hook
export const useSecurity = () => {
    const [securityStatus, setSecurityStatus] = useState({
        isSecure: false,
        hasCSP: false,
        rateLimitStatus: 0
    });

    useEffect(() => {
        if (typeof SecurityUtils !== 'undefined') {
            const status = SecurityUtils.getSecurityStatus();
            setSecurityStatus({
                isSecure: status.isSecureContext && status.hasCSP,
                hasCSP: status.hasCSP,
                rateLimitStatus: status.rateLimitStatus
            });
        }
    }, []);

    return securityStatus;
};

// 🔒 Secure Input Hook
export const useSecureInput = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(true);

    const handleChange = useCallback((newValue) => {
        // Sanitize input
        const sanitized = SecurityUtils.sanitizeInput(newValue);
        setValue(sanitized);

        // Validate input
        const validation = SecurityUtils.validateNumericInput(sanitized);
        setIsValid(validation.isValid);
        setError(validation.error);
    }, []);

    const validate = useCallback(() => {
        const validation = SecurityUtils.validateNumericInput(value);
        setIsValid(validation.isValid);
        setError(validation.error);
        return validation.isValid;
    }, [value]);

    return {
        value,
        error,
        isValid,
        handleChange,
        validate
    };
};

// 🔒 Secure API Hook
export const useSecureAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeSecureRequest = useCallback(async (url, options = {}) => {
        // Check rate limiting
        const userIdentifier = SecurityUtils.generateUserIdentifier();
        if (!SecurityUtils.checkRateLimit(userIdentifier)) {
            throw new Error('Rate limit exceeded');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Validate API response
            if (!SecurityUtils.validateApiResponse(data, 'object')) {
                throw new Error('Invalid API response');
            }

            return data;

        } catch (err) {
            SecurityUtils.logSecurityEvent('api_error', { 
                url, 
                error: err.message 
            });
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        makeSecureRequest
    };
};

// 🔒 Security Status Component
export const SecurityStatus = () => {
    const { isSecure, hasCSP } = useSecurity();

    if (!isSecure) {
        return (
            <div className="security-warning">
                ⚠️ Some security features may not be active
            </div>
        );
    }

    return (
        <div className="security-status">
            🔒 Security features active - CSP, Input validation, Rate limiting
        </div>
    );
};

// 🔒 Secure Input Component
export const SecureInput = ({ 
    value, 
    onChange, 
    placeholder = "Enter value...",
    type = "text",
    className = "",
    ...props 
}) => {
    const { value: secureValue, error, isValid, handleChange } = useSecureInput(value);

    useEffect(() => {
        if (onChange) {
            onChange(secureValue);
        }
    }, [secureValue, onChange]);

    return (
        <div className="secure-input-container">
            <input
                type={type}
                value={secureValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className={`secure-input ${!isValid ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <div className="input-error">
                    {error}
                </div>
            )}
        </div>
    );
};

// 🔒 Secure Button Component
export const SecureButton = ({ 
    onClick, 
    children, 
    disabled = false,
    className = "",
    ...props 
}) => {
    const [isRateLimited, setIsRateLimited] = useState(false);

    const handleClick = useCallback(async (e) => {
        // Check rate limiting
        const userIdentifier = SecurityUtils.generateUserIdentifier();
        if (!SecurityUtils.checkRateLimit(userIdentifier)) {
            setIsRateLimited(true);
            setTimeout(() => setIsRateLimited(false), 60000); // 1 minute
            return;
        }

        if (onClick) {
            try {
                await onClick(e);
            } catch (error) {
                SecurityUtils.logSecurityEvent('button_error', { 
                    error: error.message 
                });
            }
        }
    }, [onClick]);

    return (
        <button
            onClick={handleClick}
            disabled={disabled || isRateLimited}
            className={`secure-button ${isRateLimited ? 'rate-limited' : ''} ${className}`}
            {...props}
        >
            {isRateLimited ? 'Rate Limited' : children}
        </button>
    );
};

// 🔒 Security Provider Component
export const SecurityProvider = ({ children }) => {
    const [securityInitialized, setSecurityInitialized] = useState(false);

    useEffect(() => {
        // Initialize security features
        if (typeof SecurityUtils !== 'undefined') {
            setSecurityInitialized(true);
        }
    }, []);

    if (!securityInitialized) {
        return <div>Loading security features...</div>;
    }

    return (
        <div className="security-provider">
            <SecurityStatus />
            {children}
        </div>
    );
};

// 🔒 Security CSS (add to your CSS file)
export const securityStyles = `
.security-status {
    background: #e8f5e8;
    border: 1px solid #4caf50;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    font-size: 14px;
    color: #2e7d32;
}

.security-warning {
    background: #fff3e0;
    border: 1px solid #ff9800;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    font-size: 14px;
    color: #e65100;
}

.secure-input-container {
    margin: 10px 0;
}

.secure-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.secure-input.error {
    border-color: #f44336;
}

.input-error {
    color: #f44336;
    font-size: 12px;
    margin-top: 4px;
}

.secure-button {
    background: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.secure-button:hover:not(:disabled) {
    background: #1976d2;
}

.secure-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.secure-button.rate-limited {
    background: #ff9800;
}

.security-provider {
    min-height: 100vh;
}
`;

// 🔒 Usage Example Component
export const SecureAppExample = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const { makeSecureRequest, loading, error } = useSecureAPI();

    const handleSecureAction = async () => {
        try {
            // Example secure API call
            const data = await makeSecureRequest('https://api.example.com/data');
            setResult(`Secure data received: ${JSON.stringify(data)}`);
        } catch (err) {
            setResult(`Error: ${err.message}`);
        }
    };

    return (
        <SecurityProvider>
            <div className="secure-app">
                <h1>Secure React App</h1>
                
                <SecureInput
                    value={inputValue}
                    onChange={setInputValue}
                    placeholder="Enter secure input..."
                />
                
                <SecureButton onClick={handleSecureAction} disabled={loading}>
                    {loading ? 'Processing...' : 'Secure Action'}
                </SecureButton>
                
                {error && <div className="error">API Error: {error}</div>}
                {result && <div className="result">{result}</div>}
            </div>
        </SecurityProvider>
    );
};

export default {
    useSecurity,
    useSecureInput,
    useSecureAPI,
    SecurityStatus,
    SecureInput,
    SecureButton,
    SecurityProvider,
    SecureAppExample,
    securityStyles
};







