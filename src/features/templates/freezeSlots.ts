import { ImageFormat, Skia } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import { useCallback, useRef, useState } from 'react';
import { PixelRatio } from 'react-native';

import type { NormRect } from '../beauty/crop';
import type { Rect } from './layout';

export type Pan = { x: number; y: number };

export type Slot = { uri: string; imageWidth: number; imageHeight: number; rect: Rect; zoom: number; pan: Pan };

/** Part of the image (normalized 0–1) visible in a cover-fitted, zoomed, panned slot. */
export function slotSource({ imageWidth: iw, imageHeight: ih, rect, zoom, pan }: Omit<Slot, 'uri'>): NormRect {
  const scale = Math.max(rect.width / iw, rect.height / ih) * zoom;
  const slackX = (iw * scale - rect.width) / 2;
  const slackY = (ih * scale - rect.height) / 2;
  const left = slackX - pan.x * slackX;
  const top = slackY - pan.y * slackY;
  return { x: left / scale / iw, y: top / scale / ih, width: rect.width / scale / iw, height: rect.height / scale / ih };
}

/** Renders just the visible part of a slot into its own image file. */
async function cropSlot(slot: Slot): Promise<string> {
  const data = await Skia.Data.fromURI(slot.uri);
  const image = Skia.Image.MakeImageFromEncoded(data);
  if (!image) throw new Error('Could not read photo');
  const src = slotSource(slot);
  const ratio = PixelRatio.get();
  const w = Math.max(1, Math.round(slot.rect.width * ratio));
  const h = Math.max(1, Math.round(slot.rect.height * ratio));
  const surface = Skia.Surface.MakeOffscreen(w, h);
  if (!surface) throw new Error('Could not create an off-screen surface');
  surface.getCanvas().drawImageRect(
    image,
    Skia.XYWHRect(src.x * image.width(), src.y * image.height(), src.width * image.width(), src.height * image.height()),
    Skia.XYWHRect(0, 0, w, h),
    Skia.Paint(),
  );
  surface.flush();
  const snap = surface.makeImageSnapshot();
  const file = new File(Paths.cache, `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`);
  file.create();
  file.write((snap.makeNonTextureImage() ?? snap).encodeToBytes(ImageFormat.JPEG, 95));
  return file.uri;
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

/**
 * View snapshots ignore clipping, so photo slots can't rely on overflow:hidden when
 * exporting. Before a snapshot, each slot is swapped for a pre-cropped image.
 */
export function useFrozenSlots() {
  const [frozen, setFrozen] = useState<string[] | null>(null);
  const pending = useRef({ count: 0, resolve: () => {} });

  const onFrozenLoad = useCallback(() => {
    pending.current.count -= 1;
    if (pending.current.count <= 0) pending.current.resolve();
  }, []);

  const withFrozen = useCallback(async <T,>(slots: Slot[], snapshot: () => Promise<T>): Promise<T> => {
    const uris = await Promise.all(slots.map(cropSlot));
    await new Promise<void>((resolve) => {
      pending.current = { count: uris.length, resolve };
      setFrozen(uris);
      setTimeout(resolve, 2500); // never hang if a load event is missed
    });
    await nextFrame();
    try {
      return await snapshot();
    } finally {
      setFrozen(null);
    }
  }, []);

  return { frozen, onFrozenLoad, withFrozen };
}
