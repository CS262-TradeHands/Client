import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PotentialBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  industryExperience: string[];
  targetIndustries: string[];
  maxBudget: string;
  preferredSize: string;
  timeline: string;
  inquiryDate: string;
  status: 'new' | 'contacted' | 'interested' | 'qualified' | 'not-interested';
  notes: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  financingStatus: 'pre-approved' | 'in-progress' | 'not-started' | 'unknown';
  experienceLevel: 'beginner' | 'intermediate' | 'experienced' | 'expert';
}

const mockPotentialBuyers: PotentialBuyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    location: 'Austin, TX',
    industryExperience: ['Tech', 'Finance'],
    targetIndustries: ['Tech', 'Service'],
    maxBudget: '$300,000',
    preferredSize: 'Medium (11-50 employees)',
    timeline: '6-12 months',
    inquiryDate: '2024-01-15',
    status: 'new',
    notes: 'Very interested in SaaS businesses. Has experience with project management tools.',
    financingStatus: 'pre-approved',
    experienceLevel: 'experienced'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@business.com',
    phone: '(555) 345-6789',
    location: 'Seattle, WA',
    industryExperience: ['Tech', 'Manufacturing'],
    targetIndustries: ['Tech'],
    maxBudget: '$500,000',
    preferredSize: 'Large (50+ employees)',
    timeline: '3-6 months',
    inquiryDate: '2024-01-12',
    status: 'contacted',
    notes: 'Former tech executive looking to acquire and scale a business. Very serious buyer.',
    lastContactDate: '2024-01-14',
    nextFollowUp: '2024-01-20',
    financingStatus: 'pre-approved',
    experienceLevel: 'expert'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@startup.com',
    phone: '(555) 456-7890',
    location: 'Denver, CO',
    industryExperience: ['Service', 'Retail'],
    targetIndustries: ['Tech', 'Service'],
    maxBudget: '$200,000',
    preferredSize: 'Small (1-10 employees)',
    timeline: '1-2 years',
    inquiryDate: '2024-01-10',
    status: 'interested',
    notes: 'First-time buyer, very enthusiastic but needs guidance on the process.',
    lastContactDate: '2024-01-13',
    nextFollowUp: '2024-01-18',
    financingStatus: 'in-progress',
    experienceLevel: 'beginner'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@corp.com',
    phone: '(555) 567-8901',
    location: 'Miami, FL',
    industryExperience: ['Finance', 'Healthcare'],
    targetIndustries: ['Tech', 'Finance'],
    maxBudget: '$400,000',
    preferredSize: 'Medium (11-50 employees)',
    timeline: '6-12 months',
    inquiryDate: '2024-01-08',
    status: 'qualified',
    notes: 'Has successfully acquired and sold 2 businesses before. Strong track record.',
    lastContactDate: '2024-01-16',
    nextFollowUp: '2024-01-22',
    financingStatus: 'pre-approved',
    experienceLevel: 'expert'
  }
];

