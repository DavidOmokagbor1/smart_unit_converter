/**
 * HomeScreen - Main conversion screen for Expo
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
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversionService from '../services/ConversionService';

export default function HomeScreen() {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({});
  const [loading, setLoading] = useState(false);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [showFromUnitDropdown, setShowFromUnitDropdown] = useState(false);
  const [showToUnitDropdown, setShowToUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const cats = ConversionService.getCategories();
      setCategories(cats);
      
      // Load favorites from storage
      const savedFavorites = await AsyncStorage.getItem('favoriteCategories');
      if (savedFavorites) {
        setFavoriteCategories(JSON.parse(savedFavorites));
      } else {
        // Set default favorites
        const defaultFavorites = ['length', 'weight', 'temperature', 'currency'];
        setFavoriteCategories(defaultFavorites);
        await AsyncStorage.setItem('favoriteCategories', JSON.stringify(defaultFavorites));
      }
      
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
      
      const formattedResult = convertedValue.toFixed(6);
      setResult(formattedResult);
      
      // Save to history
      await saveToHistory(fromValue, fromUnit, formattedResult, toUnit, currentCategory);
    } catch (error) {
      console.error('Conversion error:', error);
      Alert.alert('Error', 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (fromValue, fromUnit, toValue, toUnit, category) => {
    try {
      const historyEntry = {
        id: Date.now().toString(),
        fromValue: parseFloat(fromValue),
        fromUnit,
        toValue: parseFloat(toValue),
        toUnit,
        category,
        timestamp: Date.now(),
      };

      const existingHistory = await AsyncStorage.getItem('conversionHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.unshift(historyEntry);
      
      // Keep only last 100 entries
      if (history.length > 100) {
        history.splice(100);
      }
      
      await AsyncStorage.setItem('conversionHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const quickConvert = async (fromUnitKey, toUnitKey, value) => {
    // Find the category that contains these units
    let targetCategory = null;
    for (const [categoryKey, categoryData] of Object.entries(ConversionService.categories)) {
      if (categoryData.units[fromUnitKey] && categoryData.units[toUnitKey]) {
        targetCategory = categoryKey;
        break;
      }
    }

    if (targetCategory) {
      setCurrentCategory(targetCategory);
      setFromUnit(fromUnitKey);
      setToUnit(toUnitKey);
      setFromValue(value.toString());
      
      // Perform the conversion
      try {
        const convertedValue = await ConversionService.convert(
          value,
          fromUnitKey,
          toUnitKey,
          targetCategory
        );
        setResult(convertedValue.toFixed(6));
        await saveToHistory(value, fromUnitKey, convertedValue.toFixed(6), toUnitKey, targetCategory);
      } catch (error) {
        console.error('Quick convert error:', error);
      }
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

  const addToFavorites = async (categoryKey) => {
    if (!favoriteCategories.includes(categoryKey)) {
      const newFavorites = [...favoriteCategories, categoryKey];
      setFavoriteCategories(newFavorites);
      await AsyncStorage.setItem('favoriteCategories', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = async (categoryKey) => {
    const newFavorites = favoriteCategories.filter(key => key !== categoryKey);
    setFavoriteCategories(newFavorites);
    await AsyncStorage.setItem('favoriteCategories', JSON.stringify(newFavorites));
  };

  const isFavorite = (categoryKey) => {
    return favoriteCategories.includes(categoryKey);
  };

  const getCurrentCategoryName = () => {
    const category = categories.find(cat => cat.key === currentCategory);
    return category ? category.name : 'Select Category';
  };


  const renderCategoryButton = ({ item: category }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
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
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => isFavorite(category.key) ? removeFromFavorites(category.key) : addToFavorites(category.key)}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorite(category.key) ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
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
      {/* Smart Converter Section */}
      <View style={styles.converterSection}>
        <Text style={styles.converterTitle}>Smart Unit Converter</Text>
        
        {/* Category Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownButtonText}>{getCurrentCategoryName()}</Text>
            <Text style={styles.dropdownArrow}>{showCategoryDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showCategoryDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.dropdownItem,
                      currentCategory === category.key && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      selectCategory(category.key);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.dropdownItemText,
                      currentCategory === category.key && styles.dropdownItemTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

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

        {/* From Unit Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>From Unit</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
          >
            <Text style={styles.dropdownButtonText}>{fromUnit}</Text>
            <Text style={styles.dropdownArrow}>{showFromUnitDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showFromUnitDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                {Object.entries(units).map(([key, data]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.dropdownItem,
                      fromUnit === key && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setFromUnit(key);
                      setShowFromUnitDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      fromUnit === key && styles.dropdownItemTextActive
                    ]}>
                      {key} - {data.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
          <Text style={styles.swapButtonText}>⇅ Swap Units</Text>
        </TouchableOpacity>

        {/* To Unit Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>To Unit</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowToUnitDropdown(!showToUnitDropdown)}
          >
            <Text style={styles.dropdownButtonText}>{toUnit}</Text>
            <Text style={styles.dropdownArrow}>{showToUnitDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showToUnitDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                {Object.entries(units).map(([key, data]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.dropdownItem,
                      toUnit === key && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setToUnit(key);
                      setShowToUnitDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      toUnit === key && styles.dropdownItemTextActive
                    ]}>
                      {key} - {data.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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

      {/* Favorites Section */}
      <View style={styles.favoritesSection}>
        <Text style={styles.sectionTitle}>⭐ Your Favorites</Text>
        <View style={styles.favoritesGrid}>
          {favoriteCategories.map((categoryKey) => {
            const category = categories.find(cat => cat.key === categoryKey);
            if (!category) return null;
            return (
              <TouchableOpacity
                key={categoryKey}
                style={[
                  styles.favoriteCard,
                  currentCategory === categoryKey && styles.favoriteCardActive
                ]}
                onPress={() => selectCategory(categoryKey)}
              >
                <Text style={styles.favoriteIcon}>{category.icon}</Text>
                <Text style={styles.favoriteText}>{category.name}</Text>
                <TouchableOpacity
                  style={styles.removeFavorite}
                  onPress={() => removeFromFavorites(categoryKey)}
                >
                  <Text style={styles.removeFavoriteText}>×</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 15,
  },
  categoryGrid: {
    justifyContent: 'space-between',
  },
  searchInput: {
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
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
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  unitList: {
    maxHeight: 120,
  },
  unitOption: {
    backgroundColor: '#2a2a3e',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 120,
  },
  unitOptionActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
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
    backgroundColor: '#4facfe',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  convertButtonDisabled: {
    backgroundColor: '#666',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#2a2a3e',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  liveRateText: {
    color: '#4facfe',
    fontSize: 14,
    textAlign: 'center',
  },
  suggestionsSection: {
    marginTop: 20,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionButton: {
    width: '48%',
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  favoriteCard: {
    width: '48%',
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  favoriteCardActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  favoriteIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  favoriteText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  converterSection: {
    backgroundColor: '#2a2a3e',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4facfe',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  converterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4facfe',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    color: '#4facfe',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#4facfe',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  dropdownItemActive: {
    backgroundColor: '#4facfe',
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  favoritesSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  removeFavorite: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFavoriteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryContainer: {
    position: 'relative',
    width: '48%',
    marginBottom: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  horizontalScroll: {
    marginTop: 5,
  },
  categoryChip: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  unitChip: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  unitChipActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  unitChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  unitChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
