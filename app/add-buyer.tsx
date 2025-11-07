import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

interface BuyerFormData {
  // Essential Information
  buyerType: string;
  industryExperience: string;
  previousAcquisitions: string;
  budgetRange: string;
  financingStatus: string;
  proofOfFunds: boolean;
  
  // Target Business Criteria
  industryPreferences: string[];
  geographicRegion: string;
  businessSize: string;
  businessModel: string[];
  timeline: string;
  
  // Buyer Intentions
  operatingStyle: string;
  employeeRetention: string;
  growthStrategy: string;
  relocationWillingness: string;
  
  // Contact & Profile
  fullName: string;
  email: string;
  phone: string;
  professionalBackground: string;
  linkedinProfile: string;
  confidentialityPreference: string;
  
  // Deal Preferences
  transitionPeriod: string;
  purchaseType: string;
  nonCompeteExpectation: string;
  earnoutWillingness: string;
  
  // Additional Considerations
  acquisitionReason: string;
  dealBreakers: string;
  certifications: string;
}

const BUYER_TYPES = [
  'Individual Buyer',
  'Investment Group',
  'Private Equity',
  'Competitor',
  'Employee Buyout',
  'Strategic Acquirer',
  'Other'
];

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

const BUSINESS_MODELS = [
  'B2B',
  'B2C',
  'E-commerce',
  'Brick & Mortar',
  'SaaS',
  'Subscription',
  'Marketplace',
  'Franchise',
  'Service-based'
];