export default function PotentialBuyersScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBuyer, setSelectedBuyer] = useState<PotentialBuyer | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Buyers' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'not-interested', label: 'Not Interested' }
  ];

  const filteredBuyers = selectedStatus === 'all' 
    ? mockPotentialBuyers 
    : mockPotentialBuyers.filter(buyer => buyer.status === selectedStatus);

  const getStatusColor = (status: PotentialBuyer['status']) => {
    switch (status) {
      case 'new': return '#007BFF';
      case 'contacted': return '#ffc107';
      case 'interested': return '#28a745';
      case 'qualified': return '#6f42c1';
      case 'not-interested': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: PotentialBuyer['status']) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'interested': return 'Interested';
      case 'qualified': return 'Qualified';
      case 'not-interested': return 'Not Interested';
      default: return 'Unknown';
    }
  };

  const getExperienceColor = (level: PotentialBuyer['experienceLevel']) => {
    switch (level) {
      case 'beginner': return '#dc3545';
      case 'intermediate': return '#ffc107';
      case 'experienced': return '#28a745';
      case 'expert': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getFinancingColor = (status: PotentialBuyer['financingStatus']) => {
    switch (status) {
      case 'pre-approved': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'not-started': return '#dc3545';
      case 'unknown': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const handleContactBuyer = (buyer: PotentialBuyer) => {
    Alert.alert(
      `Contact ${buyer.name}`,
      `How would you like to contact ${buyer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Alert.alert('Feature Coming Soon', 'Email functionality will be available soon!') },
        { text: 'Call', onPress: () => Alert.alert('Feature Coming Soon', 'Calling functionality will be available soon!') },
        { text: 'Schedule Meeting', onPress: () => Alert.alert('Feature Coming Soon', 'Meeting scheduling will be available soon!') }
      ]
    );
  };

  const handleUpdateStatus = (buyer: PotentialBuyer, newStatus: PotentialBuyer['status']) => {
    Alert.alert('Status Updated', `${buyer.name}'s status has been updated to ${getStatusLabel(newStatus)}.`);
  };

  const handleViewDetails = (buyer: PotentialBuyer) => {
    setSelectedBuyer(buyer);
  };

  const handleAddNote = (buyer: PotentialBuyer) => {
    Alert.alert('Add Note', 'Note functionality will be available soon!');
  };

  const renderBuyerCard = (buyer: PotentialBuyer) => (
    <View key={buyer.id} style={styles.buyerCard}>
      <View style={styles.buyerHeader}>
        <View style={styles.buyerInfo}>
          <Text style={styles.buyerName}>{buyer.name}</Text>
          <Text style={styles.buyerLocation}>{buyer.location}</Text>
          <Text style={styles.buyerEmail}>{buyer.email}</Text>
        </View>
        <View style={styles.buyerStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(buyer.status) }]}>
            <Text style={styles.statusBadgeText}>{getStatusLabel(buyer.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buyerDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>{buyer.maxBudget}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timeline:</Text>
          <Text style={styles.detailValue}>{buyer.timeline}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Experience:</Text>
          <Text style={[styles.detailValue, { color: getExperienceColor(buyer.experienceLevel) }]}>
            {buyer.experienceLevel.charAt(0).toUpperCase() + buyer.experienceLevel.slice(1)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Financing:</Text>
          <Text style={[styles.detailValue, { color: getFinancingColor(buyer.financingStatus) }]}>
            {buyer.financingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
      </View>

      <View style={styles.buyerIndustries}>
        <Text style={styles.industriesLabel}>Experience:</Text>
        <View style={styles.industryTags}>
          {buyer.industryExperience.map((industry, index) => (
            <View key={index} style={styles.industryTag}>
              <Text style={styles.industryTagText}>{industry}</Text>
            </View>
          ))}
        </View>
      </View>

      {buyer.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{buyer.notes}</Text>
        </View>
      )}

      <View style={styles.buyerActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleContactBuyer(buyer)}>
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDetails(buyer)}>
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAddNote(buyer)}>
          <Text style={styles.actionButtonText}>Note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buyerFooter}>
        <Text style={styles.inquiryDate}>Inquired: {new Date(buyer.inquiryDate).toLocaleDateString()}</Text>
        {buyer.lastContactDate && (
          <Text style={styles.lastContact}>Last Contact: {new Date(buyer.lastContactDate).toLocaleDateString()}</Text>
        )}
        {buyer.nextFollowUp && (
          <Text style={styles.nextFollowUp}>Next Follow-up: {new Date(buyer.nextFollowUp).toLocaleDateString()}</Text>
        )}
      </View>
    </View>
  );

  const renderBuyerDetailModal = () => {
    if (!selectedBuyer) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedBuyer.name}</Text>
            <TouchableOpacity onPress={() => setSelectedBuyer(null)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Contact Information</Text>
              <Text style={styles.modalText}>Email: {selectedBuyer.email}</Text>
              <Text style={styles.modalText}>Phone: {selectedBuyer.phone}</Text>
              <Text style={styles.modalText}>Location: {selectedBuyer.location}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Buying Preferences</Text>
              <Text style={styles.modalText}>Max Budget: {selectedBuyer.maxBudget}</Text>
              <Text style={styles.modalText}>Preferred Size: {selectedBuyer.preferredSize}</Text>
              <Text style={styles.modalText}>Timeline: {selectedBuyer.timeline}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Experience</Text>
              <Text style={styles.modalText}>Level: {selectedBuyer.experienceLevel.charAt(0).toUpperCase() + selectedBuyer.experienceLevel.slice(1)}</Text>
              <Text style={styles.modalText}>Industries: {selectedBuyer.industryExperience.join(', ')}</Text>
              <Text style={styles.modalText}>Target Industries: {selectedBuyer.targetIndustries.join(', ')}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Financing</Text>
              <Text style={styles.modalText}>Status: {selectedBuyer.financingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
            </View>

            {selectedBuyer.notes && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Notes</Text>
                <Text style={styles.modalText}>{selectedBuyer.notes}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalActionButton} onPress={() => handleContactBuyer(selectedBuyer)}>
              <Text style={styles.modalActionButtonText}>Contact Buyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Potential Buyers</Text>
        <Text style={styles.subtitle}>Manage interested buyers for your business</Text>
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilter}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusButton,
                selectedStatus === option.value && styles.statusButtonSelected
              ]}
              onPress={() => setSelectedStatus(option.value)}
            >
              <Text style={[
                styles.statusButtonText,
                selectedStatus === option.value && styles.statusButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Buyers List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Buyer Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{mockPotentialBuyers.length}</Text>
              <Text style={styles.summaryStatLabel}>Total Buyers</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{mockPotentialBuyers.filter(b => b.status === 'new').length}</Text>
              <Text style={styles.summaryStatLabel}>New</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{mockPotentialBuyers.filter(b => b.status === 'qualified').length}</Text>
              <Text style={styles.summaryStatLabel}>Qualified</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{mockPotentialBuyers.filter(b => b.financingStatus === 'pre-approved').length}</Text>
              <Text style={styles.summaryStatLabel}>Pre-approved</Text>
            </View>
          </View>
        </View>

        {filteredBuyers.map(renderBuyerCard)}
        
        {filteredBuyers.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No buyers found for the selected status</Text>
          </View>
        )}
      </ScrollView>

      {renderBuyerDetailModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statusFilter: {
    paddingHorizontal: 20,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusButtonSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusButtonTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  buyerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buyerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  buyerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buyerEmail: {
    fontSize: 14,
    color: '#666',
  },
  buyerStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buyerDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  buyerIndustries: {
    marginBottom: 15,
  },
  industriesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  industryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  industryTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  industryTagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  buyerActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buyerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  inquiryDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  lastContact: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  nextFollowUp: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  modalActionButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
