import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';

interface Props {
  isAuthenticated: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
}

function ProtectedInfo({ isAuthenticated, onPress, children, style }: Props) {
  if (isAuthenticated) return <>{children}</>;

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
      <View style={[styles.protectedContainer, style]}>
        <View style={styles.protectedContent}>{children}</View>
        <BlurView intensity={90} tint="light" style={styles.protectedBlur} />
      </View>
    </TouchableOpacity>
  );
}

interface Buyer {
  id: string;
  name: string;
  city: string;
  title?: string;
  avatar: any;
  bio?: string;
  lookingFor?: string[];
  budget?: string;
  experience?: string;
  timeline?: string;
  email?: string;
  phone?: string;
}

const mockBuyerDetails: Record<string, Buyer> = {
  '1': {
    id: '1',
    name: 'Khaled',
    city: 'San Francisco, CA',
    title: 'Investor / Entrepreneur',
    avatar: require('../assets/images/mii/buyer1.png'),
    bio: 'Serial entrepreneur with 15+ years of experience building and scaling tech companies. Looking to acquire established businesses with strong fundamentals and growth potential.',
    lookingFor: ['Tech Companies', 'SaaS Businesses', 'E-commerce', 'Digital Services'],
    budget: '$500K - $2M',
    experience: '15+ years in tech entrepreneurship',
    timeline: 'Ready to close within 3-6 months',
    email: 'khaled@example.com',
    phone: '+1 (555) 123-4567',
  },
  '2': {
    id: '2',
    name: 'Miriam',
    city: 'Austin, TX',
    title: 'Retail Buyer',
    avatar: require('../assets/images/mii/buyer2.png'),
    bio: 'Experienced retail operator looking to expand portfolio with established brick-and-mortar businesses in high-traffic locations.',
    lookingFor: ['Retail Stores', 'Boutiques', 'Specialty Shops', 'Food & Beverage'],
    budget: '$200K - $800K',
    experience: '10 years in retail management',
    timeline: 'Flexible, evaluating opportunities',
    email: 'miriam@example.com',
    phone: '+1 (555) 234-5678',
  },
  '3': {
    id: '3',
    name: 'Bobby',
    city: 'Denver, CO',
    title: 'Service Business Investor',
    avatar: require('../assets/images/mii/buyer3.png'),
    bio: 'Private investor seeking profitable service-based businesses with recurring revenue and strong customer relationships.',
    lookingFor: ['Consulting Firms', 'Marketing Agencies', 'Professional Services', 'Home Services'],
    budget: '$300K - $1M',
    experience: '8 years in service business operations',
    timeline: 'Actively searching',
    email: 'bobby@example.com',
    phone: '+1 (555) 345-6789',
  },
  '4': {
    id: '4',
    name: 'Mickey',
    city: 'Portland, OR',
    title: 'Brewery Enthusiast',
    avatar: require('../assets/images/mii/buyer4.png'),
    bio: 'Craft beer enthusiast and entrepreneur looking to acquire established breweries or taprooms with strong local presence.',
    lookingFor: ['Breweries', 'Taprooms', 'Bars & Pubs', 'Distilleries'],
    budget: '$400K - $1.5M',
    experience: '5 years in hospitality industry',
    timeline: '6-12 months',
    email: 'mickey@example.com',
    phone: '+1 (555) 456-7890',
  },
  '5': {
    id: '5',
    name: 'Sandra',
    city: 'Miami, FL',
    title: 'Healthcare Investor',
    avatar: require('../assets/images/mii/buyer5.png'),
    bio: 'Healthcare professional seeking to acquire medical practices, clinics, or healthcare services businesses.',
    lookingFor: ['Medical Practices', 'Dental Clinics', 'Healthcare Services', 'Wellness Centers'],
    budget: '$600K - $3M',
    experience: '12 years in healthcare administration',
    timeline: 'Ready to move quickly on the right opportunity',
    email: 'sandra@example.com',
    phone: '+1 (555) 567-8901',
  },
  '6': {
    id: '6',
    name: 'Alex',
    city: 'Seattle, WA',
    title: 'Tech Acquirer',
    avatar: require('../assets/images/mii/buyer6.png'),
    bio: 'Tech executive looking to acquire software companies, mobile apps, or tech-enabled service businesses with proven revenue.',
    lookingFor: ['Software Companies', 'Mobile Apps', 'Tech Startups', 'SaaS Platforms'],
    budget: '$750K - $5M',
    experience: '20 years in tech industry',
    timeline: 'Evaluating multiple opportunities',
    email: 'alex@example.com',
    phone: '+1 (555) 678-9012',
  },
};

export default function BuyerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const [authPromptVisible, setAuthPromptVisible] = useState(false);

  const buyer = mockBuyerDetails[params.id as string];

  if (!buyer) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Buyer not found</Text>
      </SafeAreaView>
    );
  }

  const handleContactBuyer = () => {
    if (!isAuthenticated) {
      setAuthPromptVisible(true);
      return;
    }
    Alert.alert('Contact Buyer', `Would you like to contact ${buyer.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Message', onPress: () => Alert.alert('Message sent!') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5A7A8C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buyer Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Buyer Info Card */}
        <View style={styles.buyerCard}>
          <Image source={buyer.avatar} style={styles.avatar} />
          <Text style={styles.buyerName}>{buyer.name}</Text>
          <Text style={styles.buyerTitle}>{buyer.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.buyerLocation}>{buyer.city}</Text>
          </View>

          <TouchableOpacity style={styles.contactButton} onPress={handleContactBuyer}>
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Buyer</Text>
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{buyer.bio}</Text>
        </View>

        {/* Looking For */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <View style={styles.tagsContainer}>
            {buyer.lookingFor?.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Investment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="cash-outline" size={20} color="#5A7A8C" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Budget Range</Text>
                <ProtectedInfo isAuthenticated={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
                  <Text style={styles.detailValue}>{buyer.budget}</Text>
                </ProtectedInfo>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="briefcase-outline" size={20} color="#5A7A8C" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Experience</Text>
                <Text style={styles.detailValue}>{buyer.experience}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color="#5A7A8C" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Timeline</Text>
                <Text style={styles.detailValue}>{buyer.timeline}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.detailsCard}>
            <ProtectedInfo isAuthenticated={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <Text style={styles.contactText}>{buyer.email}</Text>
              </View>
            </ProtectedInfo>

            <View style={styles.divider} />

            <ProtectedInfo isAuthenticated={isAuthenticated} onPress={() => setAuthPromptVisible(true)}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.contactText}>{buyer.phone}</Text>
              </View>
            </ProtectedInfo>
          </View>
        </View>
      </ScrollView>

      {/* Auth Prompt Modal */}
      <Modal visible={authPromptVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setAuthPromptVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign In Required</Text>
            <Text style={styles.modalText}>Please sign in to view protected information and contact buyers.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setAuthPromptVisible(false);
                router.push('/sign-in');
              }}
            >
              <Text style={styles.modalButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setAuthPromptVisible(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  buyerCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  buyerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  buyerTitle: {
    fontSize: 16,
    color: '#5A7A8C',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buyerLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#E8E3DC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5A7A8C',
  },
  tagText: {
    color: '#5A7A8C',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonSecondary: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    color: '#5A7A8C',
    fontSize: 16,
  },
  protectedContainer: {
    position: 'relative',
  },
  protectedContent: {},
  protectedBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
});