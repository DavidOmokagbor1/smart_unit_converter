/**
 * HomeScreenFixed - Compact, better layout
 * Fixed background and spacing issues
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

  // Categories with icons
  const categories = [
    { id: 'length', name: 'Length', icon: '📏' },
    { id: 'weight', name: 'Weight', icon: '⚖️' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'area', name: 'Area', icon: '📐' },
    { id: 'volume', name: 'Volume', icon: '🧪' },
    { id: 'time', name: 'Time', icon: '⏰' },
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

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Unit Converter</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Compact Converter Section */}
        <View style={styles.converterCard}>
          <Text style={styles.sectionTitle}>⚡ Convert Units</Text>
          
          {/* Value Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Value</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter value"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={fromValue}
              onChangeText={setFromValue}
              keyboardType="numeric"
            />
          </View>

          {/* From Unit */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <View style={styles.unitContainer}>
              <Text style={styles.unitText}>
                {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
              </Text>
            </View>
          </View>

          {/* To Unit */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <View style={styles.unitContainer}>
              <Text style={styles.unitText}>
                {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
              </Text>
            </View>
          </View>

          {/* Convert Button */}
          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
            disabled={loading}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>🔄 Convert</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Result */}
          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>
                {result} {currentUnits.find(u => u.id === toUnit)?.symbol || ''}
              </Text>
            </View>
          )}
        </View>

        {/* Compact Category Grid */}
        <View style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>📋 Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  currentCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setCurrentCategory(category.id)}
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
  header: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  converterCard: {
    margin: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f093fb',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f093fb',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  unitContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
  },
  unitText: {
    fontSize: 16,
    color: '#ffffff',
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
  buttonGradient: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4facfe',
    textAlign: 'center',
  },
  categoryCard: {
    margin: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
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
