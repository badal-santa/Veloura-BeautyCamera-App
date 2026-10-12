import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { LauncherApp } from '../../features/launcher/launcher';
import { ICON_PX, LABEL_PX, useSettings } from '../../features/settings/settings';
import AppIcon from './AppIcon';

type Props = {
  apps: LauncherApp[];
  onLaunch: (app: LauncherApp) => void;
  onLongPress: (app: LauncherApp) => void;
};

export default function PinnedApps({ apps, onLaunch, onLongPress }: Props) {
  const s = useSettings();
  if (apps.length === 0) {
    return (
      <View className="mx-5 flex-row items-center rounded-[24px] border border-dashed border-white/20 bg-black/25 px-4 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <MaterialCommunityIcons name="pin" className="text-lg text-primary-light" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-sm text-white">Your favorites live here</Text>
          <Text className="mt-0.5 font-regular text-xs text-white/60">
            Swipe up, long-press any app and choose Pin to Home.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-y-5 px-3">
      {apps.map((app) => (
        <AppIcon
          key={`${app.packageName}/${app.activityName}`}
          app={app}
          onPress={onLaunch}
          onLongPress={onLongPress}
          columns={s.homeColumns}
          iconSize={ICON_PX[s.homeIconSize]}
          labelSize={LABEL_PX[s.homeLabelSize]}
          showLabel={s.homeLabels}
        />
      ))}
    </View>
  );
}
