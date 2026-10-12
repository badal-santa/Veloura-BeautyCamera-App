import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ACCENTS, type Accent, type Size } from '../../features/settings/settings';
import PressableScale from '../PressableScale';

/** Rounded glass panel grouping related settings. */
export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View className="mx-5 mt-5">
      {title && (
        <Text className="mb-2 ml-1 font-bold text-[11px] tracking-[2px] text-content-tertiary">{title.toUpperCase()}</Text>
      )}
      <View className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04]">{children}</View>
    </View>
  );
}

function RowShell({ title, detail, children, first }: { title: string; detail?: string; children: ReactNode; first?: boolean }) {
  return (
    <View className={`flex-row items-center px-4 py-3.5 ${first ? '' : 'border-t border-white/[0.06]'}`}>
      <View className="mr-3 flex-1">
        <Text className="font-semibold text-[15px] text-content-primary">{title}</Text>
        {detail && <Text className="mt-0.5 font-regular text-xs leading-4 text-content-tertiary">{detail}</Text>}
      </View>
      {children}
    </View>
  );
}

export function ToggleRow({
  title,
  detail,
  value,
  onChange,
  first,
}: {
  title: string;
  detail?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  first?: boolean;
}) {
  return (
    <RowShell title={title} detail={detail} first={first}>
      <Pressable
        onPress={() => onChange(!value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={title}
        hitSlop={8}
        className={`h-[28px] w-[48px] justify-center rounded-full px-[3px] ${value ? 'items-end bg-primary' : 'items-start bg-white/15'}`}
      >
        <View className="h-[22px] w-[22px] rounded-full bg-white" />
      </Pressable>
    </RowShell>
  );
}

export function StepperRow({
  title,
  detail,
  value,
  min,
  max,
  onChange,
  first,
}: {
  title: string;
  detail?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  first?: boolean;
}) {
  const step = (d: number) => onChange(Math.min(max, Math.max(min, value + d)));
  return (
    <RowShell title={title} detail={detail} first={first}>
      <View className="flex-row items-center rounded-full border border-white/10 bg-black/30">
        <Pressable onPress={() => step(-1)} disabled={value <= min} accessibilityLabel={`Fewer ${title}`} className="px-3 py-2">
          <MaterialCommunityIcons name="minus" className={`text-lg ${value <= min ? 'text-white/20' : 'text-white'}`} />
        </Pressable>
        <Text className="w-6 text-center font-bold text-[15px] text-primary-light">{value}</Text>
        <Pressable onPress={() => step(1)} disabled={value >= max} accessibilityLabel={`More ${title}`} className="px-3 py-2">
          <MaterialCommunityIcons name="plus" className={`text-lg ${value >= max ? 'text-white/20' : 'text-white'}`} />
        </Pressable>
      </View>
    </RowShell>
  );
}

export function SizeRow({
  title,
  value,
  onChange,
  first,
}: {
  title: string;
  value: Size;
  onChange: (v: Size) => void;
  first?: boolean;
}) {
  return (
    <RowShell title={title} first={first}>
      <View className="flex-row gap-1.5">
        {(['S', 'M', 'L'] as const).map((s) => {
          const active = s === value;
          return (
            <Pressable
              key={s}
              onPress={() => onChange(s)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${title} ${s === 'S' ? 'small' : s === 'M' ? 'medium' : 'large'}`}
              className={`h-9 w-9 items-center justify-center rounded-xl border ${
                active ? 'border-primary bg-primary/20' : 'border-white/10 bg-black/30'
              }`}
            >
              <Text className={`font-bold text-sm ${active ? 'text-primary-light' : 'text-white/60'}`}>{s}</Text>
            </Pressable>
          );
        })}
      </View>
    </RowShell>
  );
}

export function PercentRow({
  title,
  detail,
  value,
  options,
  onChange,
  first,
}: {
  title: string;
  detail?: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
  first?: boolean;
}) {
  return (
    <View className={`px-4 py-3.5 ${first ? '' : 'border-t border-white/[0.06]'}`}>
      <Text className="font-semibold text-[15px] text-content-primary">{title}</Text>
      {detail && <Text className="mt-0.5 font-regular text-xs text-content-tertiary">{detail}</Text>}
      <View className="mt-3 flex-row gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <Pressable
              key={o}
              onPress={() => onChange(o)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              className={`flex-1 items-center rounded-xl border py-2 ${active ? 'border-primary bg-primary/20' : 'border-white/10 bg-black/30'}`}
            >
              <Text className={`font-bold text-[13px] ${active ? 'text-primary-light' : 'text-white/60'}`}>{o}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AccentRow({ value, onChange }: { value: Accent; onChange: (a: Accent) => void }) {
  return (
    <View className="px-4 py-3.5">
      <Text className="font-semibold text-[15px] text-content-primary">Home accent</Text>
      <Text className="mt-0.5 font-regular text-xs text-content-tertiary">Glow and camera orb on Veloura Home</Text>
      <View className="mt-3 flex-row justify-between">
        {(Object.keys(ACCENTS) as Accent[]).map((a) => {
          const active = a === value;
          return (
            <PressableScale
              key={a}
              onPress={() => onChange(a)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${ACCENTS[a].label} accent`}
              className="items-center"
            >
              <View className={`rounded-full p-[3px] ${active ? 'border-2 border-white' : 'border-2 border-transparent'}`}>
                <LinearGradient
                  colors={ACCENTS[a].colors}
                  start={{ x: 0.15, y: 0 }}
                  end={{ x: 0.85, y: 1 }}
                  className="h-12 w-12 items-center justify-center rounded-full"
                >
                  {active && <MaterialCommunityIcons name="check" className="text-xl text-white" />}
                </LinearGradient>
              </View>
              <Text className={`mt-1.5 font-semibold text-[11px] ${active ? 'text-white' : 'text-white/50'}`}>
                {ACCENTS[a].label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export function LinkRow({
  title,
  detail,
  icon,
  onPress,
  destructive,
  first,
}: {
  title: string;
  detail?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
  first?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      pressedScale={0.98}
      className={`flex-row items-center px-4 py-3.5 ${first ? '' : 'border-t border-white/[0.06]'}`}
    >
      <MaterialCommunityIcons name={icon} className={`text-xl ${destructive ? 'text-rose-400' : 'text-primary-light'}`} />
      <View className="ml-3 flex-1">
        <Text className={`font-semibold text-[15px] ${destructive ? 'text-rose-400' : 'text-content-primary'}`}>{title}</Text>
        {detail && <Text className="mt-0.5 font-regular text-xs text-content-tertiary">{detail}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" className="text-xl text-content-tertiary" />
    </PressableScale>
  );
}
