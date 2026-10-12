export type LauncherApp = {
  packageName: string;
  activityName: string;
  label: string;
  /** file:// URI of a cached PNG icon. */
  icon: string;
};

export type LaunchSource = 'home' | 'icon' | 'other';

export type VelouraLauncherEvents = {
  onPackagesChanged: (event: { packageName: string; action: string }) => void;
  onLaunchIntent: (event: { source: LaunchSource }) => void;
  onLauncherBack: () => void;
};

export type VideoInfo = {
  durationMs: number;
  /** Display size (rotation applied). */
  width: number;
  height: number;
  hasAudio: boolean;
};

/** [x, y] normalized to 0–1 of the image. */
export type Point = [number, number];

export type DetectedFace = {
  bounds: { x: number; y: number; width: number; height: number };
  oval: Point[];
  leftEye: Point[];
  rightEye: Point[];
  leftBrow: Point[];
  rightBrow: Point[];
  lips: Point[];
  mouth: Point[];
};
