import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import PressableScale from './PressableScale';

type Props = {
  title: string;
  subtitle?: string;
  /** Optional round action button on the right. */
  action?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    onPress?: () => void;
  };
};

export default function ScreenHeader({ title, subtitle, action }: Props) {
  return (
    <View className="flex-row items-start justify-between px-5">
      <View className="flex-1 pr-3">
        <Text className="font-extrabold text-[32px] leading-[40px] text-content-primary">{title}</Text>
        {subtitle && (
          <Text className="mt-1 font-regular text-sm text-content-secondary">{subtitle}</Text>
        )}
      </View>
      {action && (
        <PressableScale
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          hitSlop={8}
          className="h-[46px] w-[46px] items-center justify-center rounded-full border border-border bg-white/10"
        >
          <MaterialCommunityIcons name={action.icon} className="text-[22px] text-content-primary" />
        </PressableScale>
      )}
    </View>
  );
}
