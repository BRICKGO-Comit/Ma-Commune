import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchBusinesses } from '../../../services/api';

export default function BusinessDirectoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, [id]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const result = await fetchBusinesses(id);
      setBusinesses(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    restauration: '🍴',
    commerce: '🛍️',
    service: '🛠️',
    sante: '🏥',
    pharmacie: '💊',
    santé: '🏥',
    autre: '📦',
  };

  const isPharmacy = (cat) => {
    const c = (cat || '').toLowerCase();
    return c === 'pharmacie' || c === 'sante' || c === 'santé';
  };

  const renderBusinessItem = ({ item }) => (
    <View style={[styles.businessCard, item.is_on_duty && styles.dutyCard]}>
      {/* Badge DE GARDE */}
      {item.is_on_duty && isPharmacy(item.category) && (
        <View style={styles.dutyBanner}>
          <Ionicons name="medical" size={14} color={Colors.white} />
          <Text style={styles.dutyBannerText}>💊 DE GARDE — OUVERT 24H</Text>
        </View>
      )}

      <View style={styles.businessHeader}>
        <View style={styles.categoryBadge}>
          <Text style={{ fontSize: 16 }}>{categoryIcons[item.category] || '🏢'}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.businessName}>{item.name}</Text>
      <Text style={styles.businessDescription}>{item.description}</Text>
      
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={Colors.textLight} />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        >
          <Ionicons name="call" size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Appeler</Text>
        </TouchableOpacity>
        
        {item.website && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => Linking.openURL(`https://${item.website}`)}
          >
            <Ionicons name="globe-outline" size={18} color={Colors.primary} />
            <Text style={styles.actionText}>Site web</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛍️ Annuaire Local</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessItem}
        contentContainerStyle={styles.list}
        onRefresh={loadBusinesses}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Soutenez vos commerçants</Text>
            <Text style={styles.welcomeText}>Retrouvez tous les professionnels et services de votre commune à portée de main.</Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🏢</Text>
              <Text style={styles.emptyTitle}>Aucune entreprise</Text>
              <Text style={styles.emptyText}>L'annuaire de cette commune est en cours de création.</Text>
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
  welcomeCard: {
    backgroundColor: Colors.primary + '15', borderRadius: Radius.md,
    padding: Spacing.lg, marginBottom: Spacing.md, borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  welcomeTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.primary, marginBottom: 4 },
  welcomeText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  businessCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.sm, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  businessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  categoryText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary, textTransform: 'capitalize' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF9E5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  ratingText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: '#B8860B' },
  businessName: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  businessDescription: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  infoText: { fontSize: Fonts.sizes.sm, color: Colors.textLight },
  actions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary + '10', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.sm },
  actionText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 4, textAlign: 'center' },
  // Pharmacy Duty styles
  dutyCard: { borderWidth: 2, borderColor: '#E53935' },
  dutyBanner: {
    backgroundColor: '#E53935', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 6, marginHorizontal: -Spacing.lg, marginTop: -Spacing.lg,
    marginBottom: Spacing.sm, borderTopLeftRadius: Radius.md, borderTopRightRadius: Radius.md,
  },
  dutyBannerText: { color: Colors.white, fontSize: 11, fontWeight: Fonts.weights.bold, letterSpacing: 1 },
});
