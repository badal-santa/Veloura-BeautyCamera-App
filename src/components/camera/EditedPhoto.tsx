import {
  Blur,
  BlurMask,
  Canvas,
  ColorMatrix,
  Group,
  Image as SkiaImage,
  Mask,
  Path,
  Picture,
  type SkImage,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { buildColorMatrix } from '../../features/beauty/colorMatrix';
import { FULL_RECT, fitRect, type NormRect } from '../../features/beauty/crop';
import { featherFor, skinPath, type DetectedFace } from '../../features/beauty/faces';
import { beautyLayers } from '../../features/beauty/layers';
import { makeupPicture, type MakeupState } from '../../features/beauty/makeup';
import type { EditState } from '../../features/beauty/types';

type Props = {
  image: SkImage;
  edit: EditState;
  width: number;
  height: number;
  /** Portion of the photo to show (normalized). */
  crop?: NormRect;
  /** Show the untouched photo (BEFORE). */
  original?: boolean;
  /** When known, smoothing applies to skin only. */
  faces?: DetectedFace[];
  makeup?: MakeupState;
};

/** Live Skia render of a photo with beauty + filter edits and crop, fitted inside width×height. */
export default function EditedPhoto({ image, edit, width, height, crop = FULL_RECT, original, faces = [], makeup }: Props) {
  const matrix = useMemo(() => buildColorMatrix(edit), [edit]);

  const imgW = image.width();
  const imgH = image.height();
  const view = fitRect(crop.width * imgW, crop.height * imgH, width, height);

  // Draw the whole photo scaled so the crop region lands on `view`, then clip to it.
  const scale = view.width / (crop.width * imgW);
  const rect = {
    x: view.x - crop.x * imgW * scale,
    y: view.y - crop.y * imgH * scale,
    width: imgW * scale,
    height: imgH * scale,
    fit: 'fill' as const,
  };
  const layers = beautyLayers(edit.beauty, rect.width);

  const skin = useMemo(
    () => (faces.length ? skinPath(faces, rect) : null),
    // rect values fully determine the path
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [faces, rect.x, rect.y, rect.width, rect.height],
  );

  const makeupPic = useMemo(
    () => (makeup ? makeupPicture(faces, rect, makeup, { width, height }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [faces, makeup, rect.x, rect.y, rect.width, rect.height, width, height],
  );

  const smoothLayer = (
    <SkiaImage image={image} {...rect} opacity={skin ? layers.smooth.skinOpacity : layers.smooth.opacity}>
      <Blur blur={layers.smooth.sigma} mode="clamp" />
      <ColorMatrix matrix={matrix} />
    </SkiaImage>
  );

  return (
    // Size comes from runtime layout, so it can't be a static class.
    <Canvas style={{ width, height }}>
      <Group clip={view}>
        <SkiaImage image={image} {...rect}>
          {!original && <ColorMatrix matrix={matrix} />}
        </SkiaImage>
        {!original &&
          layers.smooth.opacity > 0 &&
          (skin ? (
            <Mask
              mode="alpha"
              mask={
                <Path path={skin} color="white">
                  <BlurMask blur={featherFor(faces, rect)} style="normal" />
                </Path>
              }
            >
              {smoothLayer}
            </Mask>
          ) : (
            smoothLayer
          ))}
        {!original && makeupPic && <Picture picture={makeupPic} />}
        {!original && layers.glow.opacity > 0 && (
          <SkiaImage image={image} {...rect} opacity={layers.glow.opacity} blendMode="screen">
            <Blur blur={layers.glow.sigma} mode="clamp" />
            <ColorMatrix matrix={matrix} />
          </SkiaImage>
        )}
      </Group>
    </Canvas>
  );
}
