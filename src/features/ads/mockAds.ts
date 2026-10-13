import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { PlacementId } from './config';

/** The fields every network's native/banner/interstitial ad provides. */
export type AdCreative = {
  advertiser: string;
  headline: string;
  body: string;
  cta: string;
  /** Placeholder art — real ads supply an icon image and media view. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: readonly [string, string];
  rating?: number;
};

/** Design-review stand-ins; never shown in release builds. */
export const MOCK_ADS: Record<PlacementId, AdCreative> = {
  homeFeed: {
    advertiser: 'Lumen Notes',
    headline: 'Plan your week in 30 seconds',
    body: 'Smart lists, reminders and widgets — free on Google Play.',
    cta: 'Install',
    icon: 'notebook-heart-outline',
    tint: ['#38BDF8', '#6366F1'],
    rating: 4.6,
  },
  editorFeed: {
    advertiser: 'Petal Prints',
    headline: 'Turn your selfies into prints',
    body: 'Glossy prints delivered in 2 days.',
    cta: 'Shop now',
    icon: 'printer-outline',
    tint: ['#FDBA74', '#FB7185'],
  },
  templatesFeed: {
    advertiser: 'Strum',
    headline: 'Learn guitar with your phone',
    body: 'Real-time feedback on every chord.',
    cta: 'Install',
    icon: 'guitar-acoustic',
    tint: ['#34D399', '#0EA5E9'],
    rating: 4.8,
  },
  galleryBanner: {
    advertiser: 'CloudBox',
    headline: '100 GB backup for your photos',
    body: 'Try free for 30 days.',
    cta: 'Open',
    icon: 'cloud-upload-outline',
    tint: ['#818CF8', '#A855F7'],
  },
  profileBanner: {
    advertiser: 'Brew & Co',
    headline: 'Your first coffee is on us',
    body: 'Order ahead and skip the line.',
    cta: 'Open',
    icon: 'coffee-outline',
    tint: ['#FBBF24', '#F97316'],
  },
  afterSave: {
    advertiser: 'Wander',
    headline: 'Weekend getaways from ₹1,999',
    body: 'Handpicked stays near you. Book in two taps, cancel free.',
    cta: 'Explore stays',
    icon: 'airplane',
    tint: ['#F472B6', '#8B5CF6'],
    rating: 4.7,
  },
};
