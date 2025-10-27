import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import 'react-native-reanimated';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'business-listings',
};

const { width, height } = Dimensions.get('window');

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        setAppReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && !showVideoSplash) {
      router.replace('/business-listings');
    }
  }, [appReady, showVideoSplash, router]);

  if (!appReady || showVideoSplash) {
    return <VideoSplashScreen onFinish={() => setShowVideoSplash(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="buyer" options={{ headerShown: false }} />
        <Stack.Screen name="owner" options={{ headerShown: false }} />
        <Stack.Screen name="business-listings" options={{ headerShown: false }} />
        <Stack.Screen name="business-detail" options={{ headerShown: false }} />
        <Stack.Screen name="owner-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="potential-buyers" options={{ headerShown: false }} />
        <Stack.Screen name="matches" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export function VideoSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    if (videoFinished) {
      const timer = setTimeout(onFinish, 500);
      return () => clearTimeout(timer);
    }
  }, [videoFinished, onFinish]);

  const handleSkip = () => {
    onFinish();
  };

  return (
    <TouchableWithoutFeedback onPress={handleSkip}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#0A1929', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['#000000', '#0A1929', '#000000']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.videoWrapper} pointerEvents="none">
          <Video
            source={require('../assets/images/Firefly-logo.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                setVideoFinished(true);
              }
            }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 25, 41, 0.3)', 'rgba(10, 25, 41, 0.6)', '#0A1929']}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.vignette}
          />
        </View>
        <Text style={styles.welcomeText} pointerEvents="none">Welcome to TradeHands!</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  videoWrapper: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'System',
    position: 'absolute',
    bottom: 50,
    zIndex: 10,
  },
});
