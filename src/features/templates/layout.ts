import type { TemplateFrame } from '../../data/templates';

export type Rect = { x: number; y: number; width: number; height: number };

export type TemplateLayout = {
  /** Where the photo is drawn. */
  photo: Rect;
  /** Polaroid card behind the photo (polaroid frame only). */
  card?: Rect;
  /** Caption block. */
  text: Rect;
  textAlign: 'left' | 'center';
  /** Base sizes, scaled to the canvas width. */
  captionSize: number;
  kickerSize: number;
  radius: number;
};

/** Pixel layout of a template frame on a W×H canvas. */
export function templateLayout(frame: TemplateFrame, W: number, H: number): TemplateLayout {
  const tall = H / W > 1.5;
  const base = { captionSize: W * 0.085, kickerSize: W * 0.028, radius: W * 0.045 };

  switch (frame) {
    case 'full':
      return {
        ...base,
        photo: { x: 0, y: 0, width: W, height: H },
        text: { x: W * 0.07, y: H * 0.72, width: W * 0.86, height: H * 0.22 },
        textAlign: 'left',
        radius: 0,
      };

    case 'polaroid': {
      const cardW = W * (tall ? 0.8 : 0.68);
      const pad = cardW * 0.06;
      const photoSize = cardW - pad * 2;
      const strip = photoSize * 0.24;
      const cardH = pad + photoSize + strip;
      const card = { x: (W - cardW) / 2, y: (H - cardH) / 2, width: cardW, height: cardH };
      return {
        ...base,
        captionSize: W * 0.06,
        card,
        photo: { x: card.x + pad, y: card.y + pad, width: photoSize, height: photoSize },
        text: { x: card.x + pad, y: card.y + pad + photoSize, width: photoSize, height: strip },
        textAlign: 'center',
        radius: W * 0.01,
      };
    }

    case 'arch': {
      const photo = { x: W * 0.13, y: H * 0.09, width: W * 0.74, height: H * (tall ? 0.66 : 0.64) };
      return {
        ...base,
        photo,
        text: { x: W * 0.07, y: photo.y + photo.height, width: W * 0.86, height: H - photo.y - photo.height },
        textAlign: 'center',
        radius: photo.width / 2,
      };
    }

    case 'neon':
    case 'inset':
    default: {
      const top = H * (tall ? 0.09 : 0.07);
      const photo = { x: W * 0.07, y: top, width: W * 0.86, height: H * (tall ? 0.66 : 0.68) };
      return {
        ...base,
        photo,
        text: { x: W * 0.07, y: photo.y + photo.height, width: W * 0.86, height: H - photo.y - photo.height },
        textAlign: frame === 'neon' ? 'center' : 'left',
      };
    }
  }
}
