import type { EditState, FilterId } from './types';

/** 4×5 row-major color matrix; offsets (5th column) are normalized 0–1. */
export type ColorMatrix = number[];

const IDENTITY: ColorMatrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

/** Compose so that `b` is applied first, then `a`. */
function multiply(a: ColorMatrix, b: ColorMatrix): ColorMatrix {
  const out = new Array<number>(20).fill(0);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      let v = c === 4 ? a[r * 5 + 4] : 0;
      for (let k = 0; k < 4; k++) v += a[r * 5 + k] * b[k * 5 + c];
      out[r * 5 + c] = v;
    }
  }
  return out;
}

const compose = (...ms: ColorMatrix[]) => ms.reduce((acc, m) => multiply(m, acc), IDENTITY);

const scale = (r: number, g: number, b: number): ColorMatrix => [
  r, 0, 0, 0, 0,
  0, g, 0, 0, 0,
  0, 0, b, 0, 0,
  0, 0, 0, 1, 0,
];

const offset = (r: number, g: number, b: number): ColorMatrix => [
  1, 0, 0, 0, r,
  0, 1, 0, 0, g,
  0, 0, 1, 0, b,
  0, 0, 0, 1, 0,
];

const contrast = (c: number): ColorMatrix => {
  const t = (1 - c) / 2;
  return [c, 0, 0, 0, t, 0, c, 0, 0, t, 0, 0, c, 0, t, 0, 0, 0, 1, 0];
};

const saturation = (s: number): ColorMatrix => {
  const [lr, lg, lb] = [0.2126, 0.7152, 0.0722];
  const sr = (1 - s) * lr;
  const sg = (1 - s) * lg;
  const sb = (1 - s) * lb;
  return [
    sr + s, sg, sb, 0, 0,
    sr, sg + s, sb, 0, 0,
    sr, sg, sb + s, 0, 0,
    0, 0, 0, 1, 0,
  ];
};

const FILTER_MATRICES: Record<FilterId, ColorMatrix> = {
  natural: IDENTITY,
  bloom: compose(saturation(1.08), scale(1.04, 0.98, 1.02), offset(0.04, 0.01, 0.03)),
  golden: compose(saturation(1.1), scale(1.08, 1.0, 0.86), offset(0.03, 0.015, 0)),
  cool: compose(saturation(0.95), scale(0.93, 1.0, 1.1), offset(0, 0.01, 0.03)),
  mono: compose(saturation(0), contrast(1.12)),
  film: compose(saturation(0.82), contrast(0.86), scale(1.04, 1.0, 0.94), offset(0.03, 0.025, 0.01)),
};

/** Builds the full color transform for a set of edits (glow/smooth are handled as layers). */
export function buildColorMatrix({ beauty, filter, exposure }: EditState): ColorMatrix {
  const gain = Math.pow(2, exposure / 100);
  const b = beauty.brighten / 100;
  const w = beauty.warmth / 100;
  const t = beauty.skinTone / 100;

  return compose(
    scale(gain, gain, gain),
    contrast(1 - b * 0.08),
    offset(b * 0.09, b * 0.09, b * 0.09),
    scale(1 + w * 0.08, 1 + w * 0.02, 1 - w * 0.1),
    saturation(1 + t * 0.08),
    offset(t * 0.035, t * 0.008, t * 0.012),
    FILTER_MATRICES[filter],
  );
}

export const filterMatrix = (filter: FilterId) => FILTER_MATRICES[filter];
