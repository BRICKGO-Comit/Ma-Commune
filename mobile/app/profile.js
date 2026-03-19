import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { getCurrentUser, getAuthToken, clearAuth, fetchPayments, fetchReports, fetchMyBusiness } from '../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const isLoggedIn = !!getAuthToken();
  const [activities, setActivities] = useState({ payments: [], reports: [] });
  const [myBusiness, setMyBusiness] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      loadActivities();
    }
  }, [isLoggedIn, user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const [paymentsRes, reportsRes, businessRes] = await Promise.all([
        fetchPayments(user.id),
        fetchReports(),
        fetchMyBusiness()
      ]);
      
      setActivities({
        payments: paymentsRes.data || [],
        reports: (reportsRes.data || []).filter(r => r.user_id === user.id)
      });
      setMyBusiness(businessRes.data);
    } catch (err) {
      console.log('Error loading activities:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => {
          clearAuth();
          router.replace('/search');
        },
      },
    ]);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>👤 Mon Profil</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.notLoggedIn}>
          <View style={styles.bigIcon}>
            <Ionicons name="person-circle-outline" size={80} color={Colors.textLight} />
          </View>
          <Text style={styles.notLoggedTitle}>Espace Citoyen</Text>
          <Text style={styles.notLoggedText}>
            Connectez-vous pour accéder à votre espace personnel et suivre vos signalements.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerBtnText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👤 Mon Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'C'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.full_name || 'Citoyen'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'admin' || user?.role === 'super_admin' ? '🛡️ Admin' : '👤 Citoyen'}
            </Text>
          </View>
        </View>

        {/* Ma Commune Pro — Gestion d'entreprise */}
        {myBusiness && (
          <>
            <Text style={styles.sectionTitle}>💼 Ma Commune Pro</Text>
            <View style={styles.businessCard}>
              <View style={styles.businessHeader}>
                <View style={styles.businessIcon}>
                  <Ionicons name="business" size={24} color={Colors.primary} />
                </View>
                <View style={styles.businessTitleSection}>
                  <Text style={styles.businessName}>{myBusiness.name}</Text>
                  <Text style={styles.businessStatus}>
                    {myBusiness.status === 'active' ? '✅ Validée' : '⏳ En attente'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => router.push({
                  pathname: `/commune/${myBusiness.commune_id}/business/manage`,
                  params: { businessId: myBusiness.id }
                })}
              >
                <Ionicons name="settings-outline" size={18} color={Colors.white} />
                <Text style={styles.manageBtnText}>Gérer les informations</Text>
              </TouchableOpacity>
              
              {myBusiness.category === 'pharmacie' && myBusiness.status === 'active' && (
                <View style={styles.dutyBadgeContainer}>
                  <View style={[styles.dutySmallBadge, { backgroundColor: myBusiness.is_on_duty ? Colors.success : Colors.textLight }]}>
                    <Text style={styles.dutySmallText}>{myBusiness.is_on_duty ? 'DE GARDE' : 'PAS DE GARDE'}</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* Mes Activités Section */}
        <Text style={styles.sectionTitle}>📅 Mes Activités</Text>
        <View style={styles.activityCard}>
          <TouchableOpacity style={styles.activityItem} onPress={() => {}}>
            <View style={[styles.activityIcon, { backgroundColor: Colors.primary + '15' }]}>
              <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityLabel}>Paiements (Taxes)</Text>
              <Text style={styles.activityValue}>{activities.payments.length} transaction(s)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.activityItem} onPress={() => {}}>
            <View style={[styles.activityIcon, { backgroundColor: Colors.warning + '15' }]}>
              <Ionicons name="megaphone-outline" size={20} color={Colors.warning} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityLabel}>Mes Signalements</Text>
              <Text style={styles.activityValue}>{activities.reports.length} rapport(s)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Info Items */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          {user?.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Ionicons name="shield-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoLabel}>Rôle</Text>
            <Text style={styles.infoValue}>{user?.role}</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: 12, marginTop: 8 },
  activityCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  activityIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1 },
  activityLabel: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.text },
  activityValue: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  profileCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 32, fontWeight: Fonts.weights.bold, color: Colors.white },
  userName: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.text },
  userEmail: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  roleBadge: {
    backgroundColor: Colors.successLight, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: Radius.full, marginTop: Spacing.sm,
  },
  roleText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.primary },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, width: 80 },
  infoValue: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text, fontWeight: Fonts.weights.medium },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.white, borderRadius: Radius.sm, padding: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.dangerLight,
  },
  logoutText: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, color: Colors.danger },
  // Not logged in
  notLoggedIn: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  bigIcon: { marginBottom: Spacing.md },
  notLoggedTitle: {
    fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.text, marginBottom: Spacing.sm,
  },
  notLoggedText: {
    fontSize: Fonts.sizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl,
  },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm, width: '100%', alignItems: 'center',
  },
  loginBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold },
  registerBtn: {
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.sm,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, width: '100%', alignItems: 'center',
  },
  registerBtnText: { color: Colors.primary, fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold },
  // Ma Commune Pro
  businessCard: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  businessHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md },
  businessIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  businessTitleSection: { flex: 1 },
  businessName: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.text },
  businessStatus: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  manageBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  manageBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold },
  dutyBadgeContainer: { marginTop: 10, alignItems: 'flex-start' },
  dutySmallBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  dutySmallText: { color: Colors.white, fontSize: 10, fontWeight: Fonts.weights.bold },
});
