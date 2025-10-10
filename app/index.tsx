import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  // Animated values
  const scale = useRef(new Animated.Value(0.8)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Parallel animation: logo scale then welcome fade/slide in
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(welcomeTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // After animation completes, navigate to business listings
      // Use a tiny delay so the user sees the final state
      setTimeout(() => router.replace('/business-listings'), 300);
    });
  }, [scale, welcomeOpacity, welcomeTranslateY, router]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/handshake-logo.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
        resizeMode="contain"
      />

      <Animated.View
        style={{
          opacity: welcomeOpacity,
          transform: [{ translateY: welcomeTranslateY }],
        }}
      >
        <Text style={styles.welcome}>Welcome to TradeHands!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
});