import {
  BlendMode,
  BlurStyle,
  PathOp,
  Skia,
  TileMode,
  type SkCanvas,
  type SkPath,
  type SkPicture,
} from '@shopify/react-native-skia';

import type { DetectedFace, ImageFrame } from './faces';

type Point = [number, number];

export type MakeupKey = 'lipstick' | 'blush' | 'eyeshadow';
export type MakeupLayer = { color: string; /** 0–100 */ amount: number };
export type MakeupState = Record<MakeupKey, MakeupLayer>;

export const MAKEUP_TOOLS: { key: MakeupKey; label: string; icon: 'lipstick' | 'blur-radial' | 'eye-outline' }[] = [
  { key: 'lipstick', label: 'Lipstick', icon: 'lipstick' },
  { key: 'blush', label: 'Blush', icon: 'blur-radial' },
  { key: 'eyeshadow', label: 'Eyeshadow', icon: 'eye-outline' },
];

export const MAKEUP_COLORS: Record<MakeupKey, string[]> = {
  lipstick: ['#C2185B', '#E0457B', '#B71C1C', '#D9777F', '#8E244D', '#F06292', '#A1453B'],
  blush: ['#F48FB1', '#FF8A80', '#F8A5C2', '#E57373', '#FFAB91', '#D98C8C'],
  eyeshadow: ['#8D6E63', '#B39DDB', '#F48FB1', '#CE93D8', '#FFB74D', '#90A4AE', '#6D4C41'],
};

export const NO_MAKEUP: MakeupState = {
  lipstick: { color: MAKEUP_COLORS.lipstick[0], amount: 0 },
  blush: { color: MAKEUP_COLORS.blush[0], amount: 0 },
  eyeshadow: { color: MAKEUP_COLORS.eyeshadow[0], amount: 0 },
};

export const hasMakeup = (m: MakeupState) => m.lipstick.amount + m.blush.amount + m.eyeshadow.amount > 0;

// ── Geometry ────────────────────────────────────────────────────────────────

const centroid = (pts: Point[]): Point => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
];

/** Orders contour points around their centre so they form a clean outline. */
const ordered = (pts: Point[]) => {
  const [cx, cy] = centroid(pts);
  return [...pts].sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
};

const scaleAround = (pts: Point[], factor: number, shiftY = 0): Point[] => {
  const [cx, cy] = centroid(pts);
  return pts.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor + shiftY]);
};

const toPath = (pts: Point[], f: ImageFrame) =>
  Skia.Path.Polygon(
    ordered(pts).map(([x, y]) => ({ x: f.x + x * f.width, y: f.y + y * f.height })),
    true,
  );

const span = (pts: Point[]) => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};

const minus = (a: SkPath, b: SkPath) => Skia.Path.MakeFromOp(a, b, PathOp.Difference) ?? a;

// ── Drawing ─────────────────────────────────────────────────────────────────

function fill(canvas: SkCanvas, path: SkPath, color: string, alpha: number, mode: BlendMode, feather: number) {
  const p = Skia.Paint();
  p.setColor(Skia.Color(color));
  p.setAlphaf(alpha);
  p.setBlendMode(mode);
  if (feather > 0) p.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, feather, true));
  canvas.drawPath(path, p);
}

function drawFace(canvas: SkCanvas, face: DetectedFace, f: ImageFrame, m: MakeupState) {
  const faceW = face.bounds.width * f.width;

  // Lipstick — lips minus the open-mouth area, tinted (hue) + deepened (multiply).
  if (m.lipstick.amount > 0 && face.lips.length >= 6) {
    let lips = toPath(face.lips, f);
    if (face.mouth?.length >= 6) lips = minus(lips, toPath(scaleAround(face.mouth, 0.92), f));
    const a = m.lipstick.amount / 100;
    const feather = Math.max(1, span(face.lips).h * f.height * 0.07);
    fill(canvas, lips, m.lipstick.color, a * 0.6, BlendMode.Color, feather);
    fill(canvas, lips, m.lipstick.color, a * 0.35, BlendMode.Multiply, feather);
  }

  // Eyeshadow — a lid-shaped band above each eye.
  if (m.eyeshadow.amount > 0) {
    const a = m.eyeshadow.amount / 100;
    for (const eye of [face.leftEye, face.rightEye]) {
      if (eye.length < 6) continue;
      const h = span(eye).h;
      const lid = minus(toPath(scaleAround(eye, 1.9, -h * 0.8), f), toPath(scaleAround(eye, 1.1), f));
      const feather = Math.max(1, h * f.height * 0.4);
      fill(canvas, lid, m.eyeshadow.color, a * 0.55, BlendMode.Color, feather);
      fill(canvas, lid, m.eyeshadow.color, a * 0.5, BlendMode.Multiply, feather);
    }
  }

  // Blush — soft radial glow on each cheek.
  if (m.blush.amount > 0 && face.leftEye.length && face.rightEye.length && face.lips.length) {
    const a = m.blush.amount / 100;
    const [ly] = centroid(face.lips).slice(1);
    for (const eye of [face.leftEye, face.rightEye]) {
      const [ex, ey] = centroid(eye);
      const [fx] = centroid(face.oval);
      // Slightly outward from the eye, between eye and mouth height.
      const cx = f.x + (ex + (ex - fx) * 0.25) * f.width;
      const cy = f.y + (ey + (ly - ey) * 0.55) * f.height;
      const r = faceW * 0.17;
      const p = Skia.Paint();
      p.setShader(
        Skia.Shader.MakeRadialGradient({ x: cx, y: cy }, r, [Skia.Color(m.blush.color), Skia.Color('transparent')], [0, 1], TileMode.Clamp),
      );
      p.setAlphaf(a * 0.5);
      p.setBlendMode(BlendMode.Multiply);
      canvas.drawCircle(cx, cy, r, p);
    }
  }
}

/** Makeup for all faces, recorded once and reusable by the preview and the export. */
export function makeupPicture(
  faces: DetectedFace[],
  frame: ImageFrame,
  makeup: MakeupState,
  bounds: { width: number; height: number },
): SkPicture | null {
  if (!faces.length || !hasMakeup(makeup)) return null;
  const recorder = Skia.PictureRecorder();
  const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, bounds.width, bounds.height));
  for (const face of faces) drawFace(canvas, face, frame, makeup);
  return recorder.finishRecordingAsPicture();
}
