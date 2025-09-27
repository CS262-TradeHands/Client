import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          paddingHorizontal: 20,
        },
        header: {
          paddingTop: 60,
          paddingBottom: 40,
          alignItems: "center",
        },
        title: {
          fontSize: 28,
          fontWeight: "600",
          color: theme.text,
          marginBottom: 8,
          fontFamily: "Courier",
        },
        subtitle: {
          fontSize: 16,
          color: theme.icon,
          fontFamily: "Courier",
        },
        form: {
          flex: 1,
          justifyContent: "center",
        },
        inputContainer: {
          marginBottom: 20,
        },
        label: {
          fontSize: 16,
          color: theme.text,
          marginBottom: 8,
          fontFamily: "Courier",
        },
        input: {
          borderWidth: 1,
          borderColor: theme.icon,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.background,
          fontFamily: "Courier",
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
          marginTop: 20,
        },
        loginButtonText: {
          color: "#FFFFFF",
          fontSize: 18,
          fontFamily: "Courier",
          textAlign: "center",
        },
        backButton: {
          paddingVertical: 8,
          paddingHorizontal: 20,
          marginTop: 20,
        },
        backButtonText: {
          color: theme.tint,
          fontSize: 16,
          fontFamily: "Courier",
          textDecorationLine: "underline",
          textAlign: "center",
        },
      }),
    [theme]
  );

  const handleLogin = () => {
    // TODO: Implement actual login logic
    console.log("Login attempt:", { email, password });
    // For now, navigate back to home
    router.push("/(tabs)/home");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.icon}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={theme.icon}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


