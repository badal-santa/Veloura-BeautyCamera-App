import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, Linking, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import GradientText from '../components/GradientText';
import LoadingSpinner from '../components/LoadingSpinner';
import { shouldShowHomePrompt } from '../features/launcher/homePrompt';
import { urlToTarget } from '../lib/appLinks';
import { goToTarget } from '../navigation/navigationRef';
import type { RootStackScreenProps } from '../navigation/types';
import { Colors } from '../theme/colors';

const SPLASH_DURATION_MS = 3000;
const LOGO_SIZE = 124;

const SPARKLES: { top: `${number}%`; left: `${number}%`; size: number; delay: number }[] = [
  { top: '14%', left: '18%', size: 3, delay: 200 },
  { top: '22%', left: '72%', size: 2, delay: 900 },
  { top: '34%', left: '86%', size: 3, delay: 500 },
  { top: '58%', left: '10%', size: 2, delay: 1300 },
  { top: '66%', left: '80%', size: 3, delay: 700 },
  { top: '78%', left: '28%', size: 2, delay: 1100 },
];

export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    // Like the reference app: no onboarding — ask about Home once, then straight in.
    const next = shouldShowHomePrompt() ? 'HomePrompt' : 'Main';
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Only leave the splash if it's still on screen — a deep link may already have navigated.
    const leave = (fn: () => void) => {
      if (navigation.isFocused()) fn();
    };
    // Opened from Veloura Home (veloura://…) → skip the splash and go straight there.
    Linking.getInitialURL().then((url) => {
      const target = urlToTarget(url);
      if (target) {
        leave(() => {
          navigation.replace('Main');
          setTimeout(() => goToTarget(target), 0);
        });
      } else {
        timer = setTimeout(() => leave(() => navigation.replace(next)), SPLASH_DURATION_MS);
      }
    });
    return () => clearTimeout(timer);
  }, [navigation, breathe]);

  const breatheStyle = useAnimatedStyle(() => ({
    opacity: 0.75 + breathe.value * 0.25,
    transform: [{ scale: 1 + breathe.value * 0.08 }],
  }));

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <StatusBar style="light" />

      {/* Ambient neon light */}
      <Animated.View entering={FadeIn.duration(1200)} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.glowPink, breatheStyle]} />
        <Animated.View style={[styles.glowPurple, breatheStyle]} />
        <View style={styles.glowPeach} />
      </Animated.View>

      {/* Neon arc */}
      <Animated.View
        entering={FadeIn.delay(300).duration(1400)}
        style={styles.arc}
        pointerEvents="none"
      />

      {SPARKLES.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {/* Crown accent */}
      <Animated.View
        entering={ZoomIn.delay(700).duration(600).springify()}
        className="absolute right-6 top-24"
      >
        <View style={{ transform: [{ rotate: '16deg' }] }}>
          <MaterialCommunityIcons
            name="crown-outline"
            size={34}
            color={Colors.accentPink}
            // Padding gives the glow room — iOS clips text shadows to the glyph bounds.
            style={styles.crown}
          />
        </View>
      </Animated.View>

      {/* Brand */}
      <View className="flex-1 items-center justify-center pb-10">
        <View style={styles.brandHalo} pointerEvents="none" />
          <View style={styles.logoGlow}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          </View>

        <Animated.View entering={FadeInDown.delay(450).duration(800)} className="mt-8 items-center">
          <GradientText
            colors={['#FFFFFF', '#FFE1F0', Colors.primaryLight, Colors.secondaryLight]}
            className="px-2 font-extrabold text-[50px] leading-[62px] tracking-[-1.5px]"
            shimmer
            shimmerDelay={1100}
          >
            Veloura
          </GradientText>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(850).duration(700)} className="mt-3 flex-row items-center">
          <LinearGradient
            colors={['transparent', Colors.primaryLight]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.rule}
          />
          <Text className="mx-3 font-semibold text-[11px] tracking-[4px] text-content-secondary">
            BEAUTY · EDIT · GLOW
          </Text>
          <LinearGradient
            colors={[Colors.primaryLight, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.rule}
          />
        </Animated.View>
      </View>

      {/* Loader */}
      <Animated.View
        entering={FadeIn.delay(1100).duration(700)}
        className="absolute bottom-16 left-0 right-0 items-center"
      >
        <LoadingSpinner size={30} thickness={2} />
        <Text className="mt-4 font-medium text-[13px] tracking-wide text-content-tertiary">
          Loading magic...
        </Text>
      </Animated.View>
    </View>
  );
}

function Sparkle({ top, left, size, delay }: (typeof SPARKLES)[number]) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 900 }), withTiming(0.15, { duration: 1100 })),
        -1,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: Colors.white,
          boxShadow: `0 0 ${size * 3}px ${Colors.accentPink}`,
        },
        style,
      ]}
    />
  );
}

const radialGlow = (color: string, size: number): ViewStyle => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: size / 2,
  experimental_backgroundImage: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
});

const styles = StyleSheet.create({
  glowPink: {
    ...radialGlow('rgba(255, 79, 163, 0.42)', 620),
    top: -120,
    left: -260,
  },
  glowPurple: {
    ...radialGlow('rgba(168, 85, 247, 0.32)', 560),
    bottom: -180,
    right: -240,
  },
  glowPeach: {
    ...radialGlow('rgba(255, 179, 138, 0.12)', 360),
    top: '30%',
    right: -140,
  },
  arc: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
    top: 70,
    left: -400,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 143, 209, 0.7)',
    boxShadow:
      '0 0 22px rgba(255, 79, 163, 0.7), inset 0 0 22px rgba(255, 79, 163, 0.45)',
  },
  crown: {
    padding: 14,
    textShadowColor: Colors.primary,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  brandHalo: {
    ...radialGlow('rgba(255, 79, 163, 0.18)', 380),
  },
  logoGlow: {
    borderRadius: LOGO_SIZE * 0.2,
    boxShadow: '0 0 44px rgba(255, 79, 163, 0.5), 0 16px 36px rgba(0, 0, 0, 0.55)',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * 0.2,
  },
  rule: {
    width: 28,
    height: 1,
  },
});
