import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Rotation } from '../features/beauty/crop';
import type { EditState } from '../features/beauty/types';
import type { EditorPreset } from '../features/media/presets';
import type { SettingsSection } from '../screens/SettingsScreen';
import type { MainTabParamList } from './MainNavigator';

export type RootStackParamList = {
  Splash: undefined;
  HomePrompt: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  /** In-app preview of Veloura Home (the real one runs in LauncherActivity). */
  Launcher: undefined;
  Capture: undefined;
  PhotoReview: {
    uri: string;
    /** Edits to start from (camera passes its live settings). */
    edit?: EditState;
    source?: 'camera' | 'gallery' | 'creation';
    rotation?: Rotation;
    preset?: EditorPreset;
  };
  Gallery: undefined;
  /** Optionally opens straight into a video. */
  VideoStudio: { uri?: string } | undefined;
  /** Optionally starts with these photos. */
  Collage: { uris?: string[] } | undefined;
  RemoveBg: { uri: string; rotation?: Rotation };
  Decorate: { uri: string; rotation?: Rotation; tool?: 'sticker' | 'text' | 'watermark' };
  Settings: { section?: SettingsSection } | undefined;
  /** Without `uri`, the editor previews the design with its sample photo. */
  TemplateEditor: { templateId: string; uri?: string; rotation?: Rotation };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
