import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BusinessDirectoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const categories = [
    { id: 'sante', label: 'Santé', icon: 'medkit', color: '#4CAF50' },
    { id: 'restos', label: 'Restaurants', icon: 'restaurant', color: '#FF9800' },
    { id: 'commerces', label: 'Commerces', icon: 'cart', color: '#9C27B0' },
    { id: 'artisans', label: 'Artisans', icon: 'hammer', color: '#F44336' },
    { id: 'btp', label: 'BTP', icon: 'construct', color: '#607D8B' },
    { id: 'formation', label: 'Formation', icon: 'school', color: '#3F51B5' },
    { id: 'hebergement', label: 'Hébergement', icon: 'bed', color: '#795548' },
    { id: 'beaute', label: 'Beauté', icon: 'sparkles', color: '#E91E63' },
  ];

  const recommended = [
    {
      id: '1',
      name: 'Pharmacie Saint-Paul',
      category: 'Médical',
      image: 'https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?q=80&w=200&auto=format&fit=crop',
      verified: true,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Restaurant Le Bassam',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop',
      verified: true,
      rating: 4.5,
    }
  ];

  const news = [
    { id: '3', name: 'Atelier MT Coiffure', verified: true, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=150&auto=format&fit=crop' },
    { id: '4', name: 'Hôtel du Bord', verified: true, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=150&auto=format&fit=crop' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Premium */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="menu" size={28} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Annuaire de Port-Bouët</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textLight} />
          <TextInput 
            placeholder="Rechercher : restaurant, pharmacie..." 
            style={styles.searchInput}
            placeholderTextColor={Colors.textLight}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={24} color={Colors.white} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionEmoji}>📦</Text>
            <Text style={styles.sectionTitle}>Entreprises recommandées</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
          {recommended.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.recommendedCard}
              onPress={() => router.push(`/commune/${id}/business/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedName}>{item.name}</Text>
                <View style={styles.categoryBadge}>
                  <Ionicons name="leaf" size={12} color={Colors.primary} />
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
                {item.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.primary} />
                    <Text style={styles.verifiedText}>Validé par la mairie</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* News Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionEmoji}>🆕</Text>
            <Text style={styles.sectionTitle}>Nouveautés</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.newsGrid}>
          {news.map((item) => (
            <TouchableOpacity key={item.id} style={styles.newsCard}>
              <Image source={{ uri: item.image }} style={styles.newsImage} />
              <Text style={styles.newsName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.verifiedBadgeSmall}>
                <Ionicons name="checkmark-circle" size={10} color={Colors.primary} />
                <Text style={styles.verifiedTextSmall}>Validé par la mairie</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Around You Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionEmoji}>📍</Text>
            <Text style={styles.sectionTitle}>Autour de vous</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Map Button Placeholder */}
        <TouchableOpacity style={styles.mapBanner} activeOpacity={0.9}>
          <View style={styles.mapBannerContent}>
            <Ionicons name="map" size={24} color={Colors.primary} />
            <Text style={styles.mapBannerText}>Voir les entreprises sur la carte</Text>
          </View>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => router.push(`/commune/${id}/business/register`)}
        >
          <Ionicons name="add-circle" size={24} color={Colors.white} />
          <Text style={styles.registerBtnText}>Inscrire mon entreprise</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Fonts.weights.extrabold,
    color: Colors.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F0',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },
  content: { flex: 1 },
  categoriesContainer: { paddingVertical: Spacing.md },
  categoriesScroll: { paddingHorizontal: Spacing.md, gap: 15 },
  categoryItem: { alignItems: 'center' },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: Fonts.weights.medium },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionEmoji: { fontSize: 18, marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: Fonts.weights.extrabold, color: Colors.text },
  seeAll: { fontSize: 12, color: Colors.textLight },
  recommendedScroll: { paddingLeft: Spacing.md, gap: Spacing.md },
  recommendedCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  recommendedImage: { width: '100%', height: 110 },
  recommendedContent: { padding: Spacing.sm },
  recommendedName: { fontSize: 14, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryBadgeText: { fontSize: 11, color: Colors.textSecondary, marginLeft: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: Fonts.weights.bold, marginLeft: 4 },
  newsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  newsCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  newsImage: { width: '100%', height: 100, borderRadius: Radius.sm, marginBottom: 8 },
  newsName: { fontSize: 13, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  verifiedBadgeSmall: { flexDirection: 'row', alignItems: 'center' },
  verifiedTextSmall: { fontSize: 9, color: Colors.primary, marginLeft: 3 },
  mapBanner: {
    margin: Spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  mapBannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mapBannerText: { color: Colors.primary, fontWeight: Fonts.weights.bold, fontSize: 14 },
  registerBtn: {
    margin: Spacing.md,
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.md,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  registerBtnText: { color: Colors.white, fontWeight: Fonts.weights.bold, fontSize: 16 },
});
