/**
 * ThemeContext - Provides theme management for dark/light mode
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setIsDarkMode(parsedSettings.darkMode ?? true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const parsedSettings = settings ? JSON.parse(settings) : {};
      await AsyncStorage.setItem('appSettings', JSON.stringify({
        ...parsedSettings,
        darkMode: newTheme
      }));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      background: isDarkMode ? '#1a1a2e' : '#ffffff',
      surface: isDarkMode ? '#2a2a3e' : '#f8f9fa',
      card: isDarkMode ? '#2a2a3e' : '#ffffff',
      
      // Text colors
      text: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#666666' : '#666666',
      textMuted: isDarkMode ? '#999999' : '#999999',
      
      // Accent colors
      primary: '#4facfe',
      primaryDark: '#3d8bfe',
      secondary: isDarkMode ? '#333333' : '#e9ecef',
      
      // Border colors
      border: isDarkMode ? '#333333' : '#dee2e6',
      borderLight: isDarkMode ? '#444444' : '#f1f3f4',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      
      // Interactive colors
      button: isDarkMode ? '#4facfe' : '#4facfe',
      buttonText: '#ffffff',
      buttonSecondary: isDarkMode ? '#333333' : '#e9ecef',
      buttonSecondaryText: isDarkMode ? '#ffffff' : '#000000',
      
      // Dropdown colors
      dropdownBackground: isDarkMode ? '#1a1a2e' : '#ffffff',
      dropdownBorder: isDarkMode ? '#4facfe' : '#4facfe',
      dropdownItem: isDarkMode ? '#2a2a3e' : '#f8f9fa',
      dropdownItemActive: '#4facfe',
      
      // Shadow colors
      shadow: isDarkMode ? '#4facfe' : '#000000',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
