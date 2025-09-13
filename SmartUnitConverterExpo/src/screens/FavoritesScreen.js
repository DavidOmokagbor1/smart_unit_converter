/**
 * FavoritesScreen - Placeholder screen (favorites functionality removed)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function FavoritesScreen() {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    message: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Favorites</Text>
      <Text style={dynamicStyles.message}>
        Favorites functionality has been temporarily removed.{'\n\n'}
        Focus on the core conversion features for now!
      </Text>
    </View>
  );
}

