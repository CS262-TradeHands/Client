import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

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
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="business-detail" options={{ headerShown: false }} />
          <Stack.Screen name="buyer-detail" options={{ headerShown: false }} />
          <Stack.Screen name="create-account" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="add-buyer" options={{ headerShown: false }} />
          <Stack.Screen name="add-business" options={{ headerShown: false }} />
          <Stack.Screen name="inbox" options={{ headerShown: false }} />
          <Stack.Screen name="algo" options={{ headerShown: false }} />
          <Stack.Screen name="edit-buyer" options={{ headerShown: false }} />
          <Stack.Screen name="edit-business" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in-form" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

export function VideoSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [videoFinished, setVideoFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Fade in and scale animation for text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 300,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (videoFinished) {
      // Fade out animation before finishing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(onFinish, 200);
      });
    }
  }, [videoFinished, onFinish, fadeAnim]);

  const handleSkip = () => {
    onFinish();
  };

  // Prepare expo-video player at top-level (hooks must be called unconditionally)
  const videoSource = require('../assets/images/simple.mp4');
  const player = useVideoPlayer(videoSource, (p) => {
    try {
      p.muted = true; // Mute the video to avoid interrupting background audio
      p.audioMixingMode = 'mixWithOthers'; // Allow background audio to continue
      (p as any)?.play?.();
      if ((p as any)?.onPlaybackStatusUpdate) {
        (p as any).onPlaybackStatusUpdate((status: any) => {
          if (status?.didJustFinish) {
            setVideoFinished(true);
          }
        });
      }
    } catch {
      // ignore; API may differ across platforms
    }
  });

  // ensure splash finishes even if player events aren't reported.
  useEffect(() => {
    if (videoFinished) return;
    const FALLBACK_MS = 5000; // fallback after 5s to avoid stalling startup
    const id = setTimeout(() => {
      setVideoFinished(true);
    }, FALLBACK_MS);
    return () => clearTimeout(id);
  }, [videoFinished]);

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
          <VideoView
            style={styles.video}
            player={player}
            contentFit="contain"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 25, 41, 0.2)', 'rgba(10, 25, 41, 0.5)', 'rgba(10, 25, 41, 0.8)']}
            locations={[0, 0.4, 0.7, 1]}
            style={styles.vignette}
          />
        </View>
        <Animated.Text 
          style={[
            styles.welcomeText,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]} 
          pointerEvents="none"
        >
          Welcome to TradeHands!
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.tapText,
            { opacity: fadeAnim }
          ]} 
          pointerEvents="none"
        >
          Tap to continue
        </Animated.Text>
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
    backgroundColor: '#000000',
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
    fontSize: 36,
    fontWeight: '700',
    color: '#E8E8E8',
    letterSpacing: 1.5,
    fontFamily: 'System',
    textAlign: 'center',
    position: 'absolute',
    bottom: height * 0.25,
    left: 20,
    right: 20,
    zIndex: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  tapText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    fontFamily: 'System',
    textAlign: 'center',
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
