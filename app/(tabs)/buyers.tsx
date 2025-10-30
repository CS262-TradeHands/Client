import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import ProtectedInfo from '../../components/protected-info';

interface Buyer {
  id: string;
  name: string;
  city: string;
  title?: string;
  avatar?: any;
}

const mockBuyers: Buyer[] = [
  { id: '1', name: 'Khaled', city: 'San Francisco, CA', title: 'Investor / Entrepreneur', avatar: require('../../assets/images/react-logo.png') },
  { id: '2', name: 'Miriam', city: 'Austin, TX', title: 'Retail Buyer', avatar: require('../../assets/images/react-logo.png') },
  { id: '3', name: 'Bobby', city: 'Denver, CO', title: 'Service Business Investor', avatar: require('../../assets/images/react-logo.png') },
  { id: '4', name: 'Mickey', city: 'Portland, OR', title: 'Brewery Enthusiast', avatar: require('../../assets/images/handshake-logo.png') },
  { id: '5', name: 'Sandra', city: 'Miami, FL', title: 'Healthcare Investor', avatar: require('../../assets/images/partial-react-logo.png') },
  { id: '6', name: 'Alex', city: 'Seattle, WA', title: 'Tech Acquirer', avatar: require('../../assets/images/react-logo.png') },
];

export default function BuyerScreen() {
  const router = useRouter();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const profileBtnRef = useRef(null);
  const [query, setQuery] = useState('');
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { signedIn, signOut } = useAuth();

  const filteredBuyers = mockBuyers.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      (b.title || '').toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Buyers</Text>
            <Text style={styles.subtitle}>Search for buyers</Text>
          </View>

          <View style={styles.profileContainer} ref={profileBtnRef as any}>
            <Pressable
              onPress={() => setProfileMenuVisible((v) => !v)}
              style={({ pressed }) => [styles.profileButton, pressed && styles.profileButtonPressed]}
            >
              {signedIn ? (
                <Text style={styles.profileInitial}>U</Text>
              ) : (
                <Text style={styles.profileInitial}>?</Text>
              )}
            </Pressable>

            {profileMenuVisible && (
              <View style={styles.profileMenu}>
                {!signedIn ? (
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      router.push('/sign-in' as any);
                    }}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuItemText}>Sign in</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      signOut();
                      router.replace('/buyers' as any);
                    }}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuItemText}>Sign out</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
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
            </View>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsCount}>{filteredBuyers.length} buyers found</Text>
          </View>

          <View style={styles.row}>
          {filteredBuyers.map((b) => (
            <View key={b.id} style={styles.card}>
              {/* Avatar always visible even when not signed in */}
              <Image source={b.avatar || require('../../assets/images/handshake-logo.png')} style={styles.avatarImage} />

              <View style={styles.cardBody}>
                <Text style={styles.buyerName}>{b.name}</Text>
                <ProtectedInfo signedIn={signedIn} onPress={() => setAuthPromptVisible(true)}>
                  <Text style={styles.buyerCity}>{b.city}</Text>
                </ProtectedInfo>
                <ProtectedInfo signedIn={signedIn} onPress={() => setAuthPromptVisible(true)}>
                  <Text style={styles.buyerInterests}>{b.title}</Text>
                </ProtectedInfo>
              </View>

              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() => {
                  // Require sign-in to view details
                  if (signedIn) {
                    router.push('/business-detail');
                  } else {
                    setAuthPromptVisible(true);
                  }
                }}
              >
                <Text style={styles.moreBtnText}>click for more info</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-buyer' as any)}>
            <Text style={styles.addButtonText}>+ Add a buyer profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={() => setAuthPromptVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setAuthPromptVisible(false)}>
            <Pressable style={styles.modalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.modalTitle}>Log in to view details</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/sign-in');
                }}
              >
                <Text style={styles.modalButtonText}>Returning user login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/sign-in?signup=true');
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
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 4,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 4,
    marginVertical: 8,
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
    marginVertical: 15,
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

  addRow: { width: '100%', alignItems: 'center', marginTop: 6 },
  addButton: {
    width: '92%',
    backgroundColor: '#1b2438',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    backgroundColor: '#2858f2',
  },
  modalSecondary: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c6d2ff',
  },
  modalButtonText: { color: '#fff', fontWeight: '700' },
  modalSecondaryText: { color: '#2858f2', fontWeight: '700' },
});
