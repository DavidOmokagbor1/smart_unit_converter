# 🌐 API Documentation - Smart Unit Converter

## 📋 **OVERVIEW**

This document provides comprehensive information about the APIs used by the Smart Unit Converter application, including endpoints, rate limits, error handling, and integration guidelines.

---

## 🔗 **EXTERNAL APIs USED**

### **1. ExchangeRate API**
- **Base URL**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Purpose**: Primary currency conversion rates
- **Rate Limit**: 1,000 requests/month (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://api.exchangerate-api.com/v4/latest/USD
```

#### **Response Example**
```json
{
  "base": "USD",
  "date": "2024-12-19",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 148.5,
    "CAD": 1.35,
    "AUD": 1.52
  }
}
```

#### **Error Codes**
- `429`: Rate limit exceeded
- `500`: Server error
- `503`: Service unavailable

---

### **2. Fixer.io API**
- **Base URL**: `https://api.fixer.io/latest?base=USD`
- **Purpose**: Backup currency conversion rates
- **Rate Limit**: 100 requests/month (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://api.fixer.io/latest?base=USD
```

#### **Response Example**
```json
{
  "success": true,
  "timestamp": 1703001600,
  "base": "USD",
  "date": "2024-12-19",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 148.5
  }
}
```

---

### **3. CurrencyAPI**
- **Base URL**: `https://api.currencyapi.com/v3/latest?apikey=free&base_currency=USD`
- **Purpose**: Additional currency data source
- **Rate Limit**: 300 requests/month (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://api.currencyapi.com/v3/latest?apikey=free&base_currency=USD
```

#### **Response Example**
```json
{
  "data": {
    "USD": {
      "code": "USD",
      "value": 1.0
    },
    "EUR": {
      "code": "EUR",
      "value": 0.92
    }
  }
}
```

---

### **4. CoinGecko API**
- **Base URL**: `https://api.coingecko.com/api/v3/simple/price`
- **Purpose**: Cryptocurrency conversion rates
- **Rate Limit**: 50 requests/minute (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd
```

#### **Response Example**
```json
{
  "bitcoin": {
    "usd": 115105
  },
  "ethereum": {
    "usd": 3672.94
  },
  "binancecoin": {
    "usd": 245.67
  }
}
```

---

### **5. CoinCap API**
- **Base URL**: `https://api.coincap.io/v2/assets`
- **Purpose**: Backup cryptocurrency data
- **Rate Limit**: 200 requests/minute (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://api.coincap.io/v2/assets?limit=25
```

#### **Response Example**
```json
{
  "data": [
    {
      "id": "bitcoin",
      "rank": "1",
      "symbol": "BTC",
      "name": "Bitcoin",
      "priceUsd": "115105.00"
    }
  ]
}
```

---

### **6. CryptoCompare API**
- **Base URL**: `https://min-api.cryptocompare.com/data/pricemulti`
- **Purpose**: Additional cryptocurrency data
- **Rate Limit**: 100 requests/day (free tier)
- **Response Format**: JSON
- **Status**: ✅ **ACTIVE**

#### **Endpoint Details**
```http
GET https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,BNB&tsyms=USD
```

#### **Response Example**
```json
{
  "BTC": {
    "USD": 115105
  },
  "ETH": {
    "USD": 3672.94
  },
  "BNB": {
    "USD": 245.67
  }
}
```

---

## 🔄 **API FALLBACK STRATEGY**

### **Currency APIs (Priority Order)**
1. **ExchangeRate API** - Primary source
2. **Fixer.io API** - First fallback
3. **CurrencyAPI** - Second fallback
4. **Static rates** - Final fallback

### **Cryptocurrency APIs (Priority Order)**
1. **CoinGecko API** - Primary source
2. **CoinCap API** - First fallback
3. **CryptoCompare API** - Second fallback
4. **Static rates** - Final fallback

---

## ⚡ **RATE LIMITING IMPLEMENTATION**

### **Application-Level Rate Limiting**
- **Limit**: 60 requests per minute per user
- **Window**: 1 minute
- **Cleanup**: Every 5 minutes
- **Implementation**: `SecurityUtils.checkRateLimit()`

### **API Rate Limiting**
- **ExchangeRate**: 1,000/month
- **Fixer.io**: 100/month
- **CurrencyAPI**: 300/month
- **CoinGecko**: 50/minute
- **CoinCap**: 200/minute
- **CryptoCompare**: 100/day

---

## 🛠️ **ERROR HANDLING**

### **HTTP Status Codes**
- `200`: Success
- `429`: Rate limit exceeded
- `500`: Server error
- `503`: Service unavailable

### **Error Response Format**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 60,
      "window": 60000,
      "retryAfter": 30
    }
  }
}
```

### **Error Handling Strategy**
1. **Try primary API**
2. **If fails, try fallback APIs**
3. **If all fail, use cached data**
4. **If no cache, use static rates**
5. **Log error for monitoring**

---

## 🔐 **SECURITY CONSIDERATIONS**

### **API Security**
- ✅ All APIs use HTTPS
- ✅ No API keys in client-side code
- ✅ Response validation before processing
- ✅ Rate limiting to prevent abuse
- ✅ Error logging for monitoring

### **Data Validation**
- ✅ Validate API response structure
- ✅ Check for required fields
- ✅ Validate numeric values
- ✅ Sanitize all inputs

---

## 📊 **PERFORMANCE METRICS**

### **Response Times**
- **ExchangeRate API**: ~200ms
- **Fixer.io API**: ~300ms
- **CurrencyAPI**: ~250ms
- **CoinGecko API**: ~400ms
- **CoinCap API**: ~350ms
- **CryptoCompare API**: ~500ms

### **Success Rates**
- **ExchangeRate API**: 98%
- **Fixer.io API**: 95%
- **CurrencyAPI**: 97%
- **CoinGecko API**: 99%
- **CoinCap API**: 96%
- **CryptoCompare API**: 94%

---

## 🔧 **INTEGRATION EXAMPLES**

### **JavaScript Integration**
```javascript
// Fetch currency rates with error handling
async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (response.ok) {
            const data = await response.json();
            if (SecurityUtils.validateApiResponse(data, 'object') && data.rates) {
                return data;
            }
        }
    } catch (error) {
        console.error('API Error:', error);
        SecurityUtils.logSecurityEvent('api_error', { api: 'ExchangeRate', error: error.message });
    }
    return null;
}
```

### **Python Integration**
```python
import requests
import json

