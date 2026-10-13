import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import type { AdCreative } from '../../features/ads/mockAds';

/** Advertiser logo. Placeholder art until the network supplies an image. */
export default function AdIcon({ ad, size = 40 }: { ad: AdCreative; size?: number }) {
  return (
    <LinearGradient
      colors={ad.tint}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size * 0.3, alignItems: 'center', justifyContent: 'center' }}
    >
      <MaterialCommunityIcons name={ad.icon} size={size * 0.52} color="#FFFFFF" />
    </LinearGradient>
  );
}
