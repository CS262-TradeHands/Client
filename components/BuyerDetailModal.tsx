import { Buyer } from '@/types/buyer';
import { User } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SIZE_PREFERENCES = [
  'Small — up to 20 employees (~$15k/month)',
  'Small-Medium — 20-50 employees (~$40k/month)',
  'Medium — 50-200 employees (~$150k/month)',
  'Large — 200+ employees (~$500k/month)'
];

interface BuyerDetailModalProps {
  buyer: Buyer | null;
  userInfo: User | null;
  visible: boolean;
  onClose: () => void;
  onContact?: () => void;
}

export default function BuyerDetailModal({ buyer, userInfo, visible, onClose, onContact }: BuyerDetailModalProps) {
  if (!buyer || !userInfo) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.buyerModalOverlay}>
        <View style={styles.buyerModalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.buyerModalHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.buyerModalTitle}>Buyer Profile</Text>
            </View>

            {/* Buyer Info */}
            <View style={styles.buyerModalBody}>
              {userInfo.profile_image_url ? 
                <Image source={{uri: userInfo.profile_image_url }} style={styles.buyerModalAvatar} />
                :
                <Image source={require('../assets/images/handshake-logo.png')} style={styles.buyerModalAvatar} />
              }
              <Text style={styles.buyerModalName}>{userInfo.first_name} {userInfo.last_name}</Text>
              <Text style={styles.buyerModalTitleText}>{buyer.title}</Text>
              <View style={styles.buyerModalLocation}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.buyerModalLocationText}>{buyer.city}</Text>
              </View>

              {/* Bio */}
              <View style={styles.buyerModalSection}>
                <Text style={styles.buyerModalSectionTitle}>About</Text>
                <Text style={styles.buyerModalBio}>{buyer.about}</Text>
              </View>

              {/* Looking For */}
              <View style={styles.buyerModalSection}>
                <Text style={styles.buyerModalSectionTitle}>Looking For</Text>
                <View style={styles.buyerModalTags}>
                  {buyer.industries?.map((item, index) => (
                    <View key={index} style={styles.buyerModalTag}>
                      <Text style={styles.buyerModalTagText}>{item}</Text>
                    </View>
                  ))}
                  <View style={styles.buyerModalTag}>
                    <Text style={styles.buyerModalTagText}>
                      {SIZE_PREFERENCES.find(s => s.includes(buyer.size_preference)) || buyer.size_preference}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Investment Details */}
              <View style={styles.buyerModalSection}>
                <Text style={styles.buyerModalSectionTitle}>Investment Details</Text>
                <View style={styles.buyerModalDetails}>
                  <View style={styles.buyerModalDetailRow}>
                    <Ionicons name="cash-outline" size={20} color="#5A7A8C" />
                    <View style={styles.buyerModalDetailContent}>
                      <Text style={styles.buyerModalDetailLabel}>Budget Range</Text>
                      <Text style={styles.buyerModalDetailValue}>
                        ${Number(buyer.budget_range_lower).toLocaleString()} - ${Number(buyer.budget_range_higher).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buyerModalDetailRow}>
                    <Ionicons name="briefcase-outline" size={20} color="#5A7A8C" />
                    <View style={styles.buyerModalDetailContent}>
                      <Text style={styles.buyerModalDetailLabel}>Experience</Text>
                      <Text style={styles.buyerModalDetailValue}>{buyer.experience} Years</Text>
                    </View>
                  </View>
                  <View style={styles.buyerModalDetailRow}>
                    <Ionicons name="time-outline" size={20} color="#5A7A8C" />
                    <View style={styles.buyerModalDetailContent}>
                      <Text style={styles.buyerModalDetailLabel}>Timeline</Text>
                      <Text style={styles.buyerModalDetailValue}>{buyer.timeline} Months</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Contact Button */}
              {onContact && (
                <TouchableOpacity style={styles.buyerModalContactButton} onPress={onContact}>
                  <Ionicons name="mail-outline" size={20} color="#fff" />
                  <Text style={styles.buyerModalContactText}>Contact Buyer</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buyerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  buyerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  buyerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 5,
  },
  buyerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  buyerModalBody: {
    padding: 20,
    alignItems: 'center',
  },
  buyerModalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  buyerModalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  buyerModalTitleText: {
    fontSize: 16,
    color: '#5A7A8C',
    marginBottom: 10,
  },
  buyerModalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buyerModalLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  buyerModalSection: {
    width: '100%',
    marginBottom: 20,
  },
  buyerModalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  buyerModalBio: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
  },
  buyerModalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buyerModalTag: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5A7A8C',
  },
  buyerModalTagText: {
    color: '#5A7A8C',
    fontSize: 14,
    fontWeight: '500',
  },
  buyerModalDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  buyerModalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buyerModalDetailContent: {
    marginLeft: 15,
    flex: 1,
  },
  buyerModalDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buyerModalDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buyerModalContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 10,
  },
  buyerModalContactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
