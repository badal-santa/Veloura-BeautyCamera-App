import { useSyncExternalStore } from 'react';

import {
  AD_PLACEMENTS,
  AD_PROVIDER,
  INTERSTITIAL_DELAY_MS,
  INTERSTITIAL_EVERY_N_SAVES,
  INTERSTITIAL_MIN_GAP_MS,
  SHOW_AD_PLACEHOLDERS,
  type PlacementId,
} from './config';
import { MOCK_ADS, type AdCreative } from './mockAds';

/**
 * Creative for a slot, or null to collapse it.
 * TODO(ads): when a provider is chosen, load from AdMob / the web URL here.
 */
export function useAdSlot(placement: PlacementId): AdCreative | null {
  if (AD_PROVIDER === 'none') return SHOW_AD_PLACEHOLDERS ? MOCK_ADS[placement] : null;
  return null;
}

// ─── Interstitial ───────────────────────────────────────────────────────────

let current: AdCreative | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

let saves = 0;
let lastShownAt = 0;

/** Call after a successful save; shows the after-save ad when pacing allows. */
export function maybeShowInterstitial(placement: PlacementId = 'afterSave') {
  saves += 1;
  if (saves % INTERSTITIAL_EVERY_N_SAVES !== 0) return;
  if (Date.now() - lastShownAt < INTERSTITIAL_MIN_GAP_MS) return;
  if (AD_PROVIDER === 'none' && !SHOW_AD_PLACEHOLDERS) return;
  if (AD_PLACEMENTS[placement].format !== 'interstitial') return;

  lastShownAt = Date.now();
  setTimeout(() => {
    current = MOCK_ADS[placement];
    emit();
  }, INTERSTITIAL_DELAY_MS);
}

export function closeInterstitial() {
  current = null;
  emit();
}

export const useInterstitial = () => useSyncExternalStore(subscribe, () => current, () => current);
