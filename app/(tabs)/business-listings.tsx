import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProtectedInfo from '../../components/protected-info';
import { useAuth } from '../../context/AuthContext';
import { Buyer } from '../../types/buyer';
import { Listing } from '../../types/listing';
import { findMatchedListingsForBuyer } from '../../utils/matchingAlgorithm';

function formatCurrency(value?: number) {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function BusinessListingsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]); // State for listings 
  const [buyers, setBuyers] = useState<Buyer[]>([]); // State for buyers
  const [loading, setLoading] = useState(false); // loading state for listings
  const [buyersLoading, setBuyersLoading] = useState(true); // loading state for buyers

  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

  // SEARCH FILTER
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

  // GET CURRENT USERS ID
  const currentUserId = user?.user_id?.toString?.() ?? 'anonymous';

  // LISTINGS OWNED BY CURRENT USER (listings where owner_id matches current user)
  const ownedListings = useMemo(() => {
    // If not authenticated or no valid user ID, return empty array
    if (!isAuthenticated || !user?.user_id || currentUserId === 'anonymous') {
      return [];
    }
    return filteredListings.filter((l) => {
      return String(l.owner_id ?? '') === currentUserId;
    });
  }, [filteredListings, currentUserId, isAuthenticated, user?.user_id]);

  // BUYER PROFILE OWNED BY CURRENT USER (buyer profile where user_id matches current user)
  const currentBuyer = useMemo(() => {
    if (!isAuthenticated || !user?.user_id || buyersLoading) {
      return null;
    }
    return buyers.find(buyer => String(buyer.user_id ?? '') === currentUserId) || null;
  }, [buyers, buyersLoading, isAuthenticated, user?.user_id, currentUserId]);

  // GET MATCHED LISTINGS FOR THE CURRENT USER'S BUYER PROFILE
  const myListings = useMemo(() => {
    if (!isAuthenticated || !user?.user_id || currentUserId === 'anonymous' || !currentBuyer) {
      return [];
    }
    console.log('\nmatched listings called');
    const matchedListings = findMatchedListingsForBuyer(currentBuyer, listings);

    return matchedListings;
  }, [isAuthenticated, user?.user_id, currentUserId, currentBuyer, listings]);

  // PUBLIC LISTINGS (either no user authenticated or the non-matches)
  const publicListings = useMemo(() => {
    return filteredListings.filter((l) => {
      const isMine = String(l.owner_id ?? '') === currentUserId;
      const isPublic = (l as any).is_public !== false;
      const isMatched = myListings.some(ml => ml.business_id === l.business_id);
      return isPublic && !isMine && !isMatched;
    });
  }, [filteredListings, currentUserId, myListings]);

  // FETCH LISTINGS FOR DISPLAY
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

  // FETCH BUYERS FOR MATCHING
  async function fetchBuyers() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyers`);
      const data = await response.json();
      setBuyers(data);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setBuyersLoading(false);
    }
  }

  // CALL FUNCTIONS TO GET BUYERS AND LISTINGS
  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      const data = await fetchBusinessListings();
      setListings(data);
      setLoading(false);
    }

    loadListings();
    fetchBuyers();
  }, []);

  // ADD LISTING BUTTON
  const handleAddBusiness = () => {
    if (isAuthenticated) {
      router.push('/add-business' as any);
    } else {
      setAuthPromptVisible(true);
    }
  };

  // New: view toggle state (matches | public) - ensure default is 'public'
  const [viewMode, setViewMode] = useState<'matches' | 'public'>('public');

  // SHOWS THE SIGN IN PROMPT OR SHOWS DETAILS
  const handleViewDetails = (listingId: string) => {
    // Require sign-in to view details
    if (isAuthenticated) {
      router.push(`/business-detail?id=${listingId}`);
    } else {
      setAuthPromptVisible(true);
    }
  };

  // FUNCTIONS TO OPEN AND CLOSE SIGN IN PROMPT
  const openAuthPrompt = () => setAuthPromptVisible(true);
  const closeAuthPrompt = () => setAuthPromptVisible(false);

  return (
    <View style={styles.container}>
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
      <View style={{ marginTop: 20 }} />
        <Text style={[styles.resultsCount, { marginBottom: 8 }]}>
          My Business Listings ({ownedListings.length})
        </Text>

        {ownedListings.map((l, index) => (
          <View key={l.business_id || `owned-listing-${index}`} style={styles.condensedCard}>
            <View>
              <Text style={styles.buyerName}>{l.name}</Text>
              <Text style={styles.buyerTitle}>{l.industry}</Text>
            </View>
            <TouchableOpacity onPress={() => handleViewDetails(l.business_id.toString())} style={styles.linkButton}>
              <Text style={styles.linkText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddBusiness}>
            <Text style={styles.addButtonText}>+ Add a business listing</Text>
          </TouchableOpacity>
        </View>

        {/* New: Browse toggle row placed right under the add button */}
        <View style={styles.browseRow}>
          <Text style={styles.browseLabel}>Browse:</Text>
          <View style={styles.browseButtons}>
            <TouchableOpacity
              style={[styles.browseBtn, viewMode === 'public' ? styles.browseBtnActive : styles.browseBtnInactive]}
              onPress={() => setViewMode('public')}
            >
              <Text style={[styles.browseBtnText, viewMode === 'public' ? styles.browseBtnTextActive : styles.browseBtnTextInactive]}>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browseBtn, viewMode === 'matches' ? styles.browseBtnActive : styles.browseBtnInactive]}
              onPress={() => setViewMode('matches')}
            >
              <Text style={[styles.browseBtnText, viewMode === 'matches' ? styles.browseBtnTextActive : styles.browseBtnTextInactive]}>
                Matches
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Single header that changes based on view mode */}
        <Text style={styles.resultsCount}>
          {viewMode === 'public' 
            ? `Public Listings (${publicListings.length})` 
            : `My Matched Listings (${myListings.length})`}
        </Text>
        <View style={{ marginBottom: 16 }} />

        {/* Existing sections wrapped with conditional display; content unchanged */}
        {viewMode === 'public' && (
          <>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              publicListings.map((listing, index) => (
                <View key={listing.business_id || `public-listing-${index}`} style={styles.businessCard}>
                  {/* ...existing card content... */}
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
                    onPress={() => handleViewDetails(listing.business_id.toString())}
                  >
                    <Text style={styles.viewDetailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {publicListings.length === 0 && !loading && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No public listings found</Text>
                <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
              </View>
            )}
          </>
        )}

        {viewMode === 'matches' && (
          <>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              myListings.map((listing, index) => (
                <View key={listing.business_id || `my-listing-${index}`} style={styles.businessCard}>
                  {/* ...existing card content... */}
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
                    onPress={() => handleViewDetails(listing.business_id.toString())}
                  >
                    <Text style={styles.viewDetailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {myListings.length === 0 && !loading && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No listings connected to you yet</Text>
                <Text style={styles.noResultsSubtext}>Create a listing or check back after matches are made</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal moved outside ScrollView */}
      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={closeAuthPrompt}>
          <Pressable style={styles.modalOverlay} onPress={closeAuthPrompt}>
            <Pressable style={styles.modalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.modalTitle}>Log into TradeHands</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimary]}
                onPress={() => {
                  closeAuthPrompt();
                  router.push('/sign-in-form');
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
    marginBottom: 6, // match buyers.tsx
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 11, // match buyers.tsx
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
    paddingHorizontal: 12, // match buyers.tsx grid padding
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
    marginTop: 4, // match buyers.tsx
    marginBottom: 16, // match buyers.tsx
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
    fontWeight: '600', // match buyers.tsx
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

  // New: browse toggle styles
  browseRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  browseLabel: {
    color: '#f0f0f0',
    fontSize: 14,
    fontWeight: '600',
  },
  browseButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  browseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  browseBtnActive: {
    backgroundColor: '#5A7A8C',
    borderColor: '#5A7A8C',
  },
  browseBtnInactive: {
    backgroundColor: 'transparent',
    borderColor: '#9B8F82',
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  browseBtnTextActive: {
    color: '#fff',
  },
  browseBtnTextInactive: {
    color: '#E8E3DC',
  },
  condensedCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  linkButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});