# 🍳 Cooking Units Integration Guide

## How to Add Cooking Units to Your Stunning Converter

### Step 1: Add Cooking Categories
In `stunning_converter.html`, find the `categories` object and add these three new categories:

```javascript
// Add these after the "Frequency" category
"Cooking Volume": {
    icon: "fas fa-utensils",
    units: {
        "cups": 1.0,
        "tablespoons": 0.0625,
        "teaspoons": 0.0208333,
        "fluid_ounces": 0.125,
        "pints": 2.0,
        "quarts": 4.0,
        "gallons": 16.0,
        "milliliters": 236.588,
        "liters": 0.236588,
        "cubic_inches": 14.4375,
        "cubic_centimeters": 236.588
    }
},
"Cooking Weight": {
    icon: "fas fa-weight-hanging", 
    units: {
        "ounces": 1.0,
        "pounds": 16.0,
        "grams": 28.3495,
        "kilograms": 28349.5,
        "cups_flour": 4.25,
        "cups_sugar": 7.0,
        "cups_butter": 8.0,
        "tablespoons_butter": 0.5,
        "teaspoons_salt": 5.69
    }
},
"Baking Temperature": {
    icon: "fas fa-thermometer-half",
    units: {
        "fahrenheit": "F",
        "celsius": "C", 
        "gas_mark_1": 275,
        "gas_mark_2": 300,
        "gas_mark_3": 325,
        "gas_mark_4": 350,
        "gas_mark_5": 375,
        "gas_mark_6": 400,
        "gas_mark_7": 425,
        "gas_mark_8": 450,
        "gas_mark_9": 475
    }
}
```

### Step 2: Add Baking Temperature Conversion Function
Add this function after the `convertTemperature` function:

```javascript
function convertBakingTemperature(value, fromUnit, toUnit) {
    // Handle edge cases
    if (fromUnit === toUnit) return value;
    
    // Convert to Fahrenheit first (standard for baking)
    let fahrenheit;
    if (fromUnit === "celsius") {
        fahrenheit = parseFloat((value * 9/5 + 32).toFixed(10));
    } else if (fromUnit === "fahrenheit") {
        fahrenheit = parseFloat(value.toFixed(10));
    } else if (fromUnit.startsWith("gas_mark_")) {
        // Gas mark to Fahrenheit conversion
        const gasMark = parseInt(fromUnit.split("_")[2]);
        fahrenheit = 275 + (gasMark - 1) * 25; // Gas mark 1 = 275°F, each mark = +25°F
    } else {
        fahrenheit = parseFloat(value.toFixed(10));
    }

    // Convert from Fahrenheit to target unit
    if (toUnit === "celsius") {
        return parseFloat(((fahrenheit - 32) * 5/9).toFixed(10));
    } else if (toUnit === "fahrenheit") {
        return fahrenheit;
    } else if (toUnit.startsWith("gas_mark_")) {
        // Fahrenheit to gas mark conversion
        const gasMark = Math.round((fahrenheit - 275) / 25) + 1;
        return Math.max(1, Math.min(9, gasMark)); // Clamp between 1-9
    } else {
        return fahrenheit;
    }
}
```

### Step 3: Update Conversion Logic
In the `convert()` function, add this condition:

```javascript
} else if (category === "Baking Temperature") {
    result = convertBakingTemperature(value, fromUnit, toUnit);
```

### Step 4: Test Your Changes
1. Open `stunning_converter.html` in your browser
2. Click on "Cooking Volume", "Cooking Weight", or "Baking Temperature"
3. Try converting between different units

## 🎯 What You'll Get:

### Cooking Volume Conversions:
- Cups ↔ Tablespoons ↔ Teaspoons
- Fluid ounces, pints, quarts, gallons
- Metric conversions (milliliters, liters)

### Cooking Weight Conversions:
- Ounces ↔ Pounds ↔ Grams
- Ingredient-specific conversions (flour, sugar, butter)
- Salt and other common ingredients

### Baking Temperature Conversions:
- Fahrenheit ↔ Celsius ↔ Gas Mark
- Perfect for oven temperature conversions
- Gas mark 1-9 with accurate temperature mapping

## 🚀 Next Enhancement Ideas:

1. **Add Recipe Scaling** - Scale entire recipes up or down
2. **Common Ingredient Conversions** - Quick access to popular conversions
3. **Nutritional Information** - Add calorie and macro conversions
4. **International Units** - Add European and Asian cooking units

## 📝 Quick Reference Conversions:

- 1 cup flour = 120 grams
- 1 cup sugar = 200 grams  
- 1 cup butter = 227 grams
- 1 tablespoon = 3 teaspoons
- 1 cup = 16 tablespoons
- Gas Mark 4 = 350°F = 175°C

---

**Happy Cooking! 🍳✨** 