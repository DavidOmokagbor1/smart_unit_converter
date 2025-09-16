/**
 * HomeScreenEnhanced - With floating conversion logos and proper dropdowns
 * Modern interface with subtle background elements
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConversionService from '../services/ConversionService';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [currentCategory, setCurrentCategory] = useState('length');
  const [loading, setLoading] = useState(false);
  const [showFromUnitModal, setShowFromUnitModal] = useState(false);
  const [showToUnitModal, setShowToUnitModal] = useState(false);

  // Categories with icons
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

  const FloatingConversionLogos = () => (
    <View style={styles.floatingLogos}>
      <Text style={[styles.floatingLogo, { top: height * 0.1, left: width * 0.1 }]}>📏</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.2, right: width * 0.1 }]}>⚖️</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.3, left: width * 0.05 }]}>🌡️</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.4, right: width * 0.05 }]}>📐</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.5, left: width * 0.15 }]}>🧪</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.6, right: width * 0.15 }]}>⏰</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.7, left: width * 0.1 }]}>🚀</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.8, right: width * 0.1 }]}>💨</Text>
      <Text style={[styles.floatingLogo, { top: height * 0.9, left: width * 0.2 }]}>⚡</Text>
    </View>
  );

  const UnitDropdown = ({ visible, onClose, onSelect, selectedUnit, title }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {currentUnits.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitOption,
                  selectedUnit === unit.id && styles.unitOptionSelected
                ]}
                onPress={() => {
                  onSelect(unit.id);
                  onClose();
                }}
              >
                <Text style={[
                  styles.unitOptionText,
                  selectedUnit === unit.id && styles.unitOptionTextSelected
                ]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Floating conversion logos in background */}
      <FloatingConversionLogos />
      
      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Unit Converter</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Converter Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Convert Units</Text>
          
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

          {/* From Unit Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <TouchableOpacity
              style={styles.unitDisplay}
              onPress={() => setShowFromUnitModal(true)}
            >
              <Text style={styles.unitText}>
                {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* To Unit Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity
              style={styles.unitDisplay}
              onPress={() => setShowToUnitModal(true)}
            >
              <Text style={styles.unitText}>
                {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
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

        {/* Category Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Categories</Text>
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

      {/* Unit Dropdown Modals */}
      <UnitDropdown
        visible={showFromUnitModal}
        onClose={() => setShowFromUnitModal(false)}
        onSelect={setFromUnit}
        selectedUnit={fromUnit}
        title="Select From Unit"
      />
      
      <UnitDropdown
        visible={showToUnitModal}
        onClose={() => setShowToUnitModal(false)}
        onSelect={setToUnit}
        selectedUnit={toUnit}
        title="Select To Unit"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  floatingLogos: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingLogo: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.1,
    color: '#667eea',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    zIndex: 5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  unitDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  convertButton: {
    borderRadius: 8,
    marginTop: 12,
  },
  buttonGradient: {
    padding: 14,
    borderRadius: 8,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    width: (width - 80) / 3,
    alignItems: 'center',
    marginBottom: 8,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    width: width * 0.8,
    maxHeight: height * 0.6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  modalScrollView: {
    maxHeight: height * 0.4,
  },
  unitOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  unitOptionSelected: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
  },
  unitOptionText: {
    fontSize: 16,
    color: '#ffffff',
  },
  unitOptionTextSelected: {
    color: '#f093fb',
    fontWeight: '600',
  },
});


