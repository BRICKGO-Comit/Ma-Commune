import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { loginUser } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      router.replace('/search');
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
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 40 }}>🏛️</Text>
          </View>
          <Text style={styles.appName}>MA COMMUNE</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre espace citoyen</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
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
            <Text style={styles.label}>Mot de passe</Text>
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
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerText}>
              Pas encore de compte ? <Text style={styles.registerBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test credentials */}
        <Text style={styles.testInfo}>
          Test : citoyen@test.ci / test123
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },
  scrollContent: { flexGrow: 1, padding: Spacing.lg, paddingTop: 50 },
  backBtn: { marginBottom: Spacing.lg },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  appName: { fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.extrabold, color: Colors.white, letterSpacing: 1 },
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
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    padding: Spacing.md, alignItems: 'center', marginTop: Spacing.md,
  },
  loginBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold },
  registerLink: { alignItems: 'center', marginTop: Spacing.lg },
  registerText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  registerBold: { fontWeight: Fonts.weights.bold, color: Colors.primary },
  testInfo: { textAlign: 'center', fontSize: Fonts.sizes.xs, color: 'rgba(255,255,255,0.4)', marginTop: Spacing.lg },
});
