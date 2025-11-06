import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const mockMatches = [
  { id: 'm1', title: "Buyer: Khaled", subtitle: 'Interested in SaaS businesses' },
  { id: 'm2', title: "Buyer: Miriam", subtitle: 'Looking for retail stores' },
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
        <Text style={styles.title}>Matches</Text>
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
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: '700' },
  list: { padding: 12 },
  item: { padding: 14, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemSubtitle: { fontSize: 13, color: '#555', marginTop: 4 },
});
