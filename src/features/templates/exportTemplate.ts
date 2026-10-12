import { ImageFormat, makeImageFromView } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import type { RefObject } from 'react';
import type { View } from 'react-native';

/** Snapshots the template canvas and writes it to a JPEG in the cache. */
export async function exportTemplate(canvas: RefObject<View | null>): Promise<string> {
  const image = await makeImageFromView(canvas as RefObject<View>);
  if (!image) throw new Error('Could not capture the template');
  const file = new File(Paths.cache, `veloura-template-${Date.now()}.jpg`);
  file.create();
  file.write(image.encodeToBytes(ImageFormat.JPEG, 95));
  return file.uri;
}
