import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../constants/theme';
import { fetchPayments, payTax, getCurrentUser } from '../../../services/api';
import { CommuneContext } from './_layout';

export default function TaxesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const commune = useContext(CommuneContext);
  const themeColor = commune?.customization?.primary_color || Colors.primaryDark;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadPayments();
    }
  }, [id, user]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await fetchPayments(user.id);
      const filtered = result.data.filter(p => p.commune_id === id);
      setPayments(filtered || []);
    } catch (err) {
      console.log('Erreur:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    try {
      await payTax({
        commune_id: id,
        amount: selectedTax.amount,
        type: selectedTax.type,
        description: selectedTax.description
      });
      setShowPayModal(false);
      Alert.alert('Succès', 'Votre paiement a été enregistré avec succès ! 🏛️💳');
      loadPayments();
    } catch (err) {
      Alert.alert('Erreur', 'Le paiement a échoué.');
    }
  };

  const taxTypes = [
    { type: 'taxe_habitation', label: 'Taxe d\'habitation', amount: 15000, icon: '🏠' },
    { type: 'taxe_voirie', label: 'Taxe de voirie', amount: 5000, icon: '🛣️' },
    { type: 'taxe_commerce', label: 'Patente commerciale', amount: 25000, icon: '🏬' },
  ];

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{item.description}</Text>
        <Text style={styles.paymentDate}>
          {new Date(item.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <View style={styles.paymentAmount}>
        <Text style={styles.amountText}>{item.amount.toLocaleString()} FCFA</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'paid' ? Colors.success + '20' : '#FFEBEB' }]}>
          <Text style={[styles.statusText, { color: item.status === 'paid' ? Colors.success : Colors.error }]}>
            {item.status === 'paid' ? 'Payé' : 'En attente'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💳 Taxes & Paiements</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Taxes à payer</Text>
        <View style={styles.taxesGrid}>
          {taxTypes.map((tax) => (
            <TouchableOpacity 
              key={tax.type} 
              style={styles.taxOption}
              onPress={() => { setSelectedTax(tax); setShowPayModal(true); }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{tax.icon}</Text>
              <Text style={styles.taxLabel}>{tax.label}</Text>
              <Text style={styles.taxAmount}>{tax.amount.toLocaleString()} F</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Historique des paiements</Text>
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          contentContainerStyle={styles.list}
          onRefresh={loadPayments}
          refreshing={loading}
          ListEmptyComponent={
            !loading && (
              <View style={styles.empty}>
                <Ionicons name="receipt-outline" size={48} color={Colors.border} />
                <Text style={styles.emptyText}>Aucun paiement récent</Text>
              </View>
            )
          }
        />
      </View>

      {/* Payment Modal Simulation */}
      <Modal visible={showPayModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer le paiement</Text>
            <View style={styles.modalDetail}>
              <Text style={styles.detailLabel}>{selectedTax?.label}</Text>
              <Text style={styles.detailValue}>{selectedTax?.amount.toLocaleString()} FCFA</Text>
            </View>
            <Text style={styles.paymentMethodTitle}>Mode de paiement</Text>
            <View style={styles.methodRow}>
              <View style={[styles.methodOption, { borderColor: themeColor, backgroundColor: themeColor + '05' }]}>
                <Ionicons name="phone-portrait-outline" size={24} color={themeColor} />
                <Text style={[styles.methodText, { color: themeColor }]}>Mobile Money</Text>
              </View>
              <View style={[styles.methodOption, { borderColor: Colors.border, backgroundColor: 'transparent' }]}>
                <Ionicons name="card-outline" size={24} color={Colors.textLight} />
                <Text style={[styles.methodText, { color: Colors.textLight }]}>Carte Bancaire</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: themeColor }]} onPress={handlePay}>
              <Text style={styles.confirmButtonText}>Payer maintenant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPayModal(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: { flex: 1, padding: Spacing.md },
  sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, marginVertical: Spacing.md },
  taxesGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  taxOption: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, alignItems: 'center', elevation: 2,
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  taxLabel: { fontSize: 10, fontWeight: Fonts.weights.semibold, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  taxAmount: { fontSize: 12, fontWeight: Fonts.weights.bold, color: Colors.primary },
  list: { paddingBottom: 100 },
  paymentCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radius.md,
    marginBottom: Spacing.xs, borderLeftWidth: 4, borderLeftColor: Colors.success,
  },
  paymentTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.text },
  paymentDate: { fontSize: 10, color: Colors.textLight, marginTop: 2 },
  paymentAmount: { alignItems: 'flex-end' },
  amountText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full, marginTop: 4 },
  statusText: { fontSize: 9, fontWeight: Fonts.weights.bold },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: Colors.textLight, marginTop: 10 },
  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: 24 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 20, textAlign: 'center' },
  modalDetail: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: Radius.md, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  detailLabel: { fontSize: Fonts.sizes.md, color: Colors.textSecondary },
  detailValue: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.primary },
  paymentMethodTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 12 },
  methodRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  methodOption: { flex: 1, borderWidth: 2, borderColor: Colors.primary, borderRadius: Radius.md, padding: 12, alignItems: 'center', backgroundColor: Colors.primary + '05' },
  methodText: { fontSize: 12, fontWeight: Fonts.weights.bold, color: Colors.primary, marginTop: 8 },
  confirmButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.md, alignItems: 'center', marginBottom: 12 },
  confirmButtonText: { color: Colors.white, fontWeight: Fonts.weights.bold, fontSize: Fonts.sizes.md },
  cancelButton: { paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: Colors.textLight, fontSize: Fonts.sizes.sm },
});
