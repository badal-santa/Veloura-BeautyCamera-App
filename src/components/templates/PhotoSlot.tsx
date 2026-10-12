import { useRef } from 'react';
import { Image, View } from 'react-native';

import type { Pan } from '../../features/templates/freezeSlots';
import type { Rect } from '../../features/templates/layout';

export type { Pan };

type Props = {
  uri: string;
  imageWidth: number;
  imageHeight: number;
  rect: Rect;
  /** 1 = cover; larger zooms in. */
  zoom: number;
  /** -1…1 per axis, 0 = centered. */
  pan: Pan;
  onPanChange?: (pan: Pan) => void;
  className?: string;
  /** Arch frames round only the top corners. */
  arch?: boolean;
  radius: number;
  /** Pre-cropped image used while exporting (see useFrozenSlots). */
  frozenUri?: string;
  onFrozenLoad?: () => void;
};

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/** Photo cover-fitted into a rect; drag to reposition. */
export default function PhotoSlot({
  uri,
  imageWidth,
  imageHeight,
  rect,
  zoom,
  pan,
  onPanChange,
  className,
  arch,
  radius,
  frozenUri,
  onFrozenLoad,
}: Props) {
  const drag = useRef({ x0: 0, y0: 0, pan });

  const scale = Math.max(rect.width / imageWidth, rect.height / imageHeight) * zoom;
  const w = imageWidth * scale;
  const h = imageHeight * scale;
  const slackX = (w - rect.width) / 2;
  const slackY = (h - rect.height) / 2;

  const corners = {
    borderRadius: arch ? undefined : radius,
    borderTopLeftRadius: arch ? radius : undefined,
    borderTopRightRadius: arch ? radius : undefined,
    borderBottomLeftRadius: arch ? radius * 0.12 : undefined,
    borderBottomRightRadius: arch ? radius * 0.12 : undefined,
  };

  // Export mode: the exact visible crop, no clipping needed.
  if (frozenUri) {
    return (
      <View
        className={`absolute ${className ?? ''}`}
        style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, ...corners }}
      >
        <Image source={{ uri: frozenUri }} onLoad={onFrozenLoad} fadeDuration={0} style={{ width: '100%', height: '100%', ...corners }} />
      </View>
    );
  }

  // Geometry is computed at runtime, so it's passed as inline style.
  return (
    <View
      className={`absolute overflow-hidden ${className ?? ''}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        ...corners,
      }}
      onStartShouldSetResponder={() => !!onPanChange}
      onMoveShouldSetResponder={() => !!onPanChange}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => {
        drag.current = { x0: e.nativeEvent.pageX, y0: e.nativeEvent.pageY, pan };
      }}
      onResponderMove={(e) => {
        const d = drag.current;
        onPanChange?.({
          x: slackX > 0 ? clamp(d.pan.x + (e.nativeEvent.pageX - d.x0) / slackX) : 0,
          y: slackY > 0 ? clamp(d.pan.y + (e.nativeEvent.pageY - d.y0) / slackY) : 0,
        });
      }}
    >
      <Image
        source={{ uri }}
        style={{
          position: 'absolute',
          width: w,
          height: h,
          left: -slackX + pan.x * slackX,
          top: -slackY + pan.y * slackY,
        }}
      />
    </View>
  );
}
