import { Skia, type SkImage } from '@shopify/react-native-skia';

import type { Rotation } from './crop';

const MAX_EDGE = 2400;

/**
 * Rotates and downscales a captured photo once, so live edits and export work
 * on a lighter raster image (export is capped at the same size anyway).
 */
export function prepareImage(image: SkImage, rotation: Rotation): SkImage {
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width(), image.height()));
  const w = Math.round(image.width() * scale);
  const h = Math.round(image.height() * scale);
  if (scale === 1 && rotation === 0) return image;

  const [outW, outH] = rotation % 180 === 0 ? [w, h] : [h, w];
  const surface = Skia.Surface.MakeOffscreen(outW, outH);
  if (!surface) return image;

  const canvas = surface.getCanvas();
  canvas.save();
  canvas.translate(outW / 2, outH / 2);
  canvas.rotate(rotation, 0, 0);
  canvas.drawImageRect(
    image,
    Skia.XYWHRect(0, 0, image.width(), image.height()),
    Skia.XYWHRect(-w / 2, -h / 2, w, h),
    Skia.Paint(),
  );
  canvas.restore();
  surface.flush();

  const snapshot = surface.makeImageSnapshot();
  // Raster copy so it can be drawn by any canvas, not just this surface's GPU context.
  return snapshot.makeNonTextureImage() ?? snapshot;
}
