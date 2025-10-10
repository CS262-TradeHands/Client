import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OwnerFormData {
  businessName: string;
  businessIndustry: string;
  yearsInOperation: string;
  location: string;
  askingPriceRange: string;
  annualRevenue: string;
  numberOfEmployees: string;
}

export default function OwnerOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OwnerFormData>({
    businessName: '',
    businessIndustry: '',
    yearsInOperation: '',
    location: '',
    askingPriceRange: '',
    annualRevenue: '',
    numberOfEmployees: '',
  });

  const industries = ['Tech', 'Retail', 'Service', 'Manufacturing', 'Healthcare', 'Finance', 'Education', 'Food & Beverage', 'Real Estate', 'Consulting'];
  const priceRanges = [
    { value: 'under-100k', label: 'Under $100,000' },
    { value: '100k-250k', label: '$100,000 - $250,000' },
    { value: '250k-500k', label: '$250,000 - $500,000' },
    { value: '500k-1m', label: '$500,000 - $1,000,000' },
    { value: '1m-plus', label: '$1,000,000+' }
  ];

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
    Alert.alert('Success!', 'Your business listing has been created successfully!');
    setTimeout(() => {
      router.push('/owner-dashboard');
    }, 1000);
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>About Your Business</Text>
      <Text style={styles.stepDescription}>Tell us about the business you're looking to sell</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.businessName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
          placeholder="Enter your business name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Industry *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industryContainer}>
          {industries.map((industry) => (
            <TouchableOpacity
              key={industry}
              style={[
                styles.industryButton,
                formData.businessIndustry === industry && styles.industryButtonSelected
              ]}
              onPress={() => setFormData(prev => ({ ...prev, businessIndustry: industry }))}
            >
              <Text style={[
                styles.industryButtonText,
                formData.businessIndustry === industry && styles.industryButtonTextSelected
              ]}>
                {industry}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years in Operation *</Text>
        <TextInput
          style={styles.input}
          value={formData.yearsInOperation}
          onChangeText={(text) => setFormData(prev => ({ ...prev, yearsInOperation: text }))}
          placeholder="e.g., 5"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location (City, State) *</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          placeholder="e.g., San Francisco, CA"
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Financial Snapshot</Text>
      <Text style={styles.stepDescription}>Provide key financial information for potential buyers</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Asking Price Range *</Text>
        {priceRanges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.priceButton,
              formData.askingPriceRange === range.value && styles.priceButtonSelected
            ]}
            onPress={() => setFormData(prev => ({ ...prev, askingPriceRange: range.value }))}
          >
            <Text style={[
              styles.priceButtonText,
              formData.askingPriceRange === range.value && styles.priceButtonTextSelected
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Annual Revenue (Approximate) *</Text>
        <TextInput
          style={styles.input}
          value={formData.annualRevenue}
          onChangeText={(text) => setFormData(prev => ({ ...prev, annualRevenue: text }))}
          placeholder="e.g., $500,000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Employees *</Text>
        <TextInput
          style={styles.input}
          value={formData.numberOfEmployees}
          onChangeText={(text) => setFormData(prev => ({ ...prev, numberOfEmployees: text }))}
          placeholder="e.g., 12"
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>List & Launch</Text>
      <Text style={styles.stepDescription}>Review your listing and launch it to find interested buyers</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Business Information</Text>
        <Text style={styles.summaryText}>Business Name: {formData.businessName}</Text>
        <Text style={styles.summaryText}>Industry: {formData.businessIndustry}</Text>
        <Text style={styles.summaryText}>Years in Operation: {formData.yearsInOperation}</Text>
        <Text style={styles.summaryText}>Location: {formData.location}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Financial Details</Text>
        <Text style={styles.summaryText}>
          Asking Price: {priceRanges.find(r => r.value === formData.askingPriceRange)?.label || 'Not selected'}
        </Text>
        <Text style={styles.summaryText}>Annual Revenue: {formData.annualRevenue || 'Not specified'}</Text>
        <Text style={styles.summaryText}>Employees: {formData.numberOfEmployees || 'Not specified'}</Text>
      </View>

      <View style={styles.imageUploadContainer}>
        <Text style={styles.label}>Business Image (Optional)</Text>
        <TouchableOpacity style={styles.imageUploadButton}>
          <Text style={styles.imageUploadText}>📷 Upload Business Photo</Text>
          <Text style={styles.imageUploadSubtext}>Tap to add a photo of your business</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const isStep1Valid = formData.businessName && formData.businessIndustry && formData.yearsInOperation && formData.location;
  const isStep2Valid = formData.askingPriceRange && formData.annualRevenue && formData.numberOfEmployees;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Retiring Business Owner Onboarding</Text>
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
            style={[styles.primaryButton, ((currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)) && styles.buttonDisabled]} 
            onPress={nextStep}
            disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
            <Text style={styles.primaryButtonText}>View Dashboard</Text>
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
    backgroundColor: '#28a745',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  industryContainer: {
    marginBottom: 10,
  },
  industryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  industryButtonSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  industryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  industryButtonTextSelected: {
    color: '#fff',
  },
  priceButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  priceButtonSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  priceButtonText: {
    fontSize: 16,
    color: '#333',
  },
  priceButtonTextSelected: {
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
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  imageUploadSubtext: {
    fontSize: 14,
    color: '#999',
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
    backgroundColor: '#28a745',
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
    borderColor: '#28a745',
  },
  secondaryButtonText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});