import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CROP_ASPECTS, type CropAspect } from '../../features/beauty/crop';
import PressableScale from '../PressableScale';

type Props = {
  aspect: CropAspect;
  onAspectChange: (aspect: CropAspect) => void;
  onRotate: () => void;
  onReset: () => void;
};

export default function CropPanel({ aspect, onAspectChange, onRotate, onReset }: Props) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4">
        {CROP_ASPECTS.map((a) => {
          const active = a.id === aspect;
          return (
            <PressableScale
              key={a.id}
              onPress={() => onAspectChange(a.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Crop ${a.label}`}
              className={`items-center rounded-2xl px-3.5 py-2 ${active ? 'bg-primary/20' : 'bg-white/5'}`}
            >
              <MaterialCommunityIcons
                name={a.icon}
                className={`text-xl ${active ? 'text-primary-light' : 'text-white/60'}`}
              />
              <Text className={`mt-0.5 font-semibold text-[11px] ${active ? 'text-primary-light' : 'text-white/70'}`}>
                {a.label}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>

      <View className="mt-3 flex-row items-center justify-center gap-3">
        <PressableScale
          onPress={onRotate}
          accessibilityRole="button"
          accessibilityLabel="Rotate 90 degrees"
          className="flex-row items-center rounded-full border border-white/15 bg-white/5 px-4 py-2"
        >
          <MaterialCommunityIcons name="rotate-right" className="text-lg text-white" />
          <Text className="ml-1.5 font-semibold text-[13px] text-white">Rotate</Text>
        </PressableScale>
        <Pressable onPress={onReset} accessibilityRole="button" accessibilityLabel="Reset crop" hitSlop={6}>
          <Text className="font-semibold text-xs text-white/60">Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
