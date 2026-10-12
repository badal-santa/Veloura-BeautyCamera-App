import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { pickPhoto } from './pickPhoto';
import { PRESETS, type PresetId } from './presets';

/** Pick a photo from the device, then open it in the photo editor. */
export function useOpenEditor() {
  const navigation = useNavigation();

  return useCallback(
    async (presetId?: PresetId) => {
      try {
        const photo = await pickPhoto();
        if (!photo) return;
        navigation.navigate('PhotoReview', {
          uri: photo.uri,
          rotation: photo.rotation,
          source: 'gallery',
          preset: presetId ? PRESETS[presetId] : undefined,
        });
      } catch (e) {
        Alert.alert('Could not open photo', e instanceof Error ? e.message : String(e));
      }
    },
    [navigation],
  );
}
