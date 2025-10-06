/**
 * Simple Test App to verify Expo is working
 */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function TestApp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎯 Smart Unit Converter</Text>
        <Text style={styles.subtitle}>Test App - Working!</Text>
        <Text style={styles.description}>
          If you can see this, Expo is working correctly!
        </Text>
        <Text style={styles.status}>✅ Status: Ready</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  status: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



