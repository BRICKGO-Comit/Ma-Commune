import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { businessId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Mock data for the demonstration
  const business = {
    id: businessId,
    name: 'Pharmacie Saint-Paul',
    category: 'Santé - Pharmacie',
    image: 'https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?q=80&w=600&auto=format&fit=crop',
    description: 'Pharmacie et parapharmacie proposant médicaments, produits de soin et de bien-être. Équipe dynamique à votre service.',
    address: 'Rue Jean-Marie Adiaffi, Abi-jan, Port-Bouët',
    phone: '+225 01 02 03 04 05',
    verified: true,
    hours: [
      { day: 'Lundi - Vendredi', time: '08:00 - 20:00' },
      { day: 'Samedi', time: '09:00 - 18:00' },
      { day: 'Dimanche', time: '08:00 - 13:00' },
    ],
    services: ['Ordonnances', 'Parapharmacie', 'Test COVID', 'Livraison'],
  };

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: business.image }} style={styles.image} />
          <TouchableOpacity 
            style={[styles.backBtn, { top: Math.max(insets.top, 20) }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.shareBtn, { top: Math.max(insets.top, 20) }]} 
          >
            <Ionicons name="share-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{business.name}</Text>
            {business.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                <Text style={styles.verifiedText}>Validé par la mairie</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.category}>{business.category}</Text>
          <Text style={styles.description}>{business.description}</Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={handleCall}>
              <Ionicons name="call" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.mapBtn]}>
              <Ionicons name="location" size={20} color={Colors.text} />
              <Text style={[styles.actionBtnText, { color: Colors.text }]}>Localiser</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Contact Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="pin" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.infoText}>{business.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.infoTitle}>Horaires</Text>
                {business.hours.map((h, i) => (
                  <View key={i} style={styles.hourRow}>
                    <Text style={styles.hourDay}>{h.day}</Text>
                    <Text style={styles.hourTime}>{h.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Services */}
          <Text style={styles.sectionTitle}>Services proposés</Text>
          <View style={styles.servicesGrid}>
            {business.services.map((s, i) => (
              <View key={i} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{s}</Text>
              </View>
            ))}
          </View>

        </View>
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Floating Bottom Contact */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="chatbubble-ellipses" size={24} color={Colors.white} />
          <Text style={styles.contactBtnText}>Contacter l'entreprise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1 },
  imageContainer: { width: '100%', height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute', left: 20, width: 40, height: 40,
    backgroundColor: Colors.white, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  shareBtn: {
    position: 'absolute', right: 20, width: 40, height: 40,
    backgroundColor: Colors.white, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  mainInfo: { padding: Spacing.lg },
  titleRow: { marginBottom: 4 },
  name: { fontSize: 24, fontWeight: Fonts.weights.extrabold, color: Colors.text, marginBottom: 8 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  verifiedText: { fontSize: 12, color: Colors.primary, fontWeight: Fonts.weights.bold, marginLeft: 6 },
  category: { fontSize: 16, color: Colors.textSecondary, fontWeight: Fonts.weights.medium, marginBottom: 16 },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionBtn: { flex: 1, height: 48, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  callBtn: { backgroundColor: Colors.primaryDark },
  mapBtn: { backgroundColor: '#F0F2F0', borderWidth: 1, borderColor: '#E0E0E0' },
  actionBtnText: { color: Colors.white, fontWeight: Fonts.weights.bold, fontSize: 15 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  infoSection: { gap: 20 },
  infoRow: { flexDirection: 'row', gap: 15 },
  infoIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F8F1', alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, fontSize: 15, color: Colors.text, lineHeight: 20, paddingTop: 10 },
  infoTitle: { fontSize: 16, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 10 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 4 },
  hourDay: { fontSize: 14, color: Colors.textSecondary },
  hourTime: { fontSize: 14, color: Colors.text, fontWeight: Fonts.weights.medium },
  sectionTitle: { fontSize: 18, fontWeight: Fonts.weights.extrabold, color: Colors.text, marginBottom: 16 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceTag: { backgroundColor: '#F5F5F5', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  serviceText: { fontSize: 13, color: Colors.textSecondary, fontWeight: Fonts.weights.medium },
  bottomBar: {
    position: 'absolute', bottom: 70, left: 0, right: 0,
    backgroundColor: Colors.white, padding: Spacing.md,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 10,
  },
  contactBtn: {
    backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  contactBtnText: { color: Colors.white, fontWeight: Fonts.weights.bold, fontSize: 16 },
});
