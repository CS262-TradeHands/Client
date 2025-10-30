import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  signedIn: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
};

export default function ProtectedInfo({ signedIn, onPress, children, style }: Props) {
  if (signedIn) return <>{children}</>;

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
      <View style={[styles.container, style]}>
        {/* render children underneath so layout preserved */}
        <View style={styles.content}>{children}</View>

        {/* blur overlay */}
        <BlurView intensity={90} tint="light" style={styles.blur} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    // keep layout natural
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
});
