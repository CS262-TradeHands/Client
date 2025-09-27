import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [interests, setInterests] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log("User info:", { name, age, occupation, interests });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Let&apos;s Get to Know You!</Text>
          <Text style={styles.subtitle}>Help us personalize your experience</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What&apos;s your name?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>How old are you?</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>What do you do for work?</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="Your occupation"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>What are your interests?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={interests}
              onChangeText={setInterests}
              placeholder="Tell us about your hobbies and interests"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // darker white/light gray
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1A3C61",
    fontFamily: "Courier",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Courier",
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#1A3C61",
    fontFamily: "Courier",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(230, 184, 0, 0.3)",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    fontFamily: "Courier",
    backgroundColor: "#FFFFFF",
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "rgba(230, 184, 0, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(230, 184, 0, 0.6)",
    borderStyle: "solid",
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#1A3C61",
    fontSize: 18,
    fontFamily: "Courier",
    fontWeight: "600",
  },
});
