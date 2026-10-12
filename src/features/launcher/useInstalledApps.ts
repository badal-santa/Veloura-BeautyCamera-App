import { useCallback, useEffect, useState } from 'react';

import { ICON_SIZE_PX, VelouraLauncher, type LauncherApp } from './launcher';

/** Installed launchable apps, refreshed when apps are installed, updated or removed. */
export function useInstalledApps() {
  const [apps, setApps] = useState<LauncherApp[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!VelouraLauncher) return;
    try {
      setApps(await VelouraLauncher.getApps(ICON_SIZE_PX));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!VelouraLauncher) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sub = VelouraLauncher.addListener('onPackagesChanged', () => {
      clearTimeout(timer);
      timer = setTimeout(refresh, 400);
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, [refresh]);

  return { apps, loading, refresh };
}
