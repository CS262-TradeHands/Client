import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProtectedInfo from '../../components/protected-info';
import { useAuth } from '../../context/AuthContext';
import { Listing } from '../../types/listing';

function formatCurrency(value?: number) {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function BusinessListingsScreen() {
  const router = useRouter();
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { isAuthenticated, user } = useAuth(); // changed: include user

  // search state and filtering
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // set the webservice url
  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

  // fetch the listings to display
  async function fetchBusinessListings(): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/listings`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching business listings:', error);
      return [];
    }
  }

  useEffect(() => {
    async function loadListings() {
      const data = await fetchBusinessListings();
      setListings(data);
      setLoading(false);
    }

    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) => {
      return (
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.industry ?? '').toLowerCase().includes(q) ||
        (l.city ?? '').toLowerCase().includes(q) ||
        (l.state ?? '').toLowerCase().includes(q) ||
        (l.country ?? '').toLowerCase().includes(q)
      );
    });
  }, [listings, query]);

  // New: derive sections while keeping styling
  const currentUserId = user?.id?.toString?.() ?? 'anonymous';
  const myListings = useMemo(() => {
    return filteredListings.filter((l) => {
      const ownerMatch = String(l.owner_id ?? '') === currentUserId;
      const connectedMatch = Array.isArray((l as any).connectedUserIds) && (l as any).connectedUserIds.includes(currentUserId);
      return ownerMatch || connectedMatch;
    });
  }, [filteredListings, currentUserId]);

  const publicListings = useMemo(() => {
    return filteredListings.filter((l) => {
      const isMineOrConnected =
        String(l.owner_id ?? '') === currentUserId ||
        (Array.isArray((l as any).connectedUserIds) && (l as any).connectedUserIds.includes(currentUserId));
      const isPublic = (l as any).is_public !== false; // default to public if not provided
      return isPublic && !isMineOrConnected;
    });
  }, [filteredListings, currentUserId]);

  const handleViewDetails = (index: number) => {
    // Require sign-in to view details
    if (isAuthenticated) {
      router.push(`/business-detail?id=${index + 1}`);
    } else {
      setAuthPromptVisible(true);
    }
  };

  const handleAddBusiness = () => {
    if (isAuthenticated) {
      router.push('/add-business' as any);
    } else {
      router.push('/sign-in');
    }
  };

  const openAuthPrompt = () => setAuthPromptVisible(true);
  const closeAuthPrompt = () => setAuthPromptVisible(false);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Restored: regular header without blur/animation */}
      <View style={[styles.header, isAuthenticated && styles.headerAuthenticated]}>
        <View style={styles.headerRow}>
          <View>
<Text style={[styles.title, isAuthenticated && styles.titleAuthenticated]}>
  {isAuthenticated ? 'Business Dashboard' : 'Welcome to TradeHands'}
</Text>
<Text style={[styles.subtitle, isAuthenticated && styles.subtitleAuthenticated]}>
  {isAuthenticated ? 'Browse listings and manage connections' : 'Find your perfect business opportunity'}
</Text>
          </View>

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

        <View style={styles.resultsRowHeader}>
          <Text style={styles.resultsCount}>
            {filteredListings.length} business{filteredListings.length !== 1 ? 'es' : ''} found
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        {/* Add button row */}
        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddBusiness}>
            <Text style={styles.addButtonText}>+ Add a business listing</Text>
          </TouchableOpacity>
        </View>

        {/* My Listings Section */}
        <Text style={styles.resultsCount}>My Matched Listings ({myListings.length})</Text>

        {myListings.map((listing, index) => (
          <View key={listing.id || `my-listing-${index}`} style={styles.businessCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.businessName}>{listing.name}</Text>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{listing.industry}</Text>
              </View>
            </View>

            <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt} style={{ marginBottom: 6 }}>
              <Text style={styles.businessLocation}>{listing.city}</Text>
            </ProtectedInfo>
            <Text style={styles.businessDescription}>{listing.description}</Text>

            <View style={styles.businessDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Asking Price</Text>
                <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt}>
                  <Text style={styles.detailValue}>
                    {formatCurrency(listing.asking_price_lower_bound)}
                    {listing.asking_price_upper_bound && listing.asking_price_lower_bound !== listing.asking_price_upper_bound
                      ? ` - ${formatCurrency(listing.asking_price_upper_bound)}`
                      : ''}
                  </Text>
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
                <Text style={styles.detailValue}>{listing.years_in_operation} years</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(index)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        {myListings.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No listings connected to you yet</Text>
            <Text style={styles.noResultsSubtext}>Create a listing or check back after matches are made</Text>
          </View>
        )}

        {/* Public Listings Section */}
        <Text style={[styles.resultsCount, { marginTop: 16 }]}>
          Public Listings ({publicListings.length})
        </Text>

        {publicListings.map((listing, index) => (
          <View key={listing.id || `public-listing-${index}`} style={styles.businessCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.businessName}>{listing.name}</Text>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{listing.industry}</Text>
              </View>
            </View>

            <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt} style={{ marginBottom: 6 }}>
              <Text style={styles.businessLocation}>{listing.city}</Text>
            </ProtectedInfo>
            <Text style={styles.businessDescription}>{listing.description}</Text>

            <View style={styles.businessDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Asking Price</Text>
                <ProtectedInfo signedIn={isAuthenticated} onPress={openAuthPrompt}>
                  <Text style={styles.detailValue}>
                    {formatCurrency(listing.asking_price_lower_bound)}
                    {listing.asking_price_upper_bound && listing.asking_price_lower_bound !== listing.asking_price_upper_bound
                      ? ` - ${formatCurrency(listing.asking_price_upper_bound)}`
                      : ''}
                  </Text>
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
                <Text style={styles.detailValue}>{listing.years_in_operation} years</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(index)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        {publicListings.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No public listings found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
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
  headerAuthenticated: {
    backgroundColor: '#5A7A8C',
  },
  titleAuthenticated: {
    color: '#F5F1ED', // warm-neutral
  },
  subtitleAuthenticated: {
    color: '#E8E3DC', // soft-beige
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5A7A8C',
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
    fontWeight: '500',
  },
  resultsRowHeader: {
    paddingHorizontal: 12,
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
    backgroundColor: '#E8E3DC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  industryBadgeText: {
    fontSize: 12,
    color: '#5A7A8C',
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
    backgroundColor: '#5A7A8C',
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
  addRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 16,
  },
  addButton: {
    alignSelf: 'center',
    width: undefined,
    paddingHorizontal: 12,
    backgroundColor: '#2B4450',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalContent: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
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
    backgroundColor: '#2B4450',
  },
  modalSecondary: {
    backgroundColor: '#E8E3DC',
    borderWidth: 1,
    borderColor: '#9B8F82',
  },
  modalButtonText: { color: '#fff', fontWeight: '700' },
  modalSecondaryText: { color: '#5A7A8C', fontWeight: '700' },
});