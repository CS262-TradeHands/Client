import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

// Simplified buyer profile data matching the domain model
interface BuyerFormData {
  // Profile fields (minimal, important only)
  title: string;                 // one- or two-word title e.g. 'Investor'
  description: string;           // buyer profile description
  location: string;              // preferred location
  industryPreferences: string[]; // array of preferred industry preferences
  budget: string;                // budget, free text (e.g. 500000)
  experience: string;            // short experience summary
  timeline: string;              // acquisition timeline
  sizePreference: string;        // chosen company size category
  linkedin?: string;             // linkedin profile url (optional)
}


const INDUSTRY_PREFERENCES = [
  'Technology',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Food & Beverage',
  'Professional Services',
  'E-commerce',
  'Real Estate',
  'Construction',
  'Transportation',
  'Education',
  'Entertainment',
  'Other'
];

const SIZE_PREFERENCES = [
  'Small — up to 20 employees (~$15k/month)',
  'Small-Medium — 20-50 employees (~$40k/month)',
  'Medium — 50-200 employees (~$150k/month)',
  'Large — 200+ employees (~$500k/month)'
];

// removed unused buyer type and business model lists — form simplified

export default function AddBuyerScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // Single-page simplified form matching the UML: only essential fields
  const [formData, setFormData] = useState<BuyerFormData>({
    title: '',
    description: '',
    location: '',
    industryPreferences: [],
    budget: '',
    experience: '',
    timeline: '',
    sizePreference: '',
    linkedin: '',
  });

  const updateFormData = (field: keyof BuyerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof BuyerFormData, item: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray);
  };

  const handleSubmit = () => {
    // Validation: require title, description, at least one industry preference, and budget
    if (!formData.title.trim()) {
      Alert.alert('Missing required field', 'Please enter a Title (e.g. "Investor").');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Missing required field', 'Please enter a short Profile Description.');
      return;
    }

    if (!(formData.industryPreferences && formData.industryPreferences.length > 0)) {
      Alert.alert('Missing required field', 'Please select at least one Industry Preference.');
      return;
    }

    if (!formData.budget.trim()) {
      Alert.alert('Missing required field', 'Please enter an approximate Budget.');
      return;
    }

    // Normally send to API here. For now show success and return to buyers list
    Alert.alert('Profile Created', 'Your buyer profile has been saved.', [
      { text: 'OK', onPress: () => router.push('/(tabs)/buyers') }
    ]);
  };

  // (single-page form — no step indicators)

  const renderMultiSelect = (
    title: string,
    options: string[],
    field: keyof BuyerFormData
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.multiSelectContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.multiSelectOption,
              (formData[field] as string[]).includes(option) && styles.multiSelectOptionSelected
            ]}
            onPress={() => toggleArrayItem(field, option)}
          >
            <Text style={[
              styles.multiSelectOptionText,
              (formData[field] as string[]).includes(option) && styles.multiSelectOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Single, compact form sections
  const renderForm = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Investor, Operator"
          placeholderTextColor="#999"
          value={formData.title}
          onChangeText={(text) => updateFormData('title', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Description *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Briefly describe your buying interests and background..."
          placeholderTextColor="#999"
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="City, region, or 'National'"
          placeholderTextColor="#999"
          value={formData.location}
          onChangeText={(text) => updateFormData('location', text)}
        />
      </View>

      {renderMultiSelect('Industry Preferences *', INDUSTRY_PREFERENCES, 'industryPreferences')}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Size Preference</Text>
        <View style={styles.radioGroup}>
          {SIZE_PREFERENCES.map(size => (
            <TouchableOpacity
              key={size}
              style={[styles.radioOption, formData.sizePreference === size && styles.radioOptionSelected]}
              onPress={() => updateFormData('sizePreference', size)}
            >
              <Text style={[styles.radioOptionText, formData.sizePreference === size && styles.radioOptionTextSelected]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget (approx.) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 500000"
          placeholderTextColor="#999"
          value={formData.budget}
          onChangeText={(text) => updateFormData('budget', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience Summary</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Years in industry, relevant roles, etc."
          placeholderTextColor="#999"
          value={formData.experience}
          onChangeText={(text) => updateFormData('experience', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acquisition Timeline</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 3-6 months, flexible"
          placeholderTextColor="#999"
          value={formData.timeline}
          onChangeText={(text) => updateFormData('timeline', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LinkedIn Profile (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://www.linkedin.com/in/yourprofile"
          placeholderTextColor="#999"
          value={formData.linkedin}
          onChangeText={(text) => updateFormData('linkedin', text)}
          autoCapitalize="none"
        />
      </View>
    </ScrollView>
  );

  const renderCurrentStep = () => renderForm();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.authBackButton}>
          <Text style={styles.authBackButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.authPrompt}>
          <Ionicons name="lock-closed-outline" size={48} color="#5A7A8C" />
          <Text style={styles.authPromptTitle}>Sign In Required</Text>
          <Text style={styles.authPromptText}>Please sign in to create a buyer profile.</Text>
          <TouchableOpacity
            style={styles.authPromptButton}
            onPress={() => router.push('/sign-in')}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5A7A8C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Buyer Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {renderCurrentStep()}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={() => router.back()}
          >
            <Text style={styles.navButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleSubmit}
          >
            <Text style={styles.navButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: '#5A7A8C',
  },
  stepDotInactive: {
    backgroundColor: '#d0d0d0',
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  radioGroup: {
    gap: 8,
  },
  radioOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  radioOptionSelected: {
    borderColor: '#5A7A8C',
    backgroundColor: '#f0f8ff',
  },
  radioOptionText: {
    fontSize: 16,
    color: '#666',
  },
  radioOptionTextSelected: {
    color: '#5A7A8C',
    fontWeight: '500',
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  multiSelectOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  multiSelectOptionSelected: {
    borderColor: '#5A7A8C',
    backgroundColor: '#5A7A8C',
  },
  multiSelectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  multiSelectOptionTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxSelected: {},
  checkboxText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonPrimary: {
    backgroundColor: '#5A7A8C',
  },
  navButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5A7A8C',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextSecondary: {
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
