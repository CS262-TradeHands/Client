// FILE: app/edit-buyer.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// NOTE: need to connect to the database to fetch and update business listing data
// This is a placeholder implementation focusing on the UI and navigation aspects.

export default function EditBuyerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;

  const handleSave = () => {
    // 1. Collect form data
    // 2. Validate data
    // 3. Send updated data to API
    Alert.alert('Success', `Buyer Profile (ID: ${id}) updated successfully!`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5A7A8C" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Buyer Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Profile ID: {id}</Text>
        <Text style={styles.placeholderText}>
            [Placeholder for the Buyer Profile Edit Form]
        </Text>
        <Text style={styles.placeholderText}>
            (Content would be a multi-step form similar to add-buyer.tsx, pre-populated with data for ID: {id})
        </Text>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#5A7A8C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});