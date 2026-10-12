import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import type { LauncherApp } from '../../features/launcher/launcher';
import PressableScale from '../PressableScale';

type Action = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  app: LauncherApp | null;
  pinned: boolean;
  inDock: boolean;
  onClose: () => void;
  onTogglePin: (app: LauncherApp) => void;
  onToggleDock: (app: LauncherApp) => void;
  onAppInfo: (app: LauncherApp) => void;
  onUninstall: (app: LauncherApp) => void;
};

export default function AppActionsSheet({
  app,
  pinned,
  inDock,
  onClose,
  onTogglePin,
  onToggleDock,
  onAppInfo,
  onUninstall,
}: Props) {
  if (!app) return null;

  const run = (fn: (a: LauncherApp) => void) => () => {
    onClose();
    fn(app);
  };

  const actions: Action[] = [
    { label: pinned ? 'Remove from Home' : 'Pin to Home', icon: pinned ? 'pin-off' : 'pin', onPress: run(onTogglePin) },
    { label: inDock ? 'Remove from Dock' : 'Add to Dock', icon: 'dock-bottom', onPress: run(onToggleDock) },
    { label: 'App info', icon: 'information-outline', onPress: run(onAppInfo) },
    { label: 'Uninstall', icon: 'delete-outline', onPress: run(onUninstall), destructive: true },
  ];

  // In-screen overlay (not a Modal) so it can reach under the edge-to-edge nav bar.
  return (
    <View className="absolute inset-0 justify-end" accessibilityViewIsModal>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} className="absolute inset-0">
        <Pressable className="flex-1 bg-black/60" onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.duration(260)}
        exiting={SlideOutDown.duration(200)}
        className="rounded-t-[32px] border-t border-white/10 bg-surface px-5 pb-safe-offset-5 pt-3"
      >
        <View className="h-1 w-10 self-center rounded-full bg-white/20" />
        <View className="mt-4 flex-row items-center">
          <Image source={{ uri: app.icon }} className="h-14 w-14" />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-lg text-white" numberOfLines={1}>
              {app.label}
            </Text>
            <Text className="font-regular text-xs text-white/45" numberOfLines={1}>
              {app.packageName}
            </Text>
          </View>
        </View>

        <View className="mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-white/5">
          {actions.map((a, i) => (
            <PressableScale
              key={a.label}
              onPress={a.onPress}
              accessibilityRole="button"
              pressedScale={0.98}
              className={`flex-row items-center px-4 py-3.5 ${i > 0 ? 'border-t border-white/10' : ''}`}
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-xl ${a.destructive ? 'bg-rose-500/15' : 'bg-primary/15'}`}
              >
                <MaterialCommunityIcons
                  name={a.icon}
                  className={`text-lg ${a.destructive ? 'text-rose-400' : 'text-primary-light'}`}
                />
              </View>
              <Text className={`ml-3 font-semibold text-[15px] ${a.destructive ? 'text-rose-400' : 'text-white'}`}>
                {a.label}
              </Text>
            </PressableScale>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
