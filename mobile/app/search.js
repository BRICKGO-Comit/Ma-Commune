import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Fonts, Spacing, Radius, Gradients, Shadows } from '../constants/theme';
import { fetchCommunes } from '../services/api';

const { width } = Dimensions.get('window');

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

  const renderCommune = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        style={styles.communeCard}
        onPress={() => handleSelectCommune(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 28 }}>🏛️</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ELITE</Text>
          </View>
        </View>
        
        <View style={styles.communeInfo}>
          <Text style={styles.communeName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.communeRegion} numberOfLines={1}>{item.region}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={12} color={Colors.accentDark} />
              <Text style={styles.statText}>{Math.floor(item.population / 1000)}k</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Ionicons name="star" size={12} color={Colors.accent} />
              <Text style={styles.statText}>4.8</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Hero Section */}
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={Gradients.mesh}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View entering={FadeInUp.duration(800)} style={styles.heroContent}>
            <Text style={styles.heroBadge}>CITOYENNETÉ NUMÉRIQUE</Text>
            <Text style={styles.heroTitle}>Ma Commune</Text>
            <Text style={styles.heroSubtitle}>L'excellence au service de chaque citoyen</Text>
          </Animated.View>

          {/* Glassmorphic Search Bar */}
          <BlurView intensity={25} tint="light" style={styles.searchBlur}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Colors.white} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une commune..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={search}
                onChangeText={handleSearch}
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </LinearGradient>
      </View>

      {/* Main List */}
      <FlatList
        data={communes}
        keyExtractor={(item) => item.id}
        renderItem={renderCommune}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Mairies d'Excellence</Text>
              <Text style={styles.communeCount}>{communes.length} villes</Text>
            </View>
            <View style={styles.underline} />
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <Animated.View entering={FadeInDown} style={styles.empty}>
              <View style={styles.emptyCircle}>
                <Ionicons name="business-outline" size={48} color={Colors.primaryLight} />
              </View>
              <Text style={styles.emptyTitle}>L'expansion continue</Text>
              <Text style={styles.emptyText}>Cette municipalité n'est pas encore certifiée "Ma Commune".</Text>
            </Animated.View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  heroContainer: {
    height: 320,
    marginBottom: -40,
    zIndex: 10,
  },
  heroGradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroBadge: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },
  searchBlur: {
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  communeCard: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 16,
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 54,
    height: 54,
    backgroundColor: Colors.background,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  communeName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  communeRegion: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F1F5F0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  communeCount: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  underline: {
    width: 40,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginTop: 6,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

