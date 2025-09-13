/**
 * HistoryScreen - Conversion history management for Expo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('conversionHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversion history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('conversionHistory');
              setHistory([]);
              Alert.alert('Success', 'History cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    emptySubtext: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
    historyList: {
      flex: 1,
      padding: 20,
    },
    historyItem: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyMain: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    historyValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
    },
    historyArrow: {
      color: colors.primary,
      fontSize: 18,
      marginHorizontal: 10,
    },
    historyMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyCategory: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    historyTime: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    loadingText: {
      color: colors.text,
      textAlign: 'center',
      marginTop: 50,
    },
  });

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={dynamicStyles.historyItem}>
      <View style={dynamicStyles.historyMain}>
        <Text style={dynamicStyles.historyValue}>
          {item.fromValue} {item.fromUnit}
        </Text>
        <Text style={dynamicStyles.historyArrow}>→</Text>
        <Text style={dynamicStyles.historyValue}>
          {item.toValue} {item.toUnit}
        </Text>
      </View>
      <View style={dynamicStyles.historyMeta}>
        <Text style={dynamicStyles.historyCategory}>{item.category}</Text>
        <Text style={dynamicStyles.historyTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity style={dynamicStyles.actionButton} onPress={clearHistory}>
          <Text style={dynamicStyles.actionButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={dynamicStyles.emptyContainer}>
          <Text style={dynamicStyles.emptyText}>No conversions yet</Text>
          <Text style={dynamicStyles.emptySubtext}>
            Start converting units to see your history here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          style={dynamicStyles.historyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

