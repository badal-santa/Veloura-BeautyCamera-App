import { Text, View } from 'react-native';

import { useAdSlot } from '../../features/ads/ads';
import type { PlacementId } from '../../features/ads/config';
import PressableScale from '../PressableScale';
import AdBadge from './AdBadge';
import AdIcon from './AdIcon';

/**
 * Inline banner slot (fits a standard 320×50 / adaptive banner).
 * TODO(ads): swap the mock row for the network's banner view, keeping the frame.
 */
export default function BannerAd({ placement, className = '' }: { placement: PlacementId; className?: string }) {
  const ad = useAdSlot(placement);
  if (!ad) return null;

  return (
    <View className={`mx-5 ${className}`}>
      <PressableScale
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel={`Ad: ${ad.headline}`}
        pressedScale={0.98}
        className="h-[64px] flex-row items-center rounded-2xl border border-white/10 bg-surface px-3"
      >
        <AdIcon ad={ad} size={38} />
        <View className="ml-3 flex-1">
          <Text className="font-bold text-[13px] text-white" numberOfLines={1}>
            {ad.headline}
          </Text>
          <Text className="font-regular text-[11px] text-white/55" numberOfLines={1}>
            {ad.advertiser} · {ad.body}
          </Text>
        </View>
        <View className="ml-2 items-end">
          <AdBadge />
          <Text className="mt-1 font-bold text-xs text-primary-light">{ad.cta}</Text>
        </View>
      </PressableScale>
    </View>
  );
}
