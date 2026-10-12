import type { MaterialCommunityIcons } from '@expo/vector-icons';

/** Rectangle in normalized image coordinates (0–1). */
export type NormRect = { x: number; y: number; width: number; height: number };

export const FULL_RECT: NormRect = { x: 0, y: 0, width: 1, height: 1 };

export type CropAspect = 'original' | '1:1' | '4:5' | '3:4' | '9:16' | '16:9';
export type Rotation = 0 | 90 | 180 | 270;

export const CROP_ASPECTS: {
  id: CropAspect;
  label: string;
  /** width / height; null keeps the full photo. */
  ratio: number | null;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { id: 'original', label: 'Original', ratio: null, icon: 'crop-free' },
  { id: '1:1', label: '1:1', ratio: 1, icon: 'crop-square' },
  { id: '4:5', label: '4:5', ratio: 4 / 5, icon: 'crop-portrait' },
  { id: '3:4', label: '3:4', ratio: 3 / 4, icon: 'crop-portrait' },
  { id: '9:16', label: '9:16', ratio: 9 / 16, icon: 'crop-portrait' },
  { id: '16:9', label: '16:9', ratio: 16 / 9, icon: 'crop-landscape' },
];

/** Largest centered rect with the aspect's ratio that fits the image. */
export function rectForAspect(aspect: CropAspect, imageWidth: number, imageHeight: number): NormRect {
  const ratio = CROP_ASPECTS.find((a) => a.id === aspect)?.ratio;
  if (!ratio) return FULL_RECT;
  const imageRatio = imageWidth / imageHeight;
  const width = ratio > imageRatio ? 1 : ratio / imageRatio;
  const height = ratio > imageRatio ? imageRatio / ratio : 1;
  return { x: (1 - width) / 2, y: (1 - height) / 2, width, height };
}

/** Moves a rect by a normalized delta, keeping it inside the image. */
export function moveRect(rect: NormRect, dx: number, dy: number): NormRect {
  return {
    ...rect,
    x: Math.min(1 - rect.width, Math.max(0, rect.x + dx)),
    y: Math.min(1 - rect.height, Math.max(0, rect.y + dy)),
  };
}

/** Fits a w×h box inside an area (contain), returning its placement. */
export function fitRect(width: number, height: number, areaWidth: number, areaHeight: number) {
  const scale = Math.min(areaWidth / width, areaHeight / height);
  const w = width * scale;
  const h = height * scale;
  return { x: (areaWidth - w) / 2, y: (areaHeight - h) / 2, width: w, height: h };
}
