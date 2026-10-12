import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { LauncherApp } from '../../features/launcher/launcher';
import { useSettings } from '../../features/settings/settings';
import AppIcon from './AppIcon';

type Row = { key: string; letter?: string; apps?: LauncherApp[] };

function chunk(apps: LauncherApp[], prefix: string, columns: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < apps.length; i += columns) rows.push({ key: `${prefix}-${i}`, apps: apps.slice(i, i + columns) });
  return rows;
}

/** A–Z sections, or a flat grid of matches while searching. */
function buildRows(apps: LauncherApp[], query: string, columns: number): Row[] {
  const q = query.trim().toLowerCase();
  if (q) return chunk(apps.filter((a) => a.label.toLowerCase().includes(q)), 'q', columns);

  const groups = new Map<string, LauncherApp[]>();
  for (const app of apps) {
    const first = app.label.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : '#';
    groups.set(letter, [...(groups.get(letter) ?? []), app]);
  }
  return [...groups.entries()].flatMap(([letter, list]) => [{ key: `h-${letter}`, letter }, ...chunk(list, letter, columns)]);
}

type Props = {
  open: boolean;
  focusSearch: boolean;
  apps: LauncherApp[];
  onClose: () => void;
  onLaunch: (app: LauncherApp) => void;
  onLongPress: (app: LauncherApp) => void;
};

export default function AppDrawer({ open, focusSearch, apps, onClose, onLaunch, onLongPress }: Props) {
  const { height } = useWindowDimensions();
  const settings = useSettings();
  const [query, setQuery] = useState('');
  const search = useRef<TextInput>(null);
  const swipeStartY = useRef(0);

  // Clear the search whenever the drawer closes.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setQuery('');
  }

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration: 320, easing: Easing.out(Easing.cubic) }));
    if (open && focusSearch) setTimeout(() => search.current?.focus(), 250);
    if (!open) Keyboard.dismiss();
  }, [open, focusSearch, progress]);

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * height * 0.6 }],
  }));

  const rows = useMemo(() => buildRows(apps, query, settings.drawerColumns), [apps, query, settings.drawerColumns]);

  return (
    <Animated.View
      style={sheetStyle}
      pointerEvents={open ? 'auto' : 'none'}
      className="absolute inset-0"
      accessibilityViewIsModal={open}
    >
      {/* Opacity is user-adjustable (Settings → Drawer); below 100% the wallpaper shows through. */}
      <LinearGradient
        colors={['#191522', '#08070C']}
        className="absolute inset-0"
        style={{ opacity: settings.drawerOpacity / 100 }}
      />
      <LinearGradient
        colors={['rgba(255, 79, 163, 0.16)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.35 }}
        className="absolute inset-0"
      />

      {/* Header — swipe down here to close */}
      <View
        className="pt-safe"
        onTouchStart={(e) => {
          swipeStartY.current = e.nativeEvent.pageY;
        }}
        onTouchEnd={(e) => {
          if (e.nativeEvent.pageY - swipeStartY.current > 60) onClose();
        }}
      >
        <View className="mt-2 h-1 w-10 self-center rounded-full bg-white/25" />
        <View className="mt-3 flex-row items-center px-5">
          <View className="flex-1">
            <Text className="font-extrabold text-2xl text-white">All apps</Text>
            <Text className="font-regular text-xs text-white/50">{apps.length} installed</Text>
          </View>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close app drawer"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <MaterialCommunityIcons name="chevron-down" className="text-2xl text-white" />
          </Pressable>
        </View>

        <View className="mx-5 mb-2 mt-4 flex-row items-center rounded-full border border-white/15 bg-white/5 px-4">
          <MaterialCommunityIcons name="magnify" className="text-xl text-white/60" />
          <TextInput
            ref={search}
            value={query}
            onChangeText={setQuery}
            placeholder="Search apps"
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            returnKeyType="search"
            autoCorrect={false}
            className="ml-2 flex-1 py-3 font-medium text-[15px] text-white"
            onSubmitEditing={() => {
              const first = rows.find((r) => r.apps)?.apps?.[0];
              if (first) onLaunch(first);
            }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={8}>
              <MaterialCommunityIcons name="close" className="text-lg text-white/60" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-safe-offset-6"
        initialNumToRender={12}
        renderItem={({ item }) =>
          item.letter ? (
            <Text className="mb-2 mt-5 px-6 font-bold text-[13px] tracking-[2px] text-primary-light">{item.letter}</Text>
          ) : (
            <View className="mb-4 flex-row px-3">
              {item.apps!.map((app) => (
                <AppIcon
                  key={`${app.packageName}/${app.activityName}`}
                  app={app}
                  onPress={onLaunch}
                  onLongPress={onLongPress}
                  columns={settings.drawerColumns}
                  iconSize={settings.drawerColumns === 5 ? 46 : 54}
                  showLabel={settings.drawerLabels}
                />
              ))}
            </View>
          )
        }
        ListEmptyComponent={
          <Text className="mt-16 text-center font-medium text-sm text-white/50">
            {query ? `No apps match “${query}”` : 'Loading apps…'}
          </Text>
        }
      />
    </Animated.View>
  );
}
