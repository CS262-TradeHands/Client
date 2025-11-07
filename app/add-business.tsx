import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BusinessFormData {
  name: string;
  industry: string;
  askingPrice: string;
  location: string;
  description: string;
  employees: string;
  yearsInOperation: string;
}

const industries = [
  'Tech', 'Retail', 'Service', 'Food & Beverage', 'Healthcare', 
  'Manufacturing', 'Construction', 'Finance', 'Education', 'Other'
];

export default function AddBusinessScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    industry: '',
    askingPrice: '',
    location: '',
    description: '',
    employees: '',
    yearsInOperation: ''
  });
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  const handleInputChange = (field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndustrySelect = (industry: string) => {
    handleInputChange('industry', industry);
    setShowIndustryPicker(false);
  };

  const validateForm = (): boolean => {
    const { name, industry, location, description, employees, yearsInOperation } = formData;
    
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Business name is required');
      return false;
    }
    if (!industry.trim()) {
      Alert.alert('Validation Error', 'Please select an industry');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Location is required');
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Here you would typically send the data to your backend
    console.log('Submitting business listing:', formData);
    
    Alert.alert(
      'Success',
      'Your business listing has been submitted and will be reviewed shortly.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
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
              <View style={styles.pickerOptions}>
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={styles.pickerOption}
                    onPress={() => handleIndustrySelect(industry)}
                  >
                    <Text style={styles.pickerOptionText}>{industry}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="e.g., San Francisco, CA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Asking Price</Text>
            <TextInput
              style={styles.input}
              value={formData.askingPrice}
              onChangeText={(value) => handleInputChange('askingPrice', value)}
              placeholder="e.g., $250,000 - $300,000"
              placeholderTextColor="#999"
            />
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
    backgroundColor: '#0d2569ff',
  },
  header: {
    backgroundColor: '#0f42cfff',
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
    backgroundColor: '#007BFF',
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
