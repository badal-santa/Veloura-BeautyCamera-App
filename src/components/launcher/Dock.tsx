import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { LauncherApp } from '../../features/launcher/launcher';
import AppIcon from './AppIcon';

type Props = {
  apps: LauncherApp[];
  onLaunch: (app: LauncherApp) => void;
  onLongPress: (app: LauncherApp) => void;
  onOpenDrawer: () => void;
};

export default function Dock({ apps, onLaunch, onLongPress, onOpenDrawer }: Props) {
  return (
    <View>
      <Pressable
        onPress={onOpenDrawer}
        accessibilityRole="button"
        accessibilityLabel="Open all apps"
        hitSlop={10}
        className="mb-2 items-center"
      >
        <MaterialCommunityIcons name="chevron-up" className="text-xl text-white/70" />
        <Text className="font-medium text-[10px] tracking-[1.5px] text-white/50">SWIPE UP FOR APPS</Text>
      </Pressable>

      <View className="mx-4 flex-row items-center justify-center rounded-[30px] border border-white/15 bg-white/10 py-3">
        {apps.length > 0 ? (
          apps.map((app) => (
            <AppIcon
              key={`${app.packageName}/${app.activityName}`}
              app={app}
              onPress={onLaunch}
              onLongPress={onLongPress}
              showLabel={false}
            />
          ))
        ) : (
          <Text className="flex-1 py-4 text-center font-regular text-xs text-white/50">
            Long-press an app and choose Add to Dock
          </Text>
        )}
      </View>
    </View>
  );
}
