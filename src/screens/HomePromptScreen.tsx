import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import GlowBackdrop from '../components/GlowBackdrop';
import GradientButton from '../components/GradientButton';
import HomePreviewMock from '../components/launcher/HomePreviewMock';
import { markHomePromptSeen } from '../features/launcher/homePrompt';
import { VelouraLauncher } from '../features/launcher/launcher';
import type { RootStackScreenProps } from '../navigation/types';

const PERKS: { icon: keyof typeof MaterialCommunityIcons.glyphMap; text: string }[] = [
  { icon: 'camera', text: 'Beauty camera one tap from your Home screen' },
  { icon: 'gesture-swipe-up', text: 'Swipe up for every app, with instant search' },
  { icon: 'image-filter-hdr', text: 'Your wallpaper, framed in a premium glass look' },
];

export default function HomePromptScreen({ navigation }: RootStackScreenProps<'HomePrompt'>) {
  const [done, setDone] = useState(false);
  const waitingForSystem = useRef(false);

  const continueToApp = () => navigation.replace('Main');
  // Accepted → show the new Veloura Home (its own window); the app waits behind it.
  const enterHome = () => {
    continueToApp();
    VelouraLauncher?.goHome();
  };

  // After the system "default Home app" dialog, see what the user chose.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !waitingForSystem.current) return;
      waitingForSystem.current = false;
      if (VelouraLauncher?.isDefaultLauncher()) {
        setDone(true);
        setTimeout(enterHome, 1400);
      } else {
        // Declined — keep Veloura out of the Home chooser until enabled in Profile.
        VelouraLauncher?.setHomeModeEnabled(false);
        continueToApp();
      }
    });
    return () => sub.remove();
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  const makeHome = () => {
    markHomePromptSeen();
    waitingForSystem.current = true;
    VelouraLauncher?.setHomeModeEnabled(true);
    VelouraLauncher?.requestDefaultLauncher();
  };

  const notNow = () => {
    markHomePromptSeen();
    continueToApp();
  };

  if (done) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-10">
        <GlowBackdrop color="rgba(255, 79, 163, 0.25)" />
        <Animated.View entering={ZoomIn.springify()} className="h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <MaterialCommunityIcons name="check-circle" className="text-[44px] text-primary-light" />
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(150)} className="mt-6 text-center font-extrabold text-2xl text-white">
          You&apos;re all set ✨
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(250)} className="mt-2 text-center font-regular text-sm text-content-secondary">
          Press Home anytime to see your new Veloura Home. If the swipe-up gesture still opens your old
          Home, restart your phone once.
        </Animated.Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pb-safe-offset-6 pt-safe-offset-4">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(255, 79, 163, 0.22)" />

      <View className="flex-1 items-center justify-center">
        <Animated.View entering={ZoomIn.duration(600).springify().damping(16)}>
          <HomePreviewMock />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} className="px-6">
        <Text className="font-extrabold text-[30px] leading-[37px] tracking-[-0.6px] text-white">
          Make Veloura{'\n'}your Home
        </Text>
        <Text className="mt-2 font-regular text-[15px] leading-[22px] text-content-secondary">
          Turn your Home screen into a glow studio. You can switch back anytime in Profile.
        </Text>

        <View className="mt-5 gap-3">
          {PERKS.map((p) => (
            <View key={p.text} className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                <MaterialCommunityIcons name={p.icon} className="text-base text-primary-light" />
              </View>
              <Text className="ml-3 flex-1 font-medium text-[13px] text-white/85">{p.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(500)} className="mt-7 px-6">
        <GradientButton label="Make Veloura my Home" icon="home-variant" onPress={makeHome} />
        <Pressable onPress={notNow} accessibilityRole="button" hitSlop={8} className="mt-4 items-center py-2">
          <Text className="font-semibold text-[15px] text-content-secondary">Not now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
