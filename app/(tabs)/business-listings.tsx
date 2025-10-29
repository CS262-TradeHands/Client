import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusinessListing {
  id: string;
  name: string;
  industry: string;
  askingPrice: string;
  location: string;
  description: string;
  employees: number;
  yearsInOperation: number;
}

const mockBusinessListings: BusinessListing[] = [
  {
    id: '1',
    name: 'TechStart Solutions',
    industry: 'Tech',
    askingPrice: '$250,000 - $300,000',
    location: 'San Francisco, CA',
    description: 'Profitable SaaS company with recurring revenue and growing customer base.',
    employees: 8,
    yearsInOperation: 5
  },
  {
    id: '2',
    name: 'Bella\'s Boutique',
    industry: 'Retail',
    askingPrice: '$150,000 - $200,000',
    location: 'Austin, TX',
    description: 'Established women\'s clothing boutique in prime downtown location with loyal customer base.',
    employees: 3,
    yearsInOperation: 7
  },
  {
    id: '3',
    name: 'Green Clean Services',
    industry: 'Service',
    askingPrice: '$80,000 - $120,000',
    location: 'Denver, CO',
    description: 'Eco-friendly cleaning service with commercial and residential clients.',
    employees: 12,
    yearsInOperation: 4
  },
  {
    id: '4',
    name: 'Craft Brewery Co.',
    industry: 'Food & Beverage',
    askingPrice: '$400,000 - $500,000',
    location: 'Portland, OR',
    description: 'Popular local brewery with taproom and distribution network.',
    employees: 15,
    yearsInOperation: 6
  },
  {
    id: '5',
    name: 'MediCare Plus',
    industry: 'Healthcare',
    askingPrice: '$600,000 - $750,000',
    location: 'Miami, FL',
    description: 'Well-established medical practice with multiple locations.',
    employees: 25,
    yearsInOperation: 12
  }
];

export default function BusinessListingsScreen() {
  const router = useRouter();
  // removed filter/search/sort state per user request
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    // read signedIn from query params when coming back from sign-in screen
    if (params.signedIn === 'true') {
      setSignedIn(true);
    }
  }, [params]);
  const profileBtnRef = useRef(null);

  // No filtering or sorting — show all listings
  const filteredListings = mockBusinessListings;

  const handleViewDetails = (listing: BusinessListing) => {
    router.push('/business-detail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Business Listings</Text>
            <Text style={styles.subtitle}>Find your perfect business opportunity</Text>
          </View>

          {/* Profile button in top-right */}
          <View style={styles.profileContainer} ref={profileBtnRef as any}>
            <Pressable
              onPress={() => setProfileMenuVisible((v) => !v)}
              style={({ pressed }) => [styles.profileButton, pressed && styles.profileButtonPressed]}
              accessibilityLabel="Profile menu"
            >
              <Text style={styles.profileInitial}>{signedIn ? 'U' : '?'}</Text>
            </Pressable>

            {profileMenuVisible && (
              <View style={styles.profileMenu}>
                {!signedIn ? (
                  <>
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      // navigate to sign-in screen
                      router.push('/sign-in' as any);
                    }}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuItemText}>Sign in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => {
                        setProfileMenuVisible(false);
                        router.push('/create-account' as any);
                      }}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>Create Account</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      setSignedIn(false);
                      // sign out by navigating to the same screen without signedIn param
                      router.replace('/business-listings' as any);
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
      </View>

      {/* Business Listings */}
      <ScrollView style={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {filteredListings.length} business{filteredListings.length !== 1 ? 'es' : ''} found
        </Text>
        
        {filteredListings.map((listing) => (
          <View key={listing.id} style={styles.businessCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.businessName}>{listing.name}</Text>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{listing.industry}</Text>
              </View>
            </View>
            
            <Text style={styles.businessLocation}>{listing.location}</Text>
            <Text style={styles.businessDescription}>{listing.description}</Text>
            
            <View style={styles.businessDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Asking Price</Text>
                <Text style={styles.detailValue}>{listing.askingPrice}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Employees</Text>
                <Text style={styles.detailValue}>{listing.employees}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Established</Text>
                <Text style={styles.detailValue}>{listing.yearsInOperation} years</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(listing)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {filteredListings.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No businesses found matching your criteria</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  /* filter/search styles removed */
  listingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginVertical: 15,
    fontWeight: '500',
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  industryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  industryBadgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  businessLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  businessDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  businessDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  viewDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileButtonPressed: {
    opacity: 0.8,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
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
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
});
