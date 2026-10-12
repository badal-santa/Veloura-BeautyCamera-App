import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';

import { urlToTarget } from '../lib/appLinks';
import CameraScreen from '../screens/CameraScreen';
import CollageScreen from '../screens/CollageScreen';
import DecorateScreen from '../screens/DecorateScreen';
import GalleryScreen from '../screens/GalleryScreen';
import HomePromptScreen from '../screens/HomePromptScreen';
import LauncherPreviewScreen from '../screens/LauncherPreviewScreen';
import PhotoReviewScreen from '../screens/PhotoReviewScreen';
import RemoveBgScreen from '../screens/RemoveBgScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';
import TemplateEditorScreen from '../screens/TemplateEditorScreen';
import VideoStudioScreen from '../screens/VideoStudioScreen';
import { Colors } from '../theme/colors';
import MainNavigator from './MainNavigator';
import { goToTarget, navigationRef, topRouteName } from './navigationRef';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.background,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.primary,
  },
};

function useAppLinks() {
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const target = urlToTarget(url);
      if (!target) return;
      // The splash handles the link the app was launched with.
      const top = topRouteName();
      if (top === 'Splash') return;
      if (top === 'HomePrompt') navigationRef.reset({ index: 0, routes: [{ name: 'Main' }] });
      goToTarget(target);
    });
    return () => sub.remove();
  }, []);
}

export default function RootNavigator() {
  useAppLinks();

  // The Home preview is transparent; keep an opaque backdrop everywhere else.
  const [showWallpaper, setShowWallpaper] = useState(false);
  const syncBackdrop = () => setShowWallpaper(topRouteName() === 'Launcher');

  return (
    <View className={`flex-1 ${showWallpaper ? '' : 'bg-background'}`}>
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={syncBackdrop}
        onStateChange={syncBackdrop}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'none' }} />
          <Stack.Screen name="HomePrompt" component={HomePromptScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Main" component={MainNavigator} options={{ animation: 'fade' }} />
          <Stack.Screen
            name="Launcher"
            component={LauncherPreviewScreen}
            options={{ animation: 'fade', gestureEnabled: false, contentStyle: { backgroundColor: 'transparent' } }}
          />
          <Stack.Screen
            name="Capture"
            component={CameraScreen}
            options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Gallery" component={GalleryScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="VideoStudio" component={VideoStudioScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Decorate" component={DecorateScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Collage" component={CollageScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="RemoveBg" component={RemoveBgScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="TemplateEditor" component={TemplateEditorScreen} options={{ animation: 'fade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
