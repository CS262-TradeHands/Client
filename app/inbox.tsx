import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const mockMatches = [
  { id: 'm1', title: "Buyer: Khaled", subtitle: 'Interested in SaaS businesses' },
  { id: 'm2', title: "Buyer: Miriam", subtitle: 'Looking for retail stores' },
  // Businesses that have expressed interest in you as a buyer
  { id: 'b1', title: "Business: Green Clean Services", subtitle: 'Interested in partnering with you' },
  { id: 'b2', title: "Business: TechStart Solutions", subtitle: 'Interested in you — exploring strategic acquisition talks' },
  { id: 'b3', title: "Business: Craft Brewery Co.", subtitle: 'Looking for investor-operators' },
];

export default function InboxScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/sign-in' as any);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={20} color="#5A7A8C" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">Matches</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={mockMatches}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => { /* future: open match detail */ }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 6, marginRight: 8, zIndex: 2 },
  headerRight: { width: 32 },
  title: { position: 'absolute', left: 0, right: 0, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  backButtonText: { color: '#5A7A8C', fontSize: 16, fontWeight: '600', marginLeft: 6 },
  list: { padding: 12 },
  item: { padding: 14, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemSubtitle: { fontSize: 13, color: '#555', marginTop: 4 },
});
