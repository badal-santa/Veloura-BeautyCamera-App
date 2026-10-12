import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { comingSoon } from '../../lib/comingSoon';
import { pickPhoto } from './pickPhoto';
import type { TileAction } from './actions';
import { useOpenEditor } from './useOpenEditor';

/** Runs a tile's action: pick a photo → editor, or a coming-soon note. */
export function useTileAction() {
  const openEditor = useOpenEditor();
  const navigation = useNavigation();
  return useCallback(
    (label: string, action: TileAction) => {
      // Video Studio uses Android media APIs (see modules/veloura-launcher).
      if (action.screen === 'VideoStudio' && Platform.OS === 'android') navigation.navigate('VideoStudio');
      else if (action.screen === 'Collage') navigation.navigate('Collage');
      else if (action.screen === 'RemoveBg' && Platform.OS === 'android') {
        pickPhoto().then((photo) => {
          if (photo) navigation.navigate('RemoveBg', { uri: photo.uri, rotation: photo.rotation });
        });
      }
      else if (action.screen === 'Decorate') {
        pickPhoto().then((photo) => {
          if (photo) navigation.navigate('Decorate', { uri: photo.uri, rotation: photo.rotation, tool: action.decorateTool });
        });
      } else if (action.soon || action.screen) comingSoon(label);
      else openEditor(action.preset);
    },
    [openEditor, navigation],
  );
}
