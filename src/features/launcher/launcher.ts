import { Platform } from 'react-native';
import VelouraLauncher, { type LaunchSource, type LauncherApp } from '../../../modules/veloura-launcher';

export { VelouraLauncher };
export type { LaunchSource, LauncherApp };

/** Home mode only exists on Android with the native module linked. */
export const isLauncherSupported = Platform.OS === 'android' && VelouraLauncher != null;

/** Icon bitmap size in pixels (≈ 52dp at 3x). */
export const ICON_SIZE_PX = 156;

export const appKey = (app: Pick<LauncherApp, 'packageName' | 'activityName'>) =>
  `${app.packageName}/${app.activityName}`;
