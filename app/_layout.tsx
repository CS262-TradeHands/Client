import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

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
      router.replace('/(tabs)/business-listings');
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
          <Stack.Screen name="edit-buyer" options={{ headerShown: false }} />
          <Stack.Screen name="edit-business" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

export function VideoSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [videoFinished, setVideoFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const isWeb = Platform.OS === 'web';
  const { width = 360, height = 640 } = useWindowDimensions();
  const videoSource = require('../assets/images/simple.mp4');

  useEffect(() => {
    // Fade in and scale animation for text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: !isWeb,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 300,
        tension: 50,
        friction: 7,
        useNativeDriver: !isWeb,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, isWeb]);

  useEffect(() => {
    if (videoFinished) {
      // Fade out animation before finishing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: !isWeb,
      }).start(() => {
        setTimeout(onFinish, 200);
      });
    }
  }, [videoFinished, onFinish, fadeAnim, isWeb]);

  const handleSkip = () => {
    onFinish();
  };

  // Prepare expo-video player at top-level (hooks must be called unconditionally)
  const player = useVideoPlayer(videoSource, (p) => {
    try {
      p.muted = true; // Mute the video to avoid interrupting background audio
      p.loop = false; // Don't loop the video
      if (isWeb) {
        p.showNowPlayingNotification = false;
      }
    } catch {
      // ignore; API may differ across platforms
    }
  });

  // Auto-play video on mount
  useEffect(() => {
    if (!player) return;

    const playVideo = async () => {
      try {
        await player.play();
      } catch (err) {
        console.log('Video autoplay failed:', err);
      }
    };

    // Small delay to ensure player is ready
    const timeout = setTimeout(() => {
      playVideo();
    }, 100);

    return () => clearTimeout(timeout);
  }, [player]);

  // Listen for playback end
  useEffect(() => {
    if (!player) return;

    const checkStatus = setInterval(() => {
      try {
        // Check if video has ended (status is idle and has played)
        if (player.status === 'idle' && player.currentTime > 0) {
          setVideoFinished(true);
        }
        // Also check if we're near the end of duration
        if (player.duration && player.currentTime >= player.duration - 0.1) {
          setVideoFinished(true);
        }
      } catch {
        // ignore
      }
    }, 500);

    return () => clearInterval(checkStatus);
  }, [player]);

  // ensure splash finishes even if player events aren't reported.
  useEffect(() => {
    if (videoFinished) return;
    const FALLBACK_MS = 5000; // fallback after 5s
    const id = setTimeout(() => {
      setVideoFinished(true);
    }, FALLBACK_MS);
    return () => clearTimeout(id);
  }, [videoFinished]);


  return (
    <Pressable onPress={handleSkip} style={{ flex: 1 }}>
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
        <View style={[styles.videoWrapper, { width, height }]}>
          {isWeb ? (
            <video
              src={videoSource}
              style={[styles.video, { width: '100%', height: '100%' }] as any}
              autoPlay
              muted
              playsInline
              controls={false}
              onEnded={() => setVideoFinished(true)}
              onError={(e) => {
                console.log('Web video error', e);
                setVideoFinished(true);
              }}
            />
          ) : (
            <VideoView
              style={[styles.video, { width: '100%', height: '100%' }]}
              player={player}
              contentFit="contain"
              nativeControls={false}
              allowsFullscreen={false}
            />
          )}
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
              bottom: height * 0.25,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          Welcome to TradeHands!
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.tapText,
            { bottom: height * 0.15, opacity: fadeAnim }
          ]}
        >
          Tap to continue
        </Animated.Text>
      </View>
    </Pressable>
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
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000',
    pointerEvents: 'none',
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
    left: 20,
    right: 20,
    zIndex: 10,
    pointerEvents: 'none',
  },
  tapText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    fontFamily: 'System',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
});
