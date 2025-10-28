/**
 * HomeScreen - Main conversion screen
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
} from 'react-native';
import ConversionService from '../services/ConversionService';

const HomeScreen = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const cats = ConversionService.getCategories();
      setCategories(cats);
      
      const categoryUnits = ConversionService.getUnitsForCategory(currentCategory);
      setUnits(categoryUnits);
      
      // Set default units
      const unitKeys = Object.keys(categoryUnits);
      if (unitKeys.length > 0) {
        setFromUnit(unitKeys[0]);
        setToUnit(unitKeys[1] || unitKeys[0]);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize the app');
    }
  };

  const selectCategory = (categoryKey) => {
    setCurrentCategory(categoryKey);
    const categoryUnits = ConversionService.getUnitsForCategory(categoryKey);
    setUnits(categoryUnits);
    
    // Reset units
    const unitKeys = Object.keys(categoryUnits);
    if (unitKeys.length > 0) {
      setFromUnit(unitKeys[0]);
      setToUnit(unitKeys[1] || unitKeys[0]);
    }
    
    setFromValue('');
    setResult('');
  };

  const performConversion = async () => {
    if (!fromValue || !fromUnit || !toUnit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (fromUnit === toUnit) {
      setResult(fromValue);
      return;
    }

    setLoading(true);
    try {
      const convertedValue = await ConversionService.convert(
        fromValue,
        fromUnit,
        toUnit,
        currentCategory
      );
      
      setResult(convertedValue.toFixed(6));
    } catch (error) {
      console.error('Conversion error:', error);
      Alert.alert('Error', 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    if (result) {
      setFromValue(result);
      setResult('');
    }
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryButton,
        currentCategory === category.key && styles.categoryButtonActive
      ]}
      onPress={() => selectCategory(category.key)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryText,
        currentCategory === category.key && styles.categoryTextActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderUnitOption = (unitKey, unitData) => (
    <TouchableOpacity
      key={unitKey}
      style={[
        styles.unitOption,
        fromUnit === unitKey && styles.unitOptionActive
      ]}
      onPress={() => setFromUnit(unitKey)}
    >
      <Text style={[
        styles.unitText,
        fromUnit === unitKey && styles.unitTextActive
      ]}>
        {unitKey} - {unitData.name}
      </Text>
    </TouchableOpacity>
  );

  const renderToUnitOption = (unitKey, unitData) => (
    <TouchableOpacity
      key={unitKey}
      style={[
        styles.unitOption,
        toUnit === unitKey && styles.unitOptionActive
      ]}
      onPress={() => setToUnit(unitKey)}
    >
      <Text style={[
        styles.unitText,
        toUnit === unitKey && styles.unitTextActive
      ]}>
        {unitKey} - {unitData.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map(renderCategoryButton)}
        </View>
      </View>

      {/* Converter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unit Converter</Text>
        
        {/* From Value Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Value</Text>
          <TextInput
            style={styles.textInput}
            value={fromValue}
            onChangeText={setFromValue}
            placeholder="Enter value"
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>

        {/* From Unit Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>From Unit</Text>
          <ScrollView style={styles.unitList} horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(units).map(([key, data]) => renderUnitOption(key, data))}
          </ScrollView>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
          <Text style={styles.swapButtonText}>⇅ Swap</Text>
        </TouchableOpacity>

        {/* To Unit Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>To Unit</Text>
          <ScrollView style={styles.unitList} horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(units).map(([key, data]) => renderToUnitOption(key, data))}
          </ScrollView>
        </View>

        {/* Convert Button */}
        <TouchableOpacity
          style={[styles.convertButton, loading && styles.convertButtonDisabled]}
          onPress={performConversion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.convertButtonText}>Convert</Text>
          )}
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {fromValue} {fromUnit} = {result} {toUnit}
            </Text>
            {(currentCategory === 'currency' || currentCategory === 'crypto') && (
              <Text style={styles.liveRateText}>💱 Live Rate</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  section: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#667eea',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#667eea',
    shadowOpacity: 0.4,
    elevation: 6,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    padding: 18,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unitList: {
    maxHeight: 120,
  },
  unitOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    minWidth: 120,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unitOptionActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#667eea',
    shadowOpacity: 0.4,
    elevation: 6,
  },
  unitText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  unitTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  swapButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  swapButtonText: {
    color: '#4facfe',
    fontSize: 16,
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(102, 126, 234, 0.5)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  convertButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: 'rgba(102, 126, 234, 0.5)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#667eea',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  liveRateText: {
    color: '#4facfe',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
