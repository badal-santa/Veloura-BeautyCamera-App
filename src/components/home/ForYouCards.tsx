import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

import type { ActionRow } from '../ActionList';
import PressableScale from '../PressableScale';

const TINTS: readonly (readonly [string, string])[] = [
  ['rgba(255, 79, 163, 0.32)', 'rgba(25, 21, 34, 0.9)'],
  ['rgba(251, 191, 36, 0.26)', 'rgba(25, 21, 34, 0.9)'],
  ['rgba(56, 189, 248, 0.26)', 'rgba(25, 21, 34, 0.9)'],
];

/** Wide swipeable suggestion cards. */
export default function ForYouCards({ rows, onPress }: { rows: ActionRow[]; onPress: (row: ActionRow) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={252}
      decelerationRate="fast"
      contentContainerClassName="gap-3 px-5"
    >
      {rows.map((row, i) => (
        <PressableScale
          key={row.title}
          onPress={() => onPress(row)}
          accessibilityRole="button"
          accessibilityLabel={row.title}
          className="h-[132px] w-[240px] justify-between overflow-hidden rounded-[26px] border border-white/10 p-4"
        >
          <LinearGradient colors={TINTS[i % TINTS.length]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <View className="flex-row items-center justify-between">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <MaterialCommunityIcons name={row.icon} className="text-xl text-white" />
            </View>
            <View className="rounded-full bg-white/10 px-2.5 py-1">
              <Text className="font-bold text-[10px] tracking-[1px] text-white/80">TRY IT</Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-base text-white">{row.title}</Text>
            <Text className="mt-0.5 font-regular text-xs text-white/60" numberOfLines={1}>
              {row.subtitle}
            </Text>
          </View>
        </PressableScale>
      ))}
    </ScrollView>
  );
}
