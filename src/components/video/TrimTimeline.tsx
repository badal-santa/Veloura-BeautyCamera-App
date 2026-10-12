import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Image, View, type LayoutChangeEvent } from 'react-native';

type Props = {
  thumbnails: string[];
  durationMs: number;
  startMs: number;
  endMs: number;
  /** Current playback position, for the playhead. */
  positionMs: number;
  minLengthMs?: number;
  onChange: (startMs: number, endMs: number) => void;
  /** Called when a handle drag ends (e.g. to seek the preview). */
  onCommit?: (which: 'start' | 'end') => void;
};

// Handles sit inside the selection, and the strip is inset from the screen edges,
// so dragging never collides with Android's edge back-gesture.
const HANDLE = 22;

/** Film-strip with draggable start/end handles over the selected range. */
export default function TrimTimeline({
  thumbnails,
  durationMs,
  startMs,
  endMs,
  positionMs,
  minLengthMs = 1000,
  onChange,
  onCommit,
}: Props) {
  const [width, setWidth] = useState(0);
  const drag = useRef({ which: 'start' as 'start' | 'end', x0: 0, value0: 0 });

  // Never let the two handles overlap.
  const minMs = Math.max(minLengthMs, width > 0 ? ((HANDLE * 2 + 6) / width) * durationMs : 0);
  const toX = (ms: number) => (durationMs > 0 ? (ms / durationMs) * width : 0);
  const toMs = (dx: number) => (width > 0 ? (dx / width) * durationMs : 0);

  const responder = (which: 'start' | 'end') => ({
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: { nativeEvent: { pageX: number } }) => {
      drag.current = { which, x0: e.nativeEvent.pageX, value0: which === 'start' ? startMs : endMs };
    },
    onResponderMove: (e: { nativeEvent: { pageX: number } }) => {
      const d = drag.current;
      const next = d.value0 + toMs(e.nativeEvent.pageX - d.x0);
      if (d.which === 'start') onChange(Math.max(0, Math.min(next, endMs - minMs)), endMs);
      else onChange(startMs, Math.min(durationMs, Math.max(next, startMs + minMs)));
    },
    onResponderRelease: () => onCommit?.(drag.current.which),
  });

  const left = toX(startMs);
  const right = toX(endMs);
  const playhead = toX(Math.min(Math.max(positionMs, startMs), endMs));

  // Geometry depends on runtime layout, so positions are inline styles.
  return (
    <View className="mx-9 h-[64px] justify-center" onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      <View className="h-[54px] flex-row overflow-hidden rounded-xl bg-white/5">
        {thumbnails.map((uri) => (
          <Image key={uri} source={{ uri }} className="h-full flex-1" resizeMode="cover" />
        ))}
      </View>

      {width > 0 && (
        <>
          {/* Dim outside the selection */}
          <View className="absolute bottom-[5px] top-[5px] rounded-l-xl bg-black/65" style={{ left: 0, width: left }} />
          <View className="absolute bottom-[5px] top-[5px] rounded-r-xl bg-black/65" style={{ left: right, right: 0 }} />

          {/* Selection frame */}
          <View
            pointerEvents="none"
            className="absolute bottom-[3px] top-[3px] rounded-lg border-y-[3px] border-primary"
            style={{ left, width: Math.max(0, right - left) }}
          />

          {/* Playhead */}
          <View pointerEvents="none" className="absolute bottom-0 top-0 w-[3px] rounded-full bg-white" style={{ left: playhead - 1.5 }} />

          {(['start', 'end'] as const).map((which) => (
            <View
              key={which}
              {...responder(which)}
              hitSlop={{ left: 14, right: 14, top: 10, bottom: 10 }}
              accessibilityRole="adjustable"
              accessibilityLabel={which === 'start' ? 'Trim start' : 'Trim end'}
              className={`absolute bottom-[3px] top-[3px] items-center justify-center bg-primary ${
                which === 'start' ? 'rounded-l-lg' : 'rounded-r-lg'
              }`}
              style={{ width: HANDLE, left: which === 'start' ? left : right - HANDLE }}
            >
              <MaterialCommunityIcons
                name={which === 'start' ? 'chevron-left' : 'chevron-right'}
                className="text-lg text-white"
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}
