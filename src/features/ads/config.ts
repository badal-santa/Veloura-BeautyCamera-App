/**
 * Ad setup — one place to switch providers and tune placements.
 *
 * The network isn't decided yet (Google AdMob, Firebase, or a web/house ad
 * served from a URL). Until it is, `AD_PROVIDER` stays 'none' and slots render
 * placeholder creatives in dev builds so the layout can be reviewed.
 *
 * Never place ads in: the camera, any editing canvas, or Veloura Home (the
 * launcher) — Play policy forbids ads on a home-screen replacement.
 */

export type AdProvider = 'none' | 'admob' | 'web';

/** Which network fills the slots. 'none' = no real ads. */
export const AD_PROVIDER: AdProvider = 'none';

/** Show mock creatives while there's no provider. Dev builds only. */
export const SHOW_AD_PLACEHOLDERS = __DEV__;

export type AdFormat = 'native' | 'banner' | 'interstitial';

export type AdPlacement = {
  format: AdFormat;
  /** Where it appears — for docs and the provider dashboard name. */
  where: string;
  /** AdMob ad unit, e.g. 'ca-app-pub-xxx/yyy'. Fill when AdMob is picked. */
  admobUnitId?: string;
  /** Endpoint returning a creative, if ads are served from the web. */
  webUrl?: string;
};

export const AD_PLACEMENTS = {
  homeFeed: { format: 'native', where: 'Home — between Trending looks and Made for you' },
  editorFeed: { format: 'native', where: 'Editor tab — between Tools and Signature looks' },
  templatesFeed: { format: 'native', where: 'Templates — under the featured design' },
  galleryBanner: { format: 'banner', where: 'Gallery — below My creations' },
  profileBanner: { format: 'banner', where: 'Profile — above the footer' },
  afterSave: { format: 'interstitial', where: 'Full screen, after a photo / video is saved' },
} satisfies Record<string, AdPlacement>;

export type PlacementId = keyof typeof AD_PLACEMENTS;

/** Interstitial pacing: only every Nth save, and never twice within the gap. */
export const INTERSTITIAL_EVERY_N_SAVES = 3;
export const INTERSTITIAL_MIN_GAP_MS = 90_000;
/** Let the "Saved to gallery" toast show before the ad covers it. */
export const INTERSTITIAL_DELAY_MS = 1200;
/** Seconds before the interstitial can be closed. */
export const INTERSTITIAL_CLOSE_AFTER_S = 5;
