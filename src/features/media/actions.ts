import type { PresetId } from './presets';

/** What tapping a tile does: open the photo editor (optionally with a preset) or mark it as upcoming. */
export type TileAction = {
  /** Open the editor with this preset after picking a photo. */
  preset?: PresetId;
  /** Not built yet — show a "coming soon" note. */
  soon?: boolean;
  /** Open a dedicated tool screen instead of the photo editor. */
  screen?: 'VideoStudio' | 'Decorate' | 'Collage' | 'RemoveBg';
  /** Which Decorate tool to start on. */
  decorateTool?: 'sticker' | 'text' | 'watermark';
};
