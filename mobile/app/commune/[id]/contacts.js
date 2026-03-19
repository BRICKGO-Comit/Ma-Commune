import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchContacts } from '../../../services/api';

export default function ContactsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, [id]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const result = await fetchContacts(id);
      setContacts(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const categoryIcons = {
    urgence: '🚨',
    sante: '🏥',
    education: '🎓',
    administration: '🏛️',
    transport: '🚌',
    general: '📋',
  };

  const emergencyContacts = contacts.filter(c => c.is_emergency);
  const regularContacts = contacts.filter(c => !c.is_emergency);

  const renderContact = ({ item }) => (
    <View style={[styles.contactCard, item.is_emergency && styles.emergencyCard]}>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={{ fontSize: 18 }}>{categoryIcons[item.category] || '📋'}</Text>
          <Text style={styles.contactName}>{item.name}</Text>
        </View>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.address && (
          <Text style={styles.contactAddress}>📍 {item.address}</Text>
        )}
        {item.is_emergency && (
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyText}>Urgence</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.callBtn, item.is_emergency && styles.emergencyCallBtn]}
        onPress={() => handleCall(item.phone)}
        activeOpacity={0.7}
      >
        <Ionicons name="call" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📞 Numéros utiles</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={[
          ...(emergencyContacts.length > 0 ? [{ type: 'section', title: '🚨 Urgences' }] : []),
          ...emergencyContacts.map(c => ({ ...c, type: 'contact' })),
          ...(regularContacts.length > 0 ? [{ type: 'section', title: '📞 Contacts' }] : []),
          ...regularContacts.map(c => ({ ...c, type: 'contact' })),
        ]}
        keyExtractor={(item, index) => item.id || `section-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'section') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
          }
          return renderContact({ item });
        }}
        contentContainerStyle={styles.list}
        onRefresh={loadContacts}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📞</Text>
              <Text style={styles.emptyTitle}>Aucun contact</Text>
              <Text style={styles.emptyText}>Les numéros utiles apparaîtront ici</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 55, paddingBottom: 16, paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.white },
  list: { padding: Spacing.md, paddingBottom: 100 },
  sectionTitle: {
    fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.text,
    marginTop: Spacing.md, marginBottom: Spacing.sm,
  },
  contactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  emergencyCard: { borderLeftWidth: 3, borderLeftColor: Colors.danger },
  contactInfo: { flex: 1 },
  contactHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  contactName: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, color: Colors.text, flex: 1 },
  contactPhone: { fontSize: Fonts.sizes.md, color: Colors.primary, fontWeight: Fonts.weights.medium, marginBottom: 2 },
  contactAddress: { fontSize: Fonts.sizes.xs, color: Colors.textLight },
  emergencyBadge: {
    backgroundColor: Colors.dangerLight, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.full, alignSelf: 'flex-start', marginTop: 4,
  },
  emergencyText: { fontSize: Fonts.sizes.xs, color: Colors.danger, fontWeight: Fonts.weights.semibold },
  callBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.sm,
  },
  emergencyCallBtn: { backgroundColor: Colors.danger },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 4 },
});
