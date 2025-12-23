/**
 * SettingsScreen - App settings and preferences for Expo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [precision, setPrecision] = useState(6);
  const [notifications, setNotifications] = useState(true);

  // Define styles first before any functions that use them
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 15,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: 15,
    },
    settingTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    settingSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    precisionContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    precisionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    precisionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    precisionButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
    },
    precisionButtonTextActive: {
      color: '#fff',
      fontWeight: 'bold',
    },
    actionButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    dangerButton: {
      backgroundColor: colors.error,
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    dangerButtonText: {
      color: '#fff',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setAutoRefresh(parsedSettings.autoRefresh ?? true);
        setPrecision(parsedSettings.precision ?? 6);
        setNotifications(parsedSettings.notifications ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleAutoRefreshToggle = (value) => {
    setAutoRefresh(value);
    saveSettings({ darkMode: isDarkMode, autoRefresh: value, precision, notifications });
  };

  const handleNotificationsToggle = (value) => {
    setNotifications(value);
    saveSettings({ darkMode: isDarkMode, autoRefresh, precision, notifications: value });
  };

  const handlePrecisionChange = (newPrecision) => {
    setPrecision(newPrecision);
    saveSettings({ darkMode: isDarkMode, autoRefresh, precision: newPrecision, notifications });
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all conversion history and favorites. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['conversionHistory', 'conversionFavorites']);
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const exportData = () => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const aboutApp = () => {
    Alert.alert(
      'About Smart Unit Converter',
      'Version 1.0.0\n\nA comprehensive unit converter with 15+ categories and 120+ units, featuring real-time currency and cryptocurrency rates.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (title, subtitle, rightComponent) => (
    <View style={dynamicStyles.settingItem}>
      <View style={dynamicStyles.settingInfo}>
        <Text style={dynamicStyles.settingTitle}>{title}</Text>
        {subtitle && <Text style={dynamicStyles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </View>
  );

  const renderPrecisionButton = (value, label) => (
    <TouchableOpacity
      key={value}
      style={[
        dynamicStyles.precisionButton,
        precision === value && dynamicStyles.precisionButtonActive
      ]}
      onPress={() => handlePrecisionChange(value)}
    >
      <Text style={[
        dynamicStyles.precisionButtonText,
        precision === value && dynamicStyles.precisionButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Appearance Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
        
        {renderSettingItem(
          'Dark Mode',
          'Use dark theme throughout the app',
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        )}
      </View>

      {/* Conversion Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Conversion</Text>
        
        {renderSettingItem(
          'Auto Refresh Rates',
          'Automatically update currency and crypto rates',
          <Switch
            value={autoRefresh}
            onValueChange={handleAutoRefreshToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={autoRefresh ? '#fff' : '#f4f3f4'}
          />
        )}

        <View style={dynamicStyles.settingItem}>
          <View style={dynamicStyles.settingInfo}>
            <Text style={dynamicStyles.settingTitle}>Result Precision</Text>
            <Text style={dynamicStyles.settingSubtitle}>Number of decimal places in results</Text>
          </View>
          <View style={dynamicStyles.precisionContainer}>
            {renderPrecisionButton(2, '2')}
            {renderPrecisionButton(4, '4')}
            {renderPrecisionButton(6, '6')}
            {renderPrecisionButton(8, '8')}
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Notifications</Text>
        
        {renderSettingItem(
          'Rate Updates',
          'Get notified when rates are updated',
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        )}
      </View>

      {/* Data Management */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={dynamicStyles.actionButton} onPress={exportData}>
          <Text style={dynamicStyles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.dangerButton]} onPress={clearAllData}>
          <Text style={[dynamicStyles.actionButtonText, dynamicStyles.dangerButtonText]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={dynamicStyles.actionButton} onPress={aboutApp}>
          <Text style={dynamicStyles.actionButtonText}>About App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
