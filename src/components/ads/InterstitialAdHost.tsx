import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { closeInterstitial, useInterstitial } from '../../features/ads/ads';
import { INTERSTITIAL_CLOSE_AFTER_S } from '../../features/ads/config';
import type { AdCreative } from '../../features/ads/mockAds';
import GradientButton from '../GradientButton';
import AdBadge from './AdBadge';
import AdIcon from './AdIcon';

/**
 * Full-screen ad shown after saves (see maybeShowInterstitial). Mounted once
 * at the app root. Close unlocks after a short countdown.
 * TODO(ads): with AdMob, call the SDK's interstitial.show() instead of this UI.
 */
export default function InterstitialAdHost() {
  const ad = useInterstitial();
  // Remounts per ad, so the countdown starts fresh each time.
  return ad ? <Interstitial ad={ad} /> : null;
}

function Interstitial({ ad }: { ad: AdCreative }) {
  const [secondsLeft, setSecondsLeft] = useState(INTERSTITIAL_CLOSE_AFTER_S);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const canClose = secondsLeft === 0;

  return (
    <Modal
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => canClose && closeInterstitial()}
    >
      <View className="flex-1 bg-background">
        <LinearGradient colors={ad.tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0 opacity-35" />
        <LinearGradient colors={['transparent', '#08070C']} locations={[0.2, 0.75]} className="absolute inset-0" />

        {/* Top bar: label + close */}
        <View className="flex-row items-center justify-between px-5 pt-safe-offset-3">
          <View className="flex-row items-center">
            <AdBadge />
            <Text className="ml-2 font-medium text-xs text-white/60">Sponsored</Text>
          </View>
          <Pressable
            onPress={closeInterstitial}
            disabled={!canClose}
            accessibilityRole="button"
            accessibilityLabel={canClose ? 'Close ad' : `Close in ${secondsLeft} seconds`}
            hitSlop={10}
            className="h-10 min-w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 px-3"
          >
            {canClose ? (
              <MaterialCommunityIcons name="close" className="text-xl text-white" />
            ) : (
              <Text className="font-bold text-[13px] text-white/80">{secondsLeft}</Text>
            )}
          </Pressable>
        </View>

        {/* Media — the network's full-screen creative fills this area. */}
        <Animated.View entering={FadeIn.duration(400)} className="flex-1 items-center justify-center px-8">
          <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-[36px] border border-white/10">
            <LinearGradient colors={ad.tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0 opacity-85" />
            <MaterialCommunityIcons name={ad.icon} size={96} color="rgba(255, 255, 255, 0.92)" />
          </View>
        </Animated.View>

        {/* Copy + CTA */}
        <Animated.View entering={FadeInDown.delay(150).duration(450)} className="px-6 pb-safe-offset-6">
          <View className="flex-row items-center">
            <AdIcon ad={ad} size={48} />
            <View className="ml-3 flex-1">
              <Text className="font-bold text-[15px] text-white">{ad.advertiser}</Text>
              {ad.rating != null && (
                <View className="mt-0.5 flex-row items-center">
                  <MaterialCommunityIcons name="star" className="text-xs text-premium" />
                  <Text className="ml-1 font-semibold text-xs text-white/70">{ad.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
          <Text className="mt-4 font-extrabold text-[26px] leading-[32px] tracking-[-0.4px] text-white">{ad.headline}</Text>
          <Text className="mb-6 mt-2 font-regular text-sm leading-[21px] text-white/60">{ad.body}</Text>
          {/* TODO(ads): route to the network's click handler. */}
          <GradientButton label={ad.cta} icon="open-in-new" onPress={() => {}} />
        </Animated.View>
      </View>
    </Modal>
  );
}
