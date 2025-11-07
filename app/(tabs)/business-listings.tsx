import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import ProtectedInfo from '../../components/protected-info';

interface BusinessListing {
  id: string;
  name: string;
  industry: string;
  askingPrice: string;
  location: string;
  description: string;
  employees: number;
  yearsInOperation: number;
}

const mockBusinessListings: BusinessListing[] = [
  {
    id: '1',
    name: 'TechStart Solutions',
    industry: 'Tech',
    askingPrice: '$250,000 - $300,000',
    location: 'San Francisco, CA',
    description: 'Profitable SaaS company with recurring revenue and growing customer base.',
    employees: 8,
    yearsInOperation: 5
  },
  {
    id: '2',
    name: 'Bella\'s Boutique',
    industry: 'Retail',
    askingPrice: '$150,000 - $200,000',
    location: 'Austin, TX',
    description: 'Established women\'s clothing boutique in prime downtown location with loyal customer base.',
    employees: 3,
    yearsInOperation: 7
  },
  {
    id: '3',
    name: 'Green Clean Services',
    industry: 'Service',
    askingPrice: '$80,000 - $120,000',
    location: 'Denver, CO',
    description: 'Eco-friendly cleaning service with commercial and residential clients.',
    employees: 12,
    yearsInOperation: 4
  },
  {
    id: '4',
    name: 'Craft Brewery Co.',
    industry: 'Food & Beverage',
    askingPrice: '$400,000 - $500,000',
    location: 'Portland, OR',
    description: 'Popular local brewery with taproom and distribution network.',
    employees: 15,
    yearsInOperation: 6
  },
  {
    id: '5',
    name: 'MediCare Plus',
    industry: 'Healthcare',
    askingPrice: '$600,000 - $750,000',
    location: 'Miami, FL',
    description: 'Well-established medical practice with multiple locations.',
    employees: 25,
    yearsInOperation: 12
  }
];

export default function BusinessListingsScreen() {
  const router = useRouter();
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  // search state and filtering
  const [query, setQuery] = useState('');
  const filteredListings = mockBusinessListings.filter((l) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.industry.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  });

  const handleViewDetails = (listing: BusinessListing) => {
    // Require sign-in to view details
    if (isAuthenticated) {
      router.push('/business-detail');
    } else {
      setAuthPromptVisible(true);
    }
  };

  const openAuthPrompt = () => setAuthPromptVisible(true);
  const closeAuthPrompt = () => setAuthPromptVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Welcome to TradeHands</Text>
            <Text style={styles.subtitle}>Find your perfect business opportunity</Text>
          </View>

          {/* Inbox icon (top-right). If not signed in, prompt to sign in. When signed-in, open inbox. */}
          <Pressable
            onPress={() => {
              if (isAuthenticated) {
                router.push('/inbox' as any);
              } else {
                setAuthPromptVisible(true);
              }
            }}
            style={({ pressed }) => [styles.profileButton, pressed && styles.profileButtonPressed]}
            accessibilityLabel={isAuthenticated ? 'Open inbox' : 'Sign in to view inbox'}
          >
            <Ionicons name="mail-outline" size={20} color="#333" />
            {isAuthenticated && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search input in header */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search for businesses"
            placeholderTextColor="#999"
            style={[styles.searchInput, styles.searchBox]}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Business Listings */}
      <ScrollView contentContainerStyle={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>
            {filteredListings.length} business{filteredListings.length !== 1 ? 'es' : ''} found
          </Text>
        </View>
        
        {filteredListings.map((listing) => (
          <View key={listing.id} style={styles.businessCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.businessName}>{listing.name}</Text>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{listing.industry}</Text>
              </View>
            </View>
            
            <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt} style={{ marginBottom: 6 }}>
              <Text style={styles.businessLocation}>{listing.location}</Text>
            </ProtectedInfo>
            <Text style={styles.businessDescription}>{listing.description}</Text>
            
            <View style={styles.businessDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Asking Price</Text>
                <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt}>
                  <Text style={styles.detailValue}>{listing.askingPrice}</Text>
                </ProtectedInfo>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Employees</Text>
                <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt}>
                  <Text style={styles.detailValue}>{listing.employees}</Text>
                </ProtectedInfo>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Established</Text>
                <Text style={styles.detailValue}>{listing.yearsInOperation} years</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(listing)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {filteredListings.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No businesses found matching your criteria</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}

        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-business' as any)}>
            <Text style={styles.addButtonText}>+ Add a business listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal moved outside ScrollView */}
      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={closeAuthPrompt}>
          <Pressable style={styles.modalOverlay} onPress={closeAuthPrompt}>
            <Pressable style={styles.modalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.modalTitle}>Log in to view details</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimary]}
                onPress={() => {
                  closeAuthPrompt();
                  router.push('/sign-in');
                }}
              >
                <Text style={styles.modalButtonText}>Returning user login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondary]}
                onPress={() => {
                  closeAuthPrompt();
                  router.push('/create-account');
                }}
              >
                <Text style={styles.modalSecondaryText}>Create an account</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
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
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    width: '100%',
    paddingHorizontal: 4,
  },
  searchBox: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
  },
  searchText: { color: '#666' },
  listingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultsCount: {
    fontSize: 14,
    color: '#f0f0f0',
    marginVertical: 15,
    fontWeight: '500',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  industryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  industryBadgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  businessLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  businessDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  businessDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  viewDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff3b30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  profileButtonPressed: {
    opacity: 0.8,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  profileMenu: {
    position: 'absolute',
    right: 0,
    top: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
  addRow: { width: '100%', alignItems: 'center', marginTop: 6 },
  addButton: {
    width: '92%',
    backgroundColor: '#1b2438',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimary: {
    backgroundColor: '#1b2438',
  },
  modalSecondary: {
    backgroundColor: '#e9ecef',
  },
  modalButtonText: { color: '#fff', fontWeight: '700' },
  modalSecondaryText: { color: '#111', fontWeight: '700' },
});