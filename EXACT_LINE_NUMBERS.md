# 📍 EXACT LINE NUMBERS TO FIX

## 🎯 File 1: docs/mobile.html (Line 1409 and 1480)

### Line 1409 - Change:
**Current:**
```javascript
function convertLinear(value, fromUnit, toUnit, category) {
```
**Should be:**
```javascript
function convertLinear(value, fromUnit, toUnit, categoryName) {
```

### Line 1480 - Change:
**Current:**
```javascript
const factors = conversionFactors[category] || {};
```
**Should be:**
```javascript
const factors = conversionFactors[categoryName] || {};
```

---

## 🎯 File 2: SmartUnitConverterExpo/src/services/ConversionService.js

### Line 13 - ADD after line 10:
**Find line 10:**
```javascript
    this.CRYPTO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
}
```
**Add this line before the closing brace:**
```javascript
    this.CRYPTO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Initialize categories after constructor
    this.initCategories();
}
```

### Line 17 - CHANGE:
**Find line 17:**
```javascript
  // Comprehensive conversion data with 15+ categories and 120+ units
  categories = {
```
**Change to:**
```javascript
  // Initialize comprehensive conversion data with 15+ categories and 120+ units
  initCategories() {
    this.categories = {
```

### Line 414 - ADD closing braces:
**Find line 413 (the end of categories object):**
```javascript
    }
  };

  // Load currency rates from API
```
**Change to:**
```javascript
    }
  };
  }

  // Load currency rates from API
```

---

## 📋 Summary

| File | Line | What to Do |
|------|------|------------|
| docs/mobile.html | 1409 | Change `category` → `categoryName` |
| docs/mobile.html | 1480 | Change `category` → `categoryName` |
| ConversionService.js | 13 | Add `this.initCategories();` |
| ConversionService.js | 17 | Change `categories = {` → `initCategories() { this.categories = {` |
| ConversionService.js | 414 | Add closing braces `}` `}` |

**That's it! Just 5 changes total!**


