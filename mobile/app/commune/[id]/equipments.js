import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchEquipments } from '../../../services/api';
import { CommuneContext } from './_layout';

export default function EquipmentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const commune = useContext(CommuneContext);
  const themeColor = commune?.customization?.primary_color || Colors.primaryDark;

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipments();
  }, [id]);

  const loadEquipments = async () => {
    try {
      setLoading(true);
      const result = await fetchEquipments(id);
      setEquipments(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const typeIcons = {
    sport: '🏀',
    culture: '🏛️',
    loisir: '🌳',
    sante: '🏥',
    admin: '🏢',
  };

  const statusColors = {
    open: '#38B000',
    closed: '#E63946',
    maintenance: '#FF9F1C',
  };

  const statusLabels = {
    open: 'Ouvert',
    closed: 'Fermé',
    maintenance: 'En travaux',
  };

  const renderEquipmentItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBox}>
          <Text style={{ fontSize: 28 }}>{typeIcons[item.type] || '📍'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] || '#999' }]} />
            <Text style={[styles.statusText, { color: statusColors[item.status] || '#999' }]}>
              {statusLabels[item.status] || item.status}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.addressBox}>
          <Ionicons name="map-outline" size={16} color={Colors.textLight} />
          <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
        </View>
        <TouchableOpacity style={[styles.mapButton, { backgroundColor: themeColor }]}>
          <Text style={styles.mapButtonText}>Y aller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏢 Équipements</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={equipments}
        keyExtractor={(item) => item.id}
        renderItem={renderEquipmentItem}
        contentContainerStyle={styles.list}
        onRefresh={loadEquipments}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="business-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyTitle}>Pas d'équipements répertoriés</Text>
              <Text style={styles.emptyText}>Les parcs, stades et bibliothèques de la commune apparaîtront ici.</Text>
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
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.sm, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  typeBox: { width: 56, height: 56, borderRadius: Radius.sm, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, justifyContent: 'center' },
  name: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: Fonts.weights.semibold },
  description: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  addressBox: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 12 },
  addressText: { fontSize: 12, color: Colors.textLight },
  mapButton: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm },
  mapButtonText: { color: Colors.white, fontSize: 12, fontWeight: Fonts.weights.bold },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary, marginTop: 16, textAlign: 'center' },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
