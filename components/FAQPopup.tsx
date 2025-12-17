import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/theme';

export default function FAQPopup() {
    const { isAuthenticated } = useAuth();
    const [visible, setVisible] = useState(true);

    // Only show if not authenticated
    if (isAuthenticated || !visible) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setVisible(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Questions?</Text>
                <Text style={styles.text}>Sign in to view the FAQ!</Text>
                <View style={styles.arrow} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90, // Position above the tab bar
        right: 20,  // Align roughly with the 3rd tab
        zIndex: 1000,
        maxWidth: 200,
    },
    bubble: {
        backgroundColor: Colors.light.tint, // Use the navy color
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    arrow: {
        position: 'absolute',
        bottom: -10,
        right: 20,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.light.tint, // Match bubble color
    },
    closeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
