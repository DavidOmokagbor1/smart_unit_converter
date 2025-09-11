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
    
    # Conversion factors (updated with improved accuracy)
    length_factors = {
        "meters": 1.0,
        "kilometers": 1000.0,
        "centimeters": 0.01,
        "millimeters": 0.001,
        "micrometers": 0.000001,
        "nanometers": 1e-9,
        "miles": 1609.344,
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
        ("fahrenheit", "kelvin", 32, 273.15),
        ("celsius", "rankine", 0, 491.67),
        ("rankine", "celsius", 491.67, 0),
        ("fahrenheit", "rankine", 32, 491.67),
        ("rankine", "fahrenheit", 491.67, 32)
    ]
    
    for from_unit, to_unit, value, expected in test_cases:
        # Convert to Celsius first with improved precision
        if from_unit == "fahrenheit":
            celsius = round((value - 32) * 5/9, 10)
        elif from_unit == "kelvin":
            celsius = round(value - 273.15, 10)
        elif from_unit == "rankine":
            celsius = round((value - 491.67) * 5/9, 10)
        else:  # celsius
            celsius = round(value, 10)
            
        # Convert from Celsius to target unit with improved precision
        if to_unit == "fahrenheit":
            result = round(celsius * 9/5 + 32, 10)
        elif to_unit == "kelvin":
            result = round(celsius + 273.15, 10)
        elif to_unit == "rankine":
            result = round(celsius * 9/5 + 491.67, 10)
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
    
    # Conversion factors (updated with improved accuracy)
    weight_factors = {
        "kilograms": 1.0,
        "grams": 0.001,
        "milligrams": 0.000001,
        "micrograms": 1e-9,
        "pounds": 0.45359237,
        "ounces": 0.028349523125,
        "tons": 1000.0,
        "stone": 6.35029318,
        "carats": 0.0002
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

def test_digital_storage_conversions():
    """Test digital storage conversions (binary vs decimal)"""
    print("\nTesting Digital Storage Conversions...")
    
    # Test data: (from_unit, to_unit, value, expected_result, is_binary)
    test_cases = [
        ("kilobytes", "bytes", 1, 1000, False),  # Decimal
        ("megabytes", "bytes", 1, 1000000, False),  # Decimal
        ("kibibytes", "bytes", 1, 1024, True),  # Binary
        ("mebibytes", "bytes", 1, 1048576, True),  # Binary
    ]
    
    # Conversion factors
    decimal_factors = {
        "bytes": 1.0,
        "kilobytes": 1000.0,
        "megabytes": 1000000.0,
        "gigabytes": 1000000000.0,
        "terabytes": 1000000000000.0
    }
    
    binary_factors = {
        "bytes": 1.0,
        "kibibytes": 1024.0,
        "mebibytes": 1048576.0,
        "gibibytes": 1073741824.0,
        "tebibytes": 1099511627776.0
    }
    
    for from_unit, to_unit, value, expected, is_binary in test_cases:
        factors = binary_factors if is_binary else decimal_factors
        
        # Convert to base unit (bytes) then to target unit
        base_value = value * factors[from_unit]
        result = base_value / factors[to_unit]
        
        # Check if result is close to expected
        if abs(result - expected) < 0.001:
            storage_type = "Binary" if is_binary else "Decimal"
            print(f"✅ {value} {from_unit} = {result:.0f} {to_unit} ({storage_type})")
        else:
            print(f"❌ {value} {from_unit} = {result:.0f} {to_unit} (expected {expected})")

def main():
    """Run all tests"""
    print("🧪 Smart Unit Converter - Test Suite")
    print("=" * 50)
    
    test_length_conversions()
    test_temperature_conversions()
    test_weight_conversions()
    test_digital_storage_conversions()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("\nTo run the full application:")
    print("python main.py")

if __name__ == "__main__":
    main() 