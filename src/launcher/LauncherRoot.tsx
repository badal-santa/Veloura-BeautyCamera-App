import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { VelouraLauncher } from '../features/launcher/launcher';
import { openInApp } from '../lib/appLinks';
import { useAppFonts } from '../lib/fonts';
import LauncherScreen from '../screens/LauncherScreen';

const subscribeBack = (handler: () => boolean) => {
  const sub = VelouraLauncher?.addListener('onLauncherBack', handler);
  return () => sub?.remove();
};

/** Root of the Home screen window (LauncherActivity) — separate from the regular app. */
export default function LauncherRoot() {
  const ready = useAppFonts();
  return (
    <SafeAreaProvider>
      {/* Transparent: the system wallpaper shows through (Theme.App.Launcher). */}
      <View className="flex-1">{ready && <LauncherScreen mode="home" onOpen={openInApp} subscribeBack={subscribeBack} />}</View>
    </SafeAreaProvider>
  );
}
