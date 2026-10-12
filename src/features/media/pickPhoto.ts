import * as ImagePicker from 'expo-image-picker';

import type { Rotation } from '../beauty/crop';

export type PickedPhoto = { uri: string; rotation: Rotation };

// EXIF orientation → clockwise rotation needed to show the photo upright.
const EXIF_ROTATION: Record<number, Rotation> = { 1: 0, 3: 180, 6: 90, 8: 270 };

/** Opens the system photo picker (no permission needed on Android). */
export async function pickPhoto(): Promise<PickedPhoto | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
    exif: true,
  });
  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const orientation = Number(asset.exif?.Orientation ?? 1);
  return { uri: asset.uri, rotation: EXIF_ROTATION[orientation] ?? 0 };
}
