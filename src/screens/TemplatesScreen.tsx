import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import NativeAdCard from '../components/ads/NativeAdCard';
import GlowBackdrop from '../components/GlowBackdrop';
import StatusBarFade from '../components/StatusBarFade';
import FeaturedTemplate from '../components/templates/FeaturedTemplate';
import TemplateMasonry from '../components/templates/TemplateMasonry';
import UnderlineTabs from '../components/templates/UnderlineTabs';
import { TEMPLATE_CATEGORIES, TEMPLATES, type Template, type TemplateCategory } from '../data/templates';

export default function TemplatesScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState<TemplateCategory>('For you');

  const [featured, ...rest] = useMemo(() => TEMPLATES.filter((t) => t.categories.includes(category)), [category]);
  const open = (t: Template) => navigation.navigate('TemplateEditor', { templateId: t.id });

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(255, 179, 138, 0.16)" />

      {/* pb clears the absolutely-positioned tab bar (see MainNavigator) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-[110px]">
        <Animated.View entering={FadeInDown.duration(450)} className="px-5">
          <Text className="font-medium text-sm text-accent">{TEMPLATES.length} designs</Text>
          <Text className="mt-1 font-extrabold text-[30px] leading-[36px] tracking-[-0.6px] text-white">
            Frame your story
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(70).duration(450)} className="mb-5 mt-5">
          <UnderlineTabs tabs={TEMPLATE_CATEGORIES} value={category} onChange={setCategory} />
        </Animated.View>

        <Animated.View key={category} entering={FadeIn.duration(300)}>
          {featured && <FeaturedTemplate template={featured} onUse={open} />}
          <NativeAdCard placement="templatesFeed" variant="compact" className="mt-4" />
          {rest.length > 0 && (
            <View className="mt-6">
              <TemplateMasonry templates={rest} onUse={open} />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
