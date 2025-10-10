import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BuyerFormData {
  name: string;
  email: string;
  phone: string;
  industryExperience: string[];
  targetIndustries: string[];
  maxBudget: string;
  preferredSize: string;
  timeline: string;
}

export default function BuyerOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BuyerFormData>({
    name: '',
    email: '',
    phone: '',
    industryExperience: [],
    targetIndustries: [],
    maxBudget: '',
    preferredSize: '',
    timeline: '',
  });

  const industries = ['Tech', 'Retail', 'Service', 'Manufacturing', 'Healthcare', 'Finance', 'Education', 'Food & Beverage'];
  const businessSizes = [
    { value: 'small', label: 'Small (1-10 employees)' },
    { value: 'medium', label: 'Medium (11-50 employees)' },
    { value: 'large', label: 'Large (50+ employees)' }
  ];
  const timelines = ['3-6 months', '6-12 months', '1-2 years', '2+ years'];

  const handleIndustryExperienceToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industryExperience: prev.industryExperience.includes(industry)
        ? prev.industryExperience.filter(i => i !== industry)
        : [...prev.industryExperience, industry]
    }));
  };

  const handleTargetIndustriesToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      targetIndustries: prev.targetIndustries.includes(industry)
        ? prev.targetIndustries.filter(i => i !== industry)
        : [...prev.targetIndustries, industry]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Show success message briefly, then navigate
    Alert.alert('Success!', 'Your buyer profile has been created successfully!');
    setTimeout(() => {
      router.push('/business-listings');
    }, 1000);
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>About You</Text>
      <Text style={styles.stepDescription}>Tell us a bit about yourself</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Industry Experience</Text>
        <Text style={styles.checkboxLabel}>Select all that apply:</Text>
        {industries.map((industry) => (
          <TouchableOpacity
            key={industry}
            style={styles.checkboxContainer}
            onPress={() => handleIndustryExperienceToggle(industry)}
          >
            <View style={[
              styles.checkbox,
              formData.industryExperience.includes(industry) && styles.checkboxSelected
            ]}>
              {formData.industryExperience.includes(industry) && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>{industry}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What You're Looking For</Text>
      <Text style={styles.stepDescription}>Help us find the perfect business for you</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Target Industries</Text>
        <Text style={styles.checkboxLabel}>Select industries you're interested in:</Text>
        {industries.map((industry) => (
          <TouchableOpacity
            key={industry}
            style={styles.checkboxContainer}
            onPress={() => handleTargetIndustriesToggle(industry)}
          >
            <View style={[
              styles.checkbox,
              formData.targetIndustries.includes(industry) && styles.checkboxSelected
            ]}>
              {formData.targetIndustries.includes(industry) && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>{industry}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Maximum Budget</Text>
        <TextInput
          style={styles.input}
          value={formData.maxBudget}
          onChangeText={(text) => setFormData(prev => ({ ...prev, maxBudget: text }))}
          placeholder="e.g., $500,000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Business Size</Text>
        {businessSizes.map((size) => (
          <TouchableOpacity
            key={size.value}
            style={styles.radioContainer}
            onPress={() => setFormData(prev => ({ ...prev, preferredSize: size.value }))}
          >
            <View style={[
              styles.radio,
              formData.preferredSize === size.value && styles.radioSelected
            ]}>
              {formData.preferredSize === size.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>{size.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Timeline to Acquire</Text>
        {timelines.map((timeline) => (
          <TouchableOpacity
            key={timeline}
            style={[
              styles.timelineButton,
              formData.timeline === timeline && styles.timelineButtonSelected
            ]}
            onPress={() => setFormData(prev => ({ ...prev, timeline }))}
          >
            <Text style={[
              styles.timelineButtonText,
              formData.timeline === timeline && styles.timelineButtonTextSelected
            ]}>
              {timeline}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm & Finish</Text>
      <Text style={styles.stepDescription}>Review your information before proceeding</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Personal Information</Text>
        <Text style={styles.summaryText}>Name: {formData.name}</Text>
        <Text style={styles.summaryText}>Email: {formData.email}</Text>
        {formData.phone && <Text style={styles.summaryText}>Phone: {formData.phone}</Text>}
        <Text style={styles.summaryText}>
          Experience: {formData.industryExperience.length > 0 ? formData.industryExperience.join(', ') : 'None selected'}
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Preferences</Text>
        <Text style={styles.summaryText}>
          Target Industries: {formData.targetIndustries.length > 0 ? formData.targetIndustries.join(', ') : 'None selected'}
        </Text>
        <Text style={styles.summaryText}>Max Budget: {formData.maxBudget || 'Not specified'}</Text>
        <Text style={styles.summaryText}>
          Preferred Size: {businessSizes.find(s => s.value === formData.preferredSize)?.label || 'Not selected'}
        </Text>
        <Text style={styles.summaryText}>Timeline: {formData.timeline || 'Not selected'}</Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aspiring Entrepreneur Onboarding</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, currentStep >= 1 && styles.progressStepActive]} />
          <View style={[styles.progressStep, currentStep >= 2 && styles.progressStepActive]} />
          <View style={[styles.progressStep, currentStep >= 3 && styles.progressStepActive]} />
        </View>
        <Text style={styles.stepIndicator}>Step {currentStep} of 3</Text>
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity 
            style={[styles.primaryButton, (!formData.name || !formData.email) && styles.buttonDisabled]} 
            onPress={nextStep}
            disabled={!formData.name || !formData.email}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
            <Text style={styles.primaryButtonText}>View Listings</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressStep: {
    width: 30,
    height: 4,
    backgroundColor: '#e9ecef',
    marginHorizontal: 5,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#007BFF',
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#333',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#007BFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  timelineButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  timelineButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  timelineButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timelineButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  secondaryButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});