#!/usr/bin/env python3
"""
Simple test script for the Smart Unit Converter
Tests basic conversion functionality without GUI
"""

def test_length_conversions():
    """Test length conversions"""
    print("Testing Length Conversions...")
    
    # Test data: (from_unit, to_unit, value, expected_result)
    test_cases = [
        ("meters", "feet", 1, 3.28084),
        ("kilometers", "miles", 1, 0.621371),
        ("inches", "centimeters", 1, 2.54),
        ("yards", "meters", 1, 0.9144)
    ]
    
    # Conversion factors (simplified from main.py)
    length_factors = {
        "meters": 1.0,
        "kilometers": 1000.0,
        "centimeters": 0.01,
        "millimeters": 0.001,
        "miles": 1609.34,
        "yards": 0.9144,
        "feet": 0.3048,
        "inches": 0.0254
    }
    
    for from_unit, to_unit, value, expected in test_cases:
        # Convert to base unit (meters) then to target unit
        base_value = value * length_factors[from_unit]
        result = base_value / length_factors[to_unit]
        
        # Check if result is close to expected (allowing for floating point precision)
        if abs(result - expected) < 0.001:
            print(f"✅ {value} {from_unit} = {result:.6f} {to_unit}")
        else:
            print(f"❌ {value} {from_unit} = {result:.6f} {to_unit} (expected {expected})")

def test_temperature_conversions():
    """Test temperature conversions"""
    print("\nTesting Temperature Conversions...")
    
    # Test data: (from_unit, to_unit, value, expected_result)
    test_cases = [
        ("celsius", "fahrenheit", 0, 32),
        ("fahrenheit", "celsius", 32, 0),
        ("celsius", "kelvin", 0, 273.15),
        ("kelvin", "celsius", 273.15, 0),
        ("fahrenheit", "kelvin", 32, 273.15)
    ]
    
    for from_unit, to_unit, value, expected in test_cases:
        # Convert to Celsius first
        if from_unit == "fahrenheit":
            celsius = (value - 32) * 5/9
        elif from_unit == "kelvin":
            celsius = value - 273.15
        else:  # celsius
            celsius = value
            
        # Convert from Celsius to target unit
        if to_unit == "fahrenheit":
            result = celsius * 9/5 + 32
        elif to_unit == "kelvin":
            result = celsius + 273.15
        else:  # celsius
            result = celsius
            
        # Check if result is close to expected
        if abs(result - expected) < 0.01:
            print(f"✅ {value}°{from_unit[0].upper()} = {result:.2f}°{to_unit[0].upper()}")
        else:
            print(f"❌ {value}°{from_unit[0].upper()} = {result:.2f}°{to_unit[0].upper()} (expected {expected})")

def test_weight_conversions():
    """Test weight conversions"""
    print("\nTesting Weight Conversions...")
    
    # Test data: (from_unit, to_unit, value, expected_result)
    test_cases = [
        ("kilograms", "pounds", 1, 2.20462),
        ("pounds", "kilograms", 1, 0.453592),
        ("grams", "ounces", 28.3495, 1),
        ("tons", "kilograms", 1, 1000)
    ]
    
    # Conversion factors
    weight_factors = {
        "kilograms": 1.0,
        "grams": 0.001,
        "pounds": 0.453592,
        "ounces": 0.0283495,
        "tons": 1000.0
    }
    
    for from_unit, to_unit, value, expected in test_cases:
        # Convert to base unit (kilograms) then to target unit
        base_value = value * weight_factors[from_unit]
        result = base_value / weight_factors[to_unit]
        
        # Check if result is close to expected
        if abs(result - expected) < 0.001:
            print(f"✅ {value} {from_unit} = {result:.6f} {to_unit}")
        else:
            print(f"❌ {value} {from_unit} = {result:.6f} {to_unit} (expected {expected})")

def main():
    """Run all tests"""
    print("🧪 Smart Unit Converter - Test Suite")
    print("=" * 50)
    
    test_length_conversions()
    test_temperature_conversions()
    test_weight_conversions()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("\nTo run the full application:")
    print("python main.py")

if __name__ == "__main__":
    main() 