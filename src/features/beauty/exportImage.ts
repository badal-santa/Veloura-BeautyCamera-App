import {
  BlendMode,
  BlurStyle,
  ImageFormat,
  Skia,
  TileMode,
  type SkImage,
  type SkPaint,
} from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';

import { buildColorMatrix } from './colorMatrix';
import { featherFor, skinPath, type DetectedFace } from './faces';
import { makeupPicture, type MakeupState } from './makeup';
import { FULL_RECT, type NormRect } from './crop';
import { beautyLayers } from './layers';
import type { EditState } from './types';

const MAX_EDGE = 2400;

/** Renders the edited, cropped photo off-screen and writes it to a JPEG in the cache. */
export function exportEditedImage(
  image: SkImage,
  edit: EditState,
  crop: NormRect = FULL_RECT,
  maxEdge = MAX_EDGE,
  /** When known, smoothing applies to skin only. */
  faces: DetectedFace[] = [],
  makeup?: MakeupState,
): string {
  const src = Skia.XYWHRect(
    crop.x * image.width(),
    crop.y * image.height(),
    crop.width * image.width(),
    crop.height * image.height(),
  );
  const ratio = Math.min(1, maxEdge / Math.max(src.width, src.height));
  const width = Math.round(src.width * ratio);
  const height = Math.round(src.height * ratio);

  const surface = Skia.Surface.MakeOffscreen(width, height);
  if (!surface) throw new Error('Could not create an off-screen surface');

  const canvas = surface.getCanvas();
  const dst = Skia.XYWHRect(0, 0, width, height);
  const colorFilter = Skia.ColorFilter.MakeMatrix(buildColorMatrix(edit));
  // Blur is relative to the full photo width so the look matches the preview.
  const layers = beautyLayers(edit.beauty, width / crop.width);

  const paintWith = (configure?: (p: SkPaint) => void) => {
    const paint = Skia.Paint();
    paint.setColorFilter(colorFilter);
    configure?.(paint);
    return paint;
  };

  canvas.drawImageRect(image, src, dst, paintWith());

  // Full image placed so the crop lands on the output.
  const frame = {
    x: -crop.x * (width / crop.width),
    y: -crop.y * (height / crop.height),
    width: width / crop.width,
    height: height / crop.height,
  };

  if (layers.smooth.opacity > 0) {
    const skin = faces.length ? skinPath(faces, frame) : null;
    const smoothPaint = paintWith((p) => {
      p.setImageFilter(Skia.ImageFilter.MakeBlur(layers.smooth.sigma, layers.smooth.sigma, TileMode.Clamp, null));
      p.setAlphaf(skin ? layers.smooth.skinOpacity : layers.smooth.opacity);
    });

    if (skin) {
      canvas.saveLayer(Skia.Paint(), null, null);
      canvas.drawImageRect(image, src, dst, smoothPaint);
      // Mask layer composited with DstIn across the whole layer: keeps the
      // smoothed pixels only where the (feathered) skin path is drawn.
      const maskLayer = Skia.Paint();
      maskLayer.setBlendMode(BlendMode.DstIn);
      canvas.saveLayer(maskLayer, null, null);
      const mask = Skia.Paint();
      mask.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, featherFor(faces, frame), true));
      canvas.drawPath(skin, mask);
      canvas.restore();
      canvas.restore();
    } else {
      canvas.drawImageRect(image, src, dst, smoothPaint);
    }
  }

  const makeupPic = makeup ? makeupPicture(faces, frame, makeup, { width, height }) : null;
  if (makeupPic) canvas.drawPicture(makeupPic);

  if (layers.glow.opacity > 0) {
    canvas.drawImageRect(
      image,
      src,
      dst,
      paintWith((p) => {
        p.setImageFilter(
          Skia.ImageFilter.MakeBlur(layers.glow.sigma, layers.glow.sigma, TileMode.Clamp, null),
        );
        p.setBlendMode(BlendMode.Screen);
        p.setAlphaf(layers.glow.opacity);
      }),
    );
  }

  surface.flush();
  const snapshot = surface.makeImageSnapshot();
  const output = snapshot.makeNonTextureImage() ?? snapshot;
  const bytes = output.encodeToBytes(ImageFormat.JPEG, 92);

  const file = new File(Paths.cache, `veloura-${Date.now()}.jpg`);
  file.create();
  file.write(bytes);
  return file.uri;
}
