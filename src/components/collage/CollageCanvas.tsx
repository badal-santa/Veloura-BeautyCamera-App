import { forwardRef } from 'react';
import { View } from 'react-native';

import { cellRect, type CollageLayout } from '../../features/collage/layouts';
import type { PickedImage } from '../../features/media/pickPhotos';
import PhotoSlot, { type Pan } from '../templates/PhotoSlot';

type Props = {
  width: number;
  height: number;
  layout: CollageLayout;
  photos: PickedImage[];
  pans: Pan[];
  onPanChange?: (index: number, pan: Pan) => void;
  gap: number;
  radius: number;
  background: string;
  /** Pre-cropped images per cell while exporting. */
  frozen?: string[] | null;
  onFrozenLoad?: () => void;
};

/** Collage built from plain views so it can be snapshotted for export. */
const CollageCanvas = forwardRef<View, Props>(function CollageCanvas(
  { width, height, layout, photos, pans, onPanChange, gap, radius, background, frozen, onFrozenLoad },
  ref,
) {
  return (
    // Size and colors are runtime values, so they're inline styles.
    <View ref={ref} collapsable={false} style={{ width, height, backgroundColor: background }}>
      {layout.cells.map((cell, i) => {
        const photo = photos[i];
        const rect = cellRect(cell, width, height, gap);
        return photo ? (
          <PhotoSlot
            key={i}
            uri={photo.uri}
            imageWidth={photo.width}
            imageHeight={photo.height}
            rect={rect}
            zoom={1}
            pan={pans[i] ?? { x: 0, y: 0 }}
            onPanChange={onPanChange ? (p) => onPanChange(i, p) : undefined}
            radius={radius}
            frozenUri={frozen?.[i]}
            onFrozenLoad={onFrozenLoad}
          />
        ) : (
          <View
            key={i}
            className="absolute bg-black/10"
            style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, borderRadius: radius }}
          />
        );
      })}
    </View>
  );
});

export default CollageCanvas;
