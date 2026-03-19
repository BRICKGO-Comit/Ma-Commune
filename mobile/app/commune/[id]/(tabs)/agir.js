import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AgirScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filters = ['Santé', 'Commerces', 'Artisans'];

  const actions = [
    {
      id: '1',
      title: 'Signaler un problème',
      description: 'Dégradation',
      extra: 'Validé : Signalements',
      icon: 'alert-circle',
      color: '#E65100', // Orange/Red
      bgColor: '#FFF3E0',
      route: `/commune/${id}/reports`,
    },
    {
      id: '2',
      title: 'Demander un document',
      description: 'Sécurité et état civil',
      extra: 'Validé : Démarches',
      icon: 'document-text',
      color: '#2E7D32', // Green
      bgColor: '#E8F5E9',
      route: `/commune/${id}/procedures`,
    },
    {
      id: '3',
      title: 'Prendre rendez-vous',
      description: 'Section locale',
      extra: 'Validé : Standard',
      icon: 'calendar',
      color: '#F57C00', // Orange
      bgColor: '#FFF3E0',
      route: `/commune/${id}/agenda`,
    },
    {
      id: '4',
      title: 'Contacter la mairie',
      description: 'Mairie',
      extra: 'Validé : Informations',
      icon: 'call',
      color: '#1565C0', // Blue
      bgColor: '#E3F2FD',
      route: `/commune/${id}/contacts`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 40) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agir pour ma commune</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Recherche..."
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity>
          <Ionicons name="mic" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.filterChip, 
                activeFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        {actions.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.actionCard}
            onPress={() => item.route ? router.push(item.route) : null}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <View style={styles.actionDetails}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.actionDesc}>{item.description}</Text>
              </View>
              <Text style={styles.actionExtra}>{item.extra}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text,
  },
  filtersContainer: {
    marginBottom: Spacing.md,
  },
  filtersScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: Colors.white, // In mockup, Sante is white but with primary border, or green background
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: Fonts.weights.medium,
  },
  filterTextActive: {
    color: Colors.text, // or Colors.primary
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  actionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionExtra: {
    fontSize: 12,
    color: Colors.textLight,
  },
});
