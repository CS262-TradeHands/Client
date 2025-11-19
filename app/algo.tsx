import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { findMatches, Profile } from '../utils/matchingAlgorithm';

export default function AlgoScreen() {
  const router = useRouter();
  // State to hold the results
  const [matches, setMatches] = useState<(Profile & { score: number })[]>([]);

  // Define the search criteria
  const searchCriteria = React.useMemo(() => ({
    location: 'NY',
    minAge: 20,
    maxAge: 30,
    requiredInterests: ['tech'],
  }), []);

  // Run the algorithm when the component loads
  useEffect(() => {
    const results = findMatches(searchCriteria);
    setMatches(results);
  }, [searchCriteria]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matching Results</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Matching Algorithm Results</Text>

        {/* Display Search Criteria */}
        <View style={styles.criteriaBox}>
          <Text style={styles.criteriaTitle}>Searching For:</Text>
          <Text style={styles.criteriaText}>
            Location: {searchCriteria.location}, Age: {searchCriteria.minAge}-{searchCriteria.maxAge}, Interests: {searchCriteria.requiredInterests?.join(', ')}
          </Text>
        </View>

        {/* Display Matches */}
        {matches.length > 0 ? (
          matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{match.score}</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
              <View style={styles.matchDetails}>
                <Text style={styles.matchId}>Profile ID: {match.id}</Text>
                <Text style={styles.matchAttribute}>Age: {match.attributes.age}</Text>
                <Text style={styles.matchAttribute}>Location: {match.attributes.location}</Text>
                <Text style={styles.matchAttribute}>Interests: {match.attributes.interests.join(', ')}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noMatchesText}>No matches found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  criteriaBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  criteriaText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scoreText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  matchDetails: {
    flex: 1,
  },
  matchId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  matchAttribute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  noMatchesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
