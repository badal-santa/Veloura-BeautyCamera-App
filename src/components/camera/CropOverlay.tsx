import { useRef } from 'react';
import { View } from 'react-native';

import { moveRect, type NormRect } from '../../features/beauty/crop';

type Props = {
  /** Where the full photo is drawn inside the parent, in points. */
  frame: { x: number; y: number; width: number; height: number };
  crop: NormRect;
  onChange: (crop: NormRect) => void;
};

/** Dimmed surround + draggable crop frame with thirds grid. */
export default function CropOverlay({ frame, crop, onChange }: Props) {
  // Touch start position + crop at that moment; only touched inside event handlers.
  const drag = useRef({ x0: 0, y0: 0, rect: crop });

  const box = {
    left: frame.x + crop.x * frame.width,
    top: frame.y + crop.y * frame.height,
    width: crop.width * frame.width,
    height: crop.height * frame.height,
  };

  // Positions come from runtime layout, so they're inline styles.
  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View className="absolute bg-black/55" style={{ left: frame.x, top: frame.y, width: frame.width, height: box.top - frame.y }} />
      <View
        className="absolute bg-black/55"
        style={{ left: frame.x, top: box.top + box.height, width: frame.width, height: frame.y + frame.height - box.top - box.height }}
      />
      <View className="absolute bg-black/55" style={{ left: frame.x, top: box.top, width: box.left - frame.x, height: box.height }} />
      <View
        className="absolute bg-black/55"
        style={{ left: box.left + box.width, top: box.top, width: frame.x + frame.width - box.left - box.width, height: box.height }}
      />

      <View
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => {
          drag.current = { x0: e.nativeEvent.pageX, y0: e.nativeEvent.pageY, rect: crop };
        }}
        onResponderMove={(e) => {
          const d = drag.current;
          onChange(
            moveRect(d.rect, (e.nativeEvent.pageX - d.x0) / frame.width, (e.nativeEvent.pageY - d.y0) / frame.height),
          );
        }}
        accessibilityLabel="Crop frame, drag to reposition"
        className="absolute border border-white"
        style={box}
      >
        {/* Rule-of-thirds grid */}
        <View className="absolute bottom-0 left-1/3 top-0 w-px bg-white/40" />
        <View className="absolute bottom-0 left-2/3 top-0 w-px bg-white/40" />
        <View className="absolute left-0 right-0 top-1/3 h-px bg-white/40" />
        <View className="absolute left-0 right-0 top-2/3 h-px bg-white/40" />

        {/* Corner marks */}
        <View className="absolute -left-[3px] -top-[3px] h-5 w-5 border-l-[3px] border-t-[3px] border-white" />
        <View className="absolute -right-[3px] -top-[3px] h-5 w-5 border-r-[3px] border-t-[3px] border-white" />
        <View className="absolute -bottom-[3px] -left-[3px] h-5 w-5 border-b-[3px] border-l-[3px] border-white" />
        <View className="absolute -bottom-[3px] -right-[3px] h-5 w-5 border-b-[3px] border-r-[3px] border-white" />
      </View>
    </View>
  );
}
