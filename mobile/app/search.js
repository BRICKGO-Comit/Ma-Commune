import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { fetchCommunes } from '../services/api';

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunes();
  }, []);

  const loadCommunes = async (query = '') => {
    try {
      setLoading(true);
      const result = await fetchCommunes(query);
      setCommunes(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((text) => {
    setSearch(text);
    loadCommunes(text);
  }, []);

  const handleSelectCommune = (commune) => {
    router.push(`/commune/${commune.id}`);
  };

  const renderCommune = ({ item }) => (
    <TouchableOpacity
      style={styles.communeCard}
      onPress={() => handleSelectCommune(item)}
      activeOpacity={0.7}
    >
      <View style={styles.communeIcon}>
        <Text style={{ fontSize: 24 }}>🏛️</Text>
      </View>
      <View style={styles.communeInfo}>
        <Text style={styles.communeName}>{item.name}</Text>
        <Text style={styles.communeRegion}>{item.region} • {item.department}</Text>
        <Text style={styles.communePopulation}>
          👥 {item.population?.toLocaleString('fr-FR')} habitants
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>MA COMMUNE</Text>
          <Text style={styles.heroSubtitle}>Sélectionnez votre municipalité pour commencer</Text>
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={Colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Quelle commune recherchez-vous ?"
              placeholderTextColor={Colors.textLight}
              value={search}
              onChangeText={handleSearch}
            />
          </View>
        </View>
      </View>

      {/* Grid of Communes */}
      <FlatList
        data={communes}
        keyExtractor={(item) => item.id}
        renderItem={renderCommune}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mairies Partenaires</Text>
            <View style={styles.indicator} />
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 60, marginBottom: 16 }}>🏙️</Text>
              <Text style={styles.emptyTitle}>Bientôt disponible</Text>
              <Text style={styles.emptyText}>Cette commune n'a pas encore rejoint l'écosystème Ma Commune.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: Spacing.lg,
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: Fonts.weights.extrabold,
    color: Colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  searchWrapper: {
    position: 'absolute',
    bottom: -24,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 56,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  list: {
    paddingtop: 40,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionHeader: {
    marginTop: 50,
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginTop: 8,
  },
  communeCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  communeIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.successLight,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  communeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  communeRegion: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
