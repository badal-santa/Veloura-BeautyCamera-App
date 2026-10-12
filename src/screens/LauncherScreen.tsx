import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import AppActionsSheet from '../components/launcher/AppActionsSheet';
import AppDrawer from '../components/launcher/AppDrawer';
import ClockHeader from '../components/launcher/ClockHeader';
import Dock from '../components/launcher/Dock';
import LauncherBackdrop from '../components/launcher/LauncherBackdrop';
import PinnedApps from '../components/launcher/PinnedApps';
import SearchPill from '../components/launcher/SearchPill';
import StudioCard, { type StudioAction } from '../components/launcher/StudioCard';
import PressableScale from '../components/PressableScale';
import { VelouraLauncher, type LauncherApp } from '../features/launcher/launcher';
import { hapticTap } from '../features/settings/settings';
import { useInstalledApps } from '../features/launcher/useInstalledApps';
import { useLauncherLayout } from '../features/launcher/useLauncherLayout';
import type { AppTarget } from '../lib/appLinks';

const SWIPE_DISTANCE = 70;

type Props = {
  mode: 'home' | 'preview';
  /** Open a place in the regular app. */
  onOpen: (target: AppTarget) => void;
  onExitPreview?: () => void;
  /** Subscribe to Back presses; return an unsubscribe. */
  subscribeBack: (handler: () => boolean) => () => void;
};

export default function LauncherScreen({ mode, onOpen, onExitPreview, subscribeBack }: Props) {
  const isPreview = mode === 'preview';
  const { apps } = useInstalledApps();
  const layout = useLauncherLayout(apps);

  const [drawer, setDrawer] = useState<{ open: boolean; search: boolean }>({ open: false, search: false });
  const [actionApp, setActionApp] = useState<LauncherApp | null>(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openDrawer = (search = false) => setDrawer({ open: true, search });
  const closeDrawer = () => setDrawer({ open: false, search: false });

  // Pressing Home while already on Home → back to a clean Home.
  useEffect(() => {
    const sub = VelouraLauncher?.addListener('onLaunchIntent', ({ source }) => {
      if (source !== 'home' || isPreview) return;
      setDrawer({ open: false, search: false });
      setActionApp(null);
    });
    return () => sub?.remove();
  }, [isPreview]);

  // Back: close the sheet, then the drawer; the Home screen itself never goes back.
  useEffect(
    () =>
      subscribeBack(() => {
        if (actionApp) setActionApp(null);
        else if (drawer.open) setDrawer({ open: false, search: false });
        return true;
      }),
    [subscribeBack, actionApp, drawer.open],
  );

  const launch = (app: LauncherApp) => {
    VelouraLauncher?.launchApp(app.packageName, app.activityName);
    setTimeout(closeDrawer, 400);
  };

  const onStudio = (action: StudioAction) => {
    if (action === 'camera') onOpen({ to: 'capture' });
    else if (action === 'editor') onOpen({ to: 'tab', tab: 'Editor' });
    else if (action === 'templates') onOpen({ to: 'tab', tab: 'Templates' });
    else onOpen({ to: 'tab', tab: 'Home' });
  };

  return (
    <View
      className="flex-1"
      onTouchStart={(e) => {
        touchStart.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        // Long-press on empty space (the root itself) → Home settings.
        clearTimeout(longPressTimer.current);
        if (e.target === e.currentTarget && !drawer.open && !actionApp) {
          longPressTimer.current = setTimeout(() => {
            hapticTap();
            onOpen({ to: 'settings', section: 'home' });
          }, 550);
        }
      }}
      onTouchMove={(e) => {
        const moved =
          Math.abs(e.nativeEvent.pageX - touchStart.current.x) + Math.abs(e.nativeEvent.pageY - touchStart.current.y);
        if (moved > 12) clearTimeout(longPressTimer.current);
      }}
      onTouchEnd={(e) => {
        clearTimeout(longPressTimer.current);
        if (drawer.open || actionApp) return;
        const dx = e.nativeEvent.pageX - touchStart.current.x;
        const dy = e.nativeEvent.pageY - touchStart.current.y;
        if (Math.abs(dy) < SWIPE_DISTANCE || Math.abs(dy) < Math.abs(dx)) return;
        if (dy < 0) openDrawer();
        else VelouraLauncher?.expandNotifications();
      }}
    >
      <StatusBar style="light" />
      <LauncherBackdrop />

      <View className="flex-1 pt-safe-offset-6" pointerEvents="box-none">
        {isPreview && (
          <PressableScale
            onPress={onExitPreview}
            accessibilityRole="button"
            accessibilityLabel="Exit Home preview"
            className="mx-5 mb-4 flex-row items-center self-start rounded-full border border-white/15 bg-black/40 px-3 py-1.5"
          >
            <MaterialCommunityIcons name="close" className="text-sm text-white" />
            <Text className="ml-1 font-semibold text-xs text-white">Exit preview</Text>
          </PressableScale>
        )}

        <Animated.View entering={FadeInDown.duration(500)}>
          <ClockHeader />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} className="mt-6">
          <StudioCard onAction={onStudio} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} className="mt-4">
          <SearchPill onPress={() => openDrawer(true)} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)} className="mt-6">
          <PinnedApps apps={layout.pinned} onLaunch={launch} onLongPress={setActionApp} />
        </Animated.View>
      </View>

      <View className="pb-safe-offset-3" pointerEvents="box-none">
        <Dock apps={layout.dock} onLaunch={launch} onLongPress={setActionApp} onOpenDrawer={() => openDrawer()} />
      </View>

      <AppDrawer
        open={drawer.open}
        focusSearch={drawer.search}
        apps={apps}
        onClose={closeDrawer}
        onLaunch={launch}
        onLongPress={setActionApp}
      />

      <AppActionsSheet
        app={actionApp}
        pinned={actionApp ? layout.isPinned(actionApp) : false}
        inDock={actionApp ? layout.isInDock(actionApp) : false}
        onClose={() => setActionApp(null)}
        onTogglePin={layout.togglePin}
        onToggleDock={layout.toggleDock}
        onAppInfo={(a) => VelouraLauncher?.openAppInfo(a.packageName)}
        onUninstall={(a) => VelouraLauncher?.uninstallApp(a.packageName)}
      />
    </View>
  );
}
