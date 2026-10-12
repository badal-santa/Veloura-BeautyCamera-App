import type { ActionRow } from '../components/ActionList';
import type { EditorTool } from './editor';

export const QUICK_STUDIO: EditorTool[] = [
  { label: 'Collage', screen: 'Collage', icon: 'view-dashboard-outline', iconClass: 'text-emerald-400', badgeClass: 'bg-emerald-400/15' },
  { label: 'Stickers', screen: 'Decorate', decorateTool: 'sticker', icon: 'sticker-emoji', iconClass: 'text-amber-400', badgeClass: 'bg-amber-400/15' },
  { label: 'Filters', preset: 'filters', icon: 'palette-outline', iconClass: 'text-secondary-light', badgeClass: 'bg-secondary/15' },
  { label: 'Watermark', screen: 'Decorate', decorateTool: 'watermark', icon: 'format-text', iconClass: 'text-emerald-400', badgeClass: 'bg-emerald-400/15' },
  { label: 'Video', screen: 'VideoStudio', icon: 'movie-open-outline', iconClass: 'text-orange-400', badgeClass: 'bg-orange-400/15' },
  { label: 'Retouch', preset: 'beauty', icon: 'auto-fix', iconClass: 'text-primary-light', badgeClass: 'bg-primary/15' },
  { label: 'Classic', preset: 'classic', icon: 'filmstrip', iconClass: 'text-sky-400', badgeClass: 'bg-sky-400/15' },
  { label: 'Fashion', preset: 'fashion', icon: 'lipstick', iconClass: 'text-violet-400', badgeClass: 'bg-violet-400/15' },
  { label: 'Mask', soon: true, icon: 'drama-masks', iconClass: 'text-rose-400', badgeClass: 'bg-rose-400/15' },
];

export const LOOKS_FOR_YOU: ActionRow[] = [
  { title: 'AI-inspired portrait', subtitle: 'A balanced glow without a heavy model', icon: 'face-woman-shimmer-outline', preset: 'portrait' },
  { title: 'Classic film', subtitle: 'Warm shadows and gentle color', icon: 'filmstrip', preset: 'classic' },
  { title: 'Social crop', subtitle: 'Square and 4:5 frames in one tap', icon: 'crop-portrait', preset: 'socialCrop' },
];
