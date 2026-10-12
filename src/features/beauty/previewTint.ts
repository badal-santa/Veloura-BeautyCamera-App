import type { EditState, FilterId } from './types';

const FILTER_TINT: Record<FilterId, string | null> = {
  natural: null,
  bloom: 'rgba(255, 120, 186, 0.14)',
  golden: 'rgba(255, 170, 80, 0.18)',
  cool: 'rgba(90, 150, 255, 0.16)',
  mono: 'rgba(128, 128, 128, 0.35)',
  film: 'rgba(255, 225, 190, 0.16)',
};

export type TintLayer = { color: string; blend?: 'saturation' | 'soft-light' };

/**
 * Lightweight live-preview approximation drawn as overlays on the camera feed.
 * The exact look is applied with Skia after capture.
 */
export function previewTints({ beauty, filter, exposure }: EditState): TintLayer[] {
  const layers: TintLayer[] = [];
  const lift = beauty.brighten * 0.0012 + Math.max(0, exposure) * 0.0022 + beauty.glow * 0.0008;
  if (lift > 0) layers.push({ color: `rgba(255, 255, 255, ${lift.toFixed(3)})` });
  if (exposure < 0) layers.push({ color: `rgba(0, 0, 0, ${(-exposure * 0.004).toFixed(3)})` });
  if (beauty.warmth > 0) layers.push({ color: `rgba(255, 150, 70, ${(beauty.warmth * 0.0012).toFixed(3)})` });
  if (beauty.skinTone > 0) layers.push({ color: `rgba(255, 120, 150, ${(beauty.skinTone * 0.0009).toFixed(3)})` });

  const tint = FILTER_TINT[filter];
  if (tint) layers.push({ color: tint, blend: filter === 'mono' ? 'saturation' : undefined });
  return layers;
}
