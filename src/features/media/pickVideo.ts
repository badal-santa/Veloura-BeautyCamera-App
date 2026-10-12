import * as ImagePicker from 'expo-image-picker';

/** Opens the system picker for a video (no permission needed on Android). */
export async function pickVideo(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}
