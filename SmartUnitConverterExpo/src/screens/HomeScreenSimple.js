/**
 * HomeScreen - Simple, clean mobile conversion screen
 * Just works - no complex features that break
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
import { LinearGradient } from 'expo-linear-gradient';
import ConversionService from '../services/ConversionService';
import { useTheme } from '../contexts/ThemeContext';
import GlassmorphismCard from '../components/GlassmorphismCard';

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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Get categories and units
  const categories = Object.entries(ConversionService.categories).map(([key, data]) => ({
    id: key,
    name: data.name,
    icon: data.icon,
  }));

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
    setShowCategoryDropdown(false);
    setFromValue('');
    setResult('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <GlassmorphismCard style={styles.headerCard}>
          <Text style={[styles.title, { color: colors.text }]}>
            ✨ Smart Unit Converter
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Convert between 15+ categories with 120+ units
          </Text>
        </GlassmorphismCard>

        {/* Category Selection */}
        <GlassmorphismCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            📁 Category
          </Text>
          <TouchableOpacity
            style={[
              styles.selector,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }
            ]}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={[styles.selectorText, { color: colors.text }]}>
              {categories.find(cat => cat.id === currentCategory)?.icon} {categories.find(cat => cat.id === currentCategory)?.name}
            </Text>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>
              {showCategoryDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: currentCategory === category.id ? colors.accent : 'transparent',
                    }
                  ]}
                  onPress={() => handleCategoryChange(category.id)}
                >
                  <Text style={[styles.dropdownText, { 
                    color: currentCategory === category.id ? '#ffffff' : colors.text 
                  }]}>
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </GlassmorphismCard>

        {/* From Unit */}
        <GlassmorphismCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            From
          </Text>
          <TouchableOpacity
            style={[
              styles.selector,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }
            ]}
            onPress={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
          >
            <Text style={[styles.selectorText, { color: colors.text }]}>
              {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
            </Text>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>
              {showFromUnitDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showFromUnitDropdown && (
            <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
              {currentUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: fromUnit === unit.id ? colors.accent : 'transparent',
                    }
                  ]}
                  onPress={() => {
                    setFromUnit(unit.id);
                    setShowFromUnitDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownText, { 
                    color: fromUnit === unit.id ? '#ffffff' : colors.text 
                  }]}>
                    {unit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </GlassmorphismCard>

        {/* To Unit */}
        <GlassmorphismCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            To
          </Text>
          <TouchableOpacity
            style={[
              styles.selector,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
              }
            ]}
            onPress={() => setShowToUnitDropdown(!showToUnitDropdown)}
          >
            <Text style={[styles.selectorText, { color: colors.text }]}>
              {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
            </Text>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>
              {showToUnitDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showToUnitDropdown && (
            <View style={[styles.dropdown, { backgroundColor: colors.glass }]}>
              {currentUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: toUnit === unit.id ? colors.accent : 'transparent',
                    }
                  ]}
                  onPress={() => {
                    setToUnit(unit.id);
                    setShowToUnitDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownText, { 
                    color: toUnit === unit.id ? '#ffffff' : colors.text 
                  }]}>
                    {unit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </GlassmorphismCard>

        {/* Value Input */}
        <GlassmorphismCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            Value
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder,
                color: colors.text,
              }
            ]}
            placeholder="Enter value to convert"
            placeholderTextColor={colors.textSecondary}
            value={fromValue}
            onChangeText={setFromValue}
            keyboardType="numeric"
          />
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
                🔄 Convert
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <GlassmorphismCard style={styles.resultCard}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>
              Result
            </Text>
            <Text style={[styles.resultText, { color: colors.text }]}>
              {result} {currentUnits.find(u => u.id === toUnit)?.symbol || ''}
            </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  arrow: {
    fontSize: 12,
  },
  dropdown: {
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    fontWeight: '500',
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
});
