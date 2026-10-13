import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { useAdSlot } from '../../features/ads/ads';
import type { PlacementId } from '../../features/ads/config';
import PressableScale from '../PressableScale';
import AdBadge from './AdBadge';
import AdIcon from './AdIcon';

type Props = {
  placement: PlacementId;
  /** 'media' = big card with an image area; 'compact' = one row. */
  variant?: 'media' | 'compact';
  className?: string;
};

/**
 * In-feed native ad, styled like the cards around it but clearly labelled.
 * Collapses to nothing when there's no ad to show.
 */
export default function NativeAdCard({ placement, variant = 'media', className = '' }: Props) {
  const ad = useAdSlot(placement);
  if (!ad) return null;

  // TODO(ads): route to the network's click handler.
  const onPress = () => {};

  if (variant === 'compact') {
    return (
      <View className={`mx-5 ${className}`}>
        <PressableScale
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Ad: ${ad.headline}`}
          pressedScale={0.98}
          className="flex-row items-center rounded-[22px] border border-white/10 bg-surface p-3.5"
        >
          <AdIcon ad={ad} size={48} />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <AdBadge />
              <Text className="ml-1.5 flex-1 font-medium text-[11px] text-content-tertiary" numberOfLines={1}>
                {ad.advertiser}
              </Text>
            </View>
            <Text className="mt-1 font-bold text-sm text-white" numberOfLines={1}>
              {ad.headline}
            </Text>
            <Text className="font-regular text-xs text-white/55" numberOfLines={1}>
              {ad.body}
            </Text>
          </View>
          <View className="ml-3 rounded-full bg-white px-3.5 py-2">
            <Text className="font-bold text-xs text-background">{ad.cta}</Text>
          </View>
        </PressableScale>
      </View>
    );
  }

  return (
    <View className={`mx-5 ${className}`}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ad: ${ad.headline}`}
        pressedScale={0.98}
        className="overflow-hidden rounded-[28px] border border-white/10 bg-surface"
      >
        {/* Header: advertiser + label */}
        <View className="flex-row items-center p-4 pb-3">
          <AdIcon ad={ad} size={36} />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-[13px] text-white" numberOfLines={1}>
              {ad.advertiser}
            </Text>
            <Text className="font-regular text-[11px] text-content-tertiary">Sponsored</Text>
          </View>
          <AdBadge />
        </View>

        {/* Media — the network's MediaView goes here (16:9). */}
        <View className="mx-4 aspect-video overflow-hidden rounded-[20px]">
          <LinearGradient colors={ad.tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0 opacity-80" />
          <LinearGradient colors={['transparent', 'rgba(8, 7, 12, 0.55)']} className="absolute inset-0" />
          <View className="flex-1 items-center justify-center">
            <MaterialCommunityIcons name={ad.icon} size={56} color="rgba(255, 255, 255, 0.9)" />
          </View>
        </View>

        {/* Copy + CTA */}
        <View className="flex-row items-center p-4">
          <View className="mr-3 flex-1">
            <Text className="font-bold text-[15px] text-white" numberOfLines={2}>
              {ad.headline}
            </Text>
            <Text className="mt-0.5 font-regular text-xs text-white/55" numberOfLines={2}>
              {ad.body}
            </Text>
            {ad.rating != null && (
              <View className="mt-1.5 flex-row items-center">
                <MaterialCommunityIcons name="star" className="text-xs text-premium" />
                <Text className="ml-1 font-semibold text-[11px] text-white/70">{ad.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          <View className="rounded-full bg-white px-4 py-2.5">
            <Text className="font-bold text-[13px] text-background">{ad.cta}</Text>
          </View>
        </View>
      </PressableScale>
    </View>
  );
}
