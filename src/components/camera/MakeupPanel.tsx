import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { MAKEUP_COLORS, MAKEUP_TOOLS, type MakeupKey, type MakeupState } from '../../features/beauty/makeup';
import PressableScale from '../PressableScale';
import Slider from './Slider';

type Props = {
  makeup: MakeupState;
  tool: MakeupKey;
  onToolChange: (tool: MakeupKey) => void;
  onChange: (key: MakeupKey, patch: Partial<MakeupState[MakeupKey]>) => void;
  /** No face found → makeup can't be placed. */
  hasFace: boolean;
};

export default function MakeupPanel({ makeup, tool, onToolChange, onChange, hasFace }: Props) {
  if (!hasFace) {
    return (
      <View className="mx-5 flex-row items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
        <MaterialCommunityIcons name="face-recognition" className="text-xl text-white/50" />
        <Text className="ml-3 flex-1 font-medium text-[13px] leading-[18px] text-white/60">
          Makeup needs a clear, front-facing face. None was found in this photo.
        </Text>
      </View>
    );
  }

  const layer = makeup[tool];
  const label = MAKEUP_TOOLS.find((t) => t.key === tool)?.label ?? '';

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="items-center gap-2 px-4">
        {MAKEUP_TOOLS.map((t) => {
          const active = t.key === tool;
          const on = makeup[t.key].amount > 0;
          return (
            <PressableScale
              key={t.key}
              onPress={() => onToolChange(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className={`flex-row items-center rounded-full px-3.5 py-2 ${active ? 'bg-primary/20' : 'bg-white/5'}`}
            >
              <MaterialCommunityIcons name={t.icon} className={`text-base ${active ? 'text-primary-light' : 'text-white/60'}`} />
              <Text className={`ml-1.5 font-semibold text-[13px] ${active ? 'text-primary-light' : 'text-white/70'}`}>{t.label}</Text>
              {on && <View className="ml-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: makeup[t.key].color }} />}
            </PressableScale>
          );
        })}
        <View className="ml-1 h-6 w-px bg-white/10" />
        {MAKEUP_COLORS[tool].map((c) => (
          <Pressable
            key={c}
            onPress={() => onChange(tool, { color: c, amount: layer.amount || 50 })}
            accessibilityRole="radio"
            accessibilityState={{ selected: c === layer.color }}
            accessibilityLabel={`${label} color ${c}`}
            className={`h-7 w-7 rounded-full border-2 ${c === layer.color ? 'border-white' : 'border-white/15'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </ScrollView>

      {/* Extra left inset keeps the slider's 0 position out of Android's edge back-gesture. */}
      <View className="mt-2 flex-row items-center gap-2.5 pl-10 pr-5">
        <View className="flex-1">
          <Slider value={layer.amount} onChange={(v) => onChange(tool, { amount: v })} accessibilityLabel={`${label} intensity`} />
        </View>
        <View className="w-10 items-center rounded-full bg-primary/25 py-1">
          <Text className="font-bold text-xs text-white">{layer.amount}</Text>
        </View>
        <Pressable onPress={() => onChange(tool, { amount: 0 })} accessibilityRole="button" accessibilityLabel={`Remove ${label}`} hitSlop={6}>
          <Text className="font-semibold text-xs text-white/60">Off</Text>
        </Pressable>
      </View>
    </View>
  );
}
