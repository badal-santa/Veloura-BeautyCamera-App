import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BEAUTY_TOOLS, type BeautyKey, type BeautySettings } from '../../features/beauty/types';
import PressableScale from '../PressableScale';
import Slider from './Slider';

type Props = {
  beauty: BeautySettings;
  tool: BeautyKey;
  onToolChange: (tool: BeautyKey) => void;
  onChange: (key: BeautyKey, value: number) => void;
  onReset: (key: BeautyKey) => void;
  /** Called with true while BEFORE is held. */
  onBeforeChange?: (showOriginal: boolean) => void;
};

export default function BeautyPanel({ beauty, tool, onToolChange, onChange, onReset, onBeforeChange }: Props) {
  const label = BEAUTY_TOOLS.find((t) => t.key === tool)?.label ?? '';

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4">
        {BEAUTY_TOOLS.map((t) => {
          const active = t.key === tool;
          return (
            <PressableScale
              key={t.key}
              onPress={() => onToolChange(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className={`flex-row items-center rounded-full px-3.5 py-2 ${
                active ? 'bg-primary/20' : 'bg-white/5'
              }`}
            >
              <MaterialCommunityIcons
                name={t.icon}
                className={`text-base ${active ? 'text-primary-light' : 'text-white/60'}`}
              />
              <Text className={`ml-1.5 font-semibold text-[13px] ${active ? 'text-primary-light' : 'text-white/70'}`}>
                {t.label}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>

      {/* Extra left inset keeps the slider's 0 position out of Android's edge back-gesture. */}
      <View className="mt-2 flex-row items-center gap-2.5 pl-10 pr-5">
        <View className="flex-1">
          <Slider value={beauty[tool]} onChange={(v) => onChange(tool, v)} accessibilityLabel={label} />
        </View>
        <View className="w-10 items-center rounded-full bg-primary/25 py-1">
          <Text className="font-bold text-xs text-white">{beauty[tool]}</Text>
        </View>
        {onBeforeChange && (
          <Pressable
            onPressIn={() => onBeforeChange(true)}
            onPressOut={() => onBeforeChange(false)}
            accessibilityRole="button"
            accessibilityLabel="Hold to see original"
            className="rounded-full border border-white/20 px-3 py-1.5"
          >
            <Text className="font-bold text-[11px] text-white">BEFORE</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => onReset(tool)}
          accessibilityRole="button"
          accessibilityLabel={`Reset ${label}`}
          hitSlop={6}
        >
          <Text className="font-semibold text-xs text-white/60">Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
