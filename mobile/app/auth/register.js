import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { registerUser } from '../../services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, password, fullName, phone);
      Alert.alert('Bienvenue !', 'Votre compte a été créé avec succès', [
        { text: 'OK', onPress: () => router.replace('/search') }
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 40 }}>🏛️</Text>
          </View>
          <Text style={styles.appName}>MA COMMUNE</Text>
          <Text style={styles.subtitle}>Créez votre compte citoyen</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Jean Kouassi"
                placeholderTextColor={Colors.textLight}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="votre@email.ci"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={18} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="+225 07 XX XX XX"
                placeholderTextColor={Colors.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.registerBtnText}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>
              Déjà un compte ? <Text style={styles.loginBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },
  scrollContent: { flexGrow: 1, padding: Spacing.lg, paddingTop: 50 },
  backBtn: { marginBottom: Spacing.md },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoBox: {
    width: 70, height: 70, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  appName: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.extrabold, color: Colors.white, letterSpacing: 1 },
  subtitle: { fontSize: Fonts.sizes.sm, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: Radius.lg,
    padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.text, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.background, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, height: 48, borderWidth: 1.5, borderColor: Colors.border,
  },
  input: { flex: 1, fontSize: Fonts.sizes.md, color: Colors.text },
  registerBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    padding: Spacing.md, alignItems: 'center', marginTop: Spacing.md,
  },
  registerBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold },
  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  loginBold: { fontWeight: Fonts.weights.bold, color: Colors.primary },
});
