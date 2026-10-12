import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppTarget } from '../lib/appLinks';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Name of the screen currently on top of the root stack. */
export const topRouteName = () => {
  const state = navigationRef.getRootState();
  return state?.routes[state.index]?.name;
};

/** Deep links from Veloura Home (veloura://…) → navigate inside the app. */
export function goToTarget(target: AppTarget) {
  if (!navigationRef.isReady()) return;
  if (target.to === 'capture') navigationRef.navigate('Capture');
  else if (target.to === 'gallery') navigationRef.navigate('Gallery');
  else if (target.to === 'video') navigationRef.navigate('VideoStudio', { uri: target.uri });
  else if (target.to === 'edit') navigationRef.navigate('PhotoReview', { uri: target.uri, source: 'gallery' });
  else if (target.to === 'decorate') navigationRef.navigate('Decorate', { uri: target.uri });
  else if (target.to === 'removebg') navigationRef.navigate('RemoveBg', { uri: target.uri });
  else if (target.to === 'collage') navigationRef.navigate('Collage', { uris: target.uris });
  else if (target.to === 'settings') navigationRef.navigate('Settings', { section: target.section });
  else navigationRef.navigate('Main', { screen: target.tab });
}
