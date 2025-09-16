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
      // Web app exact colors
      primary: '#667eea',
      secondary: '#764ba2', 
      accent: '#f093fb',
      success: '#4facfe',
      warning: '#f093fb',
      error: '#ff6b6b',
      
      // Dark mode colors (matching web app exactly)
      darkBg: '#0a0a0a',
      darkCard: '#1a1a1a',
      darkText: '#ffffff',
      darkTextSecondary: '#b0b0b0',
      
      // Light mode colors (matching web app exactly)
      lightBg: '#f8fafc',
      lightCard: '#ffffff',
      lightText: '#1a202c',
      lightTextSecondary: '#4a5568',
      
      // Glassmorphism colors (exact web app values)
      glass: 'rgba(255, 255, 255, 0.1)',
      glassDark: 'rgba(0, 0, 0, 0.1)',
      
      // Dynamic colors based on theme
      background: isDarkMode ? '#0a0a0a' : '#f8fafc',
      surface: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
      card: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
      text: isDarkMode ? '#ffffff' : '#1a202c',
      textSecondary: isDarkMode ? '#b0b0b0' : '#4a5568',
      
      // Gradient arrays for animations
      darkGradient: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460'],
      lightGradient: ['#f8fafc', '#e2e8f0', '#cbd5e0', '#a0aec0'],
      
      // Glassmorphism borders and shadows
      glassBorder: isDarkMode ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.3)',
      glassBackground: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
      shadow: isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      shadowStrong: isDarkMode ? 'rgba(102, 126, 234, 0.5)' : 'rgba(0, 0, 0, 0.2)',
      
      // Interactive elements
      button: isDarkMode ? 'rgba(102, 126, 234, 0.8)' : 'rgba(102, 126, 234, 0.9)',
      buttonText: '#ffffff',
      buttonSecondary: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      buttonSecondaryText: isDarkMode ? '#ffffff' : '#1a202c',
      
      // Text gradient colors
      gradientText: ['#667eea', '#f093fb', '#4facfe'],
      textShadow: 'rgba(102, 126, 234, 0.5)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
