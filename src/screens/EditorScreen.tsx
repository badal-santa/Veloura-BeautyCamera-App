import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import NativeAdCard from '../components/ads/NativeAdCard';
import LookGrid from '../components/editor/LookGrid';
import OpenPhotoZone from '../components/editor/OpenPhotoZone';
import RatioShapes from '../components/editor/RatioShapes';
import ToolShelves from '../components/editor/ToolShelves';
import GlowBackdrop from '../components/GlowBackdrop';
import SectionTitle from '../components/SectionTitle';
import StatusBarFade from '../components/StatusBarFade';
import { EDITOR_GROUPS } from '../data/editor';
import { EVERYDAY_LOOKS } from '../data/looks';
import { useOpenEditor } from '../features/media/useOpenEditor';
import { useTileAction } from '../features/media/useTileAction';

const reveal = (step: number) => FadeInDown.delay(step * 70).duration(450);

export default function EditorScreen() {
  const openEditor = useOpenEditor();
  const runTile = useTileAction();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(168, 85, 247, 0.2)" />

      {/* pb clears the absolutely-positioned tab bar (see MainNavigator) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-[110px]">
        <Animated.View entering={reveal(0)} className="px-5">
          <Text className="font-medium text-sm text-secondary-light">Studio</Text>
          <Text className="mt-1 font-extrabold text-[30px] leading-[36px] tracking-[-0.6px] text-white">
            Polish any photo
          </Text>
        </Animated.View>

        <Animated.View entering={reveal(1)} className="mt-6">
          <OpenPhotoZone onPress={() => openEditor()} />
        </Animated.View>

        <Animated.View entering={reveal(2)}>
          <SectionTitle title="Quick frames" />
          <RatioShapes onPress={(preset) => openEditor(preset)} />
        </Animated.View>

        <Animated.View entering={reveal(3)}>
          <SectionTitle title="Tools" />
          <ToolShelves groups={EDITOR_GROUPS} onPress={(r) => runTile(r.title, r)} />
          <NativeAdCard placement="editorFeed" variant="compact" className="mt-6" />
        </Animated.View>

        <Animated.View entering={reveal(4)}>
          <SectionTitle title="Signature looks" />
          <LookGrid looks={EVERYDAY_LOOKS} onPress={(look) => openEditor(look.preset)} />
        </Animated.View>
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
