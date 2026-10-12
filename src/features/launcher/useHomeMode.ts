import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { VelouraLauncher, isLauncherSupported } from './launcher';

const read = () => ({
  enabled: VelouraLauncher?.isHomeModeEnabled() ?? false,
  isDefault: VelouraLauncher?.isDefaultLauncher() ?? false,
});

/** Home mode switch state; re-checked when returning from system settings. */
export function useHomeMode() {
  const [state, setState] = useState(read);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') setState(read());
    });
    return () => sub.remove();
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    VelouraLauncher?.setHomeModeEnabled(enabled);
    setState(read());
    if (enabled) VelouraLauncher?.requestDefaultLauncher();
  }, []);

  const makeDefault = useCallback(() => VelouraLauncher?.requestDefaultLauncher(), []);

  return { supported: isLauncherSupported, ...state, setEnabled, makeDefault };
}
