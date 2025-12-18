import { API_BASE_URL } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Buyer } from '../types/buyer';
import { Listing } from '../types/listing';
import { MatchInput } from '../types/match';
import { User } from '../types/user';


function formatCurrency(value?: number) {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatPercent(value?: number) {
  if (typeof value !== 'number') return '';
  return `${value}%`;
}

export default function BusinessDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id;

  const [business, setBusiness] = useState<Listing>();
  const [loading, setLoading] = useState(true); // Added loading state
  const [imageLoading, setImageLoading] = useState(true); // Added image loading state
  const [ownerDetails, setOwnerDetails] = useState<User | null>(null); // State for owner details
  const [ownerLoading, setOwnerLoading] = useState(true); // State for loading owner details

  // Current user / buyer profile
  const { user } = useAuth();
  const [buyerProfile, setBuyerProfile] = useState<Buyer | null>(null);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      console.warn('Business ID undefined on mount; waiting for id.');
      return;
    }

    // Only fetch once per mounted screen
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listings/${encodeURIComponent(String(id))}`);
        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setLoading(false); // End loading state
      }
    })();
  }, [params, id]);

  async function fetchOwnerDetails(ownerId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(ownerId)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching owner details:', error);
      return null;
    }
  }

  // Fetch owner details only when owner_id changes (and avoid refetching if already loaded)
  useEffect(() => {
    if (!business?.owner_id) return;
    // If we already have details for this owner id, skip fetching
    if (ownerDetails && String(ownerDetails.user_id) === String(business.owner_id)) return;

    let mounted = true;
    (async () => {
      try {
        setOwnerLoading(true);
        const details = await fetchOwnerDetails(business.owner_id);
        if (!mounted) return;
        setOwnerDetails(details);
      } catch (err) {
        console.error('Error fetching owner details:', err);
      } finally {
        if (mounted) setOwnerLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [business?.owner_id, ownerDetails]);

  // Load current user's buyer profile once per page load when a signed-in user exists
  const buyerFetchedRef = useRef(false);
  useEffect(() => {
    if (buyerFetchedRef.current) return;
    if (!user) return; // wait until user is available
    buyerFetchedRef.current = true;

    let mounted = true;
    (async () => {
      setBuyerLoading(true);
      try {
        const resp = await fetch(`${API_BASE_URL}/buyers`);
        if (!resp.ok) return;
        const buyers: Buyer[] = await resp.json();
        if (!mounted) return;
        const mine = buyers.find(b => String(b.user_id) === String(user.user_id));
        if (mine) setBuyerProfile(mine);
      } catch (err) {
        console.error('Error fetching buyer profile:', err);
      } finally {
        if (mounted) setBuyerLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  const contactOwner = async () => {
    // guard: must be signed in
    if (!user || !user.user_id) {
      Alert.alert('Sign in required', 'Please sign in to send a contact request.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/sign-in-form') }
      ]);
      return;
    }

    // guard: if we've already sent a request, do nothing
    if (requestSent) {
      Alert.alert('Request already sent', 'You have already sent a contact request for this business.');
      return;
    }

    // guard: owner cannot contact self
    if (business?.owner_id && String(business.owner_id) === String(user.user_id)) {
      Alert.alert('Owner', 'You are the owner of this business.');
      return;
    }

    // guard: must have buyer profile
    if (!buyerProfile || buyerLoading) {
      Alert.alert('Buyer profile required', 'You need to create a buyer profile before sending a contact request.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create profile', onPress: () => router.push('/add-buyer' as any) }
      ]);
      return;
    }

    // send match request: buyer -> business (sentFromBusToBuy = false)
    setIsSubmitting(true);
    try {
      const payload: MatchInput = {
        buyer_id: buyerProfile.buyer_id,
        business_id: business!.business_id,
        sent_from_bus_to_buy: false,
      };

      const res = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to send contact request:', res.status, text);
        Alert.alert('Error', 'Failed to send contact request. Please try again.');
        return;
      }

      setRequestSent(true);
      Alert.alert('Request sent', 'Your contact request has been sent to the owner.');
    } catch (err) {
      console.error('Error sending contact request:', err);
      Alert.alert('Error', 'Network error while sending contact request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading business details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RNStatusBar barStyle="dark-content" translucent={false} />

      {/* Static header (business name → meta → asking price) — kept outside the ScrollView so it remains fixed */}
      <View style={styles.businessHeaderStatic}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.businessName}>{business?.name ?? 'Business'}</Text>
        <View style={styles.businessMeta}>
          <View style={styles.industryBadge}>
            <Text style={styles.industryBadgeText}>{business?.industry}</Text>
          </View>
          <Text style={styles.location}>{business?.city}, {business?.state || business?.country}</Text>
        </View>
        <View style={styles.askingRow}>
          <Text style={styles.askingLabel}>Asking Price</Text>
          <Text style={styles.askingPrice}>
            {formatCurrency(business?.asking_price_lower_bound)}
            {business?.asking_price_upper_bound && business?.asking_price_lower_bound !== business?.asking_price_upper_bound
              ? ` - ${formatCurrency(business?.asking_price_upper_bound)}`
              : ''}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Business Image */}
        <View style={styles.imageContainer}>
          {business?.image_url && (
            <Image
              source={{ uri: business.image_url }}
              style={styles.businessImage}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)} // End image loading state
            />
          )}
          {imageLoading && (
            <View style={[styles.imagePlaceholder, StyleSheet.absoluteFill]}>
              <Text style={styles.imagePlaceholderText}>📸</Text>
              <Text style={styles.imagePlaceholderSubtext}>Loading image...</Text>
            </View>
          )}
          {!business?.image_url && (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📸</Text>
              <Text style={styles.imagePlaceholderSubtext}>Business Photos</Text>
            </View>
          )}
        </View>

        {/* Owner info box */}
        <View style={styles.ownerInline}>
          <View style={styles.ownerTopRow}>
            <View>
              <Text style={styles.ownerLabel}>Owner</Text>
              <Text style={styles.ownerName}>{ownerLoading ? 'Loading...' : `${ownerDetails?.first_name} ${ownerDetails?.last_name}` || 'N/A'}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.contactButton,
                (isSubmitting || requestSent || (business?.owner_id && String(business.owner_id) === String(user?.user_id))) ? styles.contactButtonDisabled : null,
                isSubmitting && { opacity: 0.6 }
              ]}
              onPress={contactOwner}
              disabled={isSubmitting || requestSent || String(business?.owner_id) === String(user?.user_id)}
            >
              {!isSubmitting && !requestSent && <Ionicons name="send" size={18} color="#333" />}
              <Text style={styles.contactButtonText}>
                {business?.owner_id && String(business.owner_id) === String(user?.user_id)
                  ? 'You are the owner'
                  : requestSent
                    ? 'Request Sent'
                    : isSubmitting
                      ? 'Sending...'
                      : 'Request Contact'
                }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailSection}>
            <View style={styles.ownerContactRow}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.maskedContact}>•••••••••••</Text>
            </View>
            <View style={styles.ownerContactRow}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.maskedContact}>•••••••••••</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Description</Text>
          <Text style={styles.sectionContent}>{business?.description}</Text>
        </View>

        {/* Financial Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Highlights</Text>
          <View style={styles.financialGrid}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Annual Revenue</Text>
              <Text style={styles.financialValue}>{formatCurrency(business?.annual_revenue)}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Profit Margin</Text>
              <Text style={styles.financialValue}>{formatPercent(business?.profit_margin)}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Monthly Revenue</Text>
              <Text style={styles.financialValue}>{formatCurrency(business?.monthly_revenue)}</Text>
            </View>
          </View>
        </View>

        {/* Business Information (non-sticky) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Website</Text>
              <Text style={styles.infoValue}>{business?.website}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    color: '#5A7A8C',
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
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  businessHeaderStatic: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 32,
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
    backgroundColor: '#E8E3DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 15,
  },
  industryBadgeText: {
    fontSize: 14,
    color: '#5A7A8C',
    fontWeight: '600',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  askingPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7FA084',
  },
  askingRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  askingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
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
  businessImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
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
    color: '#5A7A8C',
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
  ownerInline: {
    marginTop: 12,
    padding: 12,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  ownerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    backgroundColor: '#7FA084',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonDisabled: {
    backgroundColor: '#e6e6e6',
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    right: 16,
    padding: 6,
    zIndex: 10,
  },
  ownerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  maskedContact: {
    fontSize: 16,
    color: '#999',
  },
  ownerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#5A7A8C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
