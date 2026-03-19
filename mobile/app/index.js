import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import { Colors, Fonts } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const sloganOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate in
    scale.value = withTiming(1, { duration: 800 });
    opacity.value = withTiming(1, { duration: 600 });
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    sloganOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));

    // Navigate after animation
    const timer = setTimeout(() => {
      router.replace('/search'); // This will be the commune selector
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const sloganStyle = useAnimatedStyle(() => ({
    opacity: sloganOpacity.value,
    transform: [{ translateY: withTiming(sloganOpacity.value === 1 ? 0 : 10) }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logoIcon}>🏛️</Text>
      </Animated.View>

      <Animated.Text style={[styles.title, titleStyle]}>
        MA COMMUNE
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        L'excellence municipale numérique
      </Animated.Text>

      <Animated.View style={[styles.sloganContainer, sloganStyle]}>
        <Text style={styles.sloganText}>Informer • Protéger • Simplifier</Text>
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
    padding: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: Fonts.weights.extrabold,
    color: Colors.white,
    letterSpacing: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: Fonts.weights.medium,
    marginBottom: 40,
    textAlign: 'center',
  },
  sloganContainer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sloganText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
