import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import PressableScale from '../PressableScale';

export type RailItem<T extends string> = { id: T; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap };

/** Row of big icon tiles used to switch settings sections. */
export default function SectionRail<T extends string>({
  items,
  value,
  onChange,
}: {
  items: RailItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <View className="mx-5 flex-row gap-2.5">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <PressableScale
            key={item.id}
            onPress={() => onChange(item.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`flex-1 items-center overflow-hidden rounded-[22px] border py-3.5 ${
              active ? 'border-primary-light/50' : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            {active && (
              <LinearGradient
                colors={['rgba(255, 79, 163, 0.35)', 'rgba(168, 85, 247, 0.25)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
              />
            )}
            <MaterialCommunityIcons name={item.icon} className={`text-[24px] ${active ? 'text-white' : 'text-white/50'}`} />
            <Text className={`mt-1.5 font-semibold text-xs ${active ? 'text-white' : 'text-white/60'}`}>{item.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
