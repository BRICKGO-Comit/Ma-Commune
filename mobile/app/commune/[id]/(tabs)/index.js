import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../../../constants/theme';
import { API_URL } from '../../../../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommuneContext } from '../_layout';

export default function CommuneHomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Utilisation du contexte global pour récupérer la commune et sa personnalisation
  const commune = useContext(CommuneContext);

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

  const logoIcon = commune.logo_url ? null : '🏛️';
  const logoUrl = getImageUrl(commune.logo_url);
  const bannerUrl = getImageUrl(commune.banner_url);
  const themeColor = Colors.primaryDark;

  return (
    <View style={styles.container}>
      {/* Top Header avec Bannière dynamique ou couleur par défaut */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 40), backgroundColor: themeColor, position: 'relative', overflow: 'hidden' }]}>
        {bannerUrl && (
          <Image 
            source={{ uri: bannerUrl }} 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }} 
            resizeMode="cover"
          />
        )}
        <TouchableOpacity 
          style={[styles.headerIconBtn, { zIndex: 2 }]} 
          onPress={() => router.push(`/commune/${id}/menu`)}
        >
          <Ionicons name="menu" size={28} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={[styles.headerTitleContainer, { zIndex: 2 }]}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, backgroundColor: Colors.white }} resizeMode="contain" />
          ) : (
            <Text style={styles.headerLogoIcon}>{logoIcon}</Text>
          )}
          <Text style={styles.headerTitleText}>MA COMMUNE</Text>
        </View>

        <TouchableOpacity style={[styles.headerIconBtn, { zIndex: 2 }]}>
          <Ionicons name="notifications" size={24} color={Colors.white} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.communeInfo}>
              <View style={[styles.communeIconContainer, { backgroundColor: themeColor + '1A' }]}>
                {logoUrl ? (
                  <Image source={{ uri: logoUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="contain" />
                ) : (
                  <Text style={styles.communeIcon}>{logoIcon}</Text>
                )}
              </View>
              <View>
                <Text style={styles.communeNameText}>{commune.name}</Text>
                <Text style={styles.mayorNameText}>Dr. Jean-Louis Delacosta</Text>
              </View>
            </View>
            <View style={styles.mayorAvatarContainer}>
              {/* Placeholder for Mayor's photo */}
              <Ionicons name="person" size={24} color={Colors.textLight} />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Bienvenue à {commune.name} !</Text>
          <Text style={styles.welcomeDescription}>
            Notre commune évolue grâce à votre participation et votre engagement citoyen.
          </Text>
        </View>

        {/* Alert Block */}
        <View style={styles.alertBlock}>
          <View style={styles.alertHeader}>
            <View style={styles.alertDot} />
            <Text style={styles.alertTitle}>ALERTE</Text>
          </View>
          <Text style={styles.alertText}>
            Travaux en cours : Route Principale partiellement fermée jusqu'au 15 mars
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push(`/commune/${id}/reports`)}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="warning" size={20} color="#E53935" />
            </View>
            <Text style={styles.actionBtnText}>Signaler un problème</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push(`/commune/${id}/contacts`)}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="call" size={20} color="#1E88E5" />
            </View>
            <Text style={styles.actionBtnText}>Contacter les urgences</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push(`/commune/${id}/procedures`)}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#43A047" />
            </View>
            <Text style={styles.actionBtnText}>Faire une demande</Text>
          </TouchableOpacity>

        </View>

        {/* Bottom padding for Tabs */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7F5' 
  },
  topHeader: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  headerTitleText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: Fonts.weights.extrabold,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  communeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  communeIcon: {
    fontSize: 18,
  },
  communeNameText: {
    fontSize: 16,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
  mayorNameText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  mayorAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: Fonts.weights.extrabold,
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  alertBlock: {
    backgroundColor: '#FFF3E0', // Light orange
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginRight: 6,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: Fonts.weights.bold,
    color: '#E65100',
    letterSpacing: 0.5,
  },
  alertText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
  actionsContainer: {
    gap: Spacing.sm,
  },
  actionBtn: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
});
