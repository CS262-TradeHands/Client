// Replace with:
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

// Import mock data structures (assuming they are accessible)
import { mockBusinesses, Business } from '../../constants/mockBusinesses';

// Re-declare Buyer type/mock from app/(tabs)/buyers.tsx since it's not exported globally
// In a real app, this would be an imported interface.
interface Buyer {
  id: string;
  name: string;
  city: string;
  title?: string;
  // ... other fields as needed
}
const mockBuyers: Buyer[] = [
    // Using a subset of the mock data from app/(tabs)/buyers.tsx for filtering
    { id: '1', name: 'Khaled', city: 'San Francisco, CA', title: 'Investor / Entrepreneur' },
];
// NOTE: In a real app, you would fetch this data from your API.

// Define the ItemCard component outside the main component to keep it clean
const ItemCard = ({ name, id, type, industryOrTitle, onEdit, onView }: 
  { name: string, id: string, type: 'business'|'buyer', industryOrTitle?: string, onEdit: (id: string) => void, onView: (id: string, type: 'business'|'buyer') => void }
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  // Mock Data, need to connect to backend in real app
const MOCK_USER_ID = '1';

const userBusinesses: Business[] = isAuthenticated ? 
    mockBusinesses.filter(b => b.id === MOCK_USER_ID) : [];
const userBuyers: Buyer[] = isAuthenticated ? 
    mockBuyers.filter(b => b.id === MOCK_USER_ID) : [];

// Handlers for navigation to View/Edit pages
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
        router.push(`/buyer-detail?id=${id}`);
    }
};
// End of new handlers

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(tabs)/business-listings');
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleViewMatches = () => {
    console.log('View Matches clicked');
    router.push('/algo');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <Text style={styles.notAuthenticatedTitle}>Not Signed In</Text>
          <Text style={styles.notAuthenticatedText}>
            Please sign in to view your profile
          </Text>
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => router.push('/sign-in')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createAccountButton} 
            onPress={() => router.push('/create-account')}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>{user?.firstName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>{user?.lastName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            {user?.phone && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={handleViewMatches}
            >
              <Text style={styles.settingText}>View Matches</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.infoDivider} />
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
        {/* Your Business Listings Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Your Business Listings ({userBusinesses.length})</Text>
  {userBusinesses.length > 0 ? (
    userBusinesses.map((b) => (
      <ItemCard
        key={b.id}
        id={b.id}
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
  <Text style={styles.sectionTitle}>Your Buyer Profiles ({userBuyers.length})</Text>
  {userBuyers.length > 0 ? (
    userBuyers.map((b) => (
      <ItemCard
        key={b.id}
        id={b.id}
        name={b.name}
        type="buyer"
        industryOrTitle={b.title}
        onView={handleViewDetails}
        onEdit={handleEditBuyer}
      />
    ))
  ) : (
    <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>No buyer profiles created.</Text>
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
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notAuthenticatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notAuthenticatedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: '#7FA084',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // New styles for Listings/Profiles section
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
});