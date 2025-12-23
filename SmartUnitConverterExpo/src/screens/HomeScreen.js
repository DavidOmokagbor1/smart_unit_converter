/**
 * HomeScreenEnhanced - With floating conversion logos and proper dropdowns
 * Modern interface with subtle background elements
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Animated,
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
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // All categories from ConversionService with icons
  const categories = [
    { id: 'length', name: 'Length', icon: '📏' },
    { id: 'weight', name: 'Weight', icon: '⚖️' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'volume', name: 'Volume', icon: '🧪' },
    { id: 'area', name: 'Area', icon: '📐' },
    { id: 'speed', name: 'Speed', icon: '🚀' },
    { id: 'time', name: 'Time', icon: '⏰' },
    { id: 'digital_storage_binary', name: 'Binary Storage', icon: '💾' },
    { id: 'digital_storage_decimal', name: 'Decimal Storage', icon: '💿' },
    { id: 'energy', name: 'Energy', icon: '⚡' },
    { id: 'power', name: 'Power', icon: '🔋' },
    { id: 'pressure', name: 'Pressure', icon: '💨' },
    { id: 'data_transfer', name: 'Data Transfer', icon: '📡' },
    { id: 'frequency', name: 'Frequency', icon: '📻' },
    { id: 'cooking_volume', name: 'Cooking Volume', icon: '🥄' },
    { id: 'cooking_weight', name: 'Cooking Weight', icon: '🍽️' },
    { id: 'baking_temperature', name: 'Baking Temp', icon: '🔥' },
    { id: 'currency', name: 'Currency', icon: '💵' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  ];

  // Country flags for currencies
  const currencyFlags = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵', 'CNY': '🇨🇳',
    'INR': '🇮🇳', 'AUD': '🇦🇺', 'CAD': '🇨🇦', 'CHF': '🇨🇭', 'SEK': '🇸🇪',
    'NOK': '🇳🇴', 'DKK': '🇩🇰', 'PLN': '🇵🇱', 'CZK': '🇨🇿', 'HUF': '🇭🇺',
    'RUB': '🇷🇺', 'BRL': '🇧🇷', 'KRW': '🇰🇷', 'SGD': '🇸🇬', 'HKD': '🇭🇰',
    'NZD': '🇳🇿', 'MXN': '🇲🇽', 'ZAR': '🇿🇦', 'TRY': '🇹🇷', 'THB': '🇹🇭'
  };

  // Crypto symbols
  const cryptoSymbols = {
    'BTC': '₿', 'ETH': 'Ξ', 'BNB': '🟡', 'ADA': '🔵', 'SOL': '☀️',
    'XRP': '💧', 'DOT': '🔴', 'DOGE': '🐕', 'AVAX': '🔺', 'SHIB': '🐕',
    'MATIC': '🟣', 'LTC': '⚡', 'UNI': '🦄', 'LINK': '🔗', 'ATOM': '⚛️',
    'FTM': '👻', 'NEAR': '🌐', 'ALGO': '🔷', 'VET': '🔷', 'ICP': '🌐'
  };

  // Get units for current category
  const currentUnits = Object.entries(ConversionService.categories[currentCategory]?.units || {}).map(([key, data]) => ({
    id: key,
    name: data.name,
    symbol: key,
    flag: currentCategory === 'currency' ? currencyFlags[key] : 
          currentCategory === 'crypto' ? cryptoSymbols[key] : null,
  }));

  useEffect(() => {
    if (currentUnits.length > 0) {
      setFromUnit(currentUnits[0].id);
      setToUnit(currentUnits[1]?.id || currentUnits[0].id);
    }
  }, [currentCategory]);

  // Auto-update currency and crypto rates every 3 minutes
  useEffect(() => {
    const updateRates = async () => {
      if (currentCategory === 'currency' || currentCategory === 'crypto') {
        setIsUpdating(true);
        try {
          await ConversionService.loadCurrencyRates();
          await ConversionService.loadCryptoRates();
          setLastUpdate(new Date());
    } catch (error) {
          console.log('Rate update failed:', error);
        } finally {
          setIsUpdating(false);
        }
      }
    };

    // Update immediately if currency/crypto category
    if (currentCategory === 'currency' || currentCategory === 'crypto') {
      updateRates();
    }

    // Set up interval for auto-updates every 3 minutes
    const interval = setInterval(updateRates, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
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

  // Floating logo component with enhanced multi-directional animation
  const FloatingLogo = ({ icon, top, left, delay = 0 }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const translateXAnim = useRef(new Animated.Value(0)).current;
    const diagonalAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const startFloating = () => {
        // Create unique animation pattern for each icon based on delay
        const baseDuration = 3000 + (delay % 5) * 500; // Vary duration 3-5.5s
        const reverseDuration = baseDuration * 1.2;
        
        // Vertical floating (up and down)
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: 1,
              duration: baseDuration,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: reverseDuration,
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Horizontal movement (left and right)
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateXAnim, {
              toValue: 1,
              duration: baseDuration * 1.5,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: 0,
              duration: baseDuration * 1.5,
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Diagonal movement (circular-like path)
        Animated.loop(
          Animated.sequence([
            Animated.timing(diagonalAnim, {
              toValue: 1,
              duration: baseDuration * 2,
              useNativeDriver: true,
            }),
            Animated.timing(diagonalAnim, {
              toValue: 0,
              duration: baseDuration * 2,
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Slow, gentle rotation
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 15000 + delay * 1000, // 15-25 seconds for full rotation
            useNativeDriver: true,
          })
        ).start();
      };

      startFloating();
    }, [delay]);

    // Multi-directional movement interpolation
    const translateY = Animated.add(
      floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-25, 25], // Up and down
      }),
      diagonalAnim.interpolate({
      inputRange: [0, 1],
        outputRange: [-15, 15], // Additional vertical component
      })
    );

    const translateX = Animated.add(
      translateXAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 30], // Left and right
      }),
      diagonalAnim.interpolate({
      inputRange: [0, 1],
        outputRange: [-20, 20], // Additional horizontal component
      })
    );

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.Text
        style={[
          styles.floatingLogo,
          {
            top,
            left: left !== undefined ? left : width * 0.5,
            transform: [
              { translateY },
              { translateX },
              { rotate },
            ],
          },
        ]}
        pointerEvents="none"
      >
        {icon}
      </Animated.Text>
    );
  };

  // Grid-based position generator utilities
  const getGridConfig = (screenWidth, screenHeight) => {
    if (screenWidth < 768) {
      // Mobile: 8 cols × 12 rows = 96 cells - spread icons everywhere
      return { cols: 8, rows: 12, minSpacing: 40, iconCount: 32 };
    } else if (screenWidth < 1024) {
      // Tablet: 10 cols × 14 rows = 140 cells - spread icons everywhere
      return { cols: 10, rows: 14, minSpacing: 50, iconCount: 38 };
    } else {
      // Desktop: 12 cols × 16 rows = 192 cells - spread icons everywhere
      return { cols: 12, rows: 16, minSpacing: 60, iconCount: 42 };
    }
  };

  const getExclusionZones = (screenWidth, screenHeight) => {
    // Minimal exclusion zones - only protect critical interactive areas
    const headerHeight = screenHeight * 0.08; // Smaller header zone (8% instead of 12%)
    
    return [
      // Only protect the very top header area with minimal padding
      {
        x: 0,
        y: 0,
        width: screenWidth,
        height: headerHeight,
        padding: 15 // Reduced padding
      }
      // Removed large content exclusion zone - allow icons everywhere else
    ];
  };

  const isInExclusionZone = (x, y, zones) => {
    return zones.some(zone => {
      const expandedZone = {
        x: zone.x - zone.padding,
        y: zone.y - zone.padding,
        width: zone.width + (zone.padding * 2),
        height: zone.height + (zone.padding * 2)
      };
      return x >= expandedZone.x &&
             x <= expandedZone.x + expandedZone.width &&
             y >= expandedZone.y &&
             y <= expandedZone.y + expandedZone.height;
    });
  };

  const isValidPosition = (newPos, existingPositions, minDistance) => {
    if (existingPositions.length === 0) return true;
    
    for (const existing of existingPositions) {
      const dx = newPos.x - existing.x;
      const dy = newPos.y - existing.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        return false;
      }
    }
    return true;
  };

  const calculatePosition = (colIndex, rowIndex, screenWidth, screenHeight, cols, rows) => {
    const cellWidth = screenWidth / cols;
    const cellHeight = screenHeight / rows;
    const edgePadding = 10; // Reduced from 20 to 10 - allow icons closer to edges
    
    // Base position (grid center)
    const gridX = (colIndex + 0.5) * cellWidth;
    const gridY = (rowIndex + 0.5) * cellHeight;
    
    // Jitter (random offset within cell bounds - 40% of cell size for more spread)
    const jitterRange = Math.min(cellWidth, cellHeight) * 0.4;
    const jitterX = (Math.random() - 0.5) * jitterRange;
    const jitterY = (Math.random() - 0.5) * jitterRange;
    
    // Calculate final position with minimal edge padding constraint
    let finalX = gridX + jitterX;
    let finalY = gridY + jitterY;
    
    // Ensure position respects minimal edge padding (allow more spread)
    finalX = Math.max(edgePadding, Math.min(screenWidth - edgePadding, finalX));
    finalY = Math.max(edgePadding, Math.min(screenHeight - edgePadding, finalY));
    
    return {
      x: finalX,
      y: finalY
    };
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateGridPositions = (iconCount, screenWidth, screenHeight) => {
    const config = getGridConfig(screenWidth, screenHeight);
    const { cols, rows, minSpacing } = config;
    const positions = [];
    const exclusionZones = getExclusionZones(screenWidth, screenHeight);
    
    // Generate candidate positions from grid
    const candidates = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pos = calculatePosition(col, row, screenWidth, screenHeight, cols, rows);
        // Ensure position is within screen bounds
        if (pos.x >= 0 && pos.x <= screenWidth && pos.y >= 0 && pos.y <= screenHeight) {
          if (!isInExclusionZone(pos.x, pos.y, exclusionZones)) {
            candidates.push(pos);
          }
        }
      }
    }
    
    // Shuffle candidates for random selection
    shuffleArray(candidates);
    
    // Select positions with minimum spacing
    let attempts = 0;
    const maxAttempts = candidates.length * 2; // Allow multiple passes if needed
    
    for (let i = 0; i < candidates.length && positions.length < iconCount && attempts < maxAttempts; i++) {
      const candidate = candidates[i];
      if (isValidPosition(candidate, positions, minSpacing)) {
        positions.push(candidate);
      }
      attempts++;
      
      // If we've gone through all candidates and don't have enough, reduce spacing requirement
      if (i === candidates.length - 1 && positions.length < iconCount && attempts < maxAttempts) {
        const reducedSpacing = minSpacing * 0.8; // Reduce by 20%
        for (const candidate of candidates) {
          if (positions.length >= iconCount) break;
          if (isValidPosition(candidate, positions, reducedSpacing)) {
            positions.push(candidate);
          }
        }
        break;
      }
    }
    
    return positions;
  };

  const FloatingConversionLogos = () => {
    // Icon list for background
    const backgroundIcons = [
      '📏', '⚖️', '🌡️', '📐', '🧪', '⏰', '🚀', '💨', '⚡', '💾',
      '💿', '🔋', '📡', '📻', '🥄', '🍽️', '🔥', '💵', '₿', '📊',
      '🔬', '🌍', '🎯', '⭐', '💫', '🌟', '🔮', '🎨', '🎭', '🎪'
    ];

    // Generate positions using grid system
    const config = getGridConfig(width, height);
    const positions = useMemo(() => 
      generateGridPositions(config.iconCount, width, height), 
      [width, height]
    );
    
    return (
    <View style={styles.floatingLogos} pointerEvents="none">
        {positions.map((pos, index) => (
          <FloatingLogo
            key={`floating-icon-${index}`}
            icon={backgroundIcons[index % backgroundIcons.length]}
            top={pos.y}
            left={pos.x}
            delay={index * 0.15}
          />
        ))}
    </View>
  );
  };

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
                <View style={styles.unitOptionContent}>
                  {unit.flag && (
                    <Text style={styles.unitOptionFlag}>{unit.flag}</Text>
                  )}
                  <Text style={[
                    styles.unitOptionText,
                    selectedUnit === unit.id && styles.unitOptionTextSelected
                  ]}>
                    {unit.name}
                  </Text>
                </View>
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
        {(currentCategory === 'currency' || currentCategory === 'crypto') && (
          <View style={styles.updateIndicator}>
            {isUpdating ? (
              <View style={styles.updatingContainer}>
                <ActivityIndicator size="small" color="#4facfe" />
                <Text style={styles.updatingText}>Updating rates...</Text>
              </View>
            ) : lastUpdate ? (
              <Text style={styles.lastUpdateText}>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Text>
            ) : (
              <Text style={styles.lastUpdateText}>Loading rates...</Text>
            )}
          </View>
        )}
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
              <View style={styles.unitTextContainer}>
                {fromUnit && currentUnits.find(u => u.id === fromUnit)?.flag && (
                  <Text style={styles.unitFlag}>
                    {currentUnits.find(u => u.id === fromUnit)?.flag}
                  </Text>
                )}
                <Text style={styles.unitText}>
                  {fromUnit ? currentUnits.find(u => u.id === fromUnit)?.name : 'Select Unit'}
                </Text>
              </View>
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
              <View style={styles.unitTextContainer}>
                {toUnit && currentUnits.find(u => u.id === toUnit)?.flag && (
                  <Text style={styles.unitFlag}>
                    {currentUnits.find(u => u.id === toUnit)?.flag}
                  </Text>
                )}
                <Text style={styles.unitText}>
                  {toUnit ? currentUnits.find(u => u.id === toUnit)?.name : 'Select Unit'}
                </Text>
              </View>
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
              <View style={styles.resultContent}>
                {currentUnits.find(u => u.id === toUnit)?.flag && (
                  <Text style={styles.resultFlag}>
                    {currentUnits.find(u => u.id === toUnit)?.flag}
                  </Text>
                )}
                <Text style={styles.resultText}>
                  {result} {currentUnits.find(u => u.id === toUnit)?.symbol || ''}
                </Text>
              </View>
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
    pointerEvents: 'none',
  },
  floatingLogo: {
    position: 'absolute',
    fontSize: 24, // Reduced from 36 to 24 (33% smaller)
    opacity: 0.12, // Reduced from 0.18 to 0.12 (even more faded/subtle)
    color: '#667eea',
    textShadowColor: 'rgba(102, 126, 234, 0.3)', // Further reduced shadow intensity
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6, // Further reduced shadow radius
    fontWeight: 'normal', // Changed from bold to normal for subtler look
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
  updateIndicator: {
    marginTop: 8,
    alignItems: 'center',
  },
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatingText: {
      fontSize: 12,
    color: '#4facfe',
    marginLeft: 8,
  },
  lastUpdateText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
      fontStyle: 'italic',
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
  unitTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
  unitFlag: {
    fontSize: 16,
    marginRight: 8,
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
  resultContent: {
      flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'center',
  },
  resultFlag: {
    fontSize: 18,
    marginRight: 8,
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
    padding: 10,
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
    fontSize: 10,
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
  unitOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  unitOptionFlag: {
    fontSize: 18,
    marginRight: 12,
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
