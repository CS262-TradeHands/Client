import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function WelcomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  // Animation values
  const titleAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Title fades in first
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Icon fades in second
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Button fades in last
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleAnim, iconAnim, buttonAnim]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        },
        logo: {
          width: 160,
          height: 160,
          marginBottom: 60,
          resizeMode: "contain",
        },
        title: {
          color: theme.text,
          fontSize: 24,
          fontWeight: "600",
          marginBottom: 40,
          fontFamily: "Courier",
        },
        button: {
          paddingVertical: 8,
          paddingHorizontal: 20,
          marginVertical: 8,
        },
        loginButton: {
          backgroundColor: "rgba(230, 184, 0, 0.2)",
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "rgba(230, 184, 0, 0.6)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
          marginVertical: 8,
        },
        buttonText: {
          color: theme.tint,
          fontSize: 18,
          fontFamily: "Courier",
          textDecorationLine: "underline",
          textAlign: "center",
        },
        loginButtonText: {
          color: "#FFFFFF",
          fontSize: 18,
          fontFamily: "Courier",
          textAlign: "center",
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Welcome Title */}
      <Animated.Text style={[styles.title, { opacity: titleAnim }]}>
        Welcome to Trade Hands!
      </Animated.Text>

      {/* Handshake Logo */}
      <Animated.View style={[{ opacity: iconAnim }, styles.logo]}>
        <Image
          source={require("../assets/images/handshake-logo.png")}
          style={styles.logo}
        />
      </Animated.View>

      {/* Log In and Sign Up Buttons */}
      <Animated.View style={{ opacity: buttonAnim }}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/home")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
