import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Add the handshake-logo image */}
      <Image source={require('../assets/images/handshake-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Trade Hands</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/buyer')}
      >
        <Text style={styles.buttonText}>Buyer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/owner')}
      >
        <Text style={styles.buttonText}>Owner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150, // Adjust the width of the image
    height: 150, // Adjust the height of the image
    marginBottom: 20, // Add spacing below the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});