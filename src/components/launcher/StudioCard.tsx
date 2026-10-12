import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import { ACCENTS, useSettings } from '../../features/settings/settings';
import PressableScale from '../PressableScale';

export type StudioAction = 'camera' | 'editor' | 'templates' | 'studio';

const ACTIONS: { id: Exclude<StudioAction, 'camera'>; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; iconClass: string }[] = [
  { id: 'editor', label: 'Editor', icon: 'image-edit-outline', iconClass: 'text-secondary-light' },
  { id: 'templates', label: 'Templates', icon: 'view-grid-outline', iconClass: 'text-ai-blue' },
  { id: 'studio', label: 'Studio', icon: 'creation', iconClass: 'text-accent' },
];

type Props = {
  onAction: (action: StudioAction) => void;
};

/** Glass "Veloura Studio" card — the app's own widget on the Home screen. */
export default function StudioCard({ onAction }: Props) {
  const accent = ACCENTS[useSettings().accent];
  return (
    <View className="mx-5 overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-4">
      <LinearGradient
        colors={['rgba(255, 79, 163, 0.25)', 'rgba(168, 85, 247, 0.12)', 'rgba(8, 7, 12, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <View className="flex-row items-center">
        <Image source={require('../../../assets/images/logo.png')} className="h-9 w-9 rounded-[11px]" />
        <View className="ml-2.5 flex-1">
          <Text className="font-bold text-[15px] text-white">Veloura Studio</Text>
          <Text className="font-regular text-[11px] text-white/60">Create your glow</Text>
        </View>
        <PressableScale
          onPress={() => onAction('studio')}
          accessibilityRole="button"
          accessibilityLabel="Open Veloura"
          className="flex-row items-center rounded-full bg-white/10 px-3 py-1.5"
        >
          <Text className="font-semibold text-xs text-white">Open</Text>
          <MaterialCommunityIcons name="chevron-right" className="text-base text-white" />
        </PressableScale>
      </View>

      <View className="mt-4 flex-row">
        <PressableScale
          onPress={() => onAction('camera')}
          accessibilityRole="button"
          accessibilityLabel="Beauty camera"
          className="flex-1 items-center"
        >
          <LinearGradient
            colors={accent.colors}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            className="h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full border border-white/25"
          >
            <View className="absolute inset-x-[5px] top-[2px] h-1/2 rounded-full bg-white/25" />
            <MaterialCommunityIcons name="camera" className="text-[26px] text-white" />
          </LinearGradient>
          <Text className="mt-1.5 font-semibold text-[11px] text-white">Camera</Text>
        </PressableScale>

        {ACTIONS.map((a) => (
          <PressableScale
            key={a.id}
            onPress={() => onAction(a.id)}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            className="flex-1 items-center"
          >
            <View className="h-[58px] w-[58px] items-center justify-center rounded-full border border-white/15 bg-black/30">
              <MaterialCommunityIcons name={a.icon} className={`text-[25px] ${a.iconClass}`} />
            </View>
            <Text className="mt-1.5 font-semibold text-[11px] text-white/80">{a.label}</Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}
