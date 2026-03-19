import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { fetchNewsById } from '../../../../services/api';

export default function NewsDetailScreen() {
  const router = useRouter();
  const { newsId } = useLocalSearchParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [newsId]);

  const loadArticle = async () => {
    try {
      const result = await fetchNewsById(newsId);
      setArticle(result.data);
    } catch (err) {
      console.log('Erreur:', err.message);
    }
  };

  if (!article) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        {article.summary && (
          <Text style={styles.summary}>{article.summary}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.body}>{article.content}</Text>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.extrabold,
    color: Colors.text,
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  summary: {
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
    fontWeight: Fonts.weights.medium,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  body: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
});
