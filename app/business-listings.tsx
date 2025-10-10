import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const industries = ['All', 'Tech', 'Retail', 'Service', 'Manufacturing', 'Healthcare', 'Finance', 'Education', 'Food & Beverage'];

  const filteredListings = mockBusinessListings
    .filter(listing => {
      const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === 'All' || listing.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          // Simple price comparison (extract first number)
          const priceA = parseInt(a.askingPrice.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.askingPrice.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        case 'employees':
          return a.employees - b.employees;
        default:
          return 0;
      }
    });

  const handleViewDetails = (listing: BusinessListing) => {
    router.push('/business-detail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Business Listings</Text>
        <Text style={styles.subtitle}>Find your perfect business opportunity</Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search businesses..."
            placeholderTextColor="#999"
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industryFilter}>
          {industries.map((industry) => (
            <TouchableOpacity
              key={industry}
              style={[
                styles.industryButton,
                selectedIndustry === industry && styles.industryButtonSelected
              ]}
              onPress={() => setSelectedIndustry(industry)}
            >
              <Text style={[
                styles.industryButtonText,
                selectedIndustry === industry && styles.industryButtonTextSelected
              ]}>
                {industry}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonSelected]}
            onPress={() => setSortBy('name')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextSelected]}>
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonSelected]}
            onPress={() => setSortBy('price')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextSelected]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'employees' && styles.sortButtonSelected]}
            onPress={() => setSortBy('employees')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'employees' && styles.sortButtonTextSelected]}>
              Size
            </Text>
          </TouchableOpacity>
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
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  industryFilter: {
    marginBottom: 15,
  },
  industryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  industryButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  industryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  industryButtonTextSelected: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sortButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextSelected: {
    color: '#fff',
  },
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
});
