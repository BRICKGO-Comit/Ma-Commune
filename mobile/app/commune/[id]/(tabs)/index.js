import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform, Dimensions, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Colors, Fonts, Spacing, Radius, Gradients, Shadows } from '../../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommuneContext } from '../_layout';

const { width } = Dimensions.get('window');

export default function CommuneHomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const commune = useContext(CommuneContext);

  if (!commune) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Chargement d'excellence...</Text>
      </View>
    );
  }

  const logoUrl = commune.logo_url;
  const bannerUrl = commune.banner_url;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Glass Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={Gradients.mesh}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {bannerUrl && (
          <Image 
            source={{ uri: bannerUrl }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        )}

        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerIconBtn} 
            onPress={() => router.push(`/commune/${id}/menu`)}
          >
            <BlurView intensity={20} tint="light" style={styles.blurBtn}>
              <Ionicons name="apps-outline" size={22} color={Colors.white} />
            </BlurView>
          </TouchableOpacity>
          
          <Animated.View entering={FadeIn.duration(800)} style={styles.headerLogoContainer}>
            <Image 
              source={require('../../../../assets/logo.png')} 
              style={styles.headerLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.headerTitle}>MA COMMUNE</Text>
          </Animated.View>

          <TouchableOpacity style={styles.headerIconBtn}>
            <BlurView intensity={20} tint="light" style={styles.blurBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
              <View style={styles.notificationDot} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Hero Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.welcomeCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAF5']}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeHeader}>
              <View style={styles.communeProfile}>
                <View style={styles.logoCircle}>
                   <Image 
                    source={require('../../../../assets/logo.png')} 
                    style={styles.cardLogo} 
                    resizeMode="contain" 
                  />
                </View>
                <View>
                  <Text style={styles.communeLabel}>MUNICIPALITÉ RÉGIONALE</Text>
                  <Text style={styles.communeName}>{commune.name}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.mayorBadge}>
                <Ionicons name="ribbon" size={16} color={Colors.accentDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.messageContainer}>
              <Text style={styles.welcomeTitle}>Bienvenue, Cher Citoyen</Text>
              <Text style={styles.welcomeText}>
                Votre ville se transforme. Participez à l'excellence de {commune.name} en utilisant nos services numériques.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Live Status Bar */}
        <Animated.View entering={FadeInRight.delay(400)} style={styles.statusRow}>
          <BlurView intensity={10} style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statusText}>Services en ligne</Text>
          </BlurView>
          <View style={styles.statusDivider} />
          <TouchableOpacity style={styles.statusItem}>
            <Ionicons name="thermometer-outline" size={14} color={Colors.primary} />
            <Text style={styles.statusText}>28°C Ensoleillé</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Premium Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services Prioritaires</Text>
          <View style={styles.accentLine} />
        </View>

        <View style={styles.grid}>
          <ActionCard 
            title="SIGNALEMENT" 
            subtitle="Incident urbain"
            icon="warning" 
            color="#EF4444" 
            delay={500}
            onPress={() => router.push(`/commune/${id}/reports`)}
          />
          <ActionCard 
            title="DÉMARCHES" 
            subtitle="État civil & Actes"
            icon="document-text" 
            color={Colors.primary} 
            delay={600}
            onPress={() => router.push(`/commune/${id}/procedures`)}
          />
          <ActionCard 
            title="CONTACTS" 
            subtitle="Urgences & Mairie"
            icon="call" 
            color="#3B82F6" 
            delay={700}
            onPress={() => router.push(`/commune/${id}/contacts`)}
          />
          <ActionCard 
            title="CULTURE" 
            subtitle="Agenda & Sorties"
            icon="calendar" 
            color={Colors.accentDark} 
            delay={800}
            onPress={() => {}}
          />
        </View>

        {/* News Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actualités Locales</Text>
          <View style={styles.accentLine} />
        </View>
        
        <TouchableOpacity style={styles.newsCard}>
          <View style={styles.newsImagePlaceholder}>
            <LinearGradient colors={['#eee', '#f9f9f9']} style={StyleSheet.absoluteFill} />
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsTag}>TRAVAUX</Text>
            <Text style={styles.newsTitle}>Modernisation de la voirie au centre-ville</Text>
            <Text style={styles.newsDate}>Il y a 2 heures</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function ActionCard({ title, subtitle, icon, color, delay, onPress }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.cardWrapper}>
      <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.9}>
        <View style={[styles.actionIconBg, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAF5' 
  },
  headerContainer: {
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 25,
    ...Shadows.medium,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  blurBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  welcomeCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  communeProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    ...Shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardLogo: {
    width: '70%',
    height: '70%',
  },
  communeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 1,
  },
  communeName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  mayorBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  messageContainer: {
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 20,
    marginBottom: 32,
    ...Shadows.soft,
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  statusDivider: {
    width: 1,
    height: 15,
    backgroundColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  accentLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.accent + '30',
    marginLeft: 15,
    borderRadius: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    ...Shadows.soft,
    alignItems: 'center',
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  newsCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    ...Shadows.soft,
    flexDirection: 'row',
    height: 110,
  },
  newsImagePlaceholder: {
    width: 110,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  newsTag: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.accentDark,
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
    lineHeight: 18,
    marginBottom: 6,
  },
  newsDate: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: '500',
  },
});

