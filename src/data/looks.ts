import type { ImageSourcePropType } from 'react-native';

import type { PresetId } from '../features/media/presets';

export type Look = {
  name: string;
  mood: string;
  image: ImageSourcePropType;
  /** Editor preset applied when the look is opened. */
  preset: PresetId;
};

export const EVERYDAY_LOOKS: Look[] = [
  { name: 'Blush', mood: 'Soft pink', image: require('../../assets/images/sections/looks/blush.jpg'), preset: 'blush' },
  { name: 'Cool night', mood: 'Crisp blue', image: require('../../assets/images/sections/looks/cool-night.jpg'), preset: 'coolNight' },
  { name: 'Cocoa', mood: 'Warm film', image: require('../../assets/images/sections/looks/cocoa.jpg'), preset: 'cocoa' },
  { name: 'Mono', mood: 'Clean B&W', image: require('../../assets/images/sections/looks/mono.jpg'), preset: 'mono' },
];

export const TRENDING_LOOKS: Look[] = [
  { name: 'Petal', mood: 'Soft blush', image: require('../../assets/images/sections/looks/petal.jpg'), preset: 'petal' },
  { name: 'Luminous', mood: 'Clean glow', image: require('../../assets/images/sections/looks/luminous.jpg'), preset: 'luminous' },
  { name: 'Peach', mood: 'Warm & fresh', image: require('../../assets/images/sections/looks/peach.jpg'), preset: 'peach' },
  { name: 'Airy', mood: 'Bright calm', image: require('../../assets/images/sections/looks/airy.jpg'), preset: 'airy' },
];
