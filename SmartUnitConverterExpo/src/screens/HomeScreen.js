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
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFromUnitDropdown, setShowFromUnitDropdown] = useState(false);
  const [showToUnitDropdown, setShowToUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [inputError, setInputError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentConversions, setRecentConversions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [fromUnitSearch, setFromUnitSearch] = useState('');
  const [toUnitSearch, setToUnitSearch] = useState('');
  const [favoriteUnits, setFavoriteUnits] = useState([]);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    loadRecentConversions();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favoriteUnits');
      if (favoritesData) {
        setFavoriteUnits(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem('favoriteUnits', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (unitKey, unitName, category) => {
    const favoriteKey = `${category}-${unitKey}`;
    const isFavorite = favoriteUnits.some(fav => fav.key === favoriteKey);
    
    let newFavorites;
    if (isFavorite) {
      newFavorites = favoriteUnits.filter(fav => fav.key !== favoriteKey);
    } else {
      newFavorites = [...favoriteUnits, {
        key: favoriteKey,
        unitKey,
        unitName,
        category,
        categoryName: getCurrentCategoryName()
      }];
    }
    
    setFavoriteUnits(newFavorites);
    await saveFavorites(newFavorites);
  };

  const isUnitFavorite = (unitKey, category) => {
    const favoriteKey = `${category}-${unitKey}`;
    return favoriteUnits.some(fav => fav.key === favoriteKey);
  };


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
    if (!fromUnit || !toUnit) {
      Alert.alert('Error', 'Please select both units');
      return;
    }

    if (!validateInput(fromValue)) {
      return;
    }

    if (fromUnit === toUnit) {
      setResult(fromValue);
      return;
    }

    setLoading(true);
    try {
      const convertedValue = await ConversionService.convert(
        parseFloat(fromValue),
        fromUnit,
        toUnit,
        currentCategory
      );
      
      const formattedResult = convertedValue.toFixed(6);
      setResult(formattedResult);
      
      // Save to history
      await saveToHistory(parseFloat(fromValue), fromUnit, formattedResult, toUnit, currentCategory);
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


  const getCurrentCategoryName = () => {
    const category = categories.find(cat => cat.key === currentCategory);
    return category ? category.name : 'Select Category';
  };

  const validateInput = (value) => {
    if (!value || value.trim() === '') {
      setInputError('Please enter a value to convert');
      return false;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setInputError('Please enter a valid number (e.g., 100, 3.14, 1/2)');
      return false;
    }
    
    if (numValue < 0) {
      setInputError('Please enter a positive number (negative values not supported)');
      return false;
    }
    
    if (numValue > 1e15) {
      setInputError('Value too large. Please enter a number less than 1e15');
      return false;
    }
    
    setInputError('');
    return true;
  };

  const getHelpfulSuggestions = (error) => {
    const suggestions = {
      'Please enter a value to convert': '💡 Try entering a number like 100, 3.14, or 1/2',
      'Please enter a valid number (e.g., 100, 3.14, 1/2)': '💡 Make sure you\'re entering only numbers and decimal points',
      'Please enter a positive number (negative values not supported)': '💡 This converter only works with positive values',
      'Value too large. Please enter a number less than 1e15': '💡 Try using scientific notation (e.g., 1e6 for 1,000,000)',
      'Please select a unit': '💡 Choose a unit from the dropdown menu above',
      'Please select both units': '💡 Select both "from" and "to" units to convert'
    };
    return suggestions[error] || '💡 Check your input and try again';
  };

  const handleInputChange = (value) => {
    setFromValue(value);
    if (inputError) {
      setInputError('');
    }
  };

  const searchUnits = (query) => {
    if (!query.trim()) return [];
    
    const searchResults = [];
    
    // Search in current category units
    Object.entries(units).forEach(([key, data]) => {
      if (key.toLowerCase().includes(query.toLowerCase()) ||
          data.name.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          key,
          data,
          category: currentCategory,
          categoryName: getCurrentCategoryName(),
          type: 'unit'
        });
      }
    });
    
    // Search in all categories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          key: category.key,
          data: { name: category.name, icon: category.icon },
          category: category.key,
          categoryName: category.name,
          type: 'category'
        });
      }
    });
    
    return searchResults.slice(0, 10); // Limit to 10 results
  };

  const loadRecentConversions = async () => {
    try {
      const historyData = await AsyncStorage.getItem('conversionHistory');
      if (historyData) {
        const history = JSON.parse(historyData);
        // Get last 5 conversions
        const recent = history.slice(-5).reverse();
        setRecentConversions(recent);
      }
    } catch (error) {
      console.error('Error loading recent conversions:', error);
    }
  };

  const quickConvertFromRecent = async (fromValue, fromUnit, toUnit, category) => {
    setCurrentCategory(category);
    setFromUnit(fromUnit);
    setToUnit(toUnit);
    setFromValue(fromValue.toString());
    
    try {
      const convertedValue = await ConversionService.convert(
        parseFloat(fromValue),
        fromUnit,
        toUnit,
        category
      );
      setResult(convertedValue.toFixed(6));
      await saveToHistory(parseFloat(fromValue), fromUnit, convertedValue.toFixed(6), toUnit, category);
      await loadRecentConversions(); // Refresh recent conversions
    } catch (error) {
      console.error('Quick convert error:', error);
    }
  };

  const filterUnits = (units, searchTerm) => {
    if (!searchTerm.trim()) return Object.entries(units);
    
    return Object.entries(units).filter(([key, data]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getUnitDescription = (unitKey, category) => {
    const descriptions = {
      // Length
      'meter': 'Base unit of length in the metric system',
      'kilometer': '1000 meters, commonly used for distances',
      'centimeter': '1/100 of a meter, used for small measurements',
      'millimeter': '1/1000 of a meter, used for precise measurements',
      'inch': '1/12 of a foot, commonly used in US measurements',
      'foot': '12 inches, used for height and room dimensions',
      'yard': '3 feet, used in sports and construction',
      'mile': '5280 feet, used for long distances',
      'nautical_mile': 'Used in aviation and maritime navigation (1.15 statute miles)',
      'furlong': '1/8 of a mile, used in horse racing',
      'fathom': '6 feet, used for measuring water depth',
      
      // Weight
      'kilogram': 'Base unit of mass in the metric system',
      'gram': '1/1000 of a kilogram, used for small weights',
      'pound': '16 ounces, commonly used in US measurements',
      'ounce': '1/16 of a pound, used for small weights',
      'ton': '2000 pounds, used for heavy weights',
      'metric_ton': '1000 kilograms, used internationally',
      
      // Temperature
      'celsius': 'Water freezes at 0°C, boils at 100°C',
      'fahrenheit': 'Water freezes at 32°F, boils at 212°F',
      'kelvin': 'Absolute temperature scale, 0K = absolute zero',
      
      // Area
      'square_meter': 'Base unit of area in metric system',
      'square_foot': 'Area of a square with 1-foot sides',
      'acre': '43,560 square feet, used for land measurement',
      'hectare': '10,000 square meters, used for large areas',
      
      // Volume
      'liter': 'Base unit of volume in metric system',
      'milliliter': '1/1000 of a liter, used for small volumes',
      'gallon': '4 quarts, used for liquid measurements',
      'quart': '2 pints, used for liquid measurements',
      'pint': '2 cups, used for liquid measurements',
      'cup': '8 fluid ounces, used in cooking',
      'fluid_ounce': '1/8 of a cup, used for small liquid measurements',
      
      // Currency
      'usd': 'US Dollar - Most traded currency globally',
      'eur': 'Euro - Used in European Union countries',
      'gbp': 'British Pound - UK currency',
      'jpy': 'Japanese Yen - Japan currency',
      'cad': 'Canadian Dollar - Canada currency',
      'aud': 'Australian Dollar - Australia currency',
      'chf': 'Swiss Franc - Switzerland currency',
      'cny': 'Chinese Yuan - China currency',
      'inr': 'Indian Rupee - India currency',
      'brl': 'Brazilian Real - Brazil currency',
      
      // Crypto
      'btc': 'Bitcoin - First and largest cryptocurrency',
      'eth': 'Ethereum - Smart contract platform',
      'bnb': 'Binance Coin - Binance exchange token',
      'ada': 'Cardano - Blockchain platform',
      'sol': 'Solana - High-performance blockchain',
      'xrp': 'Ripple - Payment protocol',
      'doge': 'Dogecoin - Meme cryptocurrency',
      'matic': 'Polygon - Ethereum scaling solution',
      'avax': 'Avalanche - Smart contract platform',
      'dot': 'Polkadot - Multi-chain protocol'
    };
    
    return descriptions[unitKey] || `${unitKey} - Unit in ${category} category`;
  };

  const getCategoryDescription = (categoryKey) => {
    const descriptions = {
      'length': 'Measurements of distance and size',
      'weight': 'Measurements of mass and weight',
      'temperature': 'Measurements of heat and cold',
      'area': 'Measurements of surface area',
      'volume': 'Measurements of capacity and space',
      'currency': 'World currencies and exchange rates',
      'crypto': 'Cryptocurrencies and digital assets',
      'time': 'Measurements of duration and time',
      'speed': 'Measurements of velocity and rate',
      'pressure': 'Measurements of force per area',
      'energy': 'Measurements of work and power',
      'data': 'Measurements of digital information'
    };
    
    return descriptions[categoryKey] || `${categoryKey} - Conversion category`;
  };


  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 15,
      fontWeight: '500',
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    inputFocused: {
      borderColor: colors.primary,
      shadowOpacity: 0.2,
    },
    inputError: {
      borderColor: colors.error,
      shadowColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 5,
      marginLeft: 5,
    },
    helpText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
      marginLeft: 5,
      fontStyle: 'italic',
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    searchResults: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: 200,
    },
    searchResultItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchResultIcon: {
      fontSize: 18,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    searchResultText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
    },
    searchResultSubtext: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    recentSection: {
      marginTop: 20,
    },
    recentItem: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    recentText: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
    },
    recentSubtext: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    quickConvertButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    quickConvertButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    dropdownSearchInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 10,
      color: colors.text,
      fontSize: 14,
      margin: 8,
    },
    unitDescription: {
      color: colors.textSecondary,
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 2,
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 6,
      marginLeft: 8,
    },
    favoriteIcon: {
      fontSize: 16,
    },
    favoritesSection: {
      marginTop: 20,
    },
    favoriteItem: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    favoriteText: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
    },
    favoriteSubtext: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    quickSelectButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    quickSelectButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    dropdownContainer: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    dropdownContainerOpen: {
      shadowOpacity: 0.25,
      elevation: 8,
    },
    dropdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    dropdownHeaderText: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    dropdownToggle: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    dropdownList: {
      maxHeight: 200,
      backgroundColor: colors.surface,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemIcon: {
      fontSize: 18,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    dropdownItemText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
    },
    dropdownItemActive: {
      backgroundColor: colors.primary,
    },
    dropdownItemTextActive: {
      color: '#fff',
      fontWeight: 'bold',
    },
    swapButton: {
      backgroundColor: 'transparent',
      padding: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    swapButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    convertButton: {
      backgroundColor: colors.primary,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 25,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    convertButtonDisabled: {
      backgroundColor: colors.textSecondary,
      shadowOpacity: 0.1,
      elevation: 2,
    },
    convertButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    resultContainer: {
      backgroundColor: colors.surface,
      padding: 25,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    resultText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    liveRateText: {
      color: colors.primary,
      fontSize: 14,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    searchSection: {
      marginTop: 20,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      color: colors.text,
      fontSize: 16,
      marginBottom: 15,
    },
    searchResults: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryContainer: {
      width: '48%',
      marginBottom: 10,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryIcon: {
      fontSize: 24,
      marginBottom: 5,
    },
    categoryText: {
      color: colors.text,
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '500',
    },
    categoryTextActive: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });


  const renderCategoryButton = ({ item: category }) => (
    <View style={dynamicStyles.categoryContainer}>
      <TouchableOpacity
        style={[
          dynamicStyles.categoryButton,
          currentCategory === category.key && dynamicStyles.categoryButtonActive
        ]}
        onPress={() => selectCategory(category.key)}
      >
        <Text style={dynamicStyles.categoryIcon}>{category.icon}</Text>
        <Text style={[
          dynamicStyles.categoryText,
          currentCategory === category.key && dynamicStyles.categoryTextActive
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderUnitOption = (unitKey, unitData) => (
    <TouchableOpacity
      key={unitKey}
      style={[
        dynamicStyles.dropdownItem,
        fromUnit === unitKey && dynamicStyles.dropdownItemActive
      ]}
      onPress={() => setFromUnit(unitKey)}
    >
      <Text style={[
        dynamicStyles.dropdownItemText,
        fromUnit === unitKey && dynamicStyles.dropdownItemTextActive
      ]}>
        {unitKey} - {unitData.name}
      </Text>
    </TouchableOpacity>
  );

  const renderToUnitOption = (unitKey, unitData) => (
    <TouchableOpacity
      key={unitKey}
      style={[
        dynamicStyles.dropdownItem,
        toUnit === unitKey && dynamicStyles.dropdownItemActive
      ]}
      onPress={() => setToUnit(unitKey)}
    >
      <Text style={[
        dynamicStyles.dropdownItemText,
        toUnit === unitKey && dynamicStyles.dropdownItemTextActive
      ]}>
        {unitKey} - {unitData.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Smart Converter Section */}
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.sectionTitle}>Smart Unit Converter</Text>
        
        {/* Search Section */}
        <View style={dynamicStyles.searchContainer}>
          <Text style={dynamicStyles.sectionSubtitle}>🔍 Quick Search</Text>
          <TextInput
            style={dynamicStyles.searchInput}
            placeholder="Search units or categories..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          />
          {showSearch && searchQuery && (
            <View style={dynamicStyles.searchResults}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {searchUnits(searchQuery).map((item, index) => (
                  <TouchableOpacity
                    key={`${item.type}-${item.key}-${index}`}
                    style={dynamicStyles.searchResultItem}
                    onPress={() => {
                      if (item.type === 'category') {
                        selectCategory(item.key);
                        setSearchQuery('');
                        setShowSearch(false);
                      } else if (item.type === 'unit') {
                        setFromUnit(item.key);
                        setSearchQuery('');
                        setShowSearch(false);
                      }
                    }}
                  >
                    <Text style={dynamicStyles.searchResultIcon}>
                      {item.type === 'category' ? '📁' : '📏'}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={dynamicStyles.searchResultText}>
                        {item.data.name}
                      </Text>
                      <Text style={dynamicStyles.searchResultSubtext}>
                        {item.type === 'category' 
                          ? getCategoryDescription(item.key)
                          : getUnitDescription(item.key, item.category)
                        }
                      </Text>
                    </View>
                    {item.type === 'unit' && (
                      <TouchableOpacity
                        style={dynamicStyles.favoriteButton}
                        onPress={() => toggleFavorite(item.key, item.data.name, item.category)}
                      >
                        <Text style={dynamicStyles.favoriteIcon}>
                          {isUnitFavorite(item.key, item.category) ? '⭐' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Favorites Section */}
        {favoriteUnits.length > 0 && (
          <View style={dynamicStyles.favoritesSection}>
            <Text style={dynamicStyles.sectionSubtitle}>⭐ Favorite Units</Text>
            {favoriteUnits.map((favorite, index) => (
              <View key={favorite.key} style={dynamicStyles.favoriteItem}>
                <View style={{ flex: 1 }}>
                  <Text style={dynamicStyles.favoriteText}>
                    {favorite.unitName} ({favorite.unitKey})
                  </Text>
                  <Text style={dynamicStyles.favoriteSubtext}>
                    {favorite.categoryName}
                  </Text>
                </View>
                <TouchableOpacity
                  style={dynamicStyles.quickSelectButton}
                  onPress={() => {
                    setFromUnit(favorite.unitKey);
                    setCurrentCategory(favorite.category);
                  }}
                >
                  <Text style={dynamicStyles.quickSelectButtonText}>Select</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={dynamicStyles.favoriteButton}
                  onPress={() => toggleFavorite(favorite.unitKey, favorite.unitName, favorite.category)}
                >
                  <Text style={dynamicStyles.favoriteIcon}>⭐</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {/* Category Dropdown */}
        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.sectionSubtitle}>Category</Text>
          <TouchableOpacity 
            style={dynamicStyles.dropdownContainer}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <View style={dynamicStyles.dropdownHeader}>
              <Text style={dynamicStyles.dropdownHeaderText}>{getCurrentCategoryName()}</Text>
              <Text style={dynamicStyles.dropdownToggle}>{showCategoryDropdown ? '▲' : '▼'}</Text>
            </View>
            {showCategoryDropdown && (
              <View style={dynamicStyles.dropdownList}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        dynamicStyles.dropdownItem,
                        currentCategory === category.key && dynamicStyles.dropdownItemActive
                      ]}
                      onPress={() => {
                        selectCategory(category.key);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={dynamicStyles.dropdownItemIcon}>{category.icon}</Text>
                      <Text style={[
                        dynamicStyles.dropdownItemText,
                        currentCategory === category.key && dynamicStyles.dropdownItemTextActive
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* From Value Input */}
        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.sectionSubtitle}>Value</Text>
          <TextInput
            style={[
              dynamicStyles.input,
              isInputFocused && dynamicStyles.inputFocused,
              inputError && dynamicStyles.inputError
            ]}
            value={fromValue}
            onChangeText={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Enter value to convert"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          {inputError ? (
            <View>
              <Text style={dynamicStyles.errorText}>{inputError}</Text>
              <Text style={dynamicStyles.helpText}>{getHelpfulSuggestions(inputError)}</Text>
            </View>
          ) : null}
        </View>

        {/* From Unit Dropdown */}
        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.sectionSubtitle}>From Unit</Text>
          <TouchableOpacity 
            style={dynamicStyles.dropdownContainer}
            onPress={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
          >
            <View style={dynamicStyles.dropdownHeader}>
              <Text style={dynamicStyles.dropdownHeaderText}>{fromUnit || 'Select Unit'}</Text>
              <Text style={dynamicStyles.dropdownToggle}>{showFromUnitDropdown ? '▲' : '▼'}</Text>
            </View>
            {showFromUnitDropdown && (
              <View style={dynamicStyles.dropdownList}>
                <TextInput
                  style={dynamicStyles.dropdownSearchInput}
                  placeholder="Search units..."
                  placeholderTextColor={colors.textSecondary}
                  value={fromUnitSearch}
                  onChangeText={setFromUnitSearch}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filterUnits(units, fromUnitSearch).map(([key, data]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        dynamicStyles.dropdownItem,
                        fromUnit === key && dynamicStyles.dropdownItemActive
                      ]}
                      onPress={() => {
                        setFromUnit(key);
                        setShowFromUnitDropdown(false);
                        setFromUnitSearch('');
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          dynamicStyles.dropdownItemText,
                          fromUnit === key && dynamicStyles.dropdownItemTextActive
                        ]}>
                          {key} - {data.name}
                        </Text>
                        <Text style={dynamicStyles.unitDescription}>
                          {getUnitDescription(key, currentCategory)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={dynamicStyles.favoriteButton}
                        onPress={() => toggleFavorite(key, data.name, currentCategory)}
                      >
                        <Text style={dynamicStyles.favoriteIcon}>
                          {isUnitFavorite(key, currentCategory) ? '⭐' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={dynamicStyles.swapButton} onPress={swapUnits}>
          <Text style={dynamicStyles.swapButtonText}>⇅ Swap Units</Text>
        </TouchableOpacity>

        {/* To Unit Dropdown */}
        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.sectionSubtitle}>To Unit</Text>
          <TouchableOpacity 
            style={dynamicStyles.dropdownContainer}
            onPress={() => setShowToUnitDropdown(!showToUnitDropdown)}
          >
            <View style={dynamicStyles.dropdownHeader}>
              <Text style={dynamicStyles.dropdownHeaderText}>{toUnit || 'Select Unit'}</Text>
              <Text style={dynamicStyles.dropdownToggle}>{showToUnitDropdown ? '▲' : '▼'}</Text>
            </View>
            {showToUnitDropdown && (
              <View style={dynamicStyles.dropdownList}>
                <TextInput
                  style={dynamicStyles.dropdownSearchInput}
                  placeholder="Search units..."
                  placeholderTextColor={colors.textSecondary}
                  value={toUnitSearch}
                  onChangeText={setToUnitSearch}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filterUnits(units, toUnitSearch).map(([key, data]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        dynamicStyles.dropdownItem,
                        toUnit === key && dynamicStyles.dropdownItemActive
                      ]}
                      onPress={() => {
                        setToUnit(key);
                        setShowToUnitDropdown(false);
                        setToUnitSearch('');
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          dynamicStyles.dropdownItemText,
                          toUnit === key && dynamicStyles.dropdownItemTextActive
                        ]}>
                          {key} - {data.name}
                        </Text>
                        <Text style={dynamicStyles.unitDescription}>
                          {getUnitDescription(key, currentCategory)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={dynamicStyles.favoriteButton}
                        onPress={() => toggleFavorite(key, data.name, currentCategory)}
                      >
                        <Text style={dynamicStyles.favoriteIcon}>
                          {isUnitFavorite(key, currentCategory) ? '⭐' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Convert Button */}
        <TouchableOpacity
          style={[dynamicStyles.convertButton, loading && dynamicStyles.convertButtonDisabled]}
          onPress={performConversion}
          disabled={loading || !fromValue || !fromUnit || !toUnit}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 10 }} />
              <Text style={dynamicStyles.convertButtonText}>Converting...</Text>
            </View>
          ) : (
            <Text style={dynamicStyles.convertButtonText}>Convert</Text>
          )}
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View style={dynamicStyles.resultContainer}>
            <Text style={dynamicStyles.resultText}>
              {fromValue} {fromUnit} = {result} {toUnit}
            </Text>
            {(currentCategory === 'currency' || currentCategory === 'crypto') && (
              <Text style={dynamicStyles.liveRateText}>💱 Live Rate</Text>
            )}
          </View>
        )}

        {/* Recent Conversions - Moved to Bottom */}
        {recentConversions.length > 0 && (
          <View style={dynamicStyles.recentSection}>
            <Text style={dynamicStyles.sectionSubtitle}>🕒 Recent Conversions</Text>
            {recentConversions.map((conversion, index) => (
              <View key={index} style={dynamicStyles.recentItem}>
                <View style={{ flex: 1 }}>
                  <Text style={dynamicStyles.recentText}>
                    {conversion.fromValue} {conversion.fromUnit} → {conversion.toValue} {conversion.toUnit}
                  </Text>
                  <Text style={dynamicStyles.recentSubtext}>
                    {conversion.category} • {new Date(conversion.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={dynamicStyles.quickConvertButton}
                  onPress={() => quickConvertFromRecent(conversion.fromValue, conversion.fromUnit, conversion.toUnit, conversion.category)}
                >
                  <Text style={dynamicStyles.quickConvertButtonText}>Convert</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

