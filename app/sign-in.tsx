import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in-form');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.authBackButton}>
        <Text style={styles.authBackButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.authPrompt}>
        <Ionicons name="lock-closed-outline" size={48} color="#5A7A8C" />
        <Text style={styles.authPromptTitle}>Sign In Required</Text>
        <Text style={styles.authPromptText}>Please sign in to continue.</Text>
        <TouchableOpacity
          style={styles.authPromptButton}
          onPress={handleSignIn}
        >
          <Text style={styles.authPromptButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authCreateAccountButton}
          onPress={() => router.push('/create-account')}
        >
          <Text style={styles.authCreateAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  authBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 20,
  },
  authBackButtonText: {
    color: '#5A7A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  authPromptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  authPromptButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  authPromptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authCreateAccountButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authCreateAccountText: {
    color: '#5A7A8C',
    fontSize: 16,
    fontWeight: '600',
  },
});