import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type BeautyKey = 'smooth' | 'brighten' | 'skinTone' | 'glow' | 'warmth';
/** Each beauty value runs 0–100. */
export type BeautySettings = Record<BeautyKey, number>;

export type FilterId = 'natural' | 'bloom' | 'golden' | 'cool' | 'mono' | 'film';

export type EditState = {
  beauty: BeautySettings;
  filter: FilterId;
  /** -100 (darker) … 100 (brighter). */
  exposure: number;
};

export const DEFAULT_EDIT: EditState = {
  beauty: { smooth: 35, brighten: 20, skinTone: 15, glow: 20, warmth: 10 },
  filter: 'natural',
  exposure: 0,
};

/** No edits — the starting point for photos opened from the gallery. */
export const NEUTRAL_EDIT: EditState = {
  beauty: { smooth: 0, brighten: 0, skinTone: 0, glow: 0, warmth: 0 },
  filter: 'natural',
  exposure: 0,
};

export const BEAUTY_TOOLS: {
  key: BeautyKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: 'smooth', label: 'Smooth', icon: 'blur' },
  { key: 'brighten', label: 'Brighten', icon: 'white-balance-sunny' },
  { key: 'skinTone', label: 'Skin tone', icon: 'face-woman-shimmer-outline' },
  { key: 'glow', label: 'Glow', icon: 'shimmer' },
  { key: 'warmth', label: 'Warmth', icon: 'thermometer' },
];

export const FILTERS: { id: FilterId; name: string }[] = [
  { id: 'natural', name: 'Natural' },
  { id: 'bloom', name: 'Bloom' },
  { id: 'golden', name: 'Golden' },
  { id: 'cool', name: 'Cool' },
  { id: 'mono', name: 'Mono' },
  { id: 'film', name: 'Film' },
];

export type EditMode = 'beauty' | 'makeup' | 'filters' | 'adjust' | 'crop';
