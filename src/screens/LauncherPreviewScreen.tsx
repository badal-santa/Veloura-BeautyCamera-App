import { useCallback } from 'react';
import { BackHandler } from 'react-native';

import type { AppTarget } from '../lib/appLinks';
import type { RootStackScreenProps } from '../navigation/types';
import LauncherScreen from './LauncherScreen';

/** In-app preview of Veloura Home (from Profile). */
export default function LauncherPreviewScreen({ navigation }: RootStackScreenProps<'Launcher'>) {
  const exit = () => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Profile' } }] });

  const open = (target: AppTarget) => {
    if (target.to === 'capture') navigation.navigate('Capture');
    else if (target.to === 'settings') navigation.navigate('Settings', { section: target.section });
    else if (target.to === 'gallery') navigation.navigate('Gallery');
    else if (target.to === 'video') navigation.navigate('VideoStudio', { uri: target.uri });
    else if (target.to === 'edit') navigation.navigate('PhotoReview', { uri: target.uri, source: 'gallery' });
    else if (target.to === 'decorate') navigation.navigate('Decorate', { uri: target.uri });
    else if (target.to === 'removebg') navigation.navigate('RemoveBg', { uri: target.uri });
    else if (target.to === 'collage') navigation.navigate('Collage', { uris: target.uris });
    else navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: target.tab } }] });
  };

  const subscribeBack = useCallback((handler: () => boolean) => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, []);
  return <LauncherScreen mode="preview" onOpen={open} onExitPreview={exit} subscribeBack={subscribeBack} />;
}
