import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import PressableScale from '../PressableScale';

export type TemplateTab = 'photo' | 'text' | 'filter';

const TABS: { id: TemplateTab; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: 'photo', label: 'Photo', icon: 'image-outline' },
  { id: 'text', label: 'Text', icon: 'format-text' },
  { id: 'filter', label: 'Filter', icon: 'palette-outline' },
];

export default function TemplateTabs({ tab, onChange }: { tab: TemplateTab; onChange: (t: TemplateTab) => void }) {
  return (
    <View className="mx-5 flex-row rounded-full border border-white/10 bg-white/5 p-1">
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <PressableScale
            key={t.id}
            onPress={() => onChange(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`flex-1 flex-row items-center justify-center rounded-full py-2 ${active ? 'bg-primary/20' : ''}`}
          >
            <MaterialCommunityIcons name={t.icon} className={`text-base ${active ? 'text-primary-light' : 'text-white/60'}`} />
            <Text className={`ml-1.5 font-semibold text-[13px] ${active ? 'text-primary-light' : 'text-white/70'}`}>
              {t.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
