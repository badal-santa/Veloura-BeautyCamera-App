import { PathOp, Skia, type SkPath } from '@shopify/react-native-skia';

import type { DetectedFace, Point } from '../../../modules/veloura-launcher';

export type { DetectedFace };

/** Where the full image is drawn: normalized (0–1) → pixels. */
export type ImageFrame = { x: number; y: number; width: number; height: number };

/** Grows a contour around its centre (so feathering doesn't soften the feature itself). */
const grow = (points: Point[], factor: number): Point[] => {
  const cx = points.reduce((a, p) => a + p[0], 0) / points.length;
  const cy = points.reduce((a, p) => a + p[1], 0) / points.length;
  return points.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor]);
};

const poly = (points: Point[], f: ImageFrame) =>
  Skia.Path.Polygon(
    points.map(([x, y]) => ({ x: f.x + x * f.width, y: f.y + y * f.height })),
    true,
  );

/**
 * Skin area: each face outline minus eyes, brows and lips, so smoothing keeps
 * those details sharp.
 */
export function skinPath(faces: DetectedFace[], frame: ImageFrame): SkPath | null {
  let skin: SkPath | null = null;
  for (const face of faces) {
    if (face.oval.length < 3) continue;
    let area: SkPath | null = poly(face.oval, frame);
    const holes: [Point[], number][] = [
      [face.leftEye, 1.9],
      [face.rightEye, 1.9],
      [face.leftBrow, 1.35],
      [face.rightBrow, 1.35],
      [face.lips, 1.25],
    ];
    for (const [hole, factor] of holes) {
      if (hole.length < 3 || !area) continue;
      area = Skia.Path.MakeFromOp(area, poly(grow(hole, factor), frame), PathOp.Difference);
    }
    if (!area) continue;
    skin = skin ? Skia.Path.MakeFromOp(skin, area, PathOp.Union) : area;
  }
  return skin;
}

/** Edge softness for the skin mask, relative to face size. */
export const featherFor = (faces: DetectedFace[], frame: ImageFrame) => {
  const w = Math.max(...faces.map((f) => f.bounds.width), 0.1) * frame.width;
  return Math.max(2, w * 0.025);
};
