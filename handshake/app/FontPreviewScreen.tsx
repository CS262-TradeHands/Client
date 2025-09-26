import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const FONTS_IOS = [
  "System",
  "Helvetica",
  "Helvetica Neue",
  "Courier",
  "Courier New",
  "Arial",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Avenir",
  "Gill Sans",
  "Trebuchet MS",
  "Marker Felt",
];

const FONTS_ANDROID = [
  "System",
  "sans-serif",
  "sans-serif-light",
  "sans-serif-thin",
  "sans-serif-condensed",
  "sans-serif-medium",
  "serif",
  "monospace",
];

export default function FontPreviewScreen() {
  const [showIOS, setShowIOS] = useState(true);
  const fonts = showIOS ? FONTS_IOS : FONTS_ANDROID;

  return (
    <View style={styles.container}>
      {/* Toggle button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowIOS(!showIOS)}
      >
        <Text style={styles.toggleButtonText}>
          {showIOS ? "Switch to Android Fonts" : "Switch to iOS Fonts"}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {fonts.map((font) => (
          <View key={font} style={styles.fontRow}>
            <Text style={[styles.sample, { fontFamily: font }]}>
              {font} → The quick brown fox jumps over the lazy dog.
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  toggleButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scroll: {
    paddingHorizontal: 20,
  },
  fontRow: {
    marginBottom: 20,
  },
  sample: {
    fontSize: 20,
  },
});
