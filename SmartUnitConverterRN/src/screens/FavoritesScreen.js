/**
 * FavoritesScreen - Favorite conversions management
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

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('conversionFavorites');
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (favoriteId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this favorite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(f => f.id !== favoriteId);
              await AsyncStorage.setItem('conversionFavorites', JSON.stringify(updatedFavorites));
              setFavorites(updatedFavorites);
              Alert.alert('Success', 'Favorite removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove favorite');
            }
          },
        },
      ]
    );
  };

  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('conversionFavorites');
              setFavorites([]);
              Alert.alert('Success', 'All favorites cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.favoriteMain}>
        <Text style={styles.favoriteUnits}>
          {item.fromUnit} → {item.toUnit}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.favoriteCategory}>{item.category}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.actionButton} onPress={clearAllFavorites}>
          <Text style={styles.actionButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Add conversions to favorites by tapping the star button
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          style={styles.favoritesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

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
    backgroundColor: '#f56565',
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
  favoritesList: {
    flex: 1,
    padding: 20,
  },
  favoriteItem: {
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  favoriteMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  favoriteUnits: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#f56565',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteCategory: {
    color: '#666',
    fontSize: 12,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default FavoritesScreen;
