import { ImageFormat, Skia, TileMode, type SkCanvas, type SkImage } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';

export type Backdrop =
  | { kind: 'transparent' }
  | { kind: 'color'; color: string }
  | { kind: 'gradient'; colors: [string, string] }
  | { kind: 'blur' }
  | { kind: 'photo'; image: SkImage };

export const BACKDROP_COLORS = ['#FFFFFF', '#08070C', '#FFE4EF', '#E9D5FF', '#BAE6FD', '#FDE68A', '#FF4FA3', '#22C55E'];
export const BACKDROP_GRADIENTS: [string, string][] = [
  ['#FF8FD1', '#A855F7'],
  ['#FDBA74', '#FB7185'],
  ['#67E8F9', '#6366F1'],
  ['#A7F3D0', '#3B82F6'],
  ['#FDE68A', '#F472B6'],
  ['#1E1B4B', '#7C3AED'],
];

/** Draws the image at w×h with "cover" fit. */
function drawCover(canvas: SkCanvas, image: SkImage, w: number, h: number, paint = Skia.Paint()) {
  const s = Math.max(w / image.width(), h / image.height());
  const sw = w / s;
  const sh = h / s;
  const src = Skia.XYWHRect((image.width() - sw) / 2, (image.height() - sh) / 2, sw, sh);
  canvas.drawImageRect(image, src, Skia.XYWHRect(0, 0, w, h), paint);
}

/** Backdrop + cut-out subject into a w×h canvas (preview and export share this). */
export function compose(
  canvas: SkCanvas,
  w: number,
  h: number,
  cutout: SkImage,
  original: SkImage,
  backdrop: Backdrop,
) {
  const full = Skia.XYWHRect(0, 0, w, h);
  if (backdrop.kind === 'color') {
    const p = Skia.Paint();
    p.setColor(Skia.Color(backdrop.color));
    canvas.drawRect(full, p);
  } else if (backdrop.kind === 'gradient') {
    const p = Skia.Paint();
    p.setShader(
      Skia.Shader.MakeLinearGradient({ x: 0, y: 0 }, { x: w, y: h }, backdrop.colors.map((c) => Skia.Color(c)), null, TileMode.Clamp),
    );
    canvas.drawRect(full, p);
  } else if (backdrop.kind === 'blur') {
    const p = Skia.Paint();
    const sigma = w * 0.03;
    p.setImageFilter(Skia.ImageFilter.MakeBlur(sigma, sigma, TileMode.Clamp, null));
    drawCover(canvas, original, w, h, p);
  } else if (backdrop.kind === 'photo') {
    drawCover(canvas, backdrop.image, w, h);
  }
  canvas.drawImageRect(cutout, Skia.XYWHRect(0, 0, cutout.width(), cutout.height()), full, Skia.Paint());
}

/** Renders the final image at the cut-out's resolution. PNG when transparent, else JPEG. */
export function exportComposite(cutout: SkImage, original: SkImage, backdrop: Backdrop): { uri: string; png: boolean } {
  const w = cutout.width();
  const h = cutout.height();
  const surface = Skia.Surface.MakeOffscreen(w, h);
  if (!surface) throw new Error('Could not create an off-screen surface');
  compose(surface.getCanvas(), w, h, cutout, original, backdrop);
  surface.flush();
  const snap = surface.makeImageSnapshot();
  const img = snap.makeNonTextureImage() ?? snap;
  const png = backdrop.kind === 'transparent';
  const file = new File(Paths.cache, `veloura-cutout-${Date.now()}.${png ? 'png' : 'jpg'}`);
  file.create();
  file.write(png ? img.encodeToBytes(ImageFormat.PNG, 100) : img.encodeToBytes(ImageFormat.JPEG, 92));
  return { uri: file.uri, png };
}
