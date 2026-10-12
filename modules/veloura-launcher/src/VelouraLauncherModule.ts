import { NativeModule, requireOptionalNativeModule } from 'expo';

import type { DetectedFace, LaunchSource, LauncherApp, VelouraLauncherEvents, VideoInfo } from './VelouraLauncher.types';

declare class VelouraLauncherModule extends NativeModule<VelouraLauncherEvents> {
  getApps(iconSize: number): Promise<LauncherApp[]>;
  launchApp(packageName: string, activityName: string): void;
  openAppInfo(packageName: string): void;
  uninstallApp(packageName: string): void;
  isHomeModeEnabled(): boolean;
  setHomeModeEnabled(enabled: boolean): void;
  isDefaultLauncher(): boolean;
  requestDefaultLauncher(): void;
  expandNotifications(): void;
  goHome(): void;
  detectFaces(uri: string): Promise<DetectedFace[]>;
  removeBackground(uri: string): Promise<{ uri: string; width: number; height: number; coverage: number }>;
  getVideoInfo(uri: string): Promise<VideoInfo>;
  getVideoThumbnails(uri: string, count: number, maxWidth: number): Promise<string[]>;
  trimVideo(uri: string, startMs: number, endMs: number, mute: boolean): Promise<{ uri: string; durationMs: number }>;
  getLaunchSource(): LaunchSource;
}

/** Android-only; `null` on iOS and web. */
export default requireOptionalNativeModule<VelouraLauncherModule>('VelouraLauncher');
