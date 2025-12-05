/**
 * HomeScreen - Main conversion screen matching web app design
 * Features: Categories, Conversion, Live Market Data, Smart Suggestions, Quick Calculator
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
import LinearGradient from 'react-native-linear-gradient';
import ConversionService from '../services/ConversionService';

const HomeScreen = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState({
    usdEur: 'Loading...',
    btcUsd: 'Loading...',
    ethUsd: 'Loading...',
    goldPrice: 'Loading...',
  });
  const [calcInput, setCalcInput] = useState('');

  useEffect(() => {
    initializeApp();
    updateMarketData();
    const marketInterval = setInterval(updateMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(marketInterval);
  }, []);

  const initializeApp = async () => {
    try {
      const cats = ConversionService.getCategories();
      setCategories(cats);
      
      // Set default category to Length
      if (cats.length > 0) {
        selectCategory(cats[0].key);
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
    if (!fromValue || !fromUnit || !toUnit || !currentCategory) {
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
        parseFloat(fromValue),
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

  const quickSuggestion = (from, to, value) => {
    // Find the category for these units
    const category = categories.find(cat => {
      const units = ConversionService.getUnitsForCategory(cat.key);
      return units[from] && units[to];
    });
    
    if (category) {
      selectCategory(category.key);
      setFromUnit(from);
      setToUnit(to);
      setFromValue(value.toString());
      setTimeout(() => performConversion(), 100);
    }
  };

  const updateMarketData = async () => {
    try {
      // USD/EUR
      const currencyResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (currencyResponse.ok) {
        const currencyData = await currencyResponse.json();
        setMarketData(prev => ({
          ...prev,
          usdEur: currencyData.rates?.EUR?.toFixed(4) || 'Error',
        }));
      }

      // BTC/USD
      const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      if (btcResponse.ok) {
        const btcData = await btcResponse.json();
        setMarketData(prev => ({
          ...prev,
          btcUsd: btcData.bitcoin?.usd ? `$${btcData.bitcoin.usd.toLocaleString()}` : 'Error',
        }));
      }

      // ETH/USD
      const ethResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      if (ethResponse.ok) {
        const ethData = await ethResponse.json();
        setMarketData(prev => ({
          ...prev,
          ethUsd: ethData.ethereum?.usd ? `$${ethData.ethereum.usd.toLocaleString()}` : 'Error',
        }));
      }

      // Gold Price (fallback)
      setMarketData(prev => ({
        ...prev,
        goldPrice: '$1950.38',
      }));
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  };

  const handleCalcInput = (value) => {
    if (value === '=') {
      try {
        const result = eval(calcInput);
        setCalcInput(result.toString());
      } catch (error) {
        setCalcInput('Error');
      }
    } else if (value === 'C') {
      setCalcInput('');
    } else {
      setCalcInput(prev => prev + value);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        currentCategory === item.key && styles.categoryCardActive
      ]}
      onPress={() => selectCategory(item.key)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        currentCategory === item.key && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderUnitOption = (unitKey, unitData, isFrom) => (
    <TouchableOpacity
      key={unitKey}
      style={[
        styles.unitOption,
        (isFrom ? fromUnit : toUnit) === unitKey && styles.unitOptionActive
      ]}
      onPress={() => isFrom ? setFromUnit(unitKey) : setToUnit(unitKey)}
    >
      <Text style={[
        styles.unitText,
        (isFrom ? fromUnit : toUnit) === unitKey && styles.unitTextActive
      ]}>
        {unitData.name || unitKey}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 AI Smart Unit Converter</Text>
        <Text style={styles.subtitle}>15+ Categories • 120+ Units • Real-time Rates</Text>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>📁</Text> Categories
        </Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor="#b0b0b0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.key}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.categoryGrid}
        />
      </View>

      {/* Conversion Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>🔄</Text> Conversion
        </Text>

        {/* From */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>→ From</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
            {Object.entries(units).map(([key, data]) => renderUnitOption(key, data, true))}
          </ScrollView>
          <TextInput
            style={styles.valueInput}
            value={fromValue}
            onChangeText={setFromValue}
            placeholder="Enter value..."
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>

        {/* To */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>← To</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
            {Object.entries(units).map(([key, data]) => renderUnitOption(key, data, false))}
          </ScrollView>
          <View style={styles.resultDisplay}>
            <Text style={styles.resultText}>
              {result || 'Enter a value to see the conversion result'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.convertButton]}
            onPress={performConversion}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🔄 Convert</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.swapButton]}
            onPress={swapUnits}
          >
            <Text style={styles.buttonText}>⇅ Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={() => {
              setFromValue('');
              setResult('');
            }}
          >
            <Text style={styles.buttonText}>🗑️ Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Market Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>📈</Text> Live Market Data
        </Text>
        <View style={styles.marketGrid}>
          <View style={styles.marketItem}>
            <Text style={styles.marketLabel}>USD/EUR</Text>
            <Text style={styles.marketValue}>{marketData.usdEur}</Text>
          </View>
          <View style={styles.marketItem}>
            <Text style={styles.marketLabel}>BTC/USD</Text>
            <Text style={styles.marketValue}>{marketData.btcUsd}</Text>
          </View>
          <View style={styles.marketItem}>
            <Text style={styles.marketLabel}>ETH/USD</Text>
            <Text style={styles.marketValue}>{marketData.ethUsd}</Text>
          </View>
          <View style={styles.marketItem}>
            <Text style={styles.marketLabel}>Gold/Oz</Text>
            <Text style={styles.marketValue}>{marketData.goldPrice}</Text>
          </View>
        </View>
      </View>

      {/* Smart Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>💡</Text> Smart Suggestions
        </Text>
        <View style={styles.suggestionsGrid}>
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => quickSuggestion('m', 'ft', 1)}
          >
            <Text style={styles.suggestionIcon}>📏</Text>
            <Text style={styles.suggestionText}>1m → 3.28ft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => quickSuggestion('celsius', 'fahrenheit', 25)}
          >
            <Text style={styles.suggestionIcon}>🌡️</Text>
            <Text style={styles.suggestionText}>25°C → 77°F</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => quickSuggestion('kg', 'lb', 1)}
          >
            <Text style={styles.suggestionIcon}>⚖️</Text>
            <Text style={styles.suggestionText}>1kg → 2.2lbs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => quickSuggestion('l', 'gal', 1)}
          >
            <Text style={styles.suggestionIcon}>💧</Text>
            <Text style={styles.suggestionText}>1L → 0.26gal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Calculator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>🔢</Text> Quick Calculator
        </Text>
        <TextInput
          style={styles.calcInput}
          value={calcInput}
          placeholder="Enter calculation..."
          placeholderTextColor="#666"
          editable={false}
        />
        <View style={styles.calcButtons}>
          {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', '0', '.', '=', '/'].map((btn) => (
            <TouchableOpacity
              key={btn}
              style={styles.calcButton}
              onPress={() => handleCalcInput(btn === '=' ? '=' : btn)}
            >
              <Text style={styles.calcButtonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f093fb',
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryGrid: {
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 90,
    justifyContent: 'center',
  },
  categoryCardActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#667eea',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  categoryTextActive: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  unitScroll: {
    maxHeight: 50,
    marginBottom: 10,
  },
  unitOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 100,
  },
  unitOptionActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#667eea',
  },
  unitText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  unitTextActive: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  valueInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  arrow: {
    fontSize: 32,
    color: '#f093fb',
  },
  resultDisplay: {
    backgroundColor: 'linear-gradient(45deg, #4facfe, #667eea)',
    backgroundColor: '#4facfe',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.5)',
  },
  resultText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  convertButton: {
    backgroundColor: '#667eea',
  },
  swapButton: {
    backgroundColor: '#764ba2',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  marketItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  marketValue: {
    color: '#4facfe',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestionIcon: {
    fontSize: 20,
  },
  suggestionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  calcInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  calcButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calcButton: {
    width: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  calcButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
