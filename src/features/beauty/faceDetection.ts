import type { SkImage } from '@shopify/react-native-skia';

import { VelouraLauncher } from '../launcher/launcher';
import { FULL_RECT } from './crop';
import { exportEditedImage } from './exportImage';
import type { DetectedFace } from './faces';
import { NEUTRAL_EDIT } from './types';

/** Finds faces on device (ML Kit). Empty when unsupported or nothing found. */
export async function detectFaces(image: SkImage): Promise<DetectedFace[]> {
  if (!VelouraLauncher) return [];
  // A ~1000px copy is plenty for detection and much faster.
  const uri = exportEditedImage(image, NEUTRAL_EDIT, FULL_RECT, 1000);
  try {
    return await VelouraLauncher.detectFaces(uri);
  } catch {
    return [];
  }
}

