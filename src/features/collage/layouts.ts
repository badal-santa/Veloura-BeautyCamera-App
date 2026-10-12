import type { Rect } from '../templates/layout';

export type CollageLayout = { id: string; cells: Rect[] };

const r = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });

/** Cell rects normalized to 0–1, by photo count. */
export const LAYOUTS: Record<number, CollageLayout[]> = {
  1: [{ id: '1-full', cells: [r(0, 0, 1, 1)] }],
  2: [
    { id: '2-cols', cells: [r(0, 0, 0.5, 1), r(0.5, 0, 0.5, 1)] },
    { id: '2-rows', cells: [r(0, 0, 1, 0.5), r(0, 0.5, 1, 0.5)] },
    { id: '2-wide', cells: [r(0, 0, 0.62, 1), r(0.62, 0, 0.38, 1)] },
    { id: '2-tall', cells: [r(0, 0, 1, 0.64), r(0, 0.64, 1, 0.36)] },
  ],
  3: [
    { id: '3-left', cells: [r(0, 0, 0.6, 1), r(0.6, 0, 0.4, 0.5), r(0.6, 0.5, 0.4, 0.5)] },
    { id: '3-top', cells: [r(0, 0, 1, 0.58), r(0, 0.58, 0.5, 0.42), r(0.5, 0.58, 0.5, 0.42)] },
    { id: '3-cols', cells: [r(0, 0, 1 / 3, 1), r(1 / 3, 0, 1 / 3, 1), r(2 / 3, 0, 1 / 3, 1)] },
    { id: '3-rows', cells: [r(0, 0, 1, 1 / 3), r(0, 1 / 3, 1, 1 / 3), r(0, 2 / 3, 1, 1 / 3)] },
  ],
  4: [
    { id: '4-grid', cells: [r(0, 0, 0.5, 0.5), r(0.5, 0, 0.5, 0.5), r(0, 0.5, 0.5, 0.5), r(0.5, 0.5, 0.5, 0.5)] },
    { id: '4-hero', cells: [r(0, 0, 1, 0.62), r(0, 0.62, 1 / 3, 0.38), r(1 / 3, 0.62, 1 / 3, 0.38), r(2 / 3, 0.62, 1 / 3, 0.38)] },
    { id: '4-side', cells: [r(0, 0, 0.64, 1), r(0.64, 0, 0.36, 1 / 3), r(0.64, 1 / 3, 0.36, 1 / 3), r(0.64, 2 / 3, 0.36, 1 / 3)] },
    { id: '4-mosaic', cells: [r(0, 0, 0.58, 0.55), r(0.58, 0, 0.42, 0.55), r(0, 0.55, 0.42, 0.45), r(0.42, 0.55, 0.58, 0.45)] },
  ],
};

export const COLLAGE_RATIOS = { '1:1': 1, '4:5': 5 / 4, '9:16': 16 / 9 } as const;
export type CollageRatio = keyof typeof COLLAGE_RATIOS;

export const BACKGROUNDS = ['#FFFFFF', '#08070C', '#FFE4EF', '#EDE4FF', '#FFF4E6', '#FF4FA3', '#A855F7', '#1E293B'];

/** Pixel rect of a cell with even gaps between cells and around the edge. */
export function cellRect(cell: Rect, W: number, H: number, gap: number): Rect {
  const half = gap / 2;
  const x = half + cell.x * (W - gap);
  const y = half + cell.y * (H - gap);
  return { x: x + half, y: y + half, width: cell.width * (W - gap) - gap, height: cell.height * (H - gap) - gap };
}
