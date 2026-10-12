import { Text, View } from 'react-native';

import type { EditMode } from '../../features/beauty/types';
import PressableScale from '../PressableScale';

const LABELS: Record<EditMode, string> = {
  beauty: 'Beauty',
  makeup: 'Makeup',
  filters: 'Filters',
  adjust: 'Adjust',
  crop: 'Crop',
};

type Props = {
  modes: EditMode[];
  mode: EditMode;
  onChange: (mode: EditMode) => void;
};

export default function ModeSwitcher({ modes, mode, onChange }: Props) {
  return (
    <View className="mx-5 flex-row rounded-full border border-white/10 bg-white/5 p-1">
      {modes.map((m) => {
        const active = m === mode;
        return (
          <PressableScale
            key={m}
            onPress={() => onChange(m)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`flex-1 items-center rounded-full py-2 ${active ? 'bg-primary/20' : ''}`}
          >
            <Text className={`font-semibold text-[13px] ${active ? 'text-primary-light' : 'text-white/70'}`}>
              {LABELS[m]}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
