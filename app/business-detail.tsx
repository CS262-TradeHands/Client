import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Listing } from '../types/listing';

const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

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
  const [liked, setLiked] = useState(false);

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
      }
    })();
  }, [params, id]);

  const toggleLike = () => {
    setLiked((v) => !v);
  };

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

        {/* Owner info box (below asking price) */}
        <View style={styles.ownerInline}>
          <View style={styles.ownerTopRow}>
            <View>
              <Text style={styles.ownerLabel}>Owner</Text>
              <Text style={styles.ownerName}>John Doe</Text>
            </View>
            <TouchableOpacity style={styles.likeButtonInline} onPress={toggleLike}>
              <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={liked ? '#7FA084' : '#333'} />
              <Text style={[styles.likeLabel, liked && { color: '#7FA084' }]}>{liked ? 'Liked' : 'Like'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ownerContactRow}>
            <Text style={styles.contactLabel}>Email:</Text>
            {liked ? (
              <Text style={styles.ownerEmail}>johndoe@gmail.com</Text>
            ) : (
              <Text style={styles.maskedContact}>•••••••••••</Text>
            )}
          </View>
          <View style={styles.ownerContactRow}>
            <Text style={styles.contactLabel}>Phone:</Text>
            {liked ? (
              <Text style={styles.ownerPhone}>(555)345-3345</Text>
            ) : (
              <Text style={styles.maskedContact}>•••••••••••</Text>
            )}
          </View>
          {!liked && <Text style={styles.likePrompt}>Like this business to contact the owner</Text>}
        </View>

        {/* Business Image */}
        <View style={styles.imageContainer}>
          {business?.image_url ? (
            <Image
              source={{ uri: business.image_url }}
              style={styles.businessImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📸</Text>
              <Text style={styles.imagePlaceholderSubtext}>Business Photos</Text>
            </View>
          )}
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
    borderWidth: 1,
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
  likeButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  likePrompt: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  ownerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  likeLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
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
  contactButton: {
    backgroundColor: '#7FA084',
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
