import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function VideoSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    if (videoFinished) {
      const timer = setTimeout(onFinish, 500);
      return () => clearTimeout(timer);
    }
  }, [videoFinished, onFinish]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/Firefly-logo.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            setVideoFinished(true);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Change this to match your video's background
  },
  video: {
    width: width,
    height: height,
  },
});