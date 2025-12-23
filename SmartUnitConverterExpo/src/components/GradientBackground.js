/**
 * GradientBackground - Optimized gradient background with floating particles
 * Matches the stunning gradient from the web app with better performance
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import FloatingParticles from './FloatingParticles';

const { width, height } = Dimensions.get('window');

const GradientBackground = ({ children }) => {
  const { colors, isDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 20000, // 20 seconds for smoother animation
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 20000,
          useNativeDriver: false,
        }),
      ])
    );
    
    animationRef.current.start();
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [animatedValue]);

  const gradientColors = useMemo(() => 
    isDarkMode ? colors.darkGradient : colors.lightGradient,
    [isDarkMode, colors.darkGradient, colors.lightGradient]
  );

  return (
    <View style={styles.container}>
      {/* Static gradient background for better performance */}
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Optimized floating particles */}
      <FloatingParticles count={12} />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});

export default GradientBackground;
