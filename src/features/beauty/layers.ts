import type { BeautySettings } from './types';

/**
 * Soft-focus layers used for Smooth and Glow. Blur sigma is expressed relative
 * to the rendered width so the look matches between preview and export.
 */
export function beautyLayers(beauty: BeautySettings, renderedWidth: number) {
  const unit = renderedWidth / 400;
  return {
    smooth: {
      opacity: (beauty.smooth / 100) * 0.55,
      // Skin-only smoothing can be stronger without blurring eyes and hair.
      skinOpacity: (beauty.smooth / 100) * 0.85,
      sigma: (2 + (beauty.smooth / 100) * 5) * unit,
    },
    glow: {
      opacity: (beauty.glow / 100) * 0.45,
      sigma: (6 + (beauty.glow / 100) * 10) * unit,
    },
  };
}
