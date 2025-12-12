import { User } from '@/types/user';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';


export default function SignInFormScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const [error, setError] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

    const handleSignIn = async () => {
        try {
            // Call the API to validate user credentials
            const response = await fetch(`${API_BASE_URL}/users`);
            const userData = await response.json();
            setUsers(userData);

            const potentialUser = users.find(u => u.email === email && u.password_hash === password);
            if (potentialUser) {
                signIn(potentialUser);
                router.replace('/(tabs)/profile');
            } else {
                setError("Email or password do not match. Please try again.")
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Image
                source={require('../assets/images/handshake-logo.png')}
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
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#777"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push('/create-account')}>
                    <Text style={styles.createAccountText}>Create account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
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
