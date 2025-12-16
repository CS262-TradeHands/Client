import type { BuyerInput } from '@/types/buyer';
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

// Form data aligned with backend `Buyer` model
interface BuyerFormData {
  title: string;                 // e.g. 'Investor'
  about: string;                 // buyer profile description (maps to `about`)
  city: string;                  // required
  state?: string;                // optional
  country: string;               // required
  industryPreferences: string[]; // array of preferred industry preferences (maps to `industries`)
  budgetLower: string;           // numeric string
  budgetHigher: string;          // numeric string
  experience: string;            // years (numeric string)
  timeline: string;              // months (numeric string)
  sizePreference: string;        // chosen company size category
  linkedin?: string;             // linkedin profile url (maps to `linkedin_url`)
}


const INDUSTRY_PREFERENCES = [
  'Tech', 'Retail', 'Service', 'Food & Beverage', 'Healthcare', 
  'Manufacturing', 'Construction', 'Finance', 'Education', 'Other'
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
  const { isAuthenticated, user } = useAuth();

  // Single-page form matching buyer.ts fields
  const [formData, setFormData] = useState<BuyerFormData>({
    title: '',
    about: '',
    city: '',
    state: '',
    country: '',
    industryPreferences: [],
    budgetLower: '',
    budgetHigher: '',
    experience: '',
    timeline: '',
    sizePreference: '',
    linkedin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';


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

  const handleSubmit = async () => {
    // Ensure user is signed in
    if (!isAuthenticated || !user?.user_id) {
      Alert.alert('Not signed in', 'Please sign in to create a buyer profile.');
      router.push('/sign-in-form');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Missing required field', 'Please enter a Title (e.g. "Investor").');
      return;
    }

    if (!formData.about.trim()) {
      Alert.alert('Missing required field', 'Please enter a short Profile Description.');
      return;
    }

    if (!(formData.industryPreferences && formData.industryPreferences.length > 0)) {
      Alert.alert('Missing required field', 'Please select at least one Industry Preference.');
      return;
    }

    if (!formData.budgetLower.trim() || !formData.budgetHigher.trim()) {
      Alert.alert('Missing required field', 'Please enter a budget range (lower and higher).');
      return;
    }

    if (!formData.city.trim() || !formData.country.trim()) {
      Alert.alert('Missing required field', 'Please enter City and Country.');
      return;
    }

    // parse numeric fields
    const experience = Number(formData.experience || 0);
    const timeline = Number(formData.timeline || 0);
    const budgetLower = Number(formData.budgetLower.replace(/[^0-9.-]+/g, ''));
    const budgetHigher = Number(formData.budgetHigher.replace(/[^0-9.-]+/g, ''));

    if (Number.isNaN(experience)) {
      Alert.alert('Invalid field', 'Please enter a valid number for Experience (years).');
      return;
    }

    if (Number.isNaN(budgetLower) || Number.isNaN(budgetHigher)) {
      Alert.alert('Invalid field', 'Please enter valid numeric values for budget range.');
      return;
    }

    // Build payload matching BuyerInput
    const payload: BuyerInput = {
      user_id: user.user_id,
      title: formData.title,
      about: formData.about,
      experience: experience,
      budget_range_lower: budgetLower,
      budget_range_higher: budgetHigher,
      city: formData.city,
      state: formData.state || '',
      country: formData.country,
      industries: formData.industryPreferences,
      size_preference: formData.sizePreference,
      timeline: timeline,
      linkedin_url: formData.linkedin || '',
    };

    setIsSubmitting(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/buyers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errBody = await resp.text();
        console.error('Create buyer failed:', resp.status, errBody);
        Alert.alert('Error', 'Failed to create buyer profile. Please try again.');
        return;
      }

      Alert.alert('Profile Created', 'Your buyer profile has been saved.', [
        { text: 'OK', onPress: () => router.push('/(tabs)/buyers') }
      ]);
    } catch (err) {
      console.error('Error creating buyer:', err);
      Alert.alert('Error', 'Failed to create buyer profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          value={formData.about}
          onChangeText={(text) => updateFormData('about', text)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location *</Text>
        <View style={styles.inlineRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="City"
            placeholderTextColor="#999"
            value={formData.city}
            onChangeText={(text) => updateFormData('city', text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="State (optional)"
            placeholderTextColor="#999"
            value={formData.state}
            onChangeText={(text) => updateFormData('state', text)}
          />
        </View>
        <View style={{ marginTop: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#999"
          value={formData.country}
          onChangeText={(text) => updateFormData('country', text)}
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
        <View style={styles.inlineRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lower"
            placeholderTextColor="#999"
            value={formData.budgetLower}
            onChangeText={(text) => updateFormData('budgetLower', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Higher"
            placeholderTextColor="#999"
            value={formData.budgetHigher}
            onChangeText={(text) => updateFormData('budgetHigher', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience (years) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          placeholderTextColor="#999"
          value={formData.experience}
          onChangeText={(text) => updateFormData('experience', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acquisition Timeline (months)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 6"
          placeholderTextColor="#999"
          value={formData.timeline}
          onChangeText={(text) => updateFormData('timeline', text)}
          keyboardType="numeric"
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
            style={[styles.navButton, styles.navButtonPrimary, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.navButtonText}>{isSubmitting ? 'Saving...' : 'Save Profile'}</Text>
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
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
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
