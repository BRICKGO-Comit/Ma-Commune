import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchProcedures } from '../../../services/api';

export default function ProceduresScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  useEffect(() => {
    loadProcedures();
  }, [id]);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      const result = await fetchProcedures(id);
      let data = result.data || [];
      if (data.length === 0) {
        data = [
          {
            id: 'default-p1',
            title: 'Extrait d\'acte de naissance',
            description: 'Obtention d\'un extrait d\'acte de naissance officiel court ou intégral.',
            steps: ['Se rendre à l\'état civil', 'Fournir l\'ancien extrait', 'Payer le timbre'],
            documents: ['Livret de famille', 'Pièce d\'identité'],
            price: '500 FCFA',
            duration: '48 heures'
          },
          {
            id: 'default-p2',
            title: 'Certificat de résidence',
            description: 'Document attestant de votre domicile effectif dans la commune.',
            steps: ['Visite du chef de quartier pour attestation', 'Présentation à la mairie', 'Timbre municipal'],
            documents: ['Facture CIE/SODECI', 'CNI', 'Attestation du chef de quartier'],
            price: '1000 FCFA',
            duration: '24 heures'
          },
          {
            id: 'default-p3',
            title: 'Légalisation de documents',
            description: 'Certification de la conformité d\'une copie à son original.',
            steps: ['Présenter l\'original et la photocopie', 'Acheter un timbre', 'Dépôt au guichet'],
            documents: ['Original du document', 'Copie lisible'],
            price: '200 FCFA',
            duration: 'Immédiat'
          }
        ];
      }
      setProcedures(data);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderProcedure = ({ item }) => (
    <TouchableOpacity
      style={styles.procedureCard}
      onPress={() => setSelectedProcedure(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="document-text" size={24} color={Colors.primary} />
        <Text style={styles.procedureTitle}>{item.title}</Text>
      </View>
      <Text style={styles.procedureDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.infoTag}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoTagText}>{item.duration}</Text>
        </View>
        <View style={styles.infoTag}>
          <Ionicons name="cash-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoTagText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedProcedure) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedProcedure(null)}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails Démarche</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{selectedProcedure.title}</Text>
          <Text style={styles.detailDesc}>{selectedProcedure.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 ÉTAPES À SUIVRE</Text>
            {selectedProcedure.steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📎 DOCUMENTS REQUIS</Text>
            {selectedProcedure.documents.map((doc, idx) => (
              <View key={idx} style={styles.docItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.docText}>{doc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceDurationBox}>
            <View style={styles.boxItem}>
              <Text style={styles.boxLabel}>Coût</Text>
              <Text style={styles.boxValue}>{selectedProcedure.price}</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.boxItem}>
              <Text style={styles.boxLabel}>Délai estimé</Text>
              <Text style={styles.boxValue}>{selectedProcedure.duration}</Text>
            </View>
          </View>

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
        <Text style={styles.headerTitle}>📄 Démarches</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={procedures}
        keyExtractor={(item) => item.id}
        renderItem={renderProcedure}
        contentContainerStyle={styles.list}
        onRefresh={loadProcedures}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyTitle}>Bientôt disponible</Text>
              <Text style={styles.emptyText}>Les fiches démarches arrivent pour cette mairie.</Text>
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
  list: { padding: Spacing.md },
  procedureCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.md, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  procedureTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, flex: 1 },
  procedureDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', gap: 16 },
  infoTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoTagText: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  content: { flex: 1, padding: Spacing.lg },
  detailTitle: { fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.extrabold, color: Colors.primary, marginBottom: 8 },
  detailDesc: { fontSize: Fonts.sizes.md, color: Colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.textLight, marginBottom: 16, letterSpacing: 1 },
  stepItem: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: Colors.white, fontWeight: Fonts.weights.bold, fontSize: 14 },
  stepText: { fontSize: Fonts.sizes.md, color: Colors.text, flex: 1, lineHeight: 22 },
  docItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  docText: { fontSize: Fonts.sizes.md, color: Colors.text },
  priceDurationBox: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.md, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 20
  },
  boxItem: { flex: 1, alignItems: 'center' },
  boxLabel: { fontSize: Fonts.sizes.xs, color: Colors.textLight, marginBottom: 4 },
  boxValue: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.primary },
  verticalDivider: { width: 1, backgroundColor: Colors.border },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.textSecondary, marginTop: 16 },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, marginTop: 4 },
});