export default function AddBuyerScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BuyerFormData>({
    buyerType: '',
    industryExperience: '',
    previousAcquisitions: '',
    budgetRange: '',
    financingStatus: '',
    proofOfFunds: false,
    industryPreferences: [],
    geographicRegion: '',
    businessSize: '',
    businessModel: [],
    timeline: '',
    operatingStyle: '',
    employeeRetention: '',
    growthStrategy: '',
    relocationWillingness: '',
    fullName: '',
    email: '',
    phone: '',
    professionalBackground: '',
    linkedinProfile: '',
    confidentialityPreference: '',
    transitionPeriod: '',
    purchaseType: '',
    nonCompeteExpectation: '',
    earnoutWillingness: '',
    acquisitionReason: '',
    dealBreakers: '',
    certifications: ''
  });

  const totalSteps = 5;

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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your API
    Alert.alert(
      'Profile Created!',
      'Your buyer profile has been created successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i + 1 <= currentStep ? styles.stepDotActive : styles.stepDotInactive
          ]}
        />
      ))}
    </View>
  );

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

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Buyer Type & Background</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buyer Type *</Text>
        <View style={styles.radioGroup}>
          {BUYER_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.radioOption,
                formData.buyerType === type && styles.radioOptionSelected
              ]}
              onPress={() => updateFormData('buyerType', type)}
            >
              <Text style={[
                styles.radioOptionText,
                formData.buyerType === type && styles.radioOptionTextSelected
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Industry Experience *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your industry experience and expertise..."
          value={formData.industryExperience}
          onChangeText={(text) => updateFormData('industryExperience', text)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Acquisitions</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe any previous business ownership or acquisition experience..."
          value={formData.previousAcquisitions}
          onChangeText={(text) => updateFormData('previousAcquisitions', text)}
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Financial Capacity</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Range *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., $500K - $2M"
          value={formData.budgetRange}
          onChangeText={(text) => updateFormData('budgetRange', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financing Status *</Text>
        <View style={styles.radioGroup}>
          {['Cash Buyer', 'Pre-approved Financing', 'Needs Financing', 'SBA Qualified', 'Other'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.radioOption,
                formData.financingStatus === status && styles.radioOptionSelected
              ]}
              onPress={() => updateFormData('financingStatus', status)}
            >
              <Text style={[
                styles.radioOptionText,
                formData.financingStatus === status && styles.radioOptionTextSelected
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.checkboxContainer, formData.proofOfFunds && styles.checkboxSelected]}
          onPress={() => updateFormData('proofOfFunds', !formData.proofOfFunds)}
        >
          <Ionicons 
            name={formData.proofOfFunds ? 'checkbox' : 'square-outline'} 
            size={24} 
            color={formData.proofOfFunds ? '#007AFF' : '#666'} 
          />
          <Text style={styles.checkboxText}>I can provide proof of funds when requested</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Target Business Criteria</Text>
      
      {renderMultiSelect('Industry Preferences *', INDUSTRY_PREFERENCES, 'industryPreferences')}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geographic Region *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., San Francisco Bay Area, National, etc."
          value={formData.geographicRegion}
          onChangeText={(text) => updateFormData('geographicRegion', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Size Preference</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., $1M-5M revenue, 10-50 employees"
          value={formData.businessSize}
          onChangeText={(text) => updateFormData('businessSize', text)}
        />
      </View>

      {renderMultiSelect('Business Model Preferences', BUSINESS_MODELS, 'businessModel')}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acquisition Timeline *</Text>
        <View style={styles.radioGroup}>
          {['Immediately', '3-6 months', '6-12 months', '1+ years', 'Flexible'].map(timeline => (
            <TouchableOpacity
              key={timeline}
              style={[
                styles.radioOption,
                formData.timeline === timeline && styles.radioOptionSelected
              ]}
              onPress={() => updateFormData('timeline', timeline)}
            >
              <Text style={[
                styles.radioOptionText,
                formData.timeline === timeline && styles.radioOptionTextSelected
              ]}>
                {timeline}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Contact & Deal Preferences</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={formData.fullName}
          onChangeText={(text) => updateFormData('fullName', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Background</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Brief overview of your professional background..."
          value={formData.professionalBackground}
          onChangeText={(text) => updateFormData('professionalBackground', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LinkedIn Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedinProfile}
          onChangeText={(text) => updateFormData('linkedinProfile', text)}
          autoCapitalize="none"
        />
      </View>
    </ScrollView>
  );

  const renderStep5 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Additional Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason for Acquisition</Text>
        <TextInput
          style={styles.textArea}
          placeholder="What motivates this acquisition? (career change, expansion, investment, etc.)"
          value={formData.acquisitionReason}
          onChangeText={(text) => updateFormData('acquisitionReason', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deal Breakers or Must-Haves</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any specific requirements or deal breakers..."
          value={formData.dealBreakers}
          onChangeText={(text) => updateFormData('dealBreakers', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any relevant certifications, licenses, or qualifications..."
          value={formData.certifications}
          onChangeText={(text) => updateFormData('certifications', text)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Owner Transition Preference</Text>
        <View style={styles.radioGroup}>
          {['No transition needed', '1-3 months', '3-6 months', '6+ months', 'Negotiable'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.radioOption,
                formData.transitionPeriod === period && styles.radioOptionSelected
              ]}
              onPress={() => updateFormData('transitionPeriod', period)}
            >
              <Text style={[
                styles.radioOptionText,
                formData.transitionPeriod === period && styles.radioOptionTextSelected
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Ionicons name="lock-closed-outline" size={48} color="#007AFF" />
          <Text style={styles.authPromptTitle}>Sign In Required</Text>
          <Text style={styles.authPromptText}>Please sign in to create a buyer profile.</Text>
          <TouchableOpacity
            style={styles.authPromptButton}
            onPress={() => router.push('/sign-in')}
          >
            <Text style={styles.authPromptButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Buyer Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {renderStepIndicator()}

        {renderCurrentStep()}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={handleBack}
          >
            <Text style={styles.navButtonTextSecondary}>
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentStep === totalSteps ? 'Create Profile' : 'Next'}
            </Text>
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
    backgroundColor: '#007AFF',
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
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  radioOptionText: {
    fontSize: 16,
    color: '#666',
  },
  radioOptionTextSelected: {
    color: '#007AFF',
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
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
  },
  navButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextSecondary: {
    color: '#007AFF',
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
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authPromptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
