import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { fetchNews } from '../../../../services/api';

export default function NewsListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const result = await fetchNews(id);
      setNews(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    general: '📋',
    infrastructure: '🏗️',
    sante: '🏥',
    education: '🎓',
    culture: '🎭',
    commerce: '🏪',
    securite: '🔒',
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => router.push(`/commune/${id}/news/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.newsHeader}>
        <View style={styles.categoryBadge}>
          <Text>{categoryIcons[item.category] || '📋'}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.newsDate}>
          {new Date(item.published_at || item.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <Text style={styles.newsTitle}>{item.title}</Text>
      {item.summary && (
        <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
      )}
      <View style={styles.readMore}>
        <Text style={styles.readMoreText}>Lire la suite</Text>
        <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📰 Actualités</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.list}
        onRefresh={loadNews}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📰</Text>
              <Text style={styles.emptyTitle}>Aucune actualité</Text>
              <Text style={styles.emptyText}>Les actualités apparaîtront ici</Text>
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
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.white,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  newsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  newsDate: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
  },
  newsTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 24,
  },
  newsSummary: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginTop: 4,
  },
});
