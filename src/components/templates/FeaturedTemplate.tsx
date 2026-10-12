import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { Template } from '../../data/templates';
import PressableScale from '../PressableScale';
import TemplatePreview, { RATIO_HEIGHT } from './TemplatePreview';

/** Big spotlight card for the first template in a category. */
export default function FeaturedTemplate({ template, onUse }: { template: Template; onUse: (t: Template) => void }) {
  // Keep the preview ~250dp tall whatever its ratio.
  const width = 250 / RATIO_HEIGHT[template.ratio];

  return (
    <PressableScale
      onPress={() => onUse(template)}
      accessibilityRole="button"
      accessibilityLabel={`Featured: ${template.title}`}
      pressedScale={0.98}
      className="mx-5 overflow-hidden rounded-[32px] border border-white/10"
    >
      <LinearGradient colors={template.design.background} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0 opacity-60" />
      <LinearGradient colors={['rgba(8, 7, 12, 0.2)', 'rgba(8, 7, 12, 0.85)']} className="absolute inset-0" />

      <View className="items-center pt-6">
        <View className="overflow-hidden rounded-xl shadow-2xl shadow-black/60" pointerEvents="none">
          <TemplatePreview template={template} width={width} />
        </View>
      </View>

      <View className="flex-row items-center p-5">
        <View className="flex-1">
          <Text className="font-bold text-[10px] tracking-[2px] text-primary-light">FEATURED</Text>
          <Text className="mt-0.5 font-extrabold text-xl text-white">{template.title}</Text>
          <Text className="font-regular text-xs text-white/60">
            {template.description} · {template.ratio}
          </Text>
        </View>
        <View className="flex-row items-center rounded-full bg-white px-4 py-2.5">
          <Text className="font-bold text-[13px] text-background">Use</Text>
          <MaterialCommunityIcons name="arrow-right" className="ml-1 text-base text-background" />
        </View>
      </View>
    </PressableScale>
  );
}
