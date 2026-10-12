import { useCallback, useMemo } from 'react';

import { createPersistedStore } from '../../lib/createStore';
import { appKey, type LauncherApp } from './launcher';

export const DOCK_SIZE = 4;

type Layout = { pinned: string[]; dock: string[] | null };

/** Pinned home apps + dock, persisted on device. `reset()` restores the defaults. */
export const launcherLayoutStore = createPersistedStore<Layout>('launcher-layout.json', { pinned: [], dock: null });

// Sensible first-run dock: phone, messages, browser, camera — whichever exist.
const DEFAULT_DOCK_PACKAGES = [
  ['com.google.android.dialer', 'com.android.dialer', 'com.samsung.android.dialer'],
  ['com.google.android.apps.messaging', 'com.samsung.android.messaging', 'com.android.mms'],
  ['com.android.chrome', 'org.mozilla.firefox', 'com.sec.android.app.sbrowser'],
  ['com.motorola.camera3', 'com.motorola.camera', 'com.google.android.GoogleCamera', 'com.sec.android.app.camera', 'com.android.camera'],
];

export function useLauncherLayout(apps: LauncherApp[]) {
  const layout = launcherLayoutStore.use();

  const byKey = useMemo(() => new Map(apps.map((a) => [appKey(a), a])), [apps]);

  const dockKeys = useMemo(() => {
    if (layout.dock) return layout.dock;
    return DEFAULT_DOCK_PACKAGES.map((candidates) => apps.find((a) => candidates.includes(a.packageName)))
      .filter((a): a is LauncherApp => a != null)
      .map(appKey);
  }, [layout.dock, apps]);

  const resolve = (keys: string[]) => keys.map((k) => byKey.get(k)).filter((a): a is LauncherApp => a != null);

  const togglePin = useCallback((app: LauncherApp) => {
    const key = appKey(app);
    launcherLayoutStore.set((l) => ({
      ...l,
      pinned: l.pinned.includes(key) ? l.pinned.filter((k) => k !== key) : [...l.pinned, key],
    }));
  }, []);

  const toggleDock = useCallback(
    (app: LauncherApp) => {
      const key = appKey(app);
      launcherLayoutStore.set((l) => {
        const current = l.dock ?? dockKeys;
        const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key].slice(-DOCK_SIZE);
        return { ...l, dock: next };
      });
    },
    [dockKeys],
  );

  return {
    pinned: resolve(layout.pinned),
    dock: resolve(dockKeys),
    isPinned: (app: LauncherApp) => layout.pinned.includes(appKey(app)),
    isInDock: (app: LauncherApp) => dockKeys.includes(appKey(app)),
    togglePin,
    toggleDock,
  };
}
