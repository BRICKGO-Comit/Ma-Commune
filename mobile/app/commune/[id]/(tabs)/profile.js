import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { getCurrentUser, clearAuth } from '../../../../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { 
        text: 'Se déconnecter', 
        style: 'destructive',
        onPress: () => {
          clearAuth();
          router.replace('/search');
        }
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authCard}>
          <View style={styles.authIconBox}>
            <Ionicons name="person-circle-outline" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.authTitle}>Mon Espace Citoyen</Text>
          <Text style={styles.authDesc}>
            Connectez-vous pour suivre vos signalements, payer vos taxes et accéder à vos documents officiels.
          </Text>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginBtnText}>Se connecter / S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuItems = [
    { title: 'Mes Signalements', icon: 'alert-circle-outline', route: `/commune/${id}/reports`, color: '#E53935' },
    { title: 'Mes Paiements', icon: 'card-outline', route: `/commune/${id}/taxes`, color: '#43A047' },
    { title: 'Ma Commune', icon: 'business-outline', route: `/commune/${id}/about`, color: '#1E88E5' },
    { title: 'Notifications', icon: 'notifications-outline', color: '#FB8C00' },
    { title: 'Paramètres', icon: 'settings-outline', color: '#757575' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{user.full_name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Signalements</Text>
        </View>
        <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: '#F0F0F0' }]}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Paiements</Text>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.menuItem}
            onPress={() => item.route ? router.push(item.route) : null}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F5' },
  authContainer: { flex: 1, backgroundColor: '#F5F7F5', justifyContent: 'center', padding: Spacing.xl },
  authCard: {
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: Radius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  authIconBox: { marginBottom: 20 },
  authTitle: { fontSize: 22, fontWeight: Fonts.weights.extrabold, color: Colors.text, marginBottom: 12 },
  authDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: { color: Colors.white, fontSize: 16, fontWeight: Fonts.weights.bold },
  
  // Logged In Styles
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#E8F5E9',
  },
  avatarInitial: { fontSize: 36, fontWeight: 'bold', color: Colors.white },
  userName: { fontSize: 22, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Colors.textSecondary },
  
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statCount: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: 'medium' },
  
  menuContainer: { backgroundColor: Colors.white, marginTop: 25, marginHorizontal: 20, borderRadius: 15, padding: 10 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuText: { flex: 1, fontSize: 16, color: Colors.text, fontWeight: '500' },
  
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEBEE',
    backgroundColor: '#FFF8F8',
    gap: 10,
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: Colors.error },
});
