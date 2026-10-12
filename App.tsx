import * as NativeSplash from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppFonts } from './src/lib/fonts';
import RootNavigator from './src/navigation/RootNavigator';

// Keep the native launch screen (a plain background-colored view, see app.json)
// up until fonts load, then hand off straight to the in-app SplashScreen.
NativeSplash.preventAutoHideAsync();

export default function App() {
  const ready = useAppFonts();

  const onLayoutRootView = useCallback(() => {
    if (ready) NativeSplash.hide();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <View className="flex-1 bg-background" onLayout={onLayoutRootView}>
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
