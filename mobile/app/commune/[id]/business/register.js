import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBusiness } from '../../../../services/api';

export default function RegisterBusinessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    phone: '',
    address: '',
    description: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.activity || !formData.phone) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom, l\'activité et le numéro de téléphone.');
      return;
    }

    try {
      setLoading(true);
      await createBusiness(id, formData);
      Alert.alert('Succès', 'Votre demande a été envoyée à la mairie pour validation. Elle apparaîtra bientôt dans l\'annuaire.');
      router.back();
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'envoi de la demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscrire mon entreprise</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.lg }}>
        
        <Text style={styles.label}>Nom de l'entreprise</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ex: Pharmacie Saint-Paul"
          value={formData.name}
          onChangeText={(v) => setFormData({...formData, name: v})}
        />

        <Text style={styles.label}>Activité</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ex: Plomberie, Boulangerie..."
          value={formData.activity}
          onChangeText={(v) => setFormData({...formData, activity: v})}
        />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇨🇮 +225</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.textLight} />
          </View>
          <TextInput 
            style={styles.phoneInput}
            placeholder="01 02 03 04 05"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(v) => setFormData({...formData, phone: v})}
          />
        </View>

        <Text style={styles.label}>Adresse</Text>
        <TextInput 
          style={styles.input}
          placeholder="Rue, Quartier, Commune"
          value={formData.address}
          onChangeText={(v) => setFormData({...formData, address: v})}
        />

        <Text style={styles.label}>Description (Facultatif)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez votre activité en quelques mots..."
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(v) => setFormData({...formData, description: v})}
        />

        <View style={styles.imagePickerPlaceholder}>
          <Ionicons name="camera" size={32} color={Colors.textLight} />
          <Text style={styles.imagePickerText}>Ajouter un logo ou une photo</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoBoxText}>
            Vos informations seront envoyées à la mairie. Une fois validée, votre entreprise apparaîtra dans l'annuaire officiel.
          </Text>
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Envoyer la demande</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: Fonts.weights.bold, color: Colors.text },
  content: { flex: 1 },
  label: { fontSize: 14, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCode: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryCodeText: { fontSize: 14, color: Colors.text },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerPlaceholder: {
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: Radius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  imagePickerText: { fontSize: 13, color: Colors.textLight },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: Radius.md,
    marginTop: 24,
    gap: 12,
  },
  infoBoxText: { flex: 1, fontSize: 12, color: Colors.primaryDark, lineHeight: 18 },
  submitBtn: {
    backgroundColor: Colors.primaryDark,
    height: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: Fonts.weights.bold },
});
