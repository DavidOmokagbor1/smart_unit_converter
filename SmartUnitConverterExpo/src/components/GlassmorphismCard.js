/**
 * GlassmorphismCard - Reusable glassmorphism component with shimmer effect
 * Matches the stunning design from the web app exactly
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';

const GlassmorphismCard = ({ 
  children, 
  style, 
  intensity = 20, 
  tint = 'default',
  borderRadius = 20,
  padding = 25,
  margin = 0,
  shadow = true,
  shimmer = true
}) => {
  const { colors, isDarkMode } = useTheme();
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shimmer) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [shimmer, shimmerValue]);

  const cardStyle = [
    styles.card,
    {
      borderRadius,
      padding,
      margin,
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    shadow && {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    style,
  ];

  return (
    <View style={cardStyle}>
      {/* Shimmer effect overlay */}
      {shimmer && (
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: shimmerValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
            },
          ]}
        />
      )}
      
      <BlurView
        intensity={intensity}
        tint={isDarkMode ? 'dark' : 'light'}
        style={[
          styles.blurView,
          {
            borderRadius: borderRadius - 1,
            backgroundColor: 'transparent',
          }
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  blurView: {
    flex: 1,
    padding: 0,
    zIndex: 2,
  },
});

export default GlassmorphismCard;
