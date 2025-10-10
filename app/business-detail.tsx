import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusinessDetail {
  id: string;
  name: string;
  industry: string;
  askingPrice: string;
  location: string;
  description: string;
  employees: number;
  yearsInOperation: number;
  annualRevenue: string;
  monthlyRevenue: string;
  profitMargin: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  reasonForSelling: string;
  keyAssets: string[];
  growthOpportunities: string[];
  financialHighlights: {
    revenue: string;
    profit: string;
    growth: string;
  };
  businessHours: string;
  website: string;
  socialMedia: string[];
}

const mockBusinessDetail: BusinessDetail = {
  id: '1',
  name: 'TechStart Solutions',
  industry: 'Tech',
  askingPrice: '$250,000 - $300,000',
  location: 'San Francisco, CA',
  description: 'TechStart Solutions is a profitable SaaS company specializing in project management tools for small to medium businesses. With a strong recurring revenue model and growing customer base, this business offers excellent growth potential for an experienced entrepreneur.',
  employees: 8,
  yearsInOperation: 5,
  annualRevenue: '$500,000',
  monthlyRevenue: '$42,000',
  profitMargin: '35%',
  ownerName: 'David Chen',
  ownerEmail: 'david@techstartsolutions.com',
  ownerPhone: '(555) 123-4567',
  reasonForSelling: 'Retiring after 25 years in tech industry. Looking to spend more time with family and travel.',
  keyAssets: [
    'Proprietary software platform',
    'Established customer base (200+ clients)',
    'Recurring revenue model',
    'Strong brand recognition',
    'Experienced development team'
  ],
  growthOpportunities: [
    'Expand to enterprise market',
    'Add mobile app development',
    'International market expansion',
    'AI/ML feature integration',
    'Partnership with larger tech companies'
  ],
  financialHighlights: {
    revenue: '$500K annual revenue',
    profit: '$175K annual profit',
    growth: '25% YoY growth'
  },
  businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
  website: 'www.techstartsolutions.com',
  socialMedia: ['LinkedIn', 'Twitter', 'GitHub']
};

export default function BusinessDetailScreen() {
  const router = useRouter();
  const [isInterested, setIsInterested] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleExpressInterest = () => {
    setIsInterested(true);
    Alert.alert(
      'Interest Expressed!',
      'Your interest has been sent to the business owner. They will contact you within 24-48 hours.',
      [
        { text: 'OK', onPress: () => setShowContactInfo(true) }
      ]
    );
  };

  const handleContactOwner = () => {
    Alert.alert(
      'Contact Owner',
      `Would you like to contact ${mockBusinessDetail.ownerName}?\n\nEmail: ${mockBusinessDetail.ownerEmail}\nPhone: ${mockBusinessDetail.ownerPhone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Alert.alert('Feature Coming Soon', 'Email functionality will be available soon!') },
        { text: 'Call', onPress: () => Alert.alert('Feature Coming Soon', 'Calling functionality will be available soon!') }
      ]
    );
  };

  const handleSaveListing = () => {
    Alert.alert('Saved!', 'This listing has been saved to your favorites.');
  };

  const handleShareListing = () => {
    Alert.alert('Share', 'Share this listing with your network or advisors.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton} onPress={handleSaveListing}>
            <Text style={styles.headerActionText}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton} onPress={handleShareListing}>
            <Text style={styles.headerActionText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Header */}
        <View style={styles.businessHeader}>
          <Text style={styles.businessName}>{mockBusinessDetail.name}</Text>
          <View style={styles.businessMeta}>
            <View style={styles.industryBadge}>
              <Text style={styles.industryBadgeText}>{mockBusinessDetail.industry}</Text>
            </View>
            <Text style={styles.location}>{mockBusinessDetail.location}</Text>
          </View>
          <Text style={styles.askingPrice}>{mockBusinessDetail.askingPrice}</Text>
        </View>

        {/* Business Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📸</Text>
            <Text style={styles.imagePlaceholderSubtext}>Business Photos</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockBusinessDetail.annualRevenue}</Text>
            <Text style={styles.statLabel}>Annual Revenue</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockBusinessDetail.profitMargin}</Text>
            <Text style={styles.statLabel}>Profit Margin</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockBusinessDetail.employees}</Text>
            <Text style={styles.statLabel}>Employees</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockBusinessDetail.yearsInOperation}</Text>
            <Text style={styles.statLabel}>Years Operating</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Description</Text>
          <Text style={styles.sectionContent}>{mockBusinessDetail.description}</Text>
        </View>

        {/* Financial Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Highlights</Text>
          <View style={styles.financialGrid}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Annual Revenue</Text>
              <Text style={styles.financialValue}>{mockBusinessDetail.financialHighlights.revenue}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Annual Profit</Text>
              <Text style={styles.financialValue}>{mockBusinessDetail.financialHighlights.profit}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Growth Rate</Text>
              <Text style={styles.financialValue}>{mockBusinessDetail.financialHighlights.growth}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Monthly Revenue</Text>
              <Text style={styles.financialValue}>{mockBusinessDetail.monthlyRevenue}</Text>
            </View>
          </View>
        </View>

        {/* Key Assets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Assets</Text>
          {mockBusinessDetail.keyAssets.map((asset, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{asset}</Text>
            </View>
          ))}
        </View>

        {/* Growth Opportunities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Opportunities</Text>
          {mockBusinessDetail.growthOpportunities.map((opportunity, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{opportunity}</Text>
            </View>
          ))}
        </View>

        {/* Reason for Selling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Selling</Text>
          <Text style={styles.sectionContent}>{mockBusinessDetail.reasonForSelling}</Text>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Business Hours</Text>
              <Text style={styles.infoValue}>{mockBusinessDetail.businessHours}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Website</Text>
              <Text style={styles.infoValue}>{mockBusinessDetail.website}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Social Media</Text>
              <Text style={styles.infoValue}>{mockBusinessDetail.socialMedia.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Owner Information */}
        {showContactInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <View style={styles.ownerCard}>
              <Text style={styles.ownerName}>{mockBusinessDetail.ownerName}</Text>
              <Text style={styles.ownerEmail}>{mockBusinessDetail.ownerEmail}</Text>
              <Text style={styles.ownerPhone}>{mockBusinessDetail.ownerPhone}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {!isInterested ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleExpressInterest}>
            <Text style={styles.primaryButtonText}>Express Interest</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerActionButton: {
    padding: 8,
  },
  headerActionText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  businessHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  businessName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  businessMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  industryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 15,
  },
  industryBadgeText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  askingPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 48,
    marginBottom: 10,
  },
  imagePlaceholderSubtext: {
    fontSize: 16,
    color: '#666',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  financialItem: {
    width: '47%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  financialLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    color: '#007BFF',
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  infoGrid: {
    gap: 15,
  },
  infoItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  ownerCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ownerEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  ownerPhone: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
