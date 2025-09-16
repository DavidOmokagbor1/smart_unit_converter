/**
 * HomeScreen - Main conversion screen with glassmorphism design
 * Matches the stunning web app design exactly
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversionService from '../services/ConversionService';
import { useTheme } from '../contexts/ThemeContext';
import GlassmorphismCard from '../components/GlassmorphismCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, isDarkMode } = useTheme();
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

  const initializeApp = async () => {
    try {
      const conversionService = new ConversionService();
      const cats = conversionService.getCategories();
      const unitsData = conversionService.getUnits();
      
      setCategories(cats);
      setUnits(unitsData);
      
      if (cats.length > 0) {
        setCurrentCategory(cats[0].id);
        const categoryUnits = unitsData[cats[0].id] || [];
        if (categoryUnits.length > 0) {
          setFromUnit(categoryUnits[0].id);
          setToUnit(categoryUnits[1]?.id || categoryUnits[0].id);
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize the converter');
    }
  };

  const loadRecentConversions = async () => {
    try {
      const recent = await AsyncStorage.getItem('recentConversions');
      if (recent) {
        setRecentConversions(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Error loading recent conversions:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteUnits');
      if (favorites) {
        setFavoriteUnits(JSON.parse(favorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveRecentConversion = async (conversion) => {
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
  };

  const toggleFavorite = async (unitId) => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteUnits');
      let favoriteList = favorites ? JSON.parse(favorites) : [];
      
      if (favoriteList.includes(unitId)) {
        favoriteList = favoriteList.filter(id => id !== unitId);
      } else {
        favoriteList.push(unitId);
      }
      
      await AsyncStorage.setItem('favoriteUnits', JSON.stringify(favoriteList));
      setFavoriteUnits(favoriteList);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleConvert = async () => {
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
      const conversionService = new ConversionService();
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
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setShowCategoryDropdown(false);
    
    const categoryUnits = units[categoryId] || [];
    if (categoryUnits.length > 0) {
      setFromUnit(categoryUnits[0].id);
      setToUnit(categoryUnits[1]?.id || categoryUnits[0].id);
    }
    
    setFromValue('');
    setResult('');
  };

  const filteredUnits = (unitList, searchTerm) => {
    if (!searchTerm) return unitList;
    return unitList.filter(unit => 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCurrentCategoryName = () => {
    const category = categories.find(cat => cat.id === currentCategory);
    return category ? category.name : 'Select Category';
  };

  const getCurrentCategoryIcon = () => {
    const category = categories.find(cat => cat.id === currentCategory);
    return category ? category.icon : '📏';
  };

  const renderGradientText = (text, style) => (
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
  );

  const renderCategoryCard = ({ item }) => (
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
  );

  const renderUnitOption = ({ item }) => (
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
  );

  const currentUnits = units[currentCategory] || [];
  const filteredFromUnits = filteredUnits(currentUnits, fromUnitSearch);
  const filteredToUnits = filteredUnits(currentUnits, toUnitSearch);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <GlassmorphismCard style={styles.headerCard}>
          {renderGradientText('✨ Smart Unit Converter', styles.title)}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Convert between 15+ categories with 120+ units
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
              <Text style={[styles.statNumber, { color: colors.accent }]}>∞</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Possibilities</Text>
            </View>
          </View>
        </GlassmorphismCard>

        {/* Search Section */}
        <GlassmorphismCard style={styles.searchCard}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            🔍 Quick Search
          </Text>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
                color: colors.text,
              }
            ]}
            placeholder="Search units or categories..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </GlassmorphismCard>

        {/* Favorites Section */}
        {favoriteUnits.length > 0 && (
          <GlassmorphismCard style={styles.favoritesCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              ⭐ Favorites
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favoriteUnits.map((unitId) => {
                const unit = currentUnits.find(u => u.id === unitId);
                if (!unit) return null;
                return (
                  <TouchableOpacity
                    key={unitId}
                    style={[styles.favoriteUnit, { backgroundColor: colors.glass }]}
                    onPress={() => {
                      setFromUnit(unitId);
                      setShowFromUnitDropdown(false);
                    }}
                  >
                    <Text style={[styles.favoriteUnitName, { color: colors.text }]}>
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </GlassmorphismCard>
        )}

        {/* Category Selection */}
        <GlassmorphismCard style={styles.categoryCard}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            📁 Category
          </Text>
          <TouchableOpacity
            style={[
              styles.categorySelector,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }
            ]}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={[styles.categorySelectorText, { color: colors.text }]}>
              {getCurrentCategoryIcon()} {getCurrentCategoryName()}
            </Text>
            <Text style={[styles.dropdownArrow, { color: colors.textSecondary }]}>
              {showCategoryDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
              <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
              />
            </View>
          )}
        </GlassmorphismCard>

        {/* Unit Selection */}
        <View style={styles.unitSelectionContainer}>
          {/* From Unit */}
          <GlassmorphismCard style={styles.unitCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              From
            </Text>
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
                {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
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
          </GlassmorphismCard>

          {/* To Unit */}
          <GlassmorphismCard style={styles.unitCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              To
            </Text>
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
                {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
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
          </GlassmorphismCard>
        </View>

        {/* Value Input */}
        <GlassmorphismCard style={styles.inputCard}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            💯 Value
          </Text>
          <TextInput
            style={[
              styles.valueInput,
              {
                backgroundColor: colors.glass,
                borderColor: isInputFocused ? colors.accent : colors.glassBorder,
                color: colors.text,
              }
            ]}
            placeholder="Enter value to convert"
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
        </GlassmorphismCard>

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
                🔄 Convert Now
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <GlassmorphismCard style={styles.resultCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              🎯 Result
            </Text>
            <Text style={[styles.resultText, { color: colors.text }]}>
              {result} {currentUnits.find(u => u.id === toUnit)?.symbol || ''}
            </Text>
          </GlassmorphismCard>
        )}

        {/* Recent Conversions */}
        {recentConversions.length > 0 && (
          <GlassmorphismCard style={styles.recentCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              🕒 Recent
            </Text>
            {recentConversions.slice(0, 3).map((conversion) => (
              <View key={conversion.id} style={[styles.recentItem, { backgroundColor: colors.glass }]}>
                <Text style={[styles.recentText, { color: colors.text }]}>
                  {conversion.fromValue} {currentUnits.find(u => u.id === conversion.fromUnit)?.symbol} = {conversion.result} {currentUnits.find(u => u.id === conversion.toUnit)?.symbol}
                </Text>
              </View>
            ))}
          </GlassmorphismCard>
        )}
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
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  searchCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  favoritesCard: {
    marginBottom: 20,
  },
  favoriteUnit: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  favoriteUnitName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryCard: {
    marginBottom: 20,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },
  categorySelectorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
  },
  dropdown: {
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    maxHeight: 200,
  },
  unitSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  unitCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },
  unitSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  unitOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
  },
  unitName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  unitSymbol: {
    fontSize: 12,
    marginLeft: 10,
  },
  inputCard: {
    marginBottom: 20,
  },
  valueInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
  convertButton: {
    borderRadius: 15,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  convertButtonGradient: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recentCard: {
    marginBottom: 20,
  },
  recentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 14,
  },
});
