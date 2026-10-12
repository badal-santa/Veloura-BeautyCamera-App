import { Image, Text, View } from 'react-native';

import type { LauncherApp } from '../../features/launcher/launcher';
import { hapticTap } from '../../features/settings/settings';
import PressableScale from '../PressableScale';

// Literal classes so Tailwind can see them.
const COLUMN_WIDTH: Record<number, string> = { 4: 'w-1/4', 5: 'w-1/5' };

type Props = {
  app: LauncherApp;
  onPress: (app: LauncherApp) => void;
  onLongPress?: (app: LauncherApp) => void;
  showLabel?: boolean;
  columns?: number;
  /** Icon edge in dp. */
  iconSize?: number;
  /** Label font size in dp. */
  labelSize?: number;
};

export default function AppIcon({
  app,
  onPress,
  onLongPress,
  showLabel = true,
  columns = 4,
  iconSize = 54,
  labelSize = 11,
}: Props) {
  return (
    <PressableScale
      onPress={() => onPress(app)}
      onLongPress={
        onLongPress
          ? () => {
              hapticTap();
              onLongPress(app);
            }
          : undefined
      }
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={app.label}
      accessibilityHint={onLongPress ? 'Long press for options' : undefined}
      pressedScale={0.88}
      className={`${COLUMN_WIDTH[columns] ?? 'w-1/4'} items-center`}
    >
      <View className="items-center justify-center" style={{ width: iconSize + 4, height: iconSize + 4 }}>
        <Image source={{ uri: app.icon }} style={{ width: iconSize, height: iconSize }} />
      </View>
      {showLabel && (
        <Text
          numberOfLines={1}
          className="mt-1.5 px-1 text-center font-medium text-white"
          style={{ fontSize: labelSize }}
        >
          {app.label}
        </Text>
      )}
    </PressableScale>
  );
}
