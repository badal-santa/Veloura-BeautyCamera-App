import { Pressable, Text, View } from 'react-native';

import Slider from './Slider';

type Props = {
  exposure: number;
  onChange: (value: number) => void;
};

export default function AdjustPanel({ exposure, onChange }: Props) {
  return (
    <View className="flex-row items-center gap-3 px-5 py-3">
      <Text className="font-semibold text-[13px] text-white">Exposure</Text>
      <View className="flex-1">
        <Slider value={exposure} onChange={onChange} min={-100} max={100} bipolar accessibilityLabel="Exposure" />
      </View>
      <View className="w-11 items-center rounded-full bg-primary/25 py-1">
        <Text className="font-bold text-xs text-white">{exposure > 0 ? `+${exposure}` : exposure}</Text>
      </View>
      <Pressable onPress={() => onChange(0)} accessibilityRole="button" accessibilityLabel="Reset exposure" hitSlop={6}>
        <Text className="font-semibold text-xs text-white/60">Reset</Text>
      </Pressable>
    </View>
  );
}
