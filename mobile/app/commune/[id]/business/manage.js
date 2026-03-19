import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { fetchMyBusiness, updateBusiness, togglePharmacyDuty } from '../../../../services/api';

export default function ManageBusinessScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    website: '',
    email: '',
  });

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const res = await fetchMyBusiness();
      if (res.data) {
        setBusiness(res.data);
        setForm({
          name: res.data.name || '',
          description: res.data.description || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          website: res.data.website || '',
          email: res.data.email || '',
        });
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger les informations de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      Alert.alert('Erreur', 'Le nom et le téléphone sont obligatoires.');
      return;
    }

    try {
      setSaving(true);
      await updateBusiness(business.id, form);
      Alert.alert('Succès', 'Informations mises à jour avec succès !');
      loadBusiness();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDuty = async (value) => {
    try {
      await togglePharmacyDuty(business.id, value);
      setBusiness({ ...business, is_on_duty: value });
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de changer le statut de garde');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isPharmacy = business?.category?.toLowerCase().includes('pharma') || 
                     business?.category?.toLowerCase() === 'santé' || 
                     business?.category?.toLowerCase() === 'sante';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Gérer mon entreprise</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Status Section */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Statut actuel :</Text>
          <View style={[styles.statusBadge, { backgroundColor: business?.status === 'active' ? Colors.success : Colors.warning }]}>
            <Text style={styles.statusText}>
              {business?.status === 'active' ? '✅ VALIDÉE' : '⏳ EN ATTENTE DE VALIDATION'}
            </Text>
          </View>
          {business?.status === 'pending' && (
            <Text style={styles.statusInfo}>
              Certaines modifications ne seront visibles qu'après validation par la mairie.
            </Text>
          )}
        </View>

        {/* Pharmacy Duty Toggle */}
        {isPharmacy && business?.status === 'active' && (
          <View style={styles.dutyCard}>
            <View style={styles.dutyHeader}>
              <View style={styles.dutyIcon}>
                <Ionicons name="medical" size={24} color={Colors.white} />
              </View>
              <View style={styles.dutyTitleSection}>
                <Text style={styles.dutyTitle}>Service de Garde</Text>
                <Text style={styles.dutySubtitle}>Signalez si vous êtes ouvert 24h/24</Text>
              </View>
              <Switch
                value={business.is_on_duty}
                onValueChange={handleToggleDuty}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor={Colors.white}
              />
            </View>
            <View style={[styles.dutyStatusIndicator, { backgroundColor: business.is_on_duty ? Colors.successLight : Colors.background }]}>
              <Text style={[styles.dutyStatusText, { color: business.is_on_duty ? Colors.success : Colors.textLight }]}>
                {business.is_on_duty ? '📍 Vous êtes actuellement signalé DE GARDE' : '⚪ Vous n\'êtes pas de garde'}
              </Text>
            </View>
          </View>
        )}

        {/* Edit Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Informations Générales</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de l'entreprise *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(txt) => setForm({...form, name: txt})}
              placeholder="Ex: Pharmacie du Bonheur"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(txt) => setForm({...form, description: txt})}
              placeholder="Décrivez votre activité..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(txt) => setForm({...form, phone: txt})}
              placeholder="+225 ..."
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse Physique</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(txt) => setForm({...form, address: txt})}
              placeholder="Ex: Rue 12, Quartier ..."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(txt) => setForm({...form, email: txt})}
              placeholder="contact@exemple.ci"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Web (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={form.website}
              onChangeText={(txt) => setForm({...form, website: txt})}
              placeholder="www.exemple.ci"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, saving && styles.disabledBtn]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color={Colors.white} /> : (
              <>
                <Ionicons name="save-outline" size={20} color={Colors.white} />
                <Text style={styles.saveBtnText}>Enregistrer les modifications</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: Spacing.lg },
  
  statusCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg,
    alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.border,
  },
  statusLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: Colors.white, fontSize: 10, fontWeight: Fonts.weights.bold },
  statusInfo: { fontSize: 11, color: Colors.textLight, textAlign: 'center', marginTop: 10 },

  dutyCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    overflow: 'hidden',
  },
  dutyHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  dutyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center' },
  dutyTitleSection: { flex: 1 },
  dutyTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text },
  dutySubtitle: { fontSize: 12, color: Colors.textSecondary },
  dutyStatusIndicator: { padding: 12, alignItems: 'center' },
  dutyStatusText: { fontSize: 12, fontWeight: Fonts.weights.semibold },

  formCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  formTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 8 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.sm, padding: 12, fontSize: Fonts.sizes.sm, color: Colors.text,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8,
  },
  disabledBtn: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold },
});
