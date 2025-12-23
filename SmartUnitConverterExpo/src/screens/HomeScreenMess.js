/**
 * HomeScreen - Web-style mobile conversion screen
 * Matches the sophisticated web app design exactly
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversionService from '../services/ConversionService';
import { useTheme } from '../contexts/ThemeContext';
import GlassmorphismCard from '../components/GlassmorphismCard';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, isDarkMode } = useTheme();
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [loading, setLoading] = useState(false);
  const [showFromUnitDropdown, setShowFromUnitDropdown] = useState(false);
  const [showToUnitDropdown, setShowToUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [inputError, setInputError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentConversions, setRecentConversions] = useState([]);
  const [fromUnitSearch, setFromUnitSearch] = useState('');
  const [toUnitSearch, setToUnitSearch] = useState('');
  const [favoriteUnits, setFavoriteUnits] = useState([]);
  const [marketData, setMarketData] = useState({});

  // Initialize conversion service
  const conversionService = useMemo(() => ConversionService, []);

  // Get categories and current units
  const categories = useMemo(() => {
    return Object.entries(conversionService.categories).map(([key, data]) => ({
      id: key,
      name: data.name,
      icon: data.icon,
    }));
  }, [conversionService]);

  const currentUnits = useMemo(() => {
    const categoryData = conversionService.categories[currentCategory];
    if (!categoryData) return [];
    
    return Object.entries(categoryData.units).map(([key, data]) => ({
      id: key,
      name: data.name,
      symbol: key,
      factor: data.factor,
    }));
  }, [conversionService, currentCategory]);

  // Smart suggestions based on current category
  const smartSuggestions = useMemo(() => {
    const suggestions = {
      length: [
        { from: '1m', to: '3.28ft', fromValue: 1, fromUnit: 'meters', toUnit: 'feet' },
        { from: '1km', to: '0.62mi', fromValue: 1, fromUnit: 'kilometers', toUnit: 'miles' },
        { from: '1in', to: '2.54cm', fromValue: 1, fromUnit: 'inches', toUnit: 'centimeters' },
      ],
      weight: [
        { from: '1kg', to: '2.2lbs', fromValue: 1, fromUnit: 'kilograms', toUnit: 'pounds' },
        { from: '1lb', to: '0.45kg', fromValue: 1, fromUnit: 'pounds', toUnit: 'kilograms' },
        { from: '1oz', to: '28.35g', fromValue: 1, fromUnit: 'ounces', toUnit: 'grams' },
      ],
      temperature: [
        { from: '25°C', to: '77°F', fromValue: 25, fromUnit: 'celsius', toUnit: 'fahrenheit' },
        { from: '0°C', to: '32°F', fromValue: 0, fromUnit: 'celsius', toUnit: 'fahrenheit' },
        { from: '100°C', to: '212°F', fromValue: 100, fromUnit: 'celsius', toUnit: 'fahrenheit' },
      ],
      volume: [
        { from: '1L', to: '0.26gal', fromValue: 1, fromUnit: 'liters', toUnit: 'gallons' },
        { from: '1gal', to: '3.79L', fromValue: 1, fromUnit: 'gallons', toUnit: 'liters' },
        { from: '1cup', to: '0.24L', fromValue: 1, fromUnit: 'cups', toUnit: 'liters' },
      ],
    };
    return suggestions[currentCategory] || [];
  }, [currentCategory]);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    loadRecentConversions();
    loadFavorites();
    loadMarketData();
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      if (categories.length > 0) {
        setCurrentCategory(categories[0].id);
        const firstCategoryUnits = Object.entries(conversionService.categories[categories[0].id].units);
        if (firstCategoryUnits.length > 0) {
          setFromUnit(firstCategoryUnits[0][0]);
          setToUnit(firstCategoryUnits[1]?.[0] || firstCategoryUnits[0][0]);
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize the converter');
    }
  }, [categories, conversionService]);

  const loadRecentConversions = useCallback(async () => {
    try {
      const recent = await AsyncStorage.getItem('recentConversions');
      if (recent) {
        setRecentConversions(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Error loading recent conversions:', error);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteUnits');
      if (favorites) {
        setFavoriteUnits(JSON.parse(favorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const loadMarketData = useCallback(async () => {
    try {
      // Simulate market data loading
      setMarketData({
        'USD/EUR': 'Loading...',
        'BTC/USD': 'Loading...',
        'ETH/USD': 'Loading...',
        'Gold/Oz': 'Loading...',
      });
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }, []);

  const saveRecentConversion = useCallback(async (conversion) => {
    try {
      const recent = await AsyncStorage.getItem('recentConversions');
      let recentList = recent ? JSON.parse(recent) : [];
      
      recentList.unshift(conversion);
      recentList = recentList.slice(0, 10);
      
      await AsyncStorage.setItem('recentConversions', JSON.stringify(recentList));
      setRecentConversions(recentList);
    } catch (error) {
      console.error('Error saving recent conversion:', error);
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!fromValue || !fromUnit || !toUnit) {
      setInputError('Please fill in all fields');
      return;
    }

    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setInputError('Please enter a valid number');
      return;
    }

    setInputError('');
    setLoading(true);

    try {
      const convertedValue = await conversionService.convert(
        value,
        fromUnit,
        toUnit,
        currentCategory
      );

      setResult(convertedValue.toString());
      
      // Save to recent conversions
      const conversion = {
        id: Date.now(),
        fromValue: value,
        fromUnit,
        toUnit,
        result: convertedValue,
        category: currentCategory,
        timestamp: new Date().toISOString(),
      };
      
      await saveRecentConversion(conversion);
    } catch (error) {
      console.error('Conversion error:', error);
      Alert.alert('Conversion Error', error.message || 'Failed to convert units');
    } finally {
      setLoading(false);
    }
  }, [fromValue, fromUnit, toUnit, currentCategory, conversionService, saveRecentConversion]);

  const handleCategoryChange = useCallback((categoryId) => {
    setCurrentCategory(categoryId);
    setShowCategoryDropdown(false);
    
    const categoryUnits = Object.entries(conversionService.categories[categoryId].units);
    if (categoryUnits.length > 0) {
      setFromUnit(categoryUnits[0][0]);
      setToUnit(categoryUnits[1]?.[0] || categoryUnits[0][0]);
    }
    
    setFromValue('');
    setResult('');
  }, [conversionService]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setFromValue(suggestion.fromValue.toString());
    setFromUnit(suggestion.fromUnit);
    setToUnit(suggestion.toUnit);
    setResult('');
  }, []);

  const filteredUnits = useCallback((unitList, searchTerm) => {
    if (!searchTerm) return unitList;
    return unitList.filter(unit => 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  const getCurrentCategoryName = useCallback(() => {
    const category = categories.find(cat => cat.id === currentCategory);
    return category ? category.name : 'Select Category';
  }, [categories, currentCategory]);

  const getCurrentCategoryIcon = useCallback(() => {
    const category = categories.find(cat => cat.id === currentCategory);
    return category ? category.icon : '📏';
  }, [categories, currentCategory]);

  const renderGradientText = useCallback((text, style) => (
    <LinearGradient
      colors={colors.gradientText}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientTextContainer, style]}
    >
      <Text style={[styles.gradientText, { textShadowColor: colors.textShadow }]}>
        {text}
      </Text>
    </LinearGradient>
  ), [colors.gradientText, colors.textShadow]);

  const renderCategoryCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: currentCategory === item.id ? colors.accent : colors.glass,
          borderColor: currentCategory === item.id ? colors.accent : colors.glassBorder,
        }
      ]}
      onPress={() => handleCategoryChange(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryName,
        { color: currentCategory === item.id ? '#ffffff' : colors.text }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [currentCategory, colors, handleCategoryChange]);

  const renderUnitOption = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.unitOption,
        {
          backgroundColor: (fromUnit === item.id || toUnit === item.id) ? colors.accent : colors.glass,
          borderColor: (fromUnit === item.id || toUnit === item.id) ? colors.accent : colors.glassBorder,
        }
      ]}
      onPress={() => {
        if (showFromUnitDropdown) {
          setFromUnit(item.id);
          setShowFromUnitDropdown(false);
        } else if (showToUnitDropdown) {
          setToUnit(item.id);
          setShowToUnitDropdown(false);
        }
      }}
    >
      <Text style={[
        styles.unitName,
        { color: (fromUnit === item.id || toUnit === item.id) ? '#ffffff' : colors.text }
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.unitSymbol,
        { color: (fromUnit === item.id || toUnit === item.id) ? '#ffffff' : colors.textSecondary }
      ]}>
        {item.symbol}
      </Text>
    </TouchableOpacity>
  ), [fromUnit, toUnit, showFromUnitDropdown, showToUnitDropdown, colors]);

  const filteredFromUnits = useMemo(() => 
    filteredUnits(currentUnits, fromUnitSearch), 
    [currentUnits, fromUnitSearch, filteredUnits]
  );

  const filteredToUnits = useMemo(() => 
    filteredUnits(currentUnits, toUnitSearch), 
    [currentUnits, toUnitSearch, filteredUnits]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <GlassmorphismCard style={styles.headerCard}>
          {renderGradientText('🧠 AI Smart Unit Converter', styles.title)}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            15+ Categories • 120+ Units • Real-time Rates • AI-Powered Conversions • Smart Interface
          </Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.glass }]}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>15+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Categories</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.glass }]}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>120+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Units</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.glass }]}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>AI</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Powered</Text>
            </View>
          </View>
        </GlassmorphismCard>

        {/* Main Content - Two Column Layout */}
        <View style={styles.mainContent}>
          {/* Left Column - Categories */}
          <View style={styles.leftColumn}>
            <GlassmorphismCard style={styles.categoriesCard}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                📁 Categories
              </Text>
              
              {/* Search */}
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: colors.glass,
                    borderColor: colors.glassBorder,
                    color: colors.text,
                  }
                ]}
                placeholder="Search categories..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              
              {/* Categories Grid */}
              <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
                All Categories
              </Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.categoriesGrid}
              />
            </GlassmorphismCard>
          </View>

          {/* Right Column - Conversion Tools */}
          <View style={styles.rightColumn}>
            {/* Conversion Section */}
            <GlassmorphismCard style={styles.conversionCard}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                🔄 Conversion
              </Text>
              
              {/* From Section */}
              <View style={styles.conversionRow}>
                <View style={styles.conversionInput}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>From</Text>
                  <TouchableOpacity
                    style={[
                      styles.unitSelector,
                      {
                        backgroundColor: colors.glass,
                        borderColor: colors.glassBorder,
                      }
                    ]}
                    onPress={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
                  >
                    <Text style={[styles.unitSelectorText, { color: colors.text }]}>
                      {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select unit...'}
                    </Text>
                    <Text style={[styles.dropdownArrow, { color: colors.textSecondary }]}>
                      {showFromUnitDropdown ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  
                  {showFromUnitDropdown && (
                    <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
                      <TextInput
                        style={[
                          styles.searchInput,
                          {
                            backgroundColor: colors.glass,
                            borderColor: colors.glassBorder,
                            color: colors.text,
                          }
                        ]}
                        placeholder="Search units..."
                        placeholderTextColor={colors.textSecondary}
                        value={fromUnitSearch}
                        onChangeText={setFromUnitSearch}
                      />
                      <FlatList
                        data={filteredFromUnits}
                        renderItem={renderUnitOption}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.arrowContainer}>
                  <Text style={[styles.arrow, { color: colors.accent }]}>→</Text>
                </View>

                <View style={styles.conversionInput}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>To</Text>
                  <TouchableOpacity
                    style={[
                      styles.unitSelector,
                      {
                        backgroundColor: colors.glass,
                        borderColor: colors.glassBorder,
                      }
                    ]}
                    onPress={() => setShowToUnitDropdown(!showToUnitDropdown)}
                  >
                    <Text style={[styles.unitSelectorText, { color: colors.text }]}>
                      {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select unit...'}
                    </Text>
                    <Text style={[styles.dropdownArrow, { color: colors.textSecondary }]}>
                      {showToUnitDropdown ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  
                  {showToUnitDropdown && (
                    <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
                      <TextInput
                        style={[
                          styles.searchInput,
                          {
                            backgroundColor: colors.glass,
                            borderColor: colors.glassBorder,
                            color: colors.text,
                          }
                        ]}
                        placeholder="Search units..."
                        placeholderTextColor={colors.textSecondary}
                        value={toUnitSearch}
                        onChangeText={setToUnitSearch}
                      />
                      <FlatList
                        data={filteredToUnits}
                        renderItem={renderUnitOption}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Value Input */}
              <View style={styles.valueSection}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Value</Text>
                <TextInput
                  style={[
                    styles.valueInput,
                    {
                      backgroundColor: colors.glass,
                      borderColor: isInputFocused ? colors.accent : colors.glassBorder,
                      color: colors.text,
                    }
                  ]}
                  placeholder="Enter value..."
                  placeholderTextColor={colors.textSecondary}
                  value={fromValue}
                  onChangeText={(text) => {
                    setFromValue(text);
                    setInputError('');
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  keyboardType="numeric"
                />
                {inputError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {inputError}
                  </Text>
                ) : null}
              </View>

              {/* Result */}
              <View style={styles.resultSection}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Result</Text>
                <View style={[styles.resultDisplay, { backgroundColor: colors.glass }]}>
                  <Text style={[styles.resultText, { color: colors.text }]}>
                    {result || 'Enter a value to see the conversion result'}
                  </Text>
                </View>
              </View>

              {/* Convert Button */}
              <TouchableOpacity
                style={[
                  styles.convertButton,
                  {
                    backgroundColor: colors.accent,
                    shadowColor: colors.shadow,
                  }
                ]}
                onPress={handleConvert}
                disabled={loading}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.convertButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.convertButtonText}>
                      {result ? '🔄 Convert Again' : '🔄 Convert Now'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </GlassmorphismCard>

            {/* Live Market Data */}
            <GlassmorphismCard style={styles.marketCard}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                📈 Live Market Data
              </Text>
              {Object.entries(marketData).map(([pair, value]) => (
                <View key={pair} style={[styles.marketItem, { backgroundColor: colors.glass }]}>
                  <Text style={[styles.marketPair, { color: colors.text }]}>{pair}</Text>
                  <Text style={[styles.marketValue, { color: colors.accent }]}>{value}</Text>
                </View>
              ))}
            </GlassmorphismCard>

            {/* Smart Suggestions */}
            <GlassmorphismCard style={styles.suggestionsCard}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                💡 Smart Suggestions
              </Text>
              <View style={styles.suggestionsGrid}>
                {smartSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionItem, { backgroundColor: colors.glass }]}
                    onPress={() => handleSuggestionClick(suggestion)}
                  >
                    <Text style={[styles.suggestionText, { color: colors.text }]}>
                      {suggestion.from} → {suggestion.to}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassmorphismCard>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 15,
  },
  headerCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  gradientTextContainer: {
    marginBottom: 10,
  },
  gradientText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    gap: 15,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 2,
  },
  categoriesCard: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  categoriesGrid: {
    gap: 8,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  categoryIcon: {
    fontSize: 18,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
  },
  conversionCard: {
    marginBottom: 15,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  conversionInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  unitSelectorText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
  },
  dropdown: {
    marginTop: 5,
    borderRadius: 8,
    padding: 8,
    maxHeight: 150,
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueSection: {
    marginBottom: 15,
  },
  valueInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
  resultSection: {
    marginBottom: 15,
  },
  resultDisplay: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  convertButton: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  convertButtonGradient: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketCard: {
    marginBottom: 15,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  marketPair: {
    fontSize: 12,
    fontWeight: '500',
  },
  marketValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionsCard: {
    marginBottom: 15,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionItem: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    minWidth: '45%',
  },
  suggestionText: {
    fontSize: 11,
    textAlign: 'center',
  },
  unitOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  unitName: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  unitSymbol: {
    fontSize: 10,
    marginLeft: 8,
  },
});
