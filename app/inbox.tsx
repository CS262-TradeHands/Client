import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const mockMatches = [
  // Buyer interested in your business -> goes to buyer profile (buyer-detail)
  {
    id: 'm1',
    title: 'buyer',
    name: 'Khaled',
    message: 'is interested in your business',
    primaryAction: 'View buyer profile',
    avatar: require('../assets/images/mii/buyer1.png'),
    route: '/buyer-detail?id=1',
    email: 'khaled@example.com',
    phone: '+1 (555) 123-4567',
  },

  // Approved contact request -> only show "View contact" which navigates to buyer detail
  {
    id: 'm3',
    title: 'approved',
    name: 'Miriam',
    message: 'approved your contact request',
    primaryAction: 'View contact',
    avatar: require('../assets/images/mii/buyer2.png'),
    route: '/buyer-detail?id=2',
    simpleContact: true,
    email: 'miriam@example.com',
    phone: '+1 (555) 234-5678',
  },

  // Someone interested in you as a buyer -> goes to business listing
  {
    id: 'm2',
    title: 'business',
    name: 'TechStart Solutions',
    message: 'is interested in you as a buyer',
    primaryAction: 'View business listing',
    avatar: 'https://cybercraftinc.com/wp-content/uploads/2019/06/pexels-fauxels-3183150-1-scaled.webp',
    route: '/business-detail?id=1',
  },

  // Another buyer
  {
    id: 'm4',
    title: 'buyer',
    name: 'Bobby',
    message: 'is interested in your business',
    primaryAction: 'View buyer profile',
    avatar: require('../assets/images/mii/buyer3.png'),
    route: '/buyer-detail?id=3',
    email: 'bobby@example.com',
    phone: '+1 (555) 345-6789',
  },
  // additional entries
  {
    id: 'm5',
    title: 'business',
    name: 'Green Clean Services',
    message: 'is interested in partnering with you',
    primaryAction: 'View business listing',
    avatar: 'https://thecleanstart.com/wp-content/uploads/2021/02/House-Cleaning-Service.jpg',
    route: '/business-detail?id=3',
  },
];

export default function InboxScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<{ name?: string; email?: string; phone?: string } | null>(null);
  const [authPromptVisible, setAuthPromptVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={20} color={Colors.light.tint} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={mockMatches}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <Image source={typeof item.avatar === 'string' ? { uri: item.avatar } : (item.avatar as any)}
                style={styles.avatar} />
              <View style={styles.itemBody}>
                <Text style={styles.notificationText}>
                  <Text style={styles.name}>{item.name} </Text>
                  <Text>{item.message}</Text>
                </Text>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    if (!isAuthenticated) {
                      setAuthPromptVisible(true);
                      return;
                    }
                    // If this is a 'view contact' action (approved contact), show popup
                    if (item.simpleContact || item.primaryAction?.toLowerCase().includes('view contact')) {
                      setContactInfo({ name: item.name, email: item.email, phone: item.phone });
                      setContactModalVisible(true);
                      return;
                    }
                    if (item?.route) router.push(item.route as any);
                  }}
                >
                  <Text style={styles.primaryButtonText}>{item.primaryAction}</Text>
                </TouchableOpacity>

                {!item.simpleContact && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.pillButton}
                      onPress={() => {
                        if (!isAuthenticated) {
                          setAuthPromptVisible(true);
                          return;
                        }
                        Alert.alert('Approved');
                      }}
                    >
                      <Text style={styles.pillText}>Approve contact request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.pillButton, styles.pillSecondary]}
                      onPress={() => {
                        if (!isAuthenticated) {
                          setAuthPromptVisible(true);
                          return;
                        }
                        Alert.alert('Denied');
                      }}
                    >
                      <Text style={styles.pillText}>Deny contact request</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      />

      {/* Contact popup modal (callout) */}
      <Modal visible={contactModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setContactModalVisible(false)}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutName}>{contactInfo?.name}</Text>
            {contactInfo?.email ? <Text style={styles.calloutText}>{contactInfo.email}</Text> : null}
            {contactInfo?.phone ? <Text style={styles.calloutText}>{contactInfo.phone}</Text> : null}
          </View>
        </Pressable>
      </Modal>

      {/* Auth Prompt Modal */}
      {authPromptVisible && (
        <Modal transparent animationType="fade" visible={authPromptVisible} onRequestClose={() => setAuthPromptVisible(false)}>
          <Pressable style={styles.authModalOverlay} onPress={() => setAuthPromptVisible(false)}>
            <Pressable style={styles.authModalContent} onPress={() => { /* absorb taps */ }}>
              <Text style={styles.authModalTitle}>Log in to view details</Text>
              <TouchableOpacity
                style={[styles.authModalButton, styles.authModalPrimary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/sign-in');
                }}
              >
                <Text style={styles.authModalButtonText}>Returning user login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authModalButton, styles.authModalSecondary]}
                onPress={() => {
                  setAuthPromptVisible(false);
                  router.push('/create-account');
                }}
              >
                <Text style={styles.authModalSecondaryText}>Create an account</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 6, marginRight: 8, zIndex: 2 },
  headerRight: { width: 32 },
  title: { position: 'absolute', left: 0, right: 0, fontSize: 20, fontWeight: '700', textAlign: 'center', color: Colors.light.text },
  backButtonText: { color: Colors.light.tint, fontSize: 16, fontWeight: '600', marginLeft: 6 },
  list: { padding: 12, paddingBottom: 20 },
  item: { padding: 14, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10, minHeight: 110 },

  /* new styles for inbox cards */
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#ccc' },
  itemBody: { flex: 1, marginLeft: 12 },
  notificationText: { fontSize: 15, color: Colors.light.text, marginBottom: 8 },
  name: { fontWeight: '700', color: Colors.light.text },

  primaryButton: { alignSelf: 'flex-start', backgroundColor: Colors.light.tint, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginBottom: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },

  actionRow: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap', alignItems: 'center' },
  pillButton: { backgroundColor: '#eaf2fb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, flexShrink: 1, maxWidth: '65%' },
  pillSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e6e6' },
  pillText: { color: Colors.light.tint, fontWeight: '600', fontSize: 13 },
  /* removed footer band per request */

  /* contact callout modal styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  calloutContainer: { backgroundColor: Colors.light.tint, paddingVertical: 18, paddingHorizontal: 22, borderRadius: 28, alignItems: 'center', minWidth: 240 },
  calloutName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  calloutText: { color: '#fff', fontSize: 15 },

  /* auth modal styles */
  authModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authModalContent: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  authModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  authModalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authModalPrimary: {
    backgroundColor: '#5A7A8C',
  },
  authModalSecondary: {
    backgroundColor: '#E8E3DC',
    borderWidth: 1,
    borderColor: '#9B8F82',
  },
  authModalButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  authModalSecondaryText: {
    color: '#5A7A8C',
    fontWeight: '700',
  },
});
