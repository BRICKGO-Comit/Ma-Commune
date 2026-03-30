import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withRepeat,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Gradients, Radius } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Entrance animations
    scale.value = withTiming(1, { duration: 1200 });
    opacity.value = withTiming(1, { duration: 1000 });
    
    // Continuous pulse for the logo
    pulse.value = withRepeat(
      withTiming(1.05, { duration: 2000 }), 
      -1, 
      true
    );

    // Navigation after splash
    const timer = setTimeout(() => {
      router.replace('/search');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value * pulse.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [1, 1.05], [0.3, 0.6], Extrapolate.CLAMP),
    transform: [{ scale: pulse.value * 1.2 }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.mesh}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Background Decor */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.content}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View style={[styles.logoWrapper, logoStyle]}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={{ opacity }}>
          <Text style={styles.title}>MA COMMUNE</Text>
          <Text style={styles.subtitle}>L'EXCELLENCE MUNICIPALE</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity }]}>
        <Text style={styles.slogan}>Informer • Protéger • Simplifier</Text>
        <View style={styles.loaderLine}>
          <Animated.View style={styles.loaderProgress} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 180,
    height: 180,
    backgroundColor: Colors.white,
    borderRadius: 90,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.accent,
    opacity: 0.4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 3,
    textAlign: 'center',
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  slogan: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
    opacity: 0.7,
  },
  loaderLine: {
    width: width * 0.4,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loaderProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.accent,
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});

