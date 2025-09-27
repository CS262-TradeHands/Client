// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function RootLayout() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  React.useEffect(() => {
    // optional: silence a noisy warning from navigation state
    LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
  }, []);

  return (
    <React.Fragment>
      {/* StatusBar for the app */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      {/* Expo Router stack. contentStyle sets the default screen background */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </React.Fragment>
  );
}

