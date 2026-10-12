import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

import type { ToolGroup } from '../../data/editor';
import type { ActionRow } from '../ActionList';
import PressableScale from '../PressableScale';

type Palette = {
  /** Orb gradient. */
  orb: readonly [string, string, string];
  /** Hairline border gradient. */
  border: readonly [string, string];
  /** Soft wash inside the card. */
  wash: readonly [string, string];
  accent: string;
};

const PALETTES: Record<string, Palette> = {
  retouch: {
    orb: ['#FF8FD1', '#FF4FA3', '#C026D3'],
    border: ['rgba(255, 143, 209, 0.55)', 'rgba(255, 255, 255, 0.06)'],
    wash: ['rgba(255, 79, 163, 0.20)', 'rgba(17, 16, 25, 0.95)'],
    accent: '#FF78BA',
  },
  layout: {
    orb: ['#6EE7B7', '#10B981', '#0E7490'],
    border: ['rgba(110, 231, 183, 0.5)', 'rgba(255, 255, 255, 0.06)'],
    wash: ['rgba(16, 185, 129, 0.16)', 'rgba(17, 16, 25, 0.95)'],
    accent: '#6EE7B7',
  },
  create: {
    orb: ['#C4B5FD', '#8B5CF6', '#4F46E5'],
    border: ['rgba(196, 181, 253, 0.55)', 'rgba(255, 255, 255, 0.06)'],
    wash: ['rgba(139, 92, 246, 0.20)', 'rgba(17, 16, 25, 0.95)'],
    accent: '#C4B5FD',
  },
};

/** Every tool visible at once: one swipeable shelf of glass cards per group. */
export default function ToolShelves({ groups, onPress }: { groups: ToolGroup[]; onPress: (row: ActionRow) => void }) {
  return (
    <View className="gap-6">
      {groups.map((group) => {
        const p = PALETTES[group.id] ?? PALETTES.retouch;
        return (
          <View key={group.id}>
            <ShelfHeader label={group.label} count={group.rows.length} palette={p} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={162}
              decelerationRate="fast"
              contentContainerClassName="gap-3 px-5"
            >
              {group.rows.map((row) => (
                <ToolCard key={row.title} row={row} palette={p} onPress={() => onPress(row)} />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

function ShelfHeader({ label, count, palette }: { label: string; count: number; palette: Palette }) {
  return (
    <View className="mb-3 flex-row items-center px-5">
      <LinearGradient
        colors={[palette.accent, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="mr-2.5 h-[3px] w-5 rounded-full"
      />
      <Text className="font-extrabold text-[15px] tracking-[0.3px] text-white">{label}</Text>
      <View className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
        <Text className="font-semibold text-[10px] text-white/50">{count} tools</Text>
      </View>
    </View>
  );
}

function ToolCard({ row, palette, onPress }: { row: ActionRow; palette: Palette; onPress: () => void }) {
  const soon = !!row.soon;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={soon ? `${row.title}, coming soon` : row.title}
      pressedScale={0.95}
      className="rounded-[26px] shadow-lg shadow-black/50"
    >
      {/* Gradient hairline border */}
      <LinearGradient
        colors={palette.border}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-[26px] p-px"
      >
        <View className="h-[136px] w-[150px] justify-between overflow-hidden rounded-[25px] bg-[#111019] p-3.5">
          <LinearGradient colors={palette.wash} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }} className="absolute inset-0" />
          {/* Light streak */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 0.5 }}
            className="absolute inset-0"
          />

          <View className={`flex-row items-start justify-between ${soon ? 'opacity-60' : ''}`}>
            {/* Glossy orb */}
            <LinearGradient
              colors={palette.orb}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              className="h-10 w-10 items-center justify-center overflow-hidden rounded-[15px] border border-white/25"
            >
              <View className="absolute inset-x-[3px] top-[2px] h-1/2 rounded-[12px] bg-white/25" />
              <MaterialCommunityIcons name={row.icon} className="text-[21px] text-white" />
            </LinearGradient>

            {soon ? (
              <View className="rounded-full border border-white/15 bg-white/10 px-2 py-1">
                <Text className="font-bold text-[9px] tracking-[1.2px] text-white/70">SOON</Text>
              </View>
            ) : (
              <View className="h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]">
                <MaterialCommunityIcons name="arrow-top-right" className="text-sm text-white/80" />
              </View>
            )}
          </View>

          <View className={soon ? 'opacity-60' : ''}>
            <Text className="font-extrabold text-[15px] tracking-[-0.2px] text-white" numberOfLines={1}>
              {row.title}
            </Text>
            <Text className="mt-0.5 font-regular text-[11px] leading-[14px] text-white/55" numberOfLines={2}>
              {row.subtitle}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}
