import { Buyer } from '@/types/buyer';
import { User } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProtectedInfo from '../../components/protected-info';
import { useAuth } from '../../context/AuthContext';

export default function BuyerScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { isAuthenticated, user } = useAuth(); // include user
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

  const [buyers, setBuyers] = useState<Buyer[]>([]); // State for buyers
  const [users, setUsers] = useState<User[]>([]); // State for user data
  const [buyersLoading, setBuyersLoading] = useState(true); // Loading state for buyers
  const [usersLoading, setUsersLoading] = useState(true); // Loading state for users

  // Search filter unchanged
  const filteredBuyers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buyers;
    return buyers.filter((b) => {
      return (
        // this grossness finds the corresponding user information for the buyer in question
        users.find(user => user.user_id === b.user_id)!.first_name.toLowerCase().includes(q) ||
        users.find(user => user.user_id === b.user_id)!.last_name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        (b.title || '').toLowerCase().includes(q)
      );
    });
  }, [query, buyers, users]);

  // New: derive sections
  const currentUserId = user?.id?.toString?.() ?? 'anonymous';
  
  // Separate counter for owned buyers only (buyers where user_id matches current user)
  const ownedBuyers = useMemo(() => {
    // If not authenticated or no valid user ID, return empty array
    if (!isAuthenticated || !user?.id || currentUserId === 'anonymous') {
      return [];
    }
    return filteredBuyers.filter((b) => {
      return String(b.user_id ?? '') === currentUserId;
    });
  }, [filteredBuyers, currentUserId, isAuthenticated, user?.id]);

  // For now, myBuyers is the same as ownedBuyers (no connection logic yet)
  const myBuyers = useMemo(() => {
    // If not authenticated or no valid user ID, return empty array
    if (!isAuthenticated || !user?.id || currentUserId === 'anonymous') {
      return [];
    }
    return filteredBuyers.filter((b) => {
      return String(b.user_id ?? '') === currentUserId;
    });
  }, [filteredBuyers, currentUserId, isAuthenticated, user?.id]);

  const publicBuyers = useMemo(() => {
    return filteredBuyers.filter((b) => {
      const isMine = String(b.user_id ?? '') === currentUserId;
      const isPublic = (b as any).is_public !== false;
      return isPublic && !isMine;
    });
  }, [filteredBuyers, currentUserId]);

  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

  async function fetchBuyerData() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyers`);
      const buyerData = await response.json();
      setBuyers(buyerData);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setBuyersLoading(false);
    }
  }

  async function fetchUserData(buyers: Buyer[]) {
    try {
      const userDetails = await Promise.all(
        buyers.map(async (buyer) => {
          const response = await fetch(`${API_BASE_URL}/users/${buyer.user_id}`);
          const userData = await response.json();
          return userData;
        })
      );
      setUsers(userDetails);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    fetchBuyerData();
  }, []);

  useEffect(() => {
    if (buyers.length > 0) {
      fetchUserData(buyers);
    }
  }, [buyers]);

  const handleAddBuyerProfile = () => {
    if (isAuthenticated) {
      router.push('/add-buyer' as any);
    } else {
      setAuthPromptVisible(true);
    }
  };

  // New: view toggle state (matches | public)
  const [viewMode, setViewMode] = useState<'matches' | 'public'>('public');

  return (
    <View style={styles.container}>
      <View style={[styles.header, isAuthenticated && styles.headerAuthenticated]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, isAuthenticated && styles.titleAuthenticated]}>
              {isAuthenticated ? 'Buyers Dashboard' : 'Welcome to TradeHands'}
            </Text>
            <Text style={[styles.subtitle, isAuthenticated && styles.subtitleAuthenticated]}>
              {isAuthenticated ? 'View detailed buyer profiles and reach out' : 'Find your perfect business opportunity'}
            </Text>
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
        {/* Search input in header (single search bar) */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search for buyers"
            placeholderTextColor="#999"
            style={[styles.searchInput, styles.searchBox]}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        {/* Results count directly below search */}
        <View style={styles.resultsRowHeader}>
          <Text style={styles.resultsCount}>{filteredBuyers.length} buyer{filteredBuyers.length !== 1 ? 's' : ''} found</Text>
        </View>
        {/* Removed stray closing View here */}
      </View>

      <ScrollView contentContainerStyle={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20 }} />
        <Text style={[styles.resultsCount, { marginBottom: 8 }]}>
          My Listings (0)
        </Text>

        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddBuyerProfile}>
        <Text style={styles.addButtonText}>+ Add a buyer profile</Text>
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
        <Text style={[styles.resultsCount]}>
          {viewMode === 'public' 
            ? `Public Buyers (${publicBuyers.length})` 
            : `My Matched Buyers (${myBuyers.length})`}
        </Text>
        <View style={{ marginBottom: 16 }} />

        {/* Existing sections wrapped with conditional display; content unchanged */}
        {viewMode === 'public' && (
      <>
        <View style={styles.row}>
          {buyersLoading || usersLoading ? (
            <Text>Loading buyers...</Text>
          ) : (
        publicBuyers.map((b, index) => (
          <View key={b.buyer_id || `public-buyer-${index}`} style={styles.card}>
            {users.find(user => user.user_id === b.user_id)!.profile_image_url ? 
            <Image source={{uri: users.find(user => user.user_id === b.user_id)!.profile_image_url }} style={styles.avatarImage} />
            :
            <Image source={require('../../assets/images/handshake-logo.png')} style={styles.avatarImage} />
            }
            <View style={styles.cardBody}>
              <Text style={styles.buyerName}>{users.find(user => user.user_id === b.user_id)!.first_name} {users.find(user => user.user_id === b.user_id)!.last_name}</Text>
              <ProtectedInfo signedIn={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
            <Text style={styles.buyerCity}>{b.city}</Text>
              </ProtectedInfo>
              <ProtectedInfo signedIn={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
            <Text style={styles.buyerInterests}>{b.title}</Text>
              </ProtectedInfo>
            </View>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
            if (isAuthenticated) {
              setSelectedBuyer(b);
            } else {
              setAuthPromptVisible(true);
            }
              }}
            >
              <Text style={styles.moreBtnText}>click for more info</Text>
            </TouchableOpacity>
          </View>
        ))
          )}
        </View>
        {publicBuyers.length === 0 && (
          <View style={styles.noResults}>
        <Text style={styles.noResultsText}>No public listings found</Text>
        <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      </>
        )}

        {viewMode === 'matches' && (
          <>
        <View style={styles.row}>
          {buyersLoading || usersLoading ? (
            <Text>Loading buyers...</Text>
          ) : (
            myBuyers.map((b, index) => (
          <View key={b.buyer_id || `my-buyer-${index}`} style={styles.card}>
            {users.find(user => user.user_id === b.user_id)!.profile_image_url ? 
            <Image source={{uri: users.find(user => user.user_id === b.user_id)!.profile_image_url }} style={styles.avatarImage} />
            :
            <Image source={require('../../assets/images/handshake-logo.png')} style={styles.avatarImage} />
            }
            <View style={styles.cardBody}>
              <Text style={styles.buyerName}>{users.find(user => user.user_id === b.user_id)!.first_name} {users.find(user => user.user_id === b.user_id)!.last_name}</Text>
              <ProtectedInfo signedIn={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
            <Text style={styles.buyerCity}>{b.city}</Text>
              </ProtectedInfo>
              <ProtectedInfo signedIn={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
            <Text style={styles.buyerInterests}>{b.title}</Text>
              </ProtectedInfo>
            </View>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
            if (isAuthenticated) {
              setSelectedBuyer(b);
            } else {
              setAuthPromptVisible(true);
            }
              }}
            >
              <Text style={styles.moreBtnText}>click for more info</Text>
            </TouchableOpacity>
          </View>
            ))
            )}
          </View> 
          {myBuyers.length === 0 && (
            <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No listings connected to you yet</Text>
          <Text style={styles.noResultsSubtext}>Create a listing or check back after matches are made</Text>
            </View>
          )}
        </>
          )}

        </ScrollView>

      {/* Buyer Detail Modal */}
      {selectedBuyer && (
        <Modal visible={!!selectedBuyer} transparent animationType="slide">
          <View style={styles.buyerModalOverlay}>
            <View style={styles.buyerModalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.buyerModalHeader}>
                  <TouchableOpacity
                    onPress={() => setSelectedBuyer(null)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.buyerModalTitle}>Buyer Profile</Text>
                </View>

                {/* Buyer Info */}
                <View style={styles.buyerModalBody}>
                  {users.find(user => user.user_id === selectedBuyer.user_id)!.profile_image_url ? 
                  <Image source={{uri: users.find(user => user.user_id === selectedBuyer.user_id)!.profile_image_url }} style={styles.buyerModalAvatar} />
                  :
                  <Image source={require('../../assets/images/handshake-logo.png')} style={styles.buyerModalAvatar} />
                  }
                  <Text style={styles.buyerModalName}>{users.find(user => user.user_id === selectedBuyer.user_id)!.first_name} {users.find(user => user.user_id === selectedBuyer.user_id)!.last_name}</Text>
                  <Text style={styles.buyerModalTitle}>{selectedBuyer.title}</Text>
                  <View style={styles.buyerModalLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.buyerModalLocationText}>{selectedBuyer.city}</Text>
                  </View>

                  {/* Bio */}
                  <View style={styles.buyerModalSection}>
                    <Text style={styles.buyerModalSectionTitle}>About</Text>
                    <Text style={styles.buyerModalBio}>{selectedBuyer.about}</Text>
                  </View>

                  {/* Looking For */}
                  <View style={styles.buyerModalSection}>
                    <Text style={styles.buyerModalSectionTitle}>Looking For</Text>
                    <View style={styles.buyerModalTags}>
                      {selectedBuyer.industries?.map((item, index) => (
                        <View key={index} style={styles.buyerModalTag}>
                          <Text style={styles.buyerModalTagText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                    {/* Investment Details */}
                    <View style={styles.buyerModalSection}>
                    <Text style={styles.buyerModalSectionTitle}>Investment Details</Text>
                    <View style={styles.buyerModalDetails}>
                      <View style={styles.buyerModalDetailRow}>
                      <Ionicons name="cash-outline" size={20} color="#5A7A8C" />
                      <View style={styles.buyerModalDetailContent}>
                        <Text style={styles.buyerModalDetailLabel}>Budget Range</Text>
                        <Text style={styles.buyerModalDetailValue}>
                        ${Number(selectedBuyer.budget_range_lower).toLocaleString()} - ${Number(selectedBuyer.budget_range_higher).toLocaleString()}
                        </Text>
                      </View>
                      </View>
                      <View style={styles.buyerModalDetailRow}>
                      <Ionicons name="briefcase-outline" size={20} color="#5A7A8C" />
                      <View style={styles.buyerModalDetailContent}>
                        <Text style={styles.buyerModalDetailLabel}>Experience</Text>
                        <Text style={styles.buyerModalDetailValue}>{selectedBuyer.experience}</Text>
                      </View>
                      </View>
                      <View style={styles.buyerModalDetailRow}>
                      <Ionicons name="time-outline" size={20} color="#5A7A8C" />
                      <View style={styles.buyerModalDetailContent}>
                        <Text style={styles.buyerModalDetailLabel}>Timeline</Text>
                        <Text style={styles.buyerModalDetailValue}>{selectedBuyer.timeline}</Text>
                      </View>
                      </View>
                    </View>
                  </View>

                  {/* Contact Button */}
                  <TouchableOpacity style={styles.buyerModalContactButton}>
                    <Ionicons name="mail-outline" size={20} color="#fff" />
                    <Text style={styles.buyerModalContactText}>Contact Buyer</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={() => setAuthPromptVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setAuthPromptVisible(false)}>
            <Pressable style={styles.modalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.modalTitle}>Log into TradeHands</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/sign-in-form');
                }}
              >
                <Text style={styles.modalButtonText}>Returning user login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondary]}
                onPress={() => {
                  setAuthPromptVisible(false);
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
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#5A7A8C', // primary
  },
  titleAuthenticated: {
    color: '#F5F1ED', // warm-neutral
  },
  subtitleAuthenticated: {
    color: '#E8E3DC', // soft-beige
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
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
  profileButtonPressed: { opacity: 0.8 },
  profileInitial: { fontSize: 18, fontWeight: '700', color: '#333' },
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
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  menuItem: { paddingHorizontal: 12, paddingVertical: 10 },
  menuItemText: { fontSize: 14, color: '#333' },

  grid: {
    padding: 12,
    alignItems: 'stretch',
  },
  listingsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  resultsRowHeader: {
    paddingHorizontal: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 11,
    width: '100%',
    paddingHorizontal: 4,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  resultsCount: {
    fontSize: 14,
    color: '#f0f0f0',
    fontWeight: '500',
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    marginBottom: 10,
  },
  avatarImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardBody: { width: '100%', marginBottom: 6 },
  buyerName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 6 },
  buyerCity: { color: '#666', marginBottom: 6 },
  buyerInterests: { color: '#555' },
  moreBtn: { marginTop: 8 },
  moreBtnText: { color: '#333', textDecorationLine: 'underline' },

  addRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16
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
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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

  // Buyer Detail Modal Styles
  buyerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  buyerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  buyerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 5,
  },
  buyerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  buyerModalBody: {
    padding: 20,
    alignItems: 'center',
  },
  buyerModalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  buyerModalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  buyerModalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buyerModalLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  buyerModalSection: {
    width: '100%',
    marginBottom: 20,
  },
  buyerModalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  buyerModalBio: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
  },
  buyerModalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buyerModalTag: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5A7A8C',
  },
  buyerModalTagText: {
    color: '#5A7A8C',
    fontSize: 14,
    fontWeight: '500',
  },
  buyerModalDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  buyerModalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buyerModalDetailContent: {
    marginLeft: 15,
    flex: 1,
  },
  buyerModalDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buyerModalDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buyerModalContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 10,
  },
  buyerModalContactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },

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
});
