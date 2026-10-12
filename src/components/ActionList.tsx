import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { TileAction } from '../features/media/actions';
import PressableScale from './PressableScale';

export type ActionRow = TileAction & {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Props = {
  rows: ActionRow[];
  onRowPress?: (row: ActionRow) => void;
};

/** Grouped card of tappable rows: icon · title/subtitle · chevron. */
export default function ActionList({ rows, onRowPress }: Props) {
  return (
    <View className="mx-5 overflow-hidden rounded-[22px] border border-border bg-surface">
      {rows.map((row, i) => (
        <PressableScale
          key={row.title}
          onPress={() => onRowPress?.(row)}
          accessibilityRole="button"
          accessibilityLabel={row.title}
          pressedScale={0.98}
          className={`flex-row items-center px-4 py-3.5 ${i > 0 ? 'border-t border-border-light' : ''}`}
        >
          <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-primary/10">
            <MaterialCommunityIcons name={row.icon} className="text-xl text-primary-light" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-[15px] text-content-primary">{row.title}</Text>
            <Text className="mt-0.5 font-regular text-xs text-content-tertiary">{row.subtitle}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" className="text-[22px] text-content-tertiary" />
        </PressableScale>
      ))}
    </View>
  );
}
