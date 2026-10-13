import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Share, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import BannerAd from '../components/ads/BannerAd';
import GlowBackdrop from '../components/GlowBackdrop';
import PressableScale from '../components/PressableScale';
import HomeModeCard from '../components/profile/HomeModeCard';
import IdentityCard from '../components/profile/IdentityCard';
import ProfileFooter from '../components/profile/ProfileFooter';
import RecentCreations from '../components/RecentCreations';
import { LinkRow, Panel } from '../components/settings/controls';
import StatusBarFade from '../components/StatusBarFade';
import { comingSoon } from '../lib/comingSoon';
import { showPrivacyInfo } from '../lib/privacy';

const reveal = (step: number) => FadeInDown.delay(step * 70).duration(450);

export default function ProfileScreen() {
  const navigation = useNavigation();

  const shareApp = () =>
    Share.share({ message: 'I edit my photos with Veloura — beauty camera, filters & templates, all on-device ✨' });

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop />

      {/* pb clears the absolutely-positioned tab bar (see MainNavigator) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-[110px]">
        <Animated.View entering={reveal(0)} className="flex-row items-center justify-between px-5">
          <Text className="font-extrabold text-[30px] leading-[36px] tracking-[-0.6px] text-white">You</Text>
          <PressableScale
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5"
          >
            <MaterialCommunityIcons name="cog-outline" className="text-[22px] text-white" />
          </PressableScale>
        </Animated.View>

        <Animated.View entering={reveal(1)} className="mt-5">
          <IdentityCard />
        </Animated.View>

        <RecentCreations
          title="Your latest"
          onOpen={(uri) => navigation.navigate('PhotoReview', { uri, source: 'creation' })}
          onSeeAll={() => navigation.navigate('Gallery')}
        />

        <Animated.View entering={reveal(2)} className="mt-6">
          <HomeModeCard />
        </Animated.View>

        <Animated.View entering={reveal(3)}>
          <Panel title="Create">
            <LinkRow first title="Gallery" detail="Your creations and phone photos" icon="image-multiple-outline" onPress={() => navigation.navigate('Gallery')} />
            <LinkRow title="Beauty camera" detail="Shoot with live beauty" icon="camera-outline" onPress={() => navigation.navigate('Capture')} />
          </Panel>
          <Panel title="Preferences">
            <LinkRow first title="Settings" detail="Camera, Home, Drawer and more" icon="tune-variant" onPress={() => navigation.navigate('Settings')} />
            <LinkRow title="Privacy" detail="What happens with your data" icon="shield-check-outline" onPress={showPrivacyInfo} />
          </Panel>
          <Panel title="Spread the glow">
            <LinkRow first title="Share Veloura" icon="share-variant-outline" onPress={shareApp} />
            <LinkRow title="Rate Veloura" icon="star-outline" onPress={() => comingSoon('Rating')} />
            <LinkRow title="Contact support" icon="email-outline" onPress={() => comingSoon('Support')} />
          </Panel>
        </Animated.View>

        <BannerAd placement="profileBanner" className="mt-8" />

        <ProfileFooter />
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
