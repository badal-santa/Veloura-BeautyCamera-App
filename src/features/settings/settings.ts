import * as Haptics from 'expo-haptics';

import { createPersistedStore } from '../../lib/createStore';

export type Size = 'S' | 'M' | 'L';
export type Accent = 'rose' | 'violet' | 'sunset' | 'ocean';

export type Settings = {
  // Camera
  mirrorSelfie: boolean;
  shutterSound: boolean;
  cameraGrid: boolean;
  // Veloura Home — home screen
  homeColumns: number;
  homeIconSize: Size;
  homeLabels: boolean;
  homeLabelSize: Size;
  // Veloura Home — app drawer
  drawerColumns: number;
  drawerLabels: boolean;
  drawerOpacity: number;
  // General
  haptics: boolean;
  accent: Accent;
  saveCreations: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  mirrorSelfie: true,
  shutterSound: true,
  cameraGrid: false,
  homeColumns: 4,
  homeIconSize: 'M',
  homeLabels: true,
  homeLabelSize: 'M',
  drawerColumns: 4,
  drawerLabels: true,
  drawerOpacity: 97,
  haptics: true,
  accent: 'rose',
  saveCreations: true,
};

export const settingsStore = createPersistedStore<Settings>('settings.json', DEFAULT_SETTINGS);
export const useSettings = settingsStore.use;
export const updateSettings = settingsStore.set;

export const ACCENTS: Record<Accent, { label: string; colors: readonly [string, string, string]; glow: string }> = {
  rose: { label: 'Rose', colors: ['#FF8FD1', '#FF4FA3', '#A855F7'], glow: 'rgba(255, 79, 163, 0.22)' },
  violet: { label: 'Violet', colors: ['#C4B5FD', '#8B5CF6', '#4F46E5'], glow: 'rgba(139, 92, 246, 0.26)' },
  sunset: { label: 'Sunset', colors: ['#FDBA74', '#FB7185', '#E11D48'], glow: 'rgba(251, 113, 133, 0.24)' },
  ocean: { label: 'Ocean', colors: ['#67E8F9', '#38BDF8', '#6366F1'], glow: 'rgba(56, 189, 248, 0.22)' },
};

/** Icon px per size; label font px per size. */
export const ICON_PX: Record<Size, number> = { S: 44, M: 54, L: 62 };
export const LABEL_PX: Record<Size, number> = { S: 10, M: 11, L: 13 };

/** Light tap for long-press actions, if enabled. */
export function hapticTap() {
  if (settingsStore.get().haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
