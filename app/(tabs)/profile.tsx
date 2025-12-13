import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Buyer } from '../../types/buyer';
import { Listing } from '../../types/listing';

const ItemCard = ({ name, id, type, industryOrTitle, onEdit, onView }:
  { name: string, id: string, type: 'business' | 'buyer', industryOrTitle?: string, onEdit: (id: string) => void, onView: (id: string, type: 'business' | 'buyer') => void }
) => (
  <View style={styles.itemCard}>
    <View style={styles.itemCardHeader}>
      <Text style={styles.itemCardName}>{name}</Text>
      {industryOrTitle && <Text style={styles.itemCardSubtitle}>{industryOrTitle}</Text>}
    </View>
    <View style={styles.itemCardActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onView(id, type)}>
        <Ionicons name="eye-outline" size={20} color="#5A7A8C" />
        <Text style={styles.actionButtonText}>View</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(id)}>
        <Ionicons name="create-outline" size={20} color="#5A7A8C" />
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FAQAccordionItem = ({ question, children }: { question: string, children: React.ReactNode }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.settingText}>{question}</Text>
        <Text style={[styles.settingArrow, expanded && { transform: [{ rotate: '90deg' }] }]}>›</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswerContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [userBusinesses, setUserBusinesses] = useState<Listing[]>([]);
  const [userBuyer, setUserBuyer] = useState<Buyer>();
  const API_BASE_URL = 'https://tradehands-bpgwcja7g5eqf2dp.canadacentral-01.azurewebsites.net';

  async function fetchBuyerData() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyers`);
      const buyerData: Buyer[] = await response.json();
      const buyer = buyerData.find(b => b.user_id === user?.user_id );

      if (buyer) {
        setUserBuyer(buyer);
      }

    } catch (error) {
      console.error('Error fetching buyers:', error);
    }
  }

  async function fetchListingData() {
    try {
      const response = await fetch(`${API_BASE_URL}/listings`);
      const listingData: Listing[] = await response.json();
      const listings = listingData.filter(b => b.owner_id === user?.user_id );

      if (listings) {
        setUserBusinesses(listings);
      }

    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  }

  const handleEditBusiness = (id: string) => {
    router.push(`/edit-business?id=${id}`);
  };

  const handleEditBuyer = (id: string) => {
    router.push(`/edit-buyer?id=${id}`);
  };

  const handleViewDetails = (id: string, type: 'business' | 'buyer') => {
    if (type === 'business') {
      router.push(`/business-detail?id=${id}`);
    } else {
      router.push(`/buyers?id=${id}`);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/(tabs)/business-listings');
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  useFocusEffect(() => {
    fetchBuyerData();
    fetchListingData();
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Your Business Listings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Business Listings ({userBusinesses.length})</Text>
          {userBusinesses.length > 0 ? (
            userBusinesses.map((b) => (
              <ItemCard
                key={b.business_id}
                id={b.owner_id.toString()}
                name={b.name}
                type="business"
                industryOrTitle={b.industry}
                onView={handleViewDetails}
                onEdit={handleEditBusiness}
              />
            ))
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>No business listings created.</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/add-business' as any)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add New Listing</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Your Buyer Profiles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Buyer Profile</Text>
          {userBuyer ? (
              <ItemCard
                key={userBuyer.buyer_id}
                id={userBuyer.user_id.toString()}
                name={userBuyer.title}
                type="buyer"
                industryOrTitle={userBuyer.title}
                onView={handleViewDetails}
                onEdit={handleEditBuyer}
              />
            ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>No buyer profile created.</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/add-buyer' as any)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add New Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.infoCard}>
            <FAQAccordionItem question="How do I create a business listing?">
              <Text style={styles.faqAnswer}>
                You can create a business listing once logged into an account. This can be done through the following steps:
                {'\n'}• Navigate to the businesses page, indicated on the bottom left of the screen
                {'\n'}• Click the “Add business listing” button at the top of the businesses page
                {'\n'}• Insert the business name, industry, location, asking price, number of employees, years in operation, and a business description
                {'\n'}• Click “submit listing.”
              </Text>
            </FAQAccordionItem>
            <View style={styles.infoDivider} />
            <FAQAccordionItem question="How do I create a buyer profile?">
              <Text style={styles.faqAnswer}>
                You can create a buyer profile once logged into an account. This can be done through the following steps:
                {'\n'}• Navigate to the buyer page, indicated at the bottom middle of the screen
                {'\n'}• Click the “Add buyer profile” button at the top of the buyers page
                {'\n'}• Insert the title of your role, profile description, location, and business preferences.
                {'\n'}• Click “submit listing.”
              </Text>
            </FAQAccordionItem>
            <View style={styles.infoDivider} />
            <FAQAccordionItem question="How do I edit my profile?">
              <Text style={styles.faqAnswer}>
                You can edit your profile information at any time. This can be done through the following steps:
                {'\n'}• Navigate to the profile page
                {'\n'}• Click the &quot;Edit Profile&quot; button next to your name
                {'\n'}• Update your information and save changes.
              </Text>
            </FAQAccordionItem>
            <View style={styles.infoDivider} />
            <FAQAccordionItem question="How do I view my matches?">
              <Text style={styles.faqAnswer}>
                You can view your business matches in the settings. This can be done through the following steps:
                {'\n'}• Navigate to the profile page
                {'\n'}• Look for the &quot;Settings&quot; section
                {'\n'}• Click on &quot;View Matches&quot; to see your compatible listings.
              </Text>
            </FAQAccordionItem>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingText}>Privacy</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingText}>Change Password</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5A7A8C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 24,
    color: '#999',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  authPromptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  authPromptButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  authPromptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 20,
  },
  authBackButtonText: {
    color: '#5A7A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  authCreateAccountButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authCreateAccountText: {
    color: '#5A7A8C',
    fontSize: 16,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemCardHeader: {
    marginBottom: 10,
  },
  itemCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  itemCardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f7f7f7',
    paddingTop: 8,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
    backgroundColor: '#E8E3DC',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7A8C',
  },
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
  faqAnswerContainer: {
    paddingHorizontal: 0,
    paddingBottom: 12,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});