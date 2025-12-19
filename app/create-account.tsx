import { API_BASE_URL } from '@/constants/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const [emailError, setEmailError] = useState('');
  const [confirmEmailError, setConfirmEmailError] = useState('');

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email.');
    } else {
      setEmailError('');
    }
  };

  const handleConfirmEmailChange = (value: string) => {
    setConfirmEmail(value);
    if (value !== email) {
      setConfirmEmailError('Emails do not match.');
    } else {
      setConfirmEmailError('');
    }
  };
  
  const handleCreateAccount = async () => {
    if (emailError || confirmEmailError) return;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          profile_image_url: profileImageUrl || null,
          password: password, // Send plain password - server will hash it
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Now log in the user
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        
        if (loginResponse.ok) {
          const userData = await loginResponse.json();
          signIn(userData);
          router.replace('/(tabs)/profile');
        }
      } else {
        const error = await response.json();
        alert(`Error creating account: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating account:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : dismissKeyboard} accessible={false}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Image
              source={require('../assets/images/handshake-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Create a new account</Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#777"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#777"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Confirm Email"
                placeholderTextColor="#777"
                value={confirmEmail}
                onChangeText={handleConfirmEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {confirmEmailError ? <Text style={styles.errorText}>{confirmEmailError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#777"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="#777"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Profile Image URL"
                placeholderTextColor="#777"
                value={profileImageUrl}
                onChangeText={setProfileImageUrl}
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                <Text style={styles.buttonText}>Create account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    backgroundColor: '#fbfbfb',
    fontSize: 16,
    color: '#111',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#5A7A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '75%',
    backgroundColor: '#5A7A8C',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  inputError: {
  borderColor: 'red',
  },
  errorText: {
    width: '75%',
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'left',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});
