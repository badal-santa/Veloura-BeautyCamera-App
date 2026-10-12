import * as ImagePicker from 'expo-image-picker';

export type PickedImage = { uri: string; width: number; height: number };

/** Pick up to `limit` photos; sizes are corrected for EXIF rotation. */
export async function pickPhotos(limit: number): Promise<PickedImage[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: limit,
    orderedSelection: true,
    quality: 1,
    exif: true,
  });
  if (result.canceled) return [];
  return result.assets.slice(0, limit).map((a) => {
    const turned = [6, 8].includes(Number(a.exif?.Orientation ?? 1));
    return { uri: a.uri, width: turned ? a.height : a.width, height: turned ? a.width : a.height };
  });
}