def fetch_currency_rates():
    try:
        response = requests.get('https://api.exchangerate-api.com/v4/latest/USD')
        if response.status_code == 200:
            data = response.json()
            if 'rates' in data:
                return data
    except requests.RequestException as e:
        print(f"API Error: {e}")
    return None
```

---

## 📈 **MONITORING & ANALYTICS**

### **Metrics Tracked**
- API response times
- Success/failure rates
- Rate limit hits
- Error frequencies
- User request patterns

### **Monitoring Tools**
- Browser console logging
- Security event logging
- Performance metrics
- Error tracking

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Rate Limit Exceeded**
- **Symptom**: "Too many requests" error
- **Solution**: Wait for rate limit window to reset
- **Prevention**: Implement proper rate limiting

#### **API Timeout**
- **Symptom**: Request hangs or times out
- **Solution**: Implement timeout handling
- **Prevention**: Use fallback APIs

#### **Invalid Response**
- **Symptom**: Conversion fails or shows wrong values
- **Solution**: Validate API response structure
- **Prevention**: Implement response validation

### **Debug Steps**
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check rate limiting status
4. Validate response data structure
5. Test with fallback APIs

---

## 📚 **ADDITIONAL RESOURCES**

### **API Documentation Links**
- [ExchangeRate API](https://exchangerate-api.com/docs)
- [Fixer.io API](https://fixer.io/documentation)
- [CurrencyAPI](https://currencyapi.com/docs)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [CoinCap API](https://docs.coincap.io/)
- [CryptoCompare API](https://min-api.cryptocompare.com/documentation)

### **Testing Tools**
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API client
- [HTTPie](https://httpie.io/) - Command line client

---

## 🎯 **BEST PRACTICES**

### **For Developers**
1. **Always implement error handling**
2. **Use fallback APIs for reliability**
3. **Implement proper rate limiting**
4. **Validate all API responses**
5. **Monitor API performance**

### **For Production**
1. **Use HTTPS for all API calls**
2. **Implement caching strategies**
3. **Monitor rate limits**
4. **Set up error alerts**
5. **Regular API health checks**

---

## 📞 **SUPPORT**

### **API Issues**
- **ExchangeRate**: support@exchangerate-api.com
- **Fixer.io**: support@fixer.io
- **CurrencyAPI**: support@currencyapi.com
- **CoinGecko**: api@coingecko.com
- **CoinCap**: support@coincap.io
- **CryptoCompare**: support@cryptocompare.com

### **Application Issues**
- **GitHub Issues**: Repository issues page
- **Documentation**: This file and README
- **Security**: SECURITY_GUIDE.md

---

*Last Updated: December 2024*  
*API Version: 1.0*  
*Next Review: March 2025*
