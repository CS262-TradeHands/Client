import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '@/constants/api';
import { Buyer } from '@/types/buyer';
import { User } from '@/types/user';
import BuyerDetailModal from '../components/BuyerDetailModal';

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

  const [activeSection, setActiveSection] = useState<'received' | 'sent'>('received');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive current user id
  const currentUserId = user?.user_id?.toString() ?? 'me';

  // Compute sections from notifications
  const receivedItems = useMemo(
    () => notifications.filter((n) => n.recipientId === currentUserId && n.senderId !== currentUserId),
    [notifications, currentUserId]
  );
  const sentItems = useMemo(
    () => notifications.filter((n) => n.senderId === currentUserId),
    [notifications, currentUserId]
  );

  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [buyerData, setBuyerData] = useState<Buyer | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  // Fetch notifications from database
  useEffect(() => {
    async function fetchNotifications() {
      if (!isAuthenticated || !user?.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // TODO: Replace with your actual notifications endpoint
        // For now, we'll fetch buyers and listings to create notifications
        const [buyersRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/buyers`),
          fetch(`${API_BASE_URL}/users`)
        ]);

        const buyers: Buyer[] = await buyersRes.json();
        const users: User[] = await usersRes.json();

        // Create notifications from buyers who match current user's listings
        const generatedNotifications: Notification[] = [];

        // Example: Create notifications for buyers interested in user's businesses
        for (const buyer of buyers) {
          if (buyer.user_id !== user.user_id) {
            const buyerUser = users.find(u => u.user_id === buyer.user_id);
            if (buyerUser) {
              generatedNotifications.push({
                id: `buyer-${buyer.buyer_id}`,
                title: 'buyer',
                name: `${buyerUser.first_name} ${buyerUser.last_name}`,
                message: 'is interested in your business',
                primaryAction: 'View buyer profile',
                avatar: buyerUser.profile_image_url || undefined,
                route: `/buyer-detail?id=${buyer.buyer_id}`,
                email: buyerUser.email,
                phone: buyerUser.phone || undefined,
                senderId: buyer.user_id.toString(),
                recipientId: currentUserId,
                buyerId: buyer.buyer_id.toString(),
              });
            }
          }
        }

        setNotifications(generatedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [isAuthenticated, user?.user_id, currentUserId]);

  // Fetch buyer details when a buyer is selected
  useEffect(() => {
    if (!selectedBuyerId) return;

    async function fetchBuyerDetails() {
      try {
        const buyerRes = await fetch(`${API_BASE_URL}/buyers/${selectedBuyerId}`);
        const buyer = await buyerRes.json();
        
        const userRes = await fetch(`${API_BASE_URL}/users/${buyer.user_id}`);
        const user = await userRes.json();

        setBuyerData(buyer);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching buyer details:', error);
      }
    }

    fetchBuyerDetails();
  }, [selectedBuyerId]);

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
        <View style={styles.headerRight} />
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={activeSection === 'received' ? receivedItems : sentItems}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.row}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={32} color="#999" />
                  </View>
                )}
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
      )}

      <BuyerDetailModal
        buyer={buyerData}
        userInfo={userData}
        visible={!!selectedBuyerId}
        onClose={() => {
          setSelectedBuyerId(null);
          setBuyerData(null);
          setUserData(null);
        }}
        onContact={() => {
          console.log('Contact buyer from inbox');
        }}
      />

      <Modal visible={contactModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setContactModalVisible(false)}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutName}>{contactInfo?.name}</Text>
            {contactInfo?.email ? <Text style={styles.calloutText}>{contactInfo.email}</Text> : null}
            {contactInfo?.phone ? <Text style={styles.calloutText}>{contactInfo.phone}</Text> : null}
          </View>
        </Pressable>
      </Modal>

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
  authModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  authModalContent: { width: '86%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  authModalTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  authModalButton: { width: '100%', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  authModalPrimary: { backgroundColor: '#5A7A8C' },
  authModalSecondary: { backgroundColor: '#E8E3DC', borderWidth: 1, borderColor: '#9B8F82' },
  authModalButtonText: { color: '#fff', fontWeight: '700' },
  authModalSecondaryText: { color: '#5A7A8C', fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999' },
});
