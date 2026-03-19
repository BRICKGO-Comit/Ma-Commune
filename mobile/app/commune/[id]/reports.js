import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchReports, createReport, getAuthToken } from '../../../services/api';

export default function ReportsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'voirie',
    address: '',
  });

  useEffect(() => {
    loadReports();
  }, [id]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const result = await fetchReports(id, filter);
      setReports(result.data || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et la description');
      return;
    }
    if (!getAuthToken()) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour signaler un problème');
      router.push('/auth/login');
      return;
    }

    try {
      await createReport(id, form);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'voirie', address: '' });
      loadReports();
      Alert.alert('Succès', 'Votre signalement a été envoyé !');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const statusConfig = {
    pending: { label: 'En attente', color: Colors.warning, bg: Colors.warningLight },
    in_progress: { label: 'En cours', color: Colors.info, bg: Colors.infoLight },
    resolved: { label: 'Résolu', color: Colors.success, bg: Colors.successLight },
    rejected: { label: 'Rejeté', color: Colors.danger, bg: Colors.dangerLight },
  };

  const categoryConfig = {
    voirie: { icon: '🛣️', label: 'Voirie' },
    eclairage: { icon: '💡', label: 'Éclairage' },
    proprete: { icon: '🧹', label: 'Propreté' },
    eau: { icon: '💧', label: 'Eau' },
    securite: { icon: '🔒', label: 'Sécurité' },
    autre: { icon: '📋', label: 'Autre' },
  };

  const categories = Object.entries(categoryConfig);

  const renderReport = ({ item }) => {
    const status = statusConfig[item.status] || statusConfig.pending;
    const cat = categoryConfig[item.category] || categoryConfig.autre;

    return (
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.categoryTag}>
            <Text>{cat.icon}</Text>
            <Text style={styles.categoryTagText}>{cat.label}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDesc} numberOfLines={2}>{item.description}</Text>
        {item.address && (
          <Text style={styles.reportAddress}>📍 {item.address}</Text>
        )}
        {item.admin_response && (
          <View style={styles.responseBox}>
            <Text style={styles.responseLabel}>Réponse de la mairie :</Text>
            <Text style={styles.responseText}>{item.admin_response}</Text>
          </View>
        )}
        <Text style={styles.reportDate}>
          {new Date(item.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    );
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau signalement</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.formLabel}>Catégorie</Text>
          <View style={styles.categoryGrid}>
            {categories.map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryChip,
                  form.category === key && styles.categoryChipActive,
                ]}
                onPress={() => setForm({ ...form, category: key })}
              >
                <Text style={{ fontSize: 20 }}>{val.icon}</Text>
                <Text style={[
                  styles.chipLabel,
                  form.category === key && styles.chipLabelActive,
                ]}>{val.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Titre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Nid de poule sur la route"
            value={form.title}
            onChangeText={(t) => setForm({ ...form, title: t })}
          />

          <Text style={styles.formLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez le problème en détail..."
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
          />

          <Text style={styles.formLabel}>Adresse / Lieu</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rue des Jardins, près du marché"
            value={form.address}
            onChangeText={(t) => setForm({ ...form, address: t })}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleCreateReport}>
            <Text style={styles.submitBtnText}>📤 Envoyer le signalement</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🚨 Signalements</Text>
        <TouchableOpacity onPress={() => setShowForm(true)}>
          <Ionicons name="add-circle" size={28} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        contentContainerStyle={styles.list}
        onRefresh={loadReports}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🚨</Text>
              <Text style={styles.emptyTitle}>Aucun signalement</Text>
              <Text style={styles.emptyText}>Soyez le premier à signaler un problème</Text>
            </View>
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
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
  reportCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryTagText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold },
  reportTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  reportDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  reportAddress: { fontSize: Fonts.sizes.xs, color: Colors.textLight, marginBottom: 6 },
  responseBox: {
    backgroundColor: Colors.infoLight, borderRadius: Radius.sm, padding: Spacing.sm, marginTop: 8,
  },
  responseLabel: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.info, marginBottom: 4 },
  responseText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  reportDate: { fontSize: Fonts.sizes.xs, color: Colors.textLight, marginTop: 8 },
  fab: {
    position: 'absolute', bottom: 90, right: 20, width: 56, height: 56,
    backgroundColor: Colors.primary, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 4 },
  // Form styles
  formContent: { flex: 1, padding: Spacing.lg },
  formLabel: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.text, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.sm, padding: Spacing.md,
    fontSize: Fonts.sizes.md, borderWidth: 1.5, borderColor: Colors.border,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.sm,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  categoryChipActive: { borderColor: Colors.primary, backgroundColor: Colors.successLight },
  chipLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  chipLabelActive: { color: Colors.primary, fontWeight: Fonts.weights.semibold },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: Spacing.md,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  submitBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold },
});
