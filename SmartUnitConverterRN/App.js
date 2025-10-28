/**
 * Smart Unit Converter - React Native App
 * Main App component with navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { MaterialIcons as Icon } from '@react-native-vector-icons/material-icons';
import LinearGradient from 'react-native-linear-gradient';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Convert') {
              iconName = 'swap-horizontal';
            } else if (route.name === 'History') {
              iconName = 'history';
            } else if (route.name === 'Favorites') {
              iconName = 'star';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4facfe',
          tabBarInactiveTintColor: '#8e8e93',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#333',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
            borderBottomColor: '#333',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Convert" 
          component={HomeScreen}
          options={{
            title: 'Unit Converter',
            headerTitle: 'Smart Unit Converter',
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            title: 'History',
            headerTitle: 'Conversion History',
          }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{
            title: 'Favorites',
            headerTitle: 'Favorite Conversions',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerTitle: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </LinearGradient>
  );
};

export default App;
