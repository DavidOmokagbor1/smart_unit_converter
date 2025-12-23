/**
 * FloatingParticles - Optimized animated floating particles background
 * Matches the stunning particle animation from the web app with better performance
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const FloatingParticle = React.memo(({ particle, colors }) => {
  const translateX = useRef(new Animated.Value(particle.x)).current;
  const translateY = useRef(new Animated.Value(particle.y)).current;
  const opacity = useRef(new Animated.Value(particle.opacity)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: Math.random() * width,
              duration: particle.duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: Math.random() * height,
              duration: particle.duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: particle.duration,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      
      animationRef.current.start();
    };

    const timer = setTimeout(animate, particle.delay);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [particle.duration, particle.delay, particle.x, particle.y, particle.opacity]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: colors.accent,
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    />
  );
});

const FloatingParticles = ({ count = 15 }) => {
  const { colors } = useTheme();
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 8000 + 6000,
      delay: Math.random() * 3000,
    }));
  }, [count]);

  const renderParticle = useCallback((particle) => (
    <FloatingParticle key={particle.id} particle={particle} colors={colors} />
  ), [colors]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(renderParticle)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default FloatingParticles;
