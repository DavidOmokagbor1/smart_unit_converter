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

export default function HistoryScreen() {
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

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyMain}>
        <Text style={styles.historyValue}>
          {item.fromValue} {item.fromUnit}
        </Text>
        <Text style={styles.historyArrow}>→</Text>
        <Text style={styles.historyValue}>
          {item.toValue} {item.toUnit}
        </Text>
      </View>
      <View style={styles.historyMeta}>
        <Text style={styles.historyCategory}>{item.category}</Text>
        <Text style={styles.historyTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.actionButton} onPress={clearHistory}>
          <Text style={styles.actionButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversions yet</Text>
          <Text style={styles.emptySubtext}>
            Start converting units to see your history here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    backgroundColor: '#4facfe',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  historyMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyArrow: {
    color: '#4facfe',
    fontSize: 16,
    marginHorizontal: 10,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyCategory: {
    color: '#666',
    fontSize: 12,
  },
  historyTime: {
    color: '#666',
    fontSize: 12,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
