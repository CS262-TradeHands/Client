import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InterestedBuyer {
  id: string;
  name: string;
  email: string;
  inquiryDate: string;
  status: 'new' | 'contacted' | 'interested' | 'not-interested';
}

const mockInterestedBuyers: InterestedBuyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    inquiryDate: '2024-01-15',
    status: 'new'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@business.com',
    inquiryDate: '2024-01-12',
    status: 'contacted'
  }
];

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const [listingStatus, setListingStatus] = useState<'active' | 'paused' | 'sold'>('active');
  
  // Mock business data - in a real app this would come from the onboarding form or API
  const businessData = {
    name: 'TechStart Solutions',
    industry: 'Tech',
    location: 'San Francisco, CA',
    askingPrice: '$250,000 - $300,000',
    annualRevenue: '$500,000',
    employees: 8,
    yearsInOperation: 5,
    listingDate: '2024-01-01'
  };

  const handleEditListing = () => {
    Alert.alert('Edit Listing', 'This feature will allow you to edit your business listing details.', [
      { text: 'OK' }
    ]);
  };

  const handleContactBuyer = (buyer: InterestedBuyer) => {
    Alert.alert(
      `Contact ${buyer.name}`,
      `Send a message to ${buyer.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => Alert.alert('Feature Coming Soon', 'Messaging functionality will be available soon!') }
      ]
    );
  };

  const handleUpdateBuyerStatus = (buyerId: string, newStatus: InterestedBuyer['status']) => {
    Alert.alert('Update Status', 'Buyer status updated successfully!');
  };

  const toggleListingStatus = () => {
    const newStatus = listingStatus === 'active' ? 'paused' : 'active';
    setListingStatus(newStatus);
    Alert.alert('Status Updated', `Your listing is now ${newStatus}.`);
  };

  const getStatusColor = (status: InterestedBuyer['status']) => {
    switch (status) {
      case 'new': return '#007BFF';
      case 'contacted': return '#28a745';
      case 'interested': return '#ffc107';
      case 'not-interested': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: InterestedBuyer['status']) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'interested': return 'Interested';
      case 'not-interested': return 'Not Interested';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Owner Dashboard</Text>
        <Text style={styles.subtitle}>Manage your business listing</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Business Overview</Text>
            <View style={[styles.statusBadge, { backgroundColor: listingStatus === 'active' ? '#28a745' : listingStatus === 'paused' ? '#ffc107' : '#dc3545' }]}>
              <Text style={styles.statusBadgeText}>
                {listingStatus === 'active' ? 'Active' : listingStatus === 'paused' ? 'Paused' : 'Sold'}
              </Text>
            </View>
          </View>
          
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{businessData.name}</Text>
            <Text style={styles.businessDetails}>
              {businessData.industry} • {businessData.location}
            </Text>
            <Text style={styles.businessDetails}>
              Established {businessData.yearsInOperation} years ago • {businessData.employees} employees
            </Text>
          </View>

          <View style={styles.financialInfo}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Asking Price</Text>
              <Text style={styles.financialValue}>{businessData.askingPrice}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Annual Revenue</Text>
              <Text style={styles.financialValue}>{businessData.annualRevenue}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEditListing}>
              <Text style={styles.primaryButtonText}>Edit Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={toggleListingStatus}>
              <Text style={styles.secondaryButtonText}>
                {listingStatus === 'active' ? 'Pause Listing' : 'Activate Listing'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interested Buyers Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Interested Buyers ({mockInterestedBuyers.length})</Text>
            <TouchableOpacity onPress={() => router.push('/potential-buyers')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {mockInterestedBuyers.length > 0 ? (
            mockInterestedBuyers.map((buyer) => (
              <View key={buyer.id} style={styles.buyerCard}>
                <View style={styles.buyerInfo}>
                  <Text style={styles.buyerName}>{buyer.name}</Text>
                  <Text style={styles.buyerEmail}>{buyer.email}</Text>
                  <Text style={styles.buyerDate}>Inquired on {new Date(buyer.inquiryDate).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.buyerActions}>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(buyer.status) }]}>
                    <Text style={styles.statusIndicatorText}>{getStatusLabel(buyer.status)}</Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleContactBuyer(buyer)}
                    >
                      <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noBuyersContainer}>
              <Text style={styles.noBuyersText}>No interested buyers yet</Text>
              <Text style={styles.noBuyersSubtext}>Your listing is live and visible to potential buyers</Text>
            </View>
          )}
        </View>

        {/* Listing Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Listing Statistics</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Days Listed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📊</Text>
              <Text style={styles.quickActionText}>View Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📝</Text>
              <Text style={styles.quickActionText}>Update Photos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>💰</Text>
              <Text style={styles.quickActionText}>Adjust Price</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📞</Text>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  businessInfo: {
    marginBottom: 20,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  businessDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  financialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  secondaryButtonText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  buyerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buyerDate: {
    fontSize: 12,
    color: '#999',
  },
  buyerActions: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusIndicatorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noBuyersContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noBuyersText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  noBuyersSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
});
