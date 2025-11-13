import { useAuth } from '../../context/AuthContext'; // Adjusted the path
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProtectedInfo from '../../components/protected-info';

interface Buyer {
  id: string;
  name: string;
  city: string;
  title?: string;
  avatar?: any;
  bio?: string;
  lookingFor?: string[];
  budget?: string;
  experience?: string;
  timeline?: string;
}

const mockBuyers: Buyer[] = [
  { 
    id: '1', 
    name: 'Khaled', 
    city: 'San Francisco, CA', 
    title: 'Investor / Entrepreneur', 
    avatar: require('../../assets/images/mii/buyer1.png'),
    bio: 'Serial entrepreneur with 15+ years of experience building and scaling tech companies.',
    lookingFor: ['Tech Companies', 'SaaS Businesses', 'E-commerce'],
    budget: '$500K - $2M',
    experience: '15+ years in tech entrepreneurship',
    timeline: 'Ready to close within 3-6 months'
  },
  { 
    id: '2', 
    name: 'Miriam', 
    city: 'Austin, TX', 
    title: 'Retail Buyer', 
    avatar: require('../../assets/images/mii/buyer2.png'),
    bio: 'Experienced retail operator looking to expand portfolio with established businesses.',
    lookingFor: ['Retail Stores', 'Boutiques', 'Specialty Shops'],
    budget: '$200K - $800K',
    experience: '10 years in retail management',
    timeline: 'Flexible, evaluating opportunities'
  },
  { 
    id: '3', 
    name: 'Bobby', 
    city: 'Denver, CO', 
    title: 'Service Business Investor', 
    avatar: require('../../assets/images/mii/buyer3.png'),
    bio: 'Private investor seeking profitable service-based businesses with recurring revenue.',
    lookingFor: ['Consulting Firms', 'Marketing Agencies', 'Professional Services'],
    budget: '$300K - $1M',
    experience: '8 years in service business operations',
    timeline: 'Actively searching'
  },
  { 
    id: '4', 
    name: 'Mickey', 
    city: 'Portland, OR', 
    title: 'Brewery Enthusiast', 
    avatar: require('../../assets/images/mii/buyer4.png'),
    bio: 'Craft beer enthusiast looking to acquire established breweries or taprooms.',
    lookingFor: ['Breweries', 'Taprooms', 'Bars & Pubs'],
    budget: '$400K - $1.5M',
    experience: '5 years in hospitality industry',
    timeline: '6-12 months'
  },
  { 
    id: '5', 
    name: 'Sandra', 
    city: 'Miami, FL', 
    title: 'Healthcare Investor', 
    avatar: require('../../assets/images/mii/buyer5.png'),
    bio: 'Healthcare professional seeking to acquire medical practices and healthcare services.',
    lookingFor: ['Medical Practices', 'Dental Clinics', 'Healthcare Services'],
    budget: '$600K - $3M',
    experience: '12 years in healthcare administration',
    timeline: 'Ready to move quickly on the right opportunity'
  },
  { 
    id: '6', 
    name: 'Alex', 
    city: 'Seattle, WA', 
    title: 'Tech Acquirer', 
    avatar: require('../../assets/images/mii/buyer6.png'),
    bio: 'Tech executive looking to acquire software companies and tech-enabled services.',
    lookingFor: ['Software Companies', 'Mobile Apps', 'SaaS Platforms'],
    budget: '$750K - $5M',
    experience: '20 years in tech industry',
    timeline: 'Evaluating multiple opportunities'
  },
];

export default function BuyerScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

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
      <View style={[styles.header, isAuthenticated && styles.headerAuthenticated]}>
  <View style={styles.headerRow}>
    <View>
      <Text style={[styles.title, isAuthenticated && styles.titleAuthenticated]}>
        {isAuthenticated ? 'Connect with YOUR Buyers' : 'Buyers'}
      </Text>
      <Text style={[styles.subtitle, isAuthenticated && styles.subtitleAuthenticated]}>
        {isAuthenticated ? 'View detailed buyer profiles and reach out' : 'Sign in to view buyer details'}
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
            </View>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsCount}>{filteredBuyers.length} buyers found</Text>
          </View>

          <View style={styles.addRow}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-buyer' as any)}>
              <Text style={styles.addButtonText}>+ Add a buyer profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
          {filteredBuyers.map((b) => (
            <View key={b.id} style={styles.card}>
              {/* Avatar always visible even when not signed in */}
              <Image source={b.avatar || require('../../assets/images/handshake-logo.png')} style={styles.avatarImage} />

              <View style={styles.cardBody}>
                <Text style={styles.buyerName}>{b.name}</Text>
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
          ))}
        </View>
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
                  <Image source={selectedBuyer.avatar} style={styles.buyerModalAvatar} />
                  <Text style={styles.buyerModalName}>{selectedBuyer.name}</Text>
                  <Text style={styles.buyerModalTitle}>{selectedBuyer.title}</Text>
                  <View style={styles.buyerModalLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.buyerModalLocationText}>{selectedBuyer.city}</Text>
                  </View>

                  {/* Bio */}
                  <View style={styles.buyerModalSection}>
                    <Text style={styles.buyerModalSectionTitle}>About</Text>
                    <Text style={styles.buyerModalBio}>{selectedBuyer.bio}</Text>
                  </View>

                  {/* Looking For */}
                  <View style={styles.buyerModalSection}>
                    <Text style={styles.buyerModalSectionTitle}>Looking For</Text>
                    <View style={styles.buyerModalTags}>
                      {selectedBuyer.lookingFor?.map((item, index) => (
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
                          <Text style={styles.buyerModalDetailValue}>{selectedBuyer.budget}</Text>
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

  addRow: { 
    width: '100%', 
    alignItems: 'center', 
    marginTop: 6,
    marginBottom: 24
  },
  addButton: {
    width: '92%',
    backgroundColor: '#2B4450',
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
    backgroundColor: '#5A7A8C',
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
});
