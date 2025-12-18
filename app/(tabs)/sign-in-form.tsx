import { API_BASE_URL } from '@/constants/api';
import { User } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';


export default function SignInFormScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth();
    const [error, setError] = useState('');
    

    const handleSignIn = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (response.ok) {
                const userData = await response.json();
                signIn(userData);
                router.replace('/(tabs)/profile');
            } else {
                setError("Email or password does not match. Please try again.")
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image
                            source={require('../../assets/images/handshake-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>Sign into TradeHands</Text>

                        <View style={styles.formContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#777"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setError('')}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#777"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setError('')}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push('/create-account')}>
                    <Text style={styles.createAccountText}>Create account</Text>
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
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        textAlign: 'center',
    },
    passwordContainer: {
        width: '75%',
        position: 'relative',
        marginBottom: 14,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingRight: 15,
        backgroundColor: '#fbfbfb',
        fontSize: 16,
        color: '#111',
        textAlign: 'center',
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        top: '40%',
        transform: [{ translateY: -12 }],
        padding: 5,
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
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    createAccountButton: {
        marginTop: 12,
        width: '75%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    createAccountText: {
        color: '#5A7A8C',
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
});
