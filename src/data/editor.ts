import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ActionRow } from '../components/ActionList';
import type { TileAction } from '../features/media/actions';
import type { PresetId } from '../features/media/presets';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

/** Icon tool (used by Home quick tools). */
export type EditorTool = TileAction & {
  label: string;
  icon: IconName;
  /** Literal class strings so Tailwind can see them at build time. */
  iconClass: string;
  badgeClass: string;
};

export type ToolGroup = { id: string; label: string; rows: ActionRow[] };

export const EDITOR_GROUPS: ToolGroup[] = [
  {
    id: 'retouch',
    label: 'Retouch',
    rows: [
      { title: 'Beautify', subtitle: 'Smooth, brighten and glow', icon: 'face-woman-shimmer-outline', preset: 'beauty' },
      { title: 'Hot looks', subtitle: 'Trending color in one tap', icon: 'fire', preset: 'hotLooks' },
      { title: 'Remove BG', subtitle: 'New background in one tap', icon: 'image-remove-outline', screen: 'RemoveBg' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    rows: [
      { title: 'Full editor', subtitle: 'Every tool in one place', icon: 'image-edit-outline' },
      { title: 'Multi-fit', subtitle: 'Smart ratios for any feed', icon: 'aspect-ratio', preset: 'socialCrop' },
      { title: 'Collage', subtitle: 'Combine 2–4 photos', icon: 'view-dashboard-outline', screen: 'Collage' },
      { title: 'Pic sew', subtitle: 'Stitch a vertical story', icon: 'view-agenda-outline', soon: true },
    ],
  },
  {
    id: 'create',
    label: 'Create',
    rows: [
      { title: 'Stickers & text', subtitle: 'Decorate with stickers, captions, watermark', icon: 'sticker-emoji', screen: 'Decorate', decorateTool: 'sticker' },
      { title: 'Freestyle', subtitle: 'Layered canvas', icon: 'layers-triple-outline', soon: true },
      { title: 'Edit video', subtitle: 'Trim a clip, drop the sound', icon: 'movie-open-edit-outline', screen: 'VideoStudio' },
    ],
  },
];

export const QUICK_FRAMES: { label: string; ratio: string; preset: PresetId; shapeClass: string }[] = [
  { label: 'Profile', ratio: '1:1', preset: 'profileCrop', shapeClass: 'h-11 w-11' },
  { label: 'Feed', ratio: '4:5', preset: 'socialCrop', shapeClass: 'h-[52px] w-[42px]' },
  { label: 'Story', ratio: '9:16', preset: 'story', shapeClass: 'h-[60px] w-[34px]' },
];
