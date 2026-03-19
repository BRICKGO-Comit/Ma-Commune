import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchEvents } from '../../../services/api';
import { CommuneContext } from './_layout';

export default function AgendaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const commune = useContext(CommuneContext);
  const themeColor = commune?.customization?.primary_color || Colors.primaryDark;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [id]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await fetchEvents(id);
      let data = result.data || [];
      if (data.length === 0) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 20);

        data = [
          {
            id: 'default-e1',
            title: 'Journée Grand Ménage Communal',
            category: 'environnement',
            date: nextWeek.toISOString(),
            location: 'Artères principales de la commune'
          },
          {
            id: 'default-e2',
            title: 'Rencontre avec le Maire - Bilan mi-mandat',
            category: 'reunion',
            date: nextMonth.toISOString(),
            location: 'Salle des fêtes de la Mairie'
          },
          {
            id: 'default-e3',
            title: 'Tournoi Sportif de la Fraternité',
            category: 'sport',
            date: new Date(nextMonth.getTime() + 86400000 * 5).toISOString(),
            location: 'Stade Municipal'
          }
        ];
      }
      setEvents(data);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().replace('.', ''),
      full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const categoryConfig = {
    culture: { icon: '🎭', color: '#8338EC' },
    sport: { icon: '⚽', color: '#FB5607' },
    environnement: { icon: '🌿', color: '#38B000' },
    reunion: { icon: '🤝', color: '#3A86FF' },
    fete: { icon: '🎉', color: '#FF006E' },
  };

  const renderEvent = ({ item }) => {
    const date = formatDate(item.date);
    const cat = categoryConfig[item.category] || { icon: '📅', color: Colors.primary };

    return (
      <View style={styles.eventCard}>
        <View style={styles.dateChip}>
          <Text style={[styles.dateDay, { color: themeColor }]}>{date.day}</Text>
          <Text style={[styles.dateMonth, { color: themeColor }]}>{date.month}</Text>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.categoryRow}>
            <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
            <Text style={[styles.categoryText, { color: cat.color }]}>{item.category}</Text>
          </View>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={Colors.textLight} />
            <Text style={styles.metaText}>{date.time}</Text>
            <View style={styles.dot} />
            <Ionicons name="location-outline" size={14} color={Colors.textLight} />
            <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🗓️ Agenda</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.list}
        onRefresh={loadEvents}
        refreshing={loading}
        ListHeaderComponent={
          events.length > 0 && (
            <Text style={styles.listSubtitle}>Événements à venir dans votre commune</Text>
          )
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="calendar-outline" size={80} color={Colors.border} />
              </View>
              <Text style={styles.emptyTitle}>Agenda vide</Text>
              <Text style={styles.emptyText}>Aucun événement n'est prévu pour le moment.</Text>
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
  listSubtitle: {
    fontSize: Fonts.sizes.sm, color: Colors.textSecondary,
    marginBottom: 20, marginTop: 10, fontWeight: Fonts.weights.medium
  },
  list: { padding: Spacing.md, paddingBottom: 100 },
  eventCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.md, gap: 16,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  dateChip: {
    width: 60, height: 75, backgroundColor: Colors.successLight, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '20'
  },
  dateDay: { fontSize: 24, fontWeight: Fonts.weights.extrabold, color: Colors.primary },
  dateMonth: { fontSize: 12, fontWeight: Fonts.weights.bold, color: Colors.primary, marginTop: -4 },
  eventInfo: { flex: 1, justifyContent: 'center' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  categoryText: { fontSize: 11, fontWeight: Fonts.weights.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  eventTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: Fonts.sizes.xs, color: Colors.textLight },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border, marginHorizontal: 4 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIconBox: { marginBottom: 24 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
});
