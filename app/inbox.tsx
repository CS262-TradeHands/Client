import { API_BASE_URL } from '@/constants/api';
import { Buyer } from '@/types/buyer';
import { User } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BuyerDetailModal from '../components/BuyerDetailModal';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Match } from '../types/match';

// Define notification type
interface Notification {
  id: string;
  title: 'buyer' | 'business' | 'approved';
  name: string;
  message: string;
  primaryAction: string;
  avatar?: string;
  route?: string;
  email?: string;
  phone?: string;
  senderId: string;
  recipientId: string;
  simpleContact?: boolean;
  buyerId?: string;
  businessId?: string;
}

export default function InboxScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<{ name?: string; email?: string; phone?: string } | null>(null);

  // Default to 'sent' per request
  const [activeSection, setActiveSection] = useState<'received' | 'sent'>('sent');

  // Lists populated from API /matches
  const [receivedItems, setReceivedItems] = useState<Notification[]>([]);
  const [sentItems, setSentItems] = useState<Notification[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [selectedBuyerUser, setSelectedBuyerUser] = useState<User | null>(null);

  useEffect(() => {
    if (!selectedBuyerId) {
      setSelectedBuyer(null);
      setSelectedBuyerUser(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/buyers/${selectedBuyerId}`);
        if (!resp.ok) return;
        const b: Buyer = await resp.json();
        if (!mounted) return;
        setSelectedBuyer(b);
        try {
          const uresp = await fetch(`${API_BASE_URL}/users/${b.user_id}`);
          if (uresp.ok) {
            const u: User = await uresp.json();
            if (!mounted) return;
            setSelectedBuyerUser(u);
          }
        } catch { }
      } catch (err) {
        console.error('Error loading selected buyer:', err);
      }
    })();
    return () => { mounted = false; };
  }, [selectedBuyerId]);

  // Derive current user id from auth
  const currentUserId = user?.user_id?.toString?.();


  const cancelledRef = useRef(false);

  // Load matches and convert to Notification[] (tolerant to naming differences)
  const loadMatches = useCallback(async () => {
    if (!isAuthenticated || !currentUserId) return;
    cancelledRef.current = false;
    setLoadingMatches(true);

    try {
      const res = await fetch(`${API_BASE_URL}/matches`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      const matches: Match[] = await res.json();

      // Hard-coded 'Lukas accepted' notification to always appear in Received
      const lukasAccepted: Notification = {
        id: 'special-lukas-accepted',
        title: 'approved',
        name: 'Lukas Mueller',
        message: 'accepted your contact request',
        primaryAction: 'View contact',
        avatar: 'https://cdn.miiwiki.org/a/ad/WS_Guest_B.png',
        route: undefined,
        email: 'lukas.mueller@example.com',
        phone: '+1 (555) 000-1111',
        senderId: 'user_lukas',
        recipientId: String(currentUserId ?? ''),
        simpleContact: true,
      };

      const rItems: Notification[] = [];
      const sItems: Notification[] = [];

      await Promise.all(matches.map(async (m) => {
        try {
          // tolerate both naming conventions for direction
          const sentFromBusToBuy = Object.prototype.hasOwnProperty.call(m, 'sentFromBusToBuy')
            ? Boolean((m as any).sentFromBusToBuy)
            : Boolean((m as any).sent_from_bus_to_buy);

          const [buyerResp, listingResp] = await Promise.all([
            fetch(`${API_BASE_URL}/buyers/${m.buyer_id}`),
            fetch(`${API_BASE_URL}/listings/${m.business_id}`),
          ]);

          if (!buyerResp.ok || !listingResp.ok) return;
          const buyer = await buyerResp.json();
          const listing = await listingResp.json();

          // fetch buyer's user profile for name/avatar where needed
          let buyerUser: User | null = null;
          try {
            const uresp = await fetch(`${API_BASE_URL}/users/${buyer.user_id}`);
            if (uresp.ok) buyerUser = await uresp.json();
          } catch { /* ignore user fetch errors */ }

          const matchKey = `match-${m.interest_id}`;

          const isBuyerCurrent = String(buyer.user_id) === String(currentUserId);
          const isListingOwnerCurrent = String(listing.owner_id) === String(currentUserId);

          // Business -> Buyer
          if (sentFromBusToBuy) {
            if (isListingOwnerCurrent) {
              sItems.push({
                id: matchKey,
                title: 'buyer',
                name: buyerUser ? `${buyerUser.first_name} ${buyerUser.last_name}` : (buyer.title || 'Buyer'),
                message: 'You sent a contact request to this buyer',
                primaryAction: 'View buyer profile',
                avatar: buyerUser?.profile_image_url || undefined,
                route: `/buyer-detail?id=${buyer.buyer_id}`,
                senderId: String(listing.owner_id),
                recipientId: String(buyer.user_id),
                buyerId: String(buyer.buyer_id),
                businessId: String(listing.business_id),
              });
            }
            if (isBuyerCurrent) {
              rItems.push({
                id: matchKey,
                title: 'business',
                name: listing.name,
                message: 'sent you a contact request',
                primaryAction: 'View business listing',
                avatar: (listing as any).feature_image_url || (listing as any).image_url || undefined,
                route: `/business-detail?id=${listing.business_id}`,
                senderId: String(listing.owner_id),
                recipientId: String(buyer.user_id),
                buyerId: String(buyer.buyer_id),
                businessId: String(listing.business_id),
              });
            }

          // Buyer -> Business
          } else {
            if (isBuyerCurrent) {
              sItems.push({
                id: matchKey,
                title: 'business',
                name: listing.name,
                message: 'You sent a contact request to this business',
                primaryAction: 'View business listing',
                avatar: (listing as any).feature_image_url || (listing as any).image_url || undefined,
                route: `/business-detail?id=${listing.business_id}`,
                senderId: String(buyer.user_id),
                recipientId: String(listing.owner_id),
                buyerId: String(buyer.buyer_id),
                businessId: String(listing.business_id),
              });
            }
            if (isListingOwnerCurrent) {
              rItems.push({
                id: matchKey,
                title: 'buyer',
                name: buyerUser ? `${buyerUser.first_name} ${buyerUser.last_name}` : (buyer.title || 'Buyer'),
                message: 'is interested in your business',
                primaryAction: 'View buyer profile',
                avatar: buyerUser?.profile_image_url || undefined,
                route: `/buyer-detail?id=${buyer.buyer_id}`,
                senderId: String(buyer.user_id),
                recipientId: String(listing.owner_id),
                buyerId: String(buyer.buyer_id),
                businessId: String(listing.business_id),
              });
            }
          }
        } catch (err) {
          console.error('Error loading match item', err);
        }
      }));

      if (!cancelledRef.current) {
        const unique = (arr: Notification[]) => Array.from(new Map(arr.map(i => [i.route, i])).values());
        const uniqReceived = unique(rItems);
        // Ensure Lukas accepted notification appears first (avoid duplicate)
        setReceivedItems([lukasAccepted, ...uniqReceived.filter(i => i.id !== lukasAccepted.id)]);
        setSentItems(unique(sItems));
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      if (!cancelledRef.current) setLoadingMatches(false);
    }
  }, [isAuthenticated, currentUserId]);

  useEffect(() => {
    loadMatches();
    return () => { cancelledRef.current = true; };
  }, [loadMatches]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/sign-in' as any);
    }
  }, [isAuthenticated, router]);

  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={20} color={Colors.light.tint} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">Notifications</Text>
        <View style={styles.headerRight}>{loadingMatches && <ActivityIndicator size="small" color={Colors.light.tint} />}</View>
      </View>

      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segmentButton, activeSection === 'received' && styles.segmentButtonActive]}
          onPress={() => setActiveSection('received')}
          accessibilityLabel="View received notifications"
        >
          <Text style={[styles.segmentText, activeSection === 'received' && styles.segmentTextActive]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeSection === 'sent' && styles.segmentButtonActive]}
          onPress={() => setActiveSection('sent')}
          accessibilityLabel="View sent notifications"
        >
          <Text style={[styles.segmentText, activeSection === 'sent' && styles.segmentTextActive]}>Sent</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeSection === 'received' ? receivedItems : sentItems}
        keyExtractor={(i) => i.id}
        refreshing={loadingMatches}
        onRefresh={loadMatches}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <Image source={typeof item.avatar === 'string' ? { uri: item.avatar } : (item.avatar as any)}
                style={styles.avatar} />
              <View style={styles.itemBody}>
                <Text style={styles.notificationText}>
                  <Text style={styles.name}>{item.name} </Text>
                  <Text>{item.message}</Text>
                </Text>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      if (!isAuthenticated) {
                        setAuthPromptVisible(true);
                        return;
                      }
                      if (item.title === 'buyer' && item.buyerId) {
                        setSelectedBuyerId(item.buyerId);
                        return;
                      }
                      if (item.simpleContact || item.primaryAction?.toLowerCase().includes('view contact')) {
                        setContactInfo({ name: item.name, email: item.email, phone: item.phone });
                        setContactModalVisible(true);
                        return;
                      }
                      if (item?.route) router.push(item.route as any);
                    }}
                  >
                    <Text style={styles.primaryButtonText}>{item.primaryAction}</Text>
                  </TouchableOpacity>

                {/* Hide approve/deny for sent items */}
                {activeSection === 'received' && !item.simpleContact && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.pillButton}
                      onPress={() => {
                        if (!isAuthenticated) {
                          setAuthPromptVisible(true);
                          return;
                        }
                        Alert.alert('Approved');
                      }}
                    >
                      <Text style={styles.pillText}>Approve contact request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.pillButton, styles.pillSecondary]}
                      onPress={() => {
                        if (!isAuthenticated) {
                          setAuthPromptVisible(true);
                          return;
                        }
                        Alert.alert('Denied');
                      }}
                    >
                      <Text style={styles.pillText}>Deny contact request</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      />

      {/* Contact popup modal (callout) */}
      <Modal visible={contactModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setContactModalVisible(false)}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutName}>{contactInfo?.name}</Text>
            {contactInfo?.email ? <Text style={styles.calloutText}>{contactInfo.email}</Text> : null}
            {contactInfo?.phone ? <Text style={styles.calloutText}>{contactInfo.phone}</Text> : null}
          </View>
        </Pressable>
      </Modal>

      {/* Buyer detail modal: fetch buyer and user details when an id is selected */}
      {selectedBuyer && selectedBuyerUser && (
        <BuyerDetailModal
          buyer={selectedBuyer}
          userInfo={selectedBuyerUser}
          visible={!!selectedBuyer}
          onClose={() => { setSelectedBuyerId(null); setSelectedBuyer(null); setSelectedBuyerUser(null); }}
        />
      )}
      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={() => setAuthPromptVisible(false)}>
          <Pressable style={styles.authModalOverlay} onPress={() => setAuthPromptVisible(false)}>
            <Pressable style={styles.authModalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.authModalTitle}>Log in to view details</Text>
              <TouchableOpacity
                style={[styles.authModalButton, styles.authModalPrimary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/sign-in-form');
                }}
              >
                <Text style={styles.authModalButtonText}>Returning user login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authModalButton, styles.authModalSecondary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/create-account');
                }}
              >
                <Text style={styles.authModalSecondaryText}>Create an account</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 6, marginRight: 8, zIndex: 2 },
  headerRight: { width: 32 },
  title: { position: 'absolute', left: 0, right: 0, fontSize: 20, fontWeight: '700', textAlign: 'center', color: Colors.light.text },
  backButtonText: { color: Colors.light.tint, fontSize: 16, fontWeight: '600', marginLeft: 6 },
  list: { padding: 12, paddingBottom: 20 },
  item: { padding: 14, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10, minHeight: 110 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#ccc' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  itemBody: { flex: 1, marginLeft: 12 },
  notificationText: { fontSize: 15, color: Colors.light.text, marginBottom: 8 },
  name: { fontWeight: '700', color: Colors.light.text },
  primaryButton: { alignSelf: 'flex-start', backgroundColor: Colors.light.tint, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginBottom: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  actionRow: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap', alignItems: 'center' },
  pillButton: { backgroundColor: '#eaf2fb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, flexShrink: 1, maxWidth: '65%' },
  pillSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e6e6' },
  pillText: { color: Colors.light.tint, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  calloutContainer: { backgroundColor: Colors.light.tint, paddingVertical: 18, paddingHorizontal: 22, borderRadius: 28, alignItems: 'center', minWidth: 240 },
  calloutName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  calloutText: { color: '#fff', fontSize: 15 },
  segmented: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 6, marginBottom: 4 },
  segmentButton: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 10, marginHorizontal: 4, alignItems: 'center', backgroundColor: '#fff' },
  segmentButtonActive: { backgroundColor: '#eaf2fb', borderColor: Colors.light.tint },
  segmentText: { color: Colors.light.text, fontWeight: '600' },
  segmentTextActive: { color: Colors.light.tint },
  /* auth modal styles */
  authModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authModalContent: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  authModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  authModalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authModalPrimary: {
    backgroundColor: '#5A7A8C',
  },
  authModalSecondary: {
    backgroundColor: '#E8E3DC',
    borderWidth: 1,
    borderColor: '#9B8F82',
  },
  authModalButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  authModalSecondaryText: {
    color: '#5A7A8C',
    fontWeight: '700',
  },
});
