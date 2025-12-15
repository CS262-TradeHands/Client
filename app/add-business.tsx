import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ListingInput } from '../types/listing';

interface BusinessFormData {
  name: string;
  industry: string;
  industryOther?: string;
  city: string;
  state: string;
  country: string;
  askingPriceLower: string;
  askingPriceUpper: string;
  description: string;
  imageUrl: string;
  employees: string;
  yearsInOperation: string;
  annualRevenue: string;
  monthlyRevenue: string;
  profitMargin: string;
  timeline: string;
  website: string;
}

const industries = [
  'Tech', 'Retail', 'Service', 'Food & Beverage', 'Healthcare', 
  'Manufacturing', 'Construction', 'Finance', 'Education', 'Other'
];

export default function AddBusinessScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    industry: '',
    industryOther: '',
    city: '',
    state: '',
    country: '',
    askingPriceLower: '',
    askingPriceUpper: '',
    description: '',
    imageUrl: '',
    employees: '',
    yearsInOperation: '',
    annualRevenue: '',
    monthlyRevenue: '',
    profitMargin: '',
    timeline: '',
    website: ''
  });
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  const handleInputChange = (field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndustrySelect = (industry: string) => {
    handleInputChange('industry', industry);
    if (industry !== 'Other') {
      // clear any previous other value
      handleInputChange('industryOther' as any, '');
    }
    setShowIndustryPicker(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!isAuthenticated || !user?.user_id) {
      Alert.alert('Authentication Required', 'You must be signed in to create a listing.');
      router.push('/sign-in-form' as any);
      return;
    }

    const owner_id = Number(user.user_id);
    const city = formData.city.trim();
    const state = formData.state.trim();
    const country = formData.country.trim();

    const asking_price_lower_bound = Number(formData.askingPriceLower) || 0;
    const asking_price_upper_bound = Number(formData.askingPriceUpper) || asking_price_lower_bound;

    const input: ListingInput = {
      owner_id,
      name: formData.name.trim(),
      industry: formData.industry === 'Other' ? (formData.industryOther || '').trim() : formData.industry.trim(),
      city,
      state,
      country,
      asking_price_upper_bound,
      asking_price_lower_bound,
      description: formData.description.trim(),
      image_url: formData.imageUrl?.trim() || '',
      employees: Number(formData.employees) || 0,
      years_in_operation: Number(formData.yearsInOperation) || 0,
      annual_revenue: Number(formData.annualRevenue) || 0,
      monthly_revenue: Number(formData.monthlyRevenue) || 0,
      profit_margin: Number(formData.profitMargin) || 0,
      timeline: Number(formData.timeline) || 0,
      website: formData.website?.trim() || '',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Failed to create listing:', errText);
        Alert.alert('Error', 'There was a problem creating your listing. Please try again.');
        return;
      }

      const created = await res.json();
      console.log('Created listing:', created);
      Alert.alert('Success', 'Your business listing has been submitted and will be reviewed shortly.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Error creating listing:', err);
      Alert.alert('Network Error', 'Unable to reach the server. Please try again later.');
    }
  };

  const validateForm = (): boolean => {
    const { name, industry, industryOther, city, country, description, employees, yearsInOperation, askingPriceLower, askingPriceUpper, annualRevenue, monthlyRevenue, profitMargin, timeline } = formData;
    
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Business name is required');
      return false;
    }
    if (!industry.trim()) {
      Alert.alert('Validation Error', 'Please select an industry');
      return false;
    }
    if (industry === 'Other' && (!industryOther || !industryOther.trim())) {
      Alert.alert('Validation Error', 'Please specify the industry');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return false;
    }
    if (!country.trim()) {
      Alert.alert('Validation Error', 'Country is required');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Business description is required');
      return false;
    }
    if (!employees.trim() || isNaN(Number(employees)) || Number(employees) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid number of employees');
      return false;
    }
    if (!yearsInOperation.trim() || isNaN(Number(yearsInOperation)) || Number(yearsInOperation) < 0) {
      Alert.alert('Validation Error', 'Please enter valid years in operation');
      return false;
    }

    // Asking price bounds
    if (!askingPriceLower.trim() || isNaN(Number(askingPriceLower)) || Number(askingPriceLower) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid asking price lower bound');
      return false;
    }
    if (!askingPriceUpper.trim() || isNaN(Number(askingPriceUpper)) || Number(askingPriceUpper) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid asking price upper bound');
      return false;
    }
    if (Number(askingPriceUpper) < Number(askingPriceLower)) {
      Alert.alert('Validation Error', 'Asking price upper bound cannot be less than lower bound');
      return false;
    }

    // Financials and timeline
    if (!annualRevenue.trim() || isNaN(Number(annualRevenue)) || Number(annualRevenue) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid annual revenue number');
      return false;
    }
    if (!monthlyRevenue.trim() || isNaN(Number(monthlyRevenue)) || Number(monthlyRevenue) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid monthly revenue number');
      return false;
    }
    if (!profitMargin.trim() || isNaN(Number(profitMargin))) {
      Alert.alert('Validation Error', 'Please enter a valid profit margin number');
      return false;
    }
    if (!timeline.trim() || isNaN(Number(timeline)) || Number(timeline) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid timeline number');
      return false;
    }

    return true;
  };

  const hasFormData = () => {
    return Object.values(formData).some(value => value.trim() !== '');
  };

  const handleCancel = () => {
    if (hasFormData()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to cancel? All entered information will be lost.',
        [
          {
            text: 'Keep Editing',
            style: 'cancel'
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>Add Business Listing</Text>
        <Text style={styles.subtitle}>Share your business opportunity</Text>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter business name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Industry *</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowIndustryPicker(!showIndustryPicker)}
            >
              <Text style={[styles.pickerText, !formData.industry && styles.placeholderText]}>
                {formData.industry || 'Select industry'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {showIndustryPicker && (
              <ScrollView style={styles.pickerOptions} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={styles.pickerOption}
                    onPress={() => handleIndustrySelect(industry)}
                  >
                    <Text style={styles.pickerOptionText}>{industry}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {formData.industry === 'Other' && (
              <View style={[styles.inputGroup, { marginTop: 8, marginBottom: 0 }]}>
                <Text style={styles.label}>Please specify *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.industryOther}
                  onChangeText={(value) => handleInputChange('industryOther' as any, value)}
                  placeholder="Enter industry"
                  placeholderTextColor="#999"
                />
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="e.g., Los Angeles"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholder="e.g., California"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={(value) => handleInputChange('country', value)}
              placeholder="e.g., USA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Asking Price Lower *</Text>
              <TextInput
                style={styles.input}
                value={formData.askingPriceLower}
                onChangeText={(value) => handleInputChange('askingPriceLower', value)}
                placeholder="e.g., 250000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Asking Price Upper *</Text>
              <TextInput
                style={styles.input}
                value={formData.askingPriceUpper}
                onChangeText={(value) => handleInputChange('askingPriceUpper', value)}
                placeholder="e.g., 300000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Annual Revenue *</Text>
              <TextInput
                style={styles.input}
                value={formData.annualRevenue}
                onChangeText={(value) => handleInputChange('annualRevenue', value)}
                placeholder="e.g., 1200000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Monthly Revenue *</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyRevenue}
                onChangeText={(value) => handleInputChange('monthlyRevenue', value)}
                placeholder="e.g., 100000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Profit Margin *</Text>
              <TextInput
                style={styles.input}
                value={formData.profitMargin}
                onChangeText={(value) => handleInputChange('profitMargin', value)}
                placeholder="e.g., 12.5"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Timeline (months) *</Text>
              <TextInput
                style={styles.input}
                value={formData.timeline}
                onChangeText={(value) => handleInputChange('timeline', value)}
                placeholder="e.g., 6"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Employees *</Text>
              <TextInput
                style={styles.input}
                value={formData.employees}
                onChangeText={(value) => handleInputChange('employees', value)}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Years in Operation *</Text>
              <TextInput
                style={styles.input}
                value={formData.yearsInOperation}
                onChangeText={(value) => handleInputChange('yearsInOperation', value)}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your business, its strengths, and what makes it attractive to buyers..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.imageUrl}
              onChangeText={(value) => handleInputChange('imageUrl', value)}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(value) => handleInputChange('website', value)}
              placeholder="https://yourbusiness.com"
              placeholderTextColor="#999"
              keyboardType="url"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2A27',
  },
  header: {
    backgroundColor: '#2B4450',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  pickerOptions: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    maxHeight: 200,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#5A7A8C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
