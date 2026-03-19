import { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchCommuneById } from '../../../services/api';
import { API_URL } from '../../../services/api';
import { CommuneContext } from './_layout';

export default function AboutMairieScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const globalCommune = useContext(CommuneContext);
  const themeColor = Colors.primaryDark;

  const [commune, setCommune] = useState(null);

  useEffect(() => {
    if (globalCommune) {
      setCommune(globalCommune);
    } else {
      loadCommune();
    }
  }, [id, globalCommune]);

  const loadCommune = async () => {
    try {
      const result = await fetchCommuneById(id);
      setCommune(result.data);
    } catch (err) {
      console.log('Erreur:', err.message);
    }
  };

  if (!commune) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const logoUrl = getImageUrl(commune.logo_url);
  const bannerUrl = getImageUrl(commune.banner_url);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ma Mairie</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mayor Hero with Banner */}
        <View style={[styles.heroCard, { borderLeftColor: themeColor, padding: 0, overflow: 'hidden' }]}>
          {bannerUrl ? (
            <Image 
              source={{ uri: bannerUrl }} 
              style={{ width: '100%', height: 120, resizeMode: 'cover', backgroundColor: '#eee' }} 
            />
          ) : (
            <View style={{ width: '100%', height: 60, backgroundColor: themeColor + '10' }} />
          )}
          
          <View style={[styles.mayorHeader, { padding: Spacing.lg, paddingTop: bannerUrl ? 10 : Spacing.lg }]}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: themeColor + '20', marginTop: bannerUrl ? -40 : 0 }]}>
              {logoUrl ? (
                <Image source={{ uri: logoUrl }} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode="contain" />
              ) : (
                <Ionicons name="person" size={40} color={themeColor} />
              )}
            </View>
            <View style={styles.mayorInfo}>
              <Text style={styles.mayorLabel}>Monsieur le Maire</Text>
              <Text style={[styles.mayorName, { color: themeColor }]}>{commune.mayor_name || 'Non défini'}</Text>
            </View>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={themeColor} />
            <Text style={styles.sectionTitle}>Histoire & Patrimoine</Text>
          </View>
          <Text style={styles.sectionText}>
            {commune.history || commune.description || "Votre commune évolue pour vous offrir un cadre de vie moderne et durable. Riche d'une histoire séculaire et d'un patrimoine culturel vibrant, elle se tourne aujourd'hui vers l'avenir avec dynamisme."}
          </Text>
        </View>

        {/* Practical Info */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={themeColor} />
            <Text style={styles.sectionTitle}>Infos Pratiques</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
            <View>
              <Text style={styles.rowLabel}>Horaires d'ouverture</Text>
              <Text style={styles.rowValue}>{commune.opening_hours || 'Lun - Ven: 08h - 16h'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
            <View>
              <Text style={styles.rowLabel}>Adresse</Text>
              <Text style={styles.rowValue}>{commune.address || 'Hôtel de Ville'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
            <View>
              <Text style={styles.rowLabel}>Standard Téléphonique</Text>
              <Text style={styles.rowValue}>{commune.phone || 'Non disponible'}</Text>
            </View>
          </View>
        </View>

        {/* Social / Website Links */}
        <View style={styles.linksRow}>
          {commune.website && (
            <TouchableOpacity style={[styles.linkCircle, { backgroundColor: themeColor }]}>
              <Ionicons name="globe" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.linkCircle, { backgroundColor: themeColor }]}>
            <Ionicons name="logo-facebook" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkCircle, { backgroundColor: themeColor }]}>
            <Ionicons name="logo-twitter" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
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
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.white },
  content: { flex: 1, padding: Spacing.lg },
  heroCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.lg, elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    borderLeftWidth: 5, borderLeftColor: Colors.accent,
  },
  mayorHeader: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  avatarPlaceholder: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.successLight,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white
  },
  mayorInfo: { flex: 1 },
  mayorLabel: { fontSize: 10, color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  mayorName: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.primary },
  infoSection: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text },
  sectionText: { fontSize: Fonts.sizes.md, color: Colors.textSecondary, lineHeight: 24 },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'flex-start' },
  rowLabel: { fontSize: 11, color: Colors.textLight, marginBottom: 2 },
  rowValue: { fontSize: Fonts.sizes.md, color: Colors.text, fontWeight: Fonts.weights.medium },
  linksRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 10 },
  linkCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 2
  }
});
