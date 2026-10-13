import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import NativeAdCard from '../components/ads/NativeAdCard';
import GlowBackdrop from '../components/GlowBackdrop';
import ForYouCards from '../components/home/ForYouCards';
import HomeGreeting from '../components/home/HomeGreeting';
import LookRings from '../components/home/LookRings';
import StudioBento from '../components/home/StudioBento';
import ToolChips from '../components/home/ToolChips';
import RecentCreations from '../components/RecentCreations';
import SectionTitle from '../components/SectionTitle';
import StatusBarFade from '../components/StatusBarFade';
import { LOOKS_FOR_YOU, QUICK_STUDIO } from '../data/home';
import { TRENDING_LOOKS } from '../data/looks';
import { useOpenEditor } from '../features/media/useOpenEditor';
import { useTileAction } from '../features/media/useTileAction';

const reveal = (step: number) => FadeInDown.delay(step * 70).duration(450);

export default function HomeScreen() {
  const navigation = useNavigation();
  const openEditor = useOpenEditor();
  const runTile = useTileAction();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(255, 79, 163, 0.2)" />

      {/* pb clears the absolutely-positioned tab bar (see MainNavigator) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-[110px]">
        <Animated.View entering={reveal(0)}>
          <HomeGreeting onSettings={() => navigation.navigate('Settings')} />
        </Animated.View>

        <Animated.View entering={reveal(1)} className="mt-6">
          <StudioBento
            onCamera={() => navigation.navigate('Capture')}
            onEdit={() => openEditor()}
            onTemplates={() => navigation.navigate('Main', { screen: 'Templates' })}
          />
        </Animated.View>

        <Animated.View entering={reveal(2)}>
          <SectionTitle title="Quick tools" />
          <ToolChips tools={QUICK_STUDIO} onPress={(t) => runTile(t.label, t)} />
        </Animated.View>

        <Animated.View entering={reveal(3)}>
          <SectionTitle title="Trending looks" />
          <LookRings looks={TRENDING_LOOKS} onPress={(look) => openEditor(look.preset)} />
        </Animated.View>

        <Animated.View entering={reveal(4)}>
          <NativeAdCard placement="homeFeed" className="mt-8" />
        </Animated.View>

        <Animated.View entering={reveal(5)}>
          <SectionTitle title="Made for you" />
          <ForYouCards rows={LOOKS_FOR_YOU} onPress={(r) => runTile(r.title, r)} />
        </Animated.View>

        <RecentCreations
          onOpen={(uri) => navigation.navigate('PhotoReview', { uri, source: 'creation' })}
          onSeeAll={() => navigation.navigate('Gallery')}
        />
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
