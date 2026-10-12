import type { CropAspect } from '../beauty/crop';
import type { EditMode, EditState } from '../beauty/types';

/** How the photo editor should open: starting look, active tab, and crop. */
export type EditorPreset = {
  edit?: Partial<Omit<EditState, 'beauty'>> & { beauty?: Partial<EditState['beauty']> };
  mode?: EditMode;
  aspect?: CropAspect;
};

export const PRESETS = {
  beauty: { mode: 'beauty', edit: { beauty: { smooth: 35, brighten: 20, skinTone: 15, glow: 20 } } },
  filters: { mode: 'filters' },
  classic: { mode: 'filters', edit: { filter: 'film' } },
  fashion: { mode: 'filters', edit: { filter: 'bloom' } },
  hotLooks: { mode: 'filters', edit: { filter: 'golden' } },
  portrait: { mode: 'beauty', edit: { beauty: { smooth: 30, brighten: 25, glow: 30, skinTone: 10 } } },
  profileCrop: { mode: 'crop', aspect: '1:1' },
  socialCrop: { mode: 'crop', aspect: '4:5' },
  story: { mode: 'crop', aspect: '9:16' },
  // Looks
  petal: { mode: 'filters', edit: { filter: 'bloom' } },
  luminous: { mode: 'filters', edit: { filter: 'natural', beauty: { brighten: 50, glow: 40 } } },
  peach: { mode: 'filters', edit: { filter: 'golden' } },
  airy: { mode: 'filters', edit: { filter: 'cool', beauty: { brighten: 30 } } },
  blush: { mode: 'filters', edit: { filter: 'bloom', beauty: { skinTone: 40 } } },
  coolNight: { mode: 'filters', edit: { filter: 'cool', exposure: -15 } },
  cocoa: { mode: 'filters', edit: { filter: 'film', beauty: { warmth: 40 } } },
  mono: { mode: 'filters', edit: { filter: 'mono' } },
} satisfies Record<string, EditorPreset>;

export type PresetId = keyof typeof PRESETS;

export function applyPreset(base: EditState, preset?: EditorPreset): EditState {
  if (!preset?.edit) return base;
  const { beauty, ...rest } = preset.edit;
  return { ...base, ...rest, beauty: { ...base.beauty, ...beauty } };
}
