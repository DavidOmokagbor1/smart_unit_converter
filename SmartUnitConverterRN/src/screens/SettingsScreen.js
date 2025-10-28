/**
 * SettingsScreen - App settings and preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState('5');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const themeData = await AsyncStorage.getItem('theme');
      const notificationsData = await AsyncStorage.getItem('notifications');
      const updateFrequencyData = await AsyncStorage.getItem('updateFrequency');
      
      if (themeData) setTheme(themeData);
      if (notificationsData) setNotifications(JSON.parse(notificationsData));
      if (updateFrequencyData) setUpdateFrequency(updateFrequencyData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('theme', theme);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      await AsyncStorage.setItem('updateFrequency', updateFrequency);
      Alert.alert('Success', 'Settings saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all history, favorites, and settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'conversionHistory',
                'conversionFavorites',
                'theme',
                'notifications',
                'updateFrequency'
              ]);
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const history = await AsyncStorage.getItem('conversionHistory');
      const favorites = await AsyncStorage.getItem('conversionFavorites');
      
      const exportData = {
        history: history ? JSON.parse(history) : [],
        favorites: favorites ? JSON.parse(favorites) : [],
        settings: {
          theme,
          notifications,
          updateFrequency
        },
        exportDate: new Date().toISOString()
      };
      
      Alert.alert('Export Data', JSON.stringify(exportData, null, 2));
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const renderSettingItem = (title, subtitle, children) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        {renderSettingItem(
          'Theme',
          'Choose your preferred theme',
          <TouchableOpacity
            style={[styles.themeButton, theme === 'dark' && styles.themeButtonActive]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[styles.themeButtonText, theme === 'dark' && styles.themeButtonTextActive]}>
              Dark
            </Text>
          </TouchableOpacity>
        )}
        
        {renderSettingItem(
          'Theme',
          'Choose your preferred theme',
          <TouchableOpacity
            style={[styles.themeButton, theme === 'light' && styles.themeButtonActive]}
            onPress={() => setTheme('light')}
          >
            <Text style={[styles.themeButtonText, theme === 'light' && styles.themeButtonTextActive]}>
              Light
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        {renderSettingItem(
          'Push Notifications',
          'Receive notifications for updates',
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#4facfe' }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        
        {renderSettingItem(
          'Clear History',
          'Remove all conversion history',
          <TouchableOpacity style={styles.actionButton} onPress={() => {
            Alert.alert('Clear History', 'This will clear all conversion history');
          }}>
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
        
        {renderSettingItem(
          'Clear Favorites',
          'Remove all favorite conversions',
          <TouchableOpacity style={styles.actionButton} onPress={() => {
            Alert.alert('Clear Favorites', 'This will clear all favorite conversions');
          }}>
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
        
        {renderSettingItem(
          'Export Data',
          'Export all your data',
          <TouchableOpacity style={styles.actionButton} onPress={exportData}>
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>
        )}
        
        {renderSettingItem(
          'Clear All Data',
          'Remove all data and reset app',
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={clearAllData}>
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Smart Unit Converter</Text>
          <Text style={styles.aboutVersion}>Version 2.1.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Features</Text>
          <Text style={styles.aboutText}>• 170+ Global Currencies</Text>
          <Text style={styles.aboutText}>• 20+ Conversion Categories</Text>
          <Text style={styles.aboutText}>• Real-time Exchange Rates</Text>
          <Text style={styles.aboutText}>• Offline Support</Text>
          <Text style={styles.aboutText}>• Conversion History</Text>
          <Text style={styles.aboutText}>• Favorites System</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  themeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginLeft: 10,
  },
  themeButtonActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  themeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  themeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#4facfe',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dangerButton: {
    backgroundColor: '#f56565',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aboutItem: {
    marginBottom: 15,
  },
  aboutTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  aboutVersion: {
    color: '#4facfe',
    fontSize: 14,
    marginBottom: 10,
  },
  aboutText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  saveButton: {
    backgroundColor: '#4facfe',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
