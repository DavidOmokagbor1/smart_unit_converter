/**
 * HomeScreen - Exact replica of mobile.html design
 * Beautiful glassmorphism mobile interface
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ConversionService from '../services/ConversionService';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [loading, setLoading] = useState(false);
  const [showFromUnitDropdown, setShowFromUnitDropdown] = useState(false);
  const [showToUnitDropdown, setShowToUnitDropdown] = useState(false);

  // Categories with icons (matching mobile.html)
  const categories = [
    { id: 'length', name: 'Length', icon: '📏' },
    { id: 'weight', name: 'Weight', icon: '⚖️' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'area', name: 'Area', icon: '📐' },
    { id: 'volume', name: 'Volume', icon: '🧪' },
    { id: 'time', name: 'Time', icon: '⏰' },
    { id: 'speed', name: 'Speed', icon: '🚀' },
    { id: 'pressure', name: 'Pressure', icon: '💨' },
    { id: 'energy', name: 'Energy', icon: '⚡' },
  ];

  // Get units for current category
  const currentUnits = Object.entries(ConversionService.categories[currentCategory]?.units || {}).map(([key, data]) => ({
    id: key,
    name: data.name,
    symbol: key,
  }));

  useEffect(() => {
    if (currentUnits.length > 0) {
      setFromUnit(currentUnits[0].id);
      setToUnit(currentUnits[1]?.id || currentUnits[0].id);
    }
  }, [currentCategory]);

  const handleConvert = async () => {
    if (!fromValue || !fromUnit || !toUnit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    setLoading(true);
    try {
      const convertedValue = await ConversionService.convert(
        value,
        fromUnit,
        toUnit,
        currentCategory
      );
      setResult(convertedValue.toString());
    } catch (error) {
      Alert.alert('Error', 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setFromValue('');
      setResult('');
  };

  return (
    <View style={styles.container}>
      {/* Mobile Header */}
      <View style={styles.mobileHeader}>
        <Text style={styles.mobileTitle}>Unit Converter</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
    </View>

      <ScrollView style={styles.mobileContent} showsVerticalScrollIndicator={false}>
        {/* Converter Section */}
        <View style={styles.mobileConverter}>
          <Text style={styles.converterTitle}>⚡ Convert Units</Text>
          
          {/* Value Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Value</Text>
            <TextInput
              style={styles.mobileInput}
              placeholder="Enter value"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={fromValue}
              onChangeText={setFromValue}
              keyboardType="numeric"
            />
          </View>

          {/* From Unit */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>From</Text>
    <TouchableOpacity
              style={styles.unitSelector}
              onPress={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
            >
              <Text style={styles.unitSelectorText}>
                {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
      </Text>
              <Text style={styles.arrow}>▼</Text>
    </TouchableOpacity>
            
            {showFromUnitDropdown && (
              <View style={styles.dropdown}>
                {currentUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.dropdownItem,
                      fromUnit === unit.id && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setFromUnit(unit.id);
                      setShowFromUnitDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownText,
                      fromUnit === unit.id && styles.dropdownTextActive
                    ]}>
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
        </View>

          {/* To Unit */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>To</Text>
          <TouchableOpacity 
              style={styles.unitSelector}
              onPress={() => setShowToUnitDropdown(!showToUnitDropdown)}
            >
              <Text style={styles.unitSelectorText}>
                {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
                        </Text>
              <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

            {showToUnitDropdown && (
              <View style={styles.dropdown}>
                {currentUnits.map((unit) => (
                    <TouchableOpacity
                    key={unit.id}
                      style={[
                      styles.dropdownItem,
                      toUnit === unit.id && styles.dropdownItemActive
                      ]}
                      onPress={() => {
                      setToUnit(unit.id);
                        setShowToUnitDropdown(false);
                      }}
                    >
                        <Text style={[
                      styles.dropdownText,
                      toUnit === unit.id && styles.dropdownTextActive
                    ]}>
                      {unit.name}
                        </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
        </View>

        {/* Convert Button */}
        <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
            disabled={loading}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.convertButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
        >
          {loading ? (
                <ActivityIndicator color="#ffffff" />
          ) : (
                <Text style={styles.convertButtonText}>🔄 Convert</Text>
          )}
            </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                {result} {currentUnits.find(u => u.id === toUnit)?.symbol || ''}
            </Text>
          </View>
        )}
                </View>

        {/* Category Selector */}
        <View style={styles.mobileCategorySelector}>
          <Text style={styles.categoryTitle}>📋 Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
                <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  currentCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryChange(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  currentCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
                </TouchableOpacity>
            ))}
          </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  mobileHeader: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  mobileContent: {
    flex: 1,
    paddingBottom: 20,
  },
  mobileConverter: {
    margin: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  converterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#f093fb',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f093fb',
    marginBottom: 6,
  },
  mobileInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  unitSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitSelectorText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dropdown: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
  },
  dropdownText: {
    fontSize: 14,
    color: '#ffffff',
  },
  dropdownTextActive: {
    color: '#f093fb',
    fontWeight: '600',
  },
  convertButton: {
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  convertButtonGradient: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4facfe',
    textAlign: 'center',
  },
  mobileCategorySelector: {
    margin: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#f093fb',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 10,
    width: (width - 72) / 3,
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 70,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#f093fb',
  },
  categoryIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#f093fb',
    fontWeight: '600',
  },
});