import { Text, View } from 'react-native';

import type { Watermark } from '../../features/decorate/types';

const CORNER_CLASS = {
  tl: 'left-0 top-0',
  tr: 'right-0 top-0',
  bl: 'bottom-0 left-0',
  br: 'bottom-0 right-0',
} as const;

/** Signature in a corner of the canvas. */
export default function WatermarkMark({ watermark, canvasWidth }: { watermark: Watermark; canvasWidth: number }) {
  if (!watermark.enabled || !watermark.text.trim()) return null;
  const size = canvasWidth * 0.04;
  return (
    <View pointerEvents="none" className={`absolute ${CORNER_CLASS[watermark.corner]}`} style={{ padding: canvasWidth * 0.035, opacity: watermark.opacity }}>
      <Text
        className="font-bold text-white"
        style={{ fontSize: size, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } }}
      >
        ✦ {watermark.text}
      </Text>
    </View>
  );
}
