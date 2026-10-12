import { Text, View } from 'react-native';

import { QUICK_FRAMES } from '../../data/editor';
import type { PresetId } from '../../features/media/presets';
import PressableScale from '../PressableScale';

/** Buttons drawn as their actual aspect-ratio shape. */
export default function RatioShapes({ onPress }: { onPress: (preset: PresetId) => void }) {
  return (
    <View className="mx-5 flex-row gap-3">
      {QUICK_FRAMES.map((f) => (
        <PressableScale
          key={f.ratio}
          onPress={() => onPress(f.preset)}
          accessibilityRole="button"
          accessibilityLabel={`${f.label} crop ${f.ratio}`}
          className="h-[118px] flex-1 items-center justify-end rounded-[24px] border border-white/10 bg-white/[0.04] pb-3"
        >
          <View className="flex-1 items-center justify-center">
            <View className={`rounded-lg border-2 border-primary-light bg-primary/15 ${f.shapeClass}`} />
          </View>
          <Text className="font-bold text-[13px] text-white">{f.label}</Text>
          <Text className="font-medium text-[11px] text-white/50">{f.ratio}</Text>
        </PressableScale>
      ))}
    </View>
  );
}
