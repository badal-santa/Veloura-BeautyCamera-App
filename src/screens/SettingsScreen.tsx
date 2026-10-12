import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import GlowBackdrop from '../components/GlowBackdrop';
import PressableScale from '../components/PressableScale';
import {
  AccentRow,
  LinkRow,
  Panel,
  PercentRow,
  SizeRow,
  StepperRow,
  ToggleRow,
} from '../components/settings/controls';
import LauncherPreview from '../components/settings/LauncherPreview';
import SectionRail, { type RailItem } from '../components/settings/SectionRail';
import StatusBarFade from '../components/StatusBarFade';
import { isLauncherSupported } from '../features/launcher/launcher';
import { launcherLayoutStore } from '../features/launcher/useLauncherLayout';
import { settingsStore, updateSettings, useSettings } from '../features/settings/settings';
import { showPrivacyInfo } from '../lib/privacy';
import type { RootStackScreenProps } from '../navigation/types';

export type SettingsSection = 'camera' | 'home' | 'drawer' | 'general';

const ALL_SECTIONS: RailItem<SettingsSection>[] = [
  { id: 'camera', label: 'Camera', icon: 'camera-iris' },
  { id: 'home', label: 'Home', icon: 'home-variant-outline' },
  { id: 'drawer', label: 'Drawer', icon: 'apps' },
  { id: 'general', label: 'General', icon: 'cog-outline' },
];
// Home & Drawer only exist where Veloura Home does (Android).
const SECTIONS = isLauncherSupported ? ALL_SECTIONS : ALL_SECTIONS.filter((s) => s.id === 'camera' || s.id === 'general');

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen({ navigation, route }: RootStackScreenProps<'Settings'>) {
  const s = useSettings();
  const [section, setSection] = useState<SettingsSection>(route.params?.section ?? 'camera');

  const resetHome = () =>
    Alert.alert('Reset Veloura Home?', 'Pinned apps and the dock go back to their defaults.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => launcherLayoutStore.reset() },
    ]);

  const resetAll = () =>
    Alert.alert('Restore default settings?', 'Camera, Home and Drawer preferences will be reset.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restore', style: 'destructive', onPress: () => settingsStore.reset() },
    ]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(168, 85, 247, 0.2)" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-10">
        <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center px-5">
          <PressableScale
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white/10"
          >
            <MaterialCommunityIcons name="arrow-left" className="text-[22px] text-content-primary" />
          </PressableScale>
          <View className="ml-3">
            <Text className="font-extrabold text-[28px] leading-[34px] text-content-primary">Settings</Text>
            <Text className="font-regular text-[13px] text-content-secondary">Make Veloura feel like yours</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(400)} className="mt-6">
          <SectionRail items={SECTIONS} value={section} onChange={setSection} />
        </Animated.View>

        <Animated.View key={section} entering={FadeIn.duration(250)} className="mt-1">
          {section === 'camera' && (
            <>
              <Panel title="Capture">
                <ToggleRow
                  first
                  title="Mirror selfies"
                  detail="Save front-camera photos the way you see them"
                  value={s.mirrorSelfie}
                  onChange={(v) => updateSettings({ mirrorSelfie: v })}
                />
                <ToggleRow
                  title="Shutter sound"
                  value={s.shutterSound}
                  onChange={(v) => updateSettings({ shutterSound: v })}
                />
                <ToggleRow
                  title="Grid lines"
                  detail="Rule-of-thirds guide over the camera"
                  value={s.cameraGrid}
                  onChange={(v) => updateSettings({ cameraGrid: v })}
                />
              </Panel>
              <Panel title="Saving">
                <ToggleRow
                  first
                  title="Keep in My creations"
                  detail="Also keep saved photos in Veloura's Gallery"
                  value={s.saveCreations}
                  onChange={(v) => updateSettings({ saveCreations: v })}
                />
              </Panel>
            </>
          )}

          {section === 'home' && (
            <>
              <View className="mt-5">
                <LauncherPreview variant="home" />
              </View>
              <Panel title="Layout">
                <StepperRow
                  first
                  title="Grid columns"
                  value={s.homeColumns}
                  min={4}
                  max={5}
                  onChange={(v) => updateSettings({ homeColumns: v })}
                />
                <SizeRow title="Icon size" value={s.homeIconSize} onChange={(v) => updateSettings({ homeIconSize: v })} />
              </Panel>
              <Panel title="Labels">
                <ToggleRow first title="Show app names" value={s.homeLabels} onChange={(v) => updateSettings({ homeLabels: v })} />
                {s.homeLabels && (
                  <SizeRow title="Text size" value={s.homeLabelSize} onChange={(v) => updateSettings({ homeLabelSize: v })} />
                )}
              </Panel>
              <Panel>
                <AccentRow value={s.accent} onChange={(v) => updateSettings({ accent: v })} />
              </Panel>
            </>
          )}

          {section === 'drawer' && (
            <>
              <View className="mt-5">
                <LauncherPreview variant="drawer" />
              </View>
              <Panel title="Layout">
                <StepperRow
                  first
                  title="Grid columns"
                  value={s.drawerColumns}
                  min={4}
                  max={5}
                  onChange={(v) => updateSettings({ drawerColumns: v })}
                />
                <ToggleRow title="Show app names" value={s.drawerLabels} onChange={(v) => updateSettings({ drawerLabels: v })} />
              </Panel>
              <Panel title="Appearance">
                <PercentRow
                  first
                  title="Background"
                  detail="Lower values let your wallpaper show through"
                  value={s.drawerOpacity}
                  options={[70, 80, 90, 97]}
                  onChange={(v) => updateSettings({ drawerOpacity: v })}
                />
              </Panel>
            </>
          )}

          {section === 'general' && (
            <>
              <Panel title="Feel">
                <ToggleRow
                  first
                  title="Haptic feedback"
                  detail="Subtle vibration on long-press"
                  value={s.haptics}
                  onChange={(v) => updateSettings({ haptics: v })}
                />
              </Panel>
              <Panel title="Privacy & data">
                <LinkRow first title="Privacy" detail="What Veloura does with your data" icon="shield-check-outline" onPress={showPrivacyInfo} />
                {isLauncherSupported && (
                  <LinkRow title="Reset Veloura Home" detail="Restore pinned apps and dock" icon="restore" onPress={resetHome} />
                )}
                <LinkRow title="Restore default settings" icon="backup-restore" onPress={resetAll} destructive />
              </Panel>
              <Text className="mt-8 text-center font-medium text-xs text-content-tertiary">Veloura · Version {APP_VERSION}</Text>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
